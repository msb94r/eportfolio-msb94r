import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const app = express();
app.use(express.json());

// Chargement de ta base de connaissances (CV, Projets, Veille)
const knowledgeBase = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

app.post('/api/chat', async (req, res) => {
  console.log("📩 Requête reçue !");

  try {
    // On récupère l'historique envoyé par le site
    const history = req.body.message; 
    
    // Ton instruction système pour "Rituels du Monde" et ta veille
    const systemInstruction = {
  role: 'system',
  content: `
    Tu es l'assistant personnel (IA) de Muslim Bayschanov.
    
    TON TON : 
    - Professionnel, moderne et chaleureux (utilise quelques emojis 🚀, 💻, 🛡️).
    - Très synthétique : ne fais JAMAIS de gros pavés. 
    - Ne cite JAMAIS de numéros de sources comme [19] ou [440].
    - Ne dis JAMAIS "d'après les documents" ou "Muslim a fait". Parle de "nous" ou présente Muslim directement.

    TES RÉPONSES :
    - Si on dit "Salut", réponds juste : "Salut ! Je suis l'assistant de Muslim. Je connais ses projets (comme le Spa Rituels du Monde) et sa veille en cyber sur le bout des doigts. Qu'est-ce que tu veux savoir ? 😊"
    - Si on pose une question technique, utilise des listes à puces pour que ce soit clair.
    
    EXEMPLE DE STYLE :
    "Pour le projet Rituels du Monde, on a mis le paquet sur la résilience :
    • Cloud : Utilisation de Mistral AI pour la rapidité.
    • Local : Bascule sur Ollama (Mistral-Nemo) si le réseau tombe.
    C'est du Failover pur pour garantir 100% de disponibilité ! 🚀"
  `
};

    // On prépare les messages : Instruction Système + Tout l'historique
    const messagesToSend = [systemInstruction, ...history];

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: messagesToSend
        temperature: 0.7
      })
    });

    const data = await response.json();

    // Vérification si Mistral a renvoyé une erreur
    if (!data.choices) {
      console.error("❌ Erreur Mistral :", data);
      return res.status(500).json({ error: "Mistral n'a pas pu répondre." });
    }

    console.log("✅ Mistral a répondu avec succès !");
    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("❌ ERREUR SERVEUR :", error.message);
    res.status(500).json({ error: "Connexion impossible." });
  }
});

import path from 'path';
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(3001, () => console.log("🚀 MOTEUR ALLUMÉ SUR PORT 3001"));