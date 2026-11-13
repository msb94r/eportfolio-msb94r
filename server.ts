import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generateSmartReply } from './src/services/mistralService';

dotenv.config();

const app = express();
app.use(express.json());

// Load knowledge base from data.json
let knowledgeBase: any = {};
try {
  const dataPath = path.resolve(process.cwd(), 'data.json');
  if (fs.existsSync(dataPath)) {
    knowledgeBase = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }
} catch (err) {
  console.warn('⚠️ Could not load data.json:', err);
}

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const rawHistory = req.body.message;
    const history: Array<{ role: string; content: string }> = Array.isArray(rawHistory)
      ? rawHistory
      : typeof rawHistory === 'string'
      ? [{ role: 'user', content: rawHistory }]
      : [];

    const lastUserMessage = [...history].reverse().find(m => m.role === 'user')?.content || '';

    const systemPrompt = `
Tu es l'assistant personnel (IA) du portfolio de Muslim Bayschanov (étudiant en BTS SIO option SISR).

CONSIGNES DE FORMATAGE ET DE TON :
- Réponds en français, de manière professionnelle, claire et synthétique.
- Utilise des listes à puces (commençant par "• ") et du **gras** pour mettre en valeur les points clés.
- Ne cite JAMAIS de références brutes ou de fichiers internes.
- Appuie-toi uniquement sur les informations vérifiées ci-dessous :

BASE DE CONNAISSANCES :
${JSON.stringify(knowledgeBase, null, 2)}
    `.trim();

    // 1. Try Gemini API if GEMINI_API_KEY is present
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
          config: {
            systemInstruction: systemPrompt,
          },
        });

        if (geminiRes.text) {
          return res.json({ reply: geminiRes.text });
        }
      } catch (geminiError: any) {
        console.warn('⚠️ Gemini API error, attempting fallback:', geminiError?.message || geminiError);
      }
    }

    // 2. Try Mistral API if MISTRAL_API_KEY is present
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
      } catch (mistralError: any) {
        console.warn('⚠️ Mistral API error, attempting fallback:', mistralError?.message || mistralError);
      }
    }

    // 3. Knowledge base smart fallback responder
    const fallbackReply = generateSmartReply(lastUserMessage);
    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('❌ Server error in /api/chat:', error?.message || error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la génération de la réponse.' });
  }
});

async function start() {
  const PORT = process.env.RENDER ? (parseInt(process.env.PORT || '10000', 10)) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
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
    console.log(`🚀 Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
