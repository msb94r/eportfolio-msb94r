export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Normalisation sans accents pour une compréhension fiable de toutes les questions
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Moteur de réponse intelligent local (garantit 100% de disponibilité même hors-ligne ou sans clé API)
export function generateSmartReply(userPrompt: string): string {
  const q = normalizeText(userPrompt.trim());

  if (!q) {
    return "Posez-moi une question sur Muslim Bayschanov : ses **projets**, ses **stages**, ses **compétences & protocoles**, sa **veille cyber** ou ses **disponibilités d'alternance** !";
  }

  // Remerciements / Politesse
  if (/^(merci|top|super|parfait|genial|nickel|cool|ok|daccord|d'accord)/.test(q)) {
    return "Avec plaisir ! Si vous souhaitez en savoir plus sur un projet, consulter son **CV** ou le **contacter pour une alternance**, je reste à votre disposition.";
  }

  if (/^(au revoir|bye|ciao|a\+|bonne journee|bonne soiree)/.test(q)) {
    return "Au revoir et merci pour votre visite sur le portfolio de **Muslim Bayschanov** ! N'hésitez pas à le contacter par email (**baysmuslim@gmail.com**).";
  }

  // Salutations
  if (/^(salut|bonjour|hello|coucou|hey|bonsoir|yo|wesh|ca va)/.test(q) && q.length < 30) {
    return "Bonjour ! Je suis l'assistant virtuel de **Muslim Bayschanov** (étudiant en BTS SIO SISR).\n\nJe peux vous renseigner sur :\n• **Ses 7 projets** (Infra Active Directory, pfSense, Zabbix, Rituels du Monde, Shop Ton Auto...)\n• **Ses stages & son parcours** en administration systèmes et réseaux\n• **Ses compétences & 24 protocoles** maîtrisés\n• **Sa recherche d'alternance** pour la rentrée 2026\n\nQue souhaitez-vous découvrir ?";
  }

  // Alternance / Recrutement / Contact / CV / Localisation
  if (/(alternance|recrut|embauch|dispo|contrat|contact|email|mail|tel|telephone|numero|linkedin|github|cv|curriculum|adresse|vitry|ou habite|localisation|joindre)/.test(q)) {
    return "**Coordonnées & Recherche d'Alternance — Muslim Bayschanov :**\n\n• **Objectif** : Contrat d'alternance de **12 mois** (rentrée 2026) en Administration Systèmes, Réseaux ou Cybersécurité.\n• **Formation** : BTS SIO option SISR (Lycée Turgot, Paris 3ème).\n• **Localisation** : Vitry-Sur-Seine (Île-de-France).\n• **Email** : baysmuslim@gmail.com\n• **Téléphone** : 06.95.13.05.64\n• **LinkedIn** : linkedin.com/in/muslimbays\n\nVous pouvez consulter son **CV complet** directement depuis le bouton ci-dessous ou en haut de la page.";
  }

  // Projets spécifiques (détails)
  if (/(rituel|ritual|spa|failover|ollama|firestore)/.test(q)) {
    return "**Projet — Rituels du Monde (2026) :**\n\n• **Concept** : Plateforme complète de Spa & Bien-être avec boutique et système de réservation en 3 étapes sans rechargement.\n• **Innovation IA hybride** : Utilisation de l'API **Mistral Cloud** en mode nominal avec bascule automatique (**Failover**) sur un modèle **Ollama local** en cas de coupure réseau.\n• **Sécurité & Données** : Base de données **Firebase Firestore** et respect du RGPD.";
  }

  if (/(shop|auto|voiture|concession)/.test(q)) {
    return "**Projet — Shop Ton Auto (2026) :**\n\n• **Front-Office** : Vitrine de concession automobile avec filtrage dynamique des véhicules (budget, carburant, année) et formulaire de reprise.\n• **Back-Office** : Dashboard d'administration sécurisé permettant la gestion complète du stock (**CRUD**) et le suivi des demandes clients.";
  }

  if (/(chicken|resto|restaurant|aubervilliers)/.test(q)) {
    return "**Projet — Chicken Point (2025) :**\n\n• **Architecture** : Site vitrine sur-mesure en HTML5 / CSS3 / JS pour un restaurant à Aubervilliers.\n• **Fonctionnalités** : Navigation fluide ScrollSpy, intégration Uber Eats et formulaire de contact AJAX via Formspree.";
  }

  if (/(active directory|wds|windows server|gpo|clonezilla)/.test(q)) {
    return "**Projet — Infrastructure Active Directory & WDS (2026) :**\n\n• **Cœur d'infrastructure** : Déploiement d'un contrôleur de domaine sous **Windows Server 2022**.\n• **Services** : Configuration **AD DS**, stratégies de groupe (**GPO**), services **DNS** et **DHCP**.\n• **Automatisation** : Déploiement automatisé de postes clients sur le réseau via **WDS** (Windows Deployment Services).";
  }

  if (/(glpi|zabbix|ocs|supervision|monitoring|ticketing)/.test(q)) {
    return "**Projet — Supervision GLPI & Zabbix (2026) :**\n\n• **Inventaire** : Remontée automatique du parc matériel et logiciel avec **OCS Inventory**.\n• **Ticketing** : Centralisation et traitement des incidents N1/N2 via **GLPI**.\n• **Monitoring** : Surveillance temps réel des serveurs, services et switchs via **Zabbix** (métriques SNMPv3 et alertes).";
  }

  if (/(pfsense|pare-feu|firewall|portail captif)/.test(q)) {
    return "**Projet — Sécurisation Réseau & Pare-feu pfSense (2026) :**\n\n• **Architecture** : Segmentation réseau multi-zones par **VLANs** (utilisateurs, serveurs, invités).\n• **Sécurité périmétrique** : Règles de filtrage strictes sous **pfSense**, portail captif authentifié et détection d'intrusions.\n• **Accès distants** : Mise en place de tunnels **VPN IPsec / OpenVPN** chiffrés.";
  }

  // Liste des projets
  if (/(projet|realisation|travaux|cahier|gantt)/.test(q)) {
    return "**Les 7 projets réalisés par Muslim :**\n\n• **Infra & Réseaux** : *Active Directory & WDS*, *Supervision GLPI & Zabbix*, *Sécurisation Réseau pfSense*.\n• **Web & Hybride** : *Rituels du Monde* (IA + Failover), *Shop Ton Auto* (CRUD sécurisé), *Chicken Point*, *E-Portfolio*.\n\nChaque projet web inclut son **cahier des charges**, **cahier des recettes**, **cahier des tests** et **diagramme de Gantt** dans la section Projets.";
  }

  // Stages / Expériences / Parcours / Formation
  if (/(stage|experience|parcours|entreprise|leclerc|job|rapport|turgot|lycee|bac|stmg|formation|etude|bts|sio|sisr|slam|filiere)/.test(q)) {
    return "**Parcours & Expériences de Muslim :**\n\n• **Formation** : En **BTS SIO option SISR** (2024–2026) au Lycée Turgot (Paris 3ème), après un Bac STMG obtenu en 2024.\n• **Stage 2ème année (Mai–Juil. 2025)** : Stagiaire Admin Systèmes & Réseaux (AD DS, GPO, VLANs Cisco, support GLPI/OCS).\n• **Stage 1ère année (2024, 6 sem.)** : Stagiaire Tech Support & Infra (maintenance parc, brassage baies RJ45, partages sécurisés).\n• **Emploi étudiant (2025–Présent)** : Employé polyvalent chez E.Leclerc (Vitry-Sur-Seine).\n\nLes **rapports de stage (1ère & 2ème année)** sont téléchargeables en bas de la section Projets.";
  }

  // Certifications
  if (/(certif|credly|badge|packet tracer|bases reseaux)/.test(q)) {
    return "**Certifications obtenues (Cisco Networking Academy — 2024) :**\n\n• **Cisco Packet Tracer** (conception et simulation d'architectures réseau)\n• **Bases Réseaux** (adressage IP, routage, commutation)\n• **Cybersécurité** (menaces, durcissement et défense réseau)\n\nToutes ses certifications sont vérifiables en ligne via ses badges officiels **Credly** dans la section Certifications.";
  }

  // Protocoles informatiques
  if (/(protocole|ospf|bgp|rip|802\.1q|stp|rstp|icmp|arp|ssh|ipsec|wireguard|tls|ssl|radius|kerberos|dns|dhcp|ldap|ntp|snmp|smb|tcp|udp|sftp|smtp|port )/.test(q)) {
    return "**Maîtrise des Protocoles Réseaux & Systèmes (24 fiches) :**\n\n• **Routage & Niveau 2** : OSPF, BGP, RIP v2, VLAN 802.1Q, STP/RSTP, ICMP, ARP.\n• **Sécurité & Auth** : SSH (Ed25519), IPsec (IKEv2), WireGuard, TLS 1.3, RADIUS/802.1X, Kerberos v5.\n• **Services Infra** : DNS/DNSSEC, DHCP (+ IP Helper), LDAP/LDAPS, NTP, SNMPv3, SMBv3.\n• **Transport & Web** : TCP, UDP, HTTP/HTTPS, SFTP, SMTP/SMTPS.\n\nCliquez sur n'importe quelle carte dans la section **Protocoles** pour afficher sa fiche technique et son PDF !";
  }

  // Compétences techniques
  if (/(competence|skill|linux|debian|ubuntu|windows|cisco|vmware|proxmox|docker|python|bash|sql|php|html|js|react)/.test(q)) {
    return "**Compétences techniques de Muslim (Option SISR) :**\n\n• **Systèmes** : Windows Server 2022 (AD, GPO, WDS), Linux (Debian/Ubuntu/Kali), scripting Bash, Python & PowerShell.\n• **Réseaux** : Switchs & routeurs Cisco, segmentation VLAN, routage OSPF, pare-feu pfSense, analyse Wireshark.\n• **Virtualisation & Outils** : Proxmox VE, VMware, Docker, Zabbix, GLPI, OCS Inventory.\n• **Développement** : HTML5/CSS3, JS, React, PHP, SQL, Firebase.";
  }

  // Veille technologique
  if (/(veille|ia|intelligence artificielle|cyberdefense|ueba|soar|soc|anssi|feedly|zero-day|problematique)/.test(q)) {
    return "**Veille Technologique — IA & Cyberdéfense Proactive :**\n\n• **Problématique** : *Comment passer d'une sécurité réactive à une cyberdéfense prédictive et automatisée ?*\n• **3 Axes d'étude** : Analyse comportementale (**UEBA** / zero-day), automatisation des **SOC & Copilotes IA** (réduction du MTTR), et réponse **IA vs IA** contre les malwares polymorphes.\n• **Outils** : Flux RSS Feedly (ANSSI / CERT-FR, LeMagIT, ZDNet) et Google Alerts.\n\nSa fiche de veille complète au format PDF est consultable dans la section **Veille**.";
  }

  // CyberLab / Simulateur d'incidents
  if (/(cyberlab|jeu|simulateur|incident|depannage|memory)/.test(q)) {
    return "**CyberLab Interactif (Simulateur d'Incidents SISR) :**\n\n• **6 scénarios réels** (Panne DNS/AD, tempête de broadcast Cisco, force brute SSH, relais DHCP inter-VLAN, saturation LVM Zabbix, détection C2 Suricata).\n• **Console Terminal interactive** : Lancez des diagnostics, tapez des commandes (`diagnostic`, `ping`, `help`) et résolvez les tickets pour monter en grade !";
  }

  // Langues & Loisirs
  if (/(langue|parle|russe|anglais|tchetchene|loisir|sport|lutte|muscu|voyage|interet|passion)/.test(q)) {
    return "**Langues & Centres d'intérêt de Muslim :**\n\n• **Langues** : Français (courant), Tchétchène (maternel), Russe (niveau B2), Anglais (niveau B1).\n• **Sport & Loisirs** : Pratique de la **lutte en club** et musculation (discipline, persévérance), voyages (Russie, Turquie, Pays-Bas, Maroc) et veille en cybersécurité.";
  }

  // Qui est Muslim (fallback profil général)
  if (/(qui est|presente|a propos|resume|synthese|profil|muslim)/.test(q)) {
    return "**Profil de Muslim Bayschanov :**\n\nÉtudiant en **BTS SIO option SISR** au Lycée Turgot (Paris), passionné par les infrastructures systèmes, les réseaux Cisco et la cybersécurité.\n\nIl a effectué **2 stages informatiques** (Admin Sys & Réseaux, Support Infra), obtenu **3 certifications Cisco**, réalisé **7 projets concrets** et recherche une **alternance de 12 mois** pour la rentrée 2026.";
  }

  // Réponse par défaut constructive
  return "Je n'ai pas saisi le détail exact de votre demande, mais je connais tout sur le profil de **Muslim Bayschanov** !\n\nEssayez par exemple de me demander :\n• *« Parle-moi de ses projets »*\n• *« Quels sont ses stages ? »*\n• *« Quels protocoles maîtrise-t-il ? »*\n• *« Est-il disponible en alternance ? »*";
}

export const sendChatMessage = async (
  message: string | ChatMessage[],
  _t?: (key: string) => string
): Promise<string> => {
  const formattedMessages = Array.isArray(message)
    ? message
    : [{ role: 'user' as const, content: message }];

  const lastUserMsg = [...formattedMessages].reverse().find(m => m.role === 'user')?.content || '';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: formattedMessages }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.reply) {
      return data.reply;
    }
    throw new Error('Empty reply');
  } catch {
    // Bascule transparente sur le moteur intelligent local (0% d'erreur visible pour le visiteur)
    return generateSmartReply(lastUserMsg);
  }
};