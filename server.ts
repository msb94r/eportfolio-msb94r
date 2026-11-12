import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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

// Fallback rule-based responder when external AI APIs are not available or quota exceeded
function generateFallbackResponse(userPrompt: string): string {
  const query = userPrompt.toLowerCase();

  if (query.includes('salut') || query.includes('bonjour') || query.includes('hello') || query.includes('coucou')) {
    return "Salut ! Je suis l'assistant de Muslim Bayschanov. Je connais ses compétences (Systèmes, Réseaux, Cyber), ses projets (Rituels du Monde, Shop Ton Auto, Chicken Point) et sa veille technologique sur le bout des doigts. Que souhaites-tu savoir ? 😊";
  }

  if (query.includes('projet') || query.includes('réalisation') || query.includes('realisation') || query.includes('portfolio')) {
    return "Voici les 3 projets phares de Muslim :\n\n" +
      "• 🌿 **Rituels du Monde** : Plateforme Spa & Bien-être avec architecture IA hybride (Mistral Cloud + bascule locale Ollama en failover) et base Firestore.\n" +
      "• 🚗 **Shop Ton Auto** : Plateforme de vente de véhicules avec filtrage dynamique, estimation et dashboard CRUD sécurisé.\n" +
      "• 🍗 **Chicken Point** : Site vitrine rapide & sécurisé pour restaurant avec navigation ScrollSpy et intégration Uber Eats.\n\n" +
      "Sur quel projet aimerais-tu plus de détails ? 🚀";
  }

  if (query.includes('rituel') || query.includes('spa') || query.includes('failover') || query.includes('ollama')) {
    return "Pour le projet **Rituels du Monde**, on a mis le paquet sur la résilience :\n\n" +
      "• **Cloud** : Utilisation de l'API Mistral pour des réponses rapides et intelligentes.\n" +
      "• **Local** : Bascule automatique (Failover) sur Ollama (modèle Mistral-Nemo) en cas de panne réseau.\n" +
      "• **Réservation** : Wizard sans rechargement en 3 étapes (choix du soin, date avec Flatpickr, validation).\n" +
      "• **Données & Sécurité** : Stockage Firebase Firestore avec respect du RGPD ! 🛡️";
  }

  if (query.includes('shop') || query.includes('auto') || query.includes('voiture')) {
    return "Le projet **Shop Ton Auto** est une plateforme complète pour concessionnaire :\n\n" +
      "• **Front-Office** : Filtres dynamiques (budget, carburant, année) et formulaire de reprise de véhicule.\n" +
      "• **Back-Office** : Dashboard d'administration sécurisé pour le gérant avec gestion complète du parc (CRUD) et suivi des leads.\n" +
      "• **Accessibilité & Sécurité** : Navigation au clavier validée et redirection automatique si non authentifié ! 🚗";
  }

  if (query.includes('chicken') || query.includes('resto') || query.includes('restaurant')) {
    return "Le projet **Chicken Point** est le site vitrine d'un restaurant à Aubervilliers :\n\n" +
      "• **Performance** : Développement statique sur mesure (HTML5/CSS3/JS) pour un chargement instantané.\n" +
      "• **Navigation** : ScrollSpy pour parcourir les rubriques (Burgers, Tex-Mex, Top Ventes).\n" +
      "• **Commandes** : Bouton flottant Uber Eats et formulaire de contact AJAX via Formspree. 🍗";
  }

  if (query.includes('veille') || query.includes('cyber') || query.includes('sécurité') || query.includes('securite')) {
    return "Muslim réalise sa **veille technologique** sur l'IA dans la cybersécurité :\n\n" +
      "• **Thème** : L'apport de l'IA dans la cyberdéfense proactive et l'anticipation des menaces.\n" +
      "• **Objectif** : Passer d'une sécurité réactive à une posture prédictive (détection d'anomalies, analyse comportementale, réponses automatisées aux incidents). 🛡️";
  }

  if (query.includes('stage') || query.includes('expérience') || query.includes('experience') || query.includes('parcours')) {
    return "Voici les expériences professionnelles et stages de Muslim en informatique :\n\n" +
      "1. 🛠️ **Stagiaire Administrateur Systèmes & Réseaux** (Mai — Juil. 2025, DSI Île-de-France) :\n" +
      "   • Déploiement de postes Windows/Linux et intégration Active Directory (GPO).\n" +
      "   • Configuration réseau Cisco (VLANs, routage, switchs, Wi-Fi sécurisé).\n" +
      "   • Gestion du parc et support utilisateurs N1/N2 avec GLPI et OCS Inventory.\n\n" +
      "2. 💻 **Stagiaire Technicien Support & Infrastructure** (2024, Service IT) :\n" +
      "   • Maintenance préventive et curative du parc machines, diagnostic matériel/logiciel.\n" +
      "   • Brassage de baies de serveurs et câblage réseau RJ45 structuré.\n" +
      "   • Déploiement de partages réseaux sécurisés et guides utilisateurs.\n\n" +
      "3. 🤝 **Employé polyvalent** (E.Leclerc, 2025 — Présent) : Rigueur, accueil client et travail d'équipe.\n\n" +
      "Il recherche également une **alternance de 12 mois** en administration systèmes, réseaux et cybersécurité pour la rentrée 2026 ! 🚀";
  }

  if (query.includes('alternance') || query.includes('recherche') || query.includes('contact') || query.includes('email') || query.includes('téléphone') || query.includes('cv')) {
    return "Muslim est actuellement en BTS SIO option SISR au Lycée Turgot (Paris) :\n\n" +
      "• **Recherche** : Contrat d'alternance de 12 mois pour la rentrée 2026 (Systèmes, Réseaux & Cyber).\n" +
      "• **Localisation** : Vitry-Sur-Seine / Île-de-France.\n" +
      "• **Email** : baysmuslim@gmail.com\n" +
      "• **Téléphone** : 06.95.13.05.64\n" +
      "• **LinkedIn** : linkedin.com/in/muslimbays 💼";
  }

  if (query.includes('compétence') || query.includes('competence') || query.includes('linux') || query.includes('cisco') || query.includes('réseau') || query.includes('reseau')) {
    return "Voici un aperçu des compétences de Muslim :\n\n" +
      "• **Systèmes & Réseaux** : Linux, Windows Server, VMware ESXi/Workstation, Cisco (Switch, VLAN, Routage), OCS Inventory, GLPI.\n" +
      "• **Cybersécurité & IA** : Architectures IA hybrides (Cloud/Local), veille cyber proactive, durcissement système.\n" +
      "• **Développement** : Python, Bash, HTML/CSS, JavaScript, SQL, PHP. 💻";
  }

  return "Je suis l'assistant de Muslim ! Je peux vous renseigner sur son profil (BTS SIO SISR), ses compétences techniques (Systèmes, Réseaux, Cyber), ses 3 projets (Rituels du Monde, Shop Ton Auto, Chicken Point) ou ses coordonnées pour un stage/alternance. Que souhaitez-vous découvrir ? 😊";
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
Tu es l'assistant personnel (IA) de Muslim Bayschanov.

TON TON :
- Professionnel, moderne et chaleureux (utilise quelques emojis 🚀, 💻, 🛡️).
- Très synthétique : ne fais JAMAIS de gros pavés.
- Ne cite JAMAIS de numéros de sources comme [19] ou [440].
- Ne dis JAMAIS "d'après les documents" ou "Muslim a fait". Parle de "nous" ou présente Muslim directement.

TES RÉPONSES :
- Si on dit "Salut", réponds juste : "Salut ! Je suis l'assistant de Muslim. Je connais ses projets (comme le Spa Rituels du Monde) et sa veille en cyber sur le bout des doigts. Qu'est-ce que tu veux savoir ? 😊"
- Si on pose une question technique, utilise des listes à puces pour que ce soit clair.

INFORMATIONS SUR MUSLIM (BASE DE CONNAISSANCES) :
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

    // 3. Knowledge base fallback responder
    const fallbackReply = generateFallbackResponse(lastUserMessage);
    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('❌ Server error in /api/chat:', error?.message || error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la génération de la réponse.' });
  }
});

async function start() {
  const PORT = 3000;
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
