import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Load knowledge base from data.json
let knowledgeBase = {};
try {
  const dataPath = path.resolve(process.cwd(), 'data.json');
  if (fs.existsSync(dataPath)) {
    knowledgeBase = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }
} catch (err) {
  console.warn('⚠️ Could not load data.json:', err);
}

// Fallback rule-based responder
function generateFallbackResponse(userPrompt) {
  const query = userPrompt.toLowerCase();

  if (query.includes('salut') || query.includes('bonjour') || query.includes('hello') || query.includes('coucou')) {
    return "Salut ! Je suis l'assistant de Muslim Bayschanov. Je connais ses compétences (Systèmes, Réseaux, Cyber), ses projets (Rituels du Monde, Shop Ton Auto, Chicken Point) et sa veille technologique sur le bout des doigts. Que souhaites-tu savoir ? 😊";
  }

  if (query.includes('projet') || query.includes('réalisation') || query.includes('realisation') || query.includes('portfolio')) {
    return "Voici les projets phares de Muslim :\n\n" +
      "• 🌿 **Rituels du Monde** : Plateforme Spa & Bien-être avec architecture IA hybride (Mistral Cloud + bascule locale Ollama en failover) et base Firestore.\n" +
      "• 🚗 **Shop Ton Auto** : Plateforme de vente de véhicules avec filtrage dynamique, estimation et dashboard CRUD sécurisé.\n" +
      "• 🍗 **Chicken Point** : Site vitrine rapide & sécurisé pour restaurant avec navigation ScrollSpy et intégration Uber Eats.\n" +
      "• 🛡️ **Projets Infra & Cyber** : Active Directory & WDS, Supervision Zabbix/GLPI, Pare-feu pfSense.\n\n" +
      "Sur quel projet aimerais-tu plus de détails ? 🚀";
  }

  if (query.includes('veille') || query.includes('cyber') || query.includes('sécurité') || query.includes('securite')) {
    return "Muslim réalise sa **veille technologique** sur l'IA dans la cybersécurité :\n\n" +
      "• **Thématique** : L'apport de l'IA dans la cyberdéfense proactive et l'anticipation des menaces.\n" +
      "• **Axes** : Détection comportementale (UEBA), copilotes de SOC, automatisation de réponse aux incidents (SOAR). 🛡️";
  }

  if (query.includes('stage') || query.includes('expérience') || query.includes('experience') || query.includes('parcours')) {
    return "Voici les expériences de Muslim en informatique :\n\n" +
      "1. 🛠️ **Stagiaire Administrateur Systèmes & Réseaux** (2025) : Déploiement AD, GPO, segmentation VLAN Cisco, support GLPI.\n" +
      "2. 💻 **Stagiaire Technicien Support & Infra** (2024) : Maintenance parc, brassage de baies, partages réseau sécurisés.\n" +
      "3. 🤝 **Employé polyvalent** (E.Leclerc, 2025 — Présent).\n\n" +
      "Il recherche une **alternance de 12 mois** pour sa 2ème année de BTS SIO SISR ! 🚀";
  }

  if (query.includes('alternance') || query.includes('recherche') || query.includes('contact') || query.includes('email') || query.includes('cv')) {
    return "Muslim recherche un contrat d'alternance de 12 mois en administration systèmes, réseaux et cybersécurité pour la rentrée 2026 :\n\n" +
      "• **Email** : baysmuslim@gmail.com\n" +
      "• **Téléphone** : 06.95.13.05.64\n" +
      "• **LinkedIn** : linkedin.com/in/muslimbays 💼";
  }

  return "Je suis l'assistant virtuel de Muslim Bayschanov ! Je peux vous renseigner sur ses compétences (SISR), ses projets informatiques, ses protocoles maîtrisés ou ses coordonnées professionnelles. Que souhaitez-vous découvrir ? 😊";
}

app.post('/api/chat', async (req, res) => {
  try {
    const rawHistory = req.body.message;
    const history = Array.isArray(rawHistory)
      ? rawHistory
      : typeof rawHistory === 'string'
      ? [{ role: 'user', content: rawHistory }]
      : [];

    const lastUserMessage = [...history].reverse().find(m => m.role === 'user')?.content || '';

    const systemPrompt = `
Tu es l'assistant personnel (IA) de Muslim Bayschanov.
TON TON : Professionnel, moderne, synthétique et chaleureux.
INFORMATIONS SUR MUSLIM : ${JSON.stringify(knowledgeBase)}
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

    // 3. Fallback
    const fallbackReply = generateFallbackResponse(lastUserMessage);
    return res.json({ reply: fallbackReply });
  } catch (error) {
    console.error('❌ Server error in /api/chat:', error?.message || error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la génération de la réponse.' });
  }
});

async function start() {
  // Render defines process.env.RENDER = 'true' and dynamically assigns PORT
  // In AI Studio workspace, the dev server must run on port 3000
  const PORT = process.env.RENDER ? (parseInt(process.env.PORT, 10) || 10000) : 3000;
  const distPath = path.resolve(process.cwd(), 'dist');

  // In production or when dist exists, serve the built static SPA
  if (process.env.NODE_ENV === 'production' || fs.existsSync(distPath)) {
    console.log(`📦 Serving production build from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // In dev, use Vite middleware
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
