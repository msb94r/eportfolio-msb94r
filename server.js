import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generateSmartReply } from './src/services/chatbotKnowledge.js';
import { PROTOCOLS_DATA } from './src/data/protocolsList.js';

dotenv.config();

const app = express();
app.use(express.json());

// Force inline display for PDF files so browsers open them in a new tab instead of downloading
app.use((req, res, next) => {
  if (req.path.toLowerCase().endsWith('.pdf')) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
  }
  next();
});

// Load knowledge base from data.json + full 24 protocol sheets
let knowledgeBase = {};
try {
  const dataPath = path.resolve(process.cwd(), 'data.json');
  if (fs.existsSync(dataPath)) {
    knowledgeBase = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }
} catch (err) {
  console.warn('⚠️ Could not load data.json:', err);
}
knowledgeBase.protocoles_detailles = PROTOCOLS_DATA;

app.post('/api/chat', async (req, res) => {
  try {
    const rawHistory = req.body.message;
    const history = Array.isArray(rawHistory)
      ? rawHistory
      : typeof rawHistory === 'string'
      ? [{ role: 'user', content: rawHistory }]
      : [];

    const systemPrompt = `
Tu es l'assistant personnel (IA) du portfolio de Muslim Bayschanov (étudiant en BTS SIO option SISR).
CONSIGNES DE PRÉCISION :
- Réponds en français, de manière professionnelle, structurée et **précise** sur le sujet exact demandé.
- NE REGROUPE PAS plusieurs sujets non demandés : si l'utilisateur pose une question sur UN protocole, UN outil/compétence, UN projet ou UN axe de veille, détaille uniquement cet élément sans diluer la réponse.
- Utilise des listes à puces ("• ") et du **gras** pour les mots-clés.
- Tient compte de l'historique pour les questions de suivi courtes.
- Appuie-toi uniquement sur ces données vérifiées :
${JSON.stringify(knowledgeBase)}
    `.trim();

    // 1. Try Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const contents = history.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: { systemInstruction: systemPrompt },
        });

        if (geminiRes.text) {
          return res.json({ reply: geminiRes.text });
        }
      } catch (geminiError) {
        console.warn('⚠️ Gemini API error, attempting fallback:', geminiError?.message || geminiError);
      }
    }

    // 2. Try Mistral
    if (process.env.MISTRAL_API_KEY) {
      try {
        const mistralMessages = [
          { role: 'system', content: systemPrompt },
          ...history,
        ];

        const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'mistral-small-latest',
            messages: mistralMessages,
            temperature: 0.7,
          }),
        });

        const mistralData = await mistralRes.json();
        if (mistralData.choices && mistralData.choices[0]?.message?.content) {
          return res.json({ reply: mistralData.choices[0].message.content });
        }
      } catch (mistralError) {
        console.warn('⚠️ Mistral API error, attempting fallback:', mistralError?.message || mistralError);
      }
    }

    // 3. Granular context-aware smart fallback
    const fallbackReply = generateSmartReply(history);
    return res.json({ reply: fallbackReply });
  } catch (error) {
    console.error('❌ Server error in /api/chat:', error?.message || error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la génération de la réponse.' });
  }
});

async function start() {
  const PORT = process.env.RENDER ? (parseInt(process.env.PORT, 10) || 10000) : 3000;
  const distPath = path.resolve(process.cwd(), 'dist');

  if (process.env.NODE_ENV === 'production' || fs.existsSync(distPath)) {
    console.log(`📦 Serving production build from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
