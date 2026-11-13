import { PROTOCOLS_DATA } from '../data/protocolsList.js';

export function normalizeText(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, "'");
}

// ============================================================================
// 1. BASE DE PROTOCOLES (24 fiches importées de protocolsList.js)
// ============================================================================
const PROTOCOL_PATTERNS = [
  { id: 'ospf', patterns: [/\bospf\b/, /\bdijkstra\b/, /\bopen shortest path\b/, /\bip\s*89\b/] },
  { id: 'bgp', patterns: [/\bbgp\b/, /\bborder gateway\b/, /\b179\b/, /\bsyst[eè]mes autonomes\b/, /\basn\b/, /\brpki\b/] },
  { id: 'rip', patterns: [/\brip\s*v?2?\b/, /\brouting information\b/, /\b520\b/] },
  { id: '802-1q', patterns: [/802\.?1q/, /\bvlan\b/, /\bvlans\b/, /\btrunk\b/, /\bdot1q\b/, /\bvlan hopping\b/] },
  { id: 'stp', patterns: [/\bstp\b/, /\brstp\b/, /\bspanning\s*tree\b/, /\bbpdu\b/, /802\.?1w/, /802\.?1d/] },
  { id: 'icmp', patterns: [/\bicmp\b/, /\bping\b/, /\btraceroute\b/, /\bsmurf\b/, /\bmtu\b/] },
  { id: 'arp', patterns: [/\barp\b/, /\bdai\b/, /\bdynamic arp\b/, /\bcache arp\b/] },
  { id: 'sftp', patterns: [/\bsftp\b/, /\bssh file transfer\b/] },
  { id: 'ssh', patterns: [/\bssh\b/, /\bsecure shell\b/, /\bed25519\b/, /\bfail2ban\b/, /\bport\s*22\b/] },
  { id: 'ipsec', patterns: [/\bipsec\b/, /\bikev2\b/, /\besp\b/, /\b500\b/, /\b4500\b/, /\bsite[- ]to[- ]site\b/] },
  { id: 'wireguard', patterns: [/\bwireguard\b/, /\b51820\b/, /\bcurve25519\b/, /\bchacha20\b/] },
  { id: 'tls', patterns: [/\btls\b/, /\bssl\b/, /\btls\s*1\.3\b/, /\bpfs\b/, /\bperfect forward\b/] },
  { id: 'radius', patterns: [/\bradius\b/, /802\.?1x/, /\bfreeradius\b/, /\bnps\b/, /\beap-tls\b/, /\b1812\b/, /\b1813\b/] },
  { id: 'kerberos', patterns: [/\bkerberos\b/, /\bkdc\b/, /\btgt\b/, /\bkerberoasting\b/, /\bport\s*88\b/, /\bsso\b/] },
  { id: 'dns', patterns: [/\bdnssec\b/, /\bdns\b/, /\bfqdn\b/, /\bsrv\b/, /\bport\s*53\b/] },
  { id: 'dhcp', patterns: [/\bdhcp\b/, /\bip helper\b/, /\brogue dhcp\b/, /\bdhcp snooping\b/, /\bport\s*6[78]\b/] },
  { id: 'ldap', patterns: [/\bldaps?\b/, /\bstarttls\b/, /\b389\b/, /\b636\b/, /\bannuaire\b/] },
  { id: 'ntp', patterns: [/\bntp\b/, /\bnetwork time\b/, /\bmonlist\b/, /\b123\b/, /\bsynchronisation horloge\b/] },
  { id: 'snmp', patterns: [/\bsnmpv?3?\b/, /\bauthpriv\b/, /\b161\b/, /\b162\b/, /\btraps?\b/] },
  { id: 'smb', patterns: [/\bsmbv?[123]?\b/, /\bcifs\b/, /\bsamba\b/, /\b445\b/, /\bwannacry\b/] },
  { id: 'tcp', patterns: [/\btcp\b/, /\bsyn flood\b/, /\bsyn cookies\b/, /\bhandshake\b/] },
  { id: 'udp', patterns: [/\budp\b/, /\bdatagrammes?\b/, /\bréflexion\b/] },
  { id: 'https', patterns: [/\bhttps?\b/, /\bhsts\b/, /\b443\b/, /\bport\s*80\b/] },
  { id: 'smtp', patterns: [/\bsmtps?\b/, /\bspf\b/, /\bdkim\b/, /\bdmarc\b/, /\b587\b/, /\b465\b/, /\bport\s*25\b/] }
];

function findMatchingProtocols(q) {
  const matched = [];
  for (const entry of PROTOCOL_PATTERNS) {
    if (entry.patterns.some((re) => re.test(q))) {
      const proto = PROTOCOLS_DATA.find((p) => p.id === entry.id);
      if (proto) matched.push(proto);
    }
  }
  return matched;
}

function formatSingleProtocol(proto, aspect = 'full') {
  const catLabel =
    proto.category === 'routing'
      ? 'Réseau & Routage'
      : proto.category === 'security'
      ? 'Sécurité & Chiffrement'
      : proto.category === 'infra'
      ? 'Services & Infrastructure'
      : 'Transport & Web';

  if (aspect === 'security') {
    return (
      `**Sécurisation & Durcissement — ${proto.name} (${proto.fullName}) :**\n\n` +
      `• **Bonnes pratiques appliquées** : ${proto.securityNote}\n` +
      `• **Port / Transport à filtrer** : ${proto.port} (${proto.layer})\n` +
      `• **Usage en environnement SISR** : ${proto.practicalRole}`
    );
  }

  if (aspect === 'port') {
    return (
      `**Port, Couche & Standard — ${proto.name} :**\n\n` +
      `• **Port / Transport** : ${proto.port}\n` +
      `• **Couche du modèle OSI** : ${proto.layer}\n` +
      (proto.rfc ? `• **Standard / RFC** : ${proto.rfc}\n` : '') +
      `• **Rôle clé** : ${proto.shortDesc}`
    );
  }

  if (aspect === 'practical') {
    return (
      `**Mise en pratique de ${proto.name} par Muslim (SISR) :**\n\n` +
      `• **En production / lab** : ${proto.practicalRole}\n` +
      `• **Durcissement associé** : ${proto.securityNote}\n` +
      `• **Spécifications** : ${proto.port} · ${proto.layer}`
    );
  }

  return (
    `**Protocole ${proto.name} — ${proto.fullName}** (${catLabel})\n\n` +
    `• **Couche OSI** : ${proto.layer}\n` +
    `• **Port / Transport** : ${proto.port}${proto.rfc ? ` · **${proto.rfc}**` : ''}\n` +
    `• **Définition** : ${proto.shortDesc}\n` +
    `• **Application BTS SIO SISR** : ${proto.practicalRole}\n` +
    `• **Sécurisation & Durcissement** : ${proto.securityNote}\n\n` +
    `La fiche détaillée et le PDF officiel de **${proto.name}** sont consultables en cliquant sur sa carte dans la section **Protocoles**.`
  );
}

// ============================================================================
// 2. COMPARAISONS TECHNIQUES GRANULAIRES
// ============================================================================
function matchComparison(q) {
  const isCompare = /\b(vs|versus|compar|differen|entre|mieux|choisir|plutot)\b/.test(q);
  if (!isCompare) return null;

  if (/\btcp\b/.test(q) && /\budp\b/.test(q)) {
    return (
      `**Comparaison TCP vs UDP (Couche 4 · Transport) :**\n\n` +
      `• **TCP (Orienté connexion — RFC 793)** : Handshake en 3 étapes (SYN/SYN-ACK/ACK), accusés de réception, réordonnancement et garantie d'intégrité. Idéal pour **HTTP/HTTPS, SSH, SMB, LDAP et bases de données**.\n` +
      `• **UDP (Sans connexion — RFC 768)** : Datagrammes légers sans acquittement, latence minimale et débit maximal. Idéal pour **DNS, DHCP, WireGuard, SNMP et VoIP**.\n` +
      `• **Sécurité** : SYN Cookies contre le SYN Flood sur TCP ; limitation de débit contre l'amplification DNS/NTP sur UDP.`
    );
  }
  if (/\bipsec\b/.test(q) && /\bwireguard\b/.test(q)) {
    return (
      `**Comparaison IPsec (IKEv2) vs WireGuard :**\n\n` +
      `• **IPsec (Ports 500/4500 UDP · ESP)** : Standard historique d'entreprise très complet (IKEv2 + AES-GCM-256), utilisé par Muslim sur **pfSense pour les VPN Site-to-Site**.\n` +
      `• **WireGuard (Port 51820 UDP)** : Protocole récent ultra-rapide (~4 000 lignes de code, Curve25519 + ChaCha20-Poly1305), idéal pour l'**accès distant nomade** avec très faible latence.`
    );
  }
  if (/\bospf\b/.test(q) && /\brip\b/.test(q)) {
    return (
      `**Comparaison OSPF vs RIP v2 :**\n\n` +
      `• **OSPF (Protocole IP 89 — État de liens)** : Calcul du plus court chemin via **Dijkstra**, convergence ultra-rapide, découpage en zones (**Area 0**) sans limite de sauts. Recommandé en **production d'entreprise**.\n` +
      `• **RIP v2 (Port 520 UDP — Vecteur de distance)** : Basé sur le nombre de sauts (plafonné à **15 sauts**), convergence plus lente. Utilisé sur de petites topologies ou maquettes BTS.`
    );
  }
  if (/\bospf\b/.test(q) && /\bbgp\b/.test(q)) {
    return (
      `**Comparaison OSPF (IGP) vs BGP (EGP) :**\n\n` +
      `• **OSPF** : Routage dynamique **interne** à une entreprise (Autonomous System unique), basé sur la bande passante (Dijkstra, IP 89).\n` +
      `• **BGP v4** : Routage dynamique **externe** sur Internet (Port 179 TCP), reliant plusieurs systèmes autonomes (AS) avec politiques de peering et filtrage RPKI.`
    );
  }
  if (/\bldap\b/.test(q) && /\bldaps\b/.test(q)) {
    return (
      `**Différence LDAP vs LDAPS :**\n\n` +
      `• **LDAP (Port 389 TCP)** : Échanges avec l'annuaire Active Directory **en clair** (risque d'interception des identifiants).\n` +
      `• **LDAPS (Port 636 TCP)** : Encapsulation dans un tunnel **SSL/TLS** garantissant confidentialité et intégrité lors des liaisons avec **GLPI, Nextcloud ou pfSense**.`
    );
  }
  if (/\bsftp\b/.test(q) && /\bftp\b/.test(q)) {
    return (
      `**Différence SFTP vs FTP :**\n\n` +
      `• **FTP (Ports 20/21 TCP)** : Obsolète et non chiffré — mots de passe et fichiers circulent en clair.\n` +
      `• **SFTP (Port 22 TCP via SSH)** : Un seul port firewall, session chiffrée de bout en bout (Ed25519) et utilisateurs isolés par ` + '`chroot`' + `.`
    );
  }
  if (/\bssh\b/.test(q) && /\btelnet\b/.test(q)) {
    return (
      `**Différence SSH vs Telnet :**\n\n` +
      `• **Telnet (Port 23)** : Administration en texte clair, bannie en production SISR.\n` +
      `• **SSH v2 (Port 22 TCP)** : Canal cryptographique complet avec authentification par clés Ed25519 et protection Fail2ban.`
    );
  }
  if (/\bsnort\b/.test(q) && /\bsuricata\b/.test(q)) {
    return (
      `**Comparaison Snort vs Suricata (IDS/IPS) :**\n\n` +
      `• **Snort** : Moteur IDS/IPS historique mono-thread, référence pour la syntaxe de règles de détection.\n` +
      `• **Suricata** : Moteur moderne **multi-thread**, inspection haute performance à la couche applicative et export JSON natif (utilisé notamment dans le scénario C2 du **CyberLab**).`
    );
  }
  if (/\bzabbix\b/.test(q) && /\bnagios\b/.test(q)) {
    return (
      `**Comparaison Zabbix vs Nagios (Supervision) :**\n\n` +
      `• **Zabbix** : Solution moderne tout-en-un avec base de données temps réel, graphiques natifs, découverte réseau et agents/SNMPv3 intégrés (utilisée dans le projet *Supervision GLPI & Zabbix*).\n` +
      `• **Nagios** : Moteur robuste pionnier basé sur des plugins de vérification d'état des hôtes et services.`
    );
  }
  if (/\bproxmox\b/.test(q) && /\bvmware\b/.test(q)) {
    return (
      `**Comparaison Proxmox VE vs VMware :**\n\n` +
      `• **Proxmox VE** : Hyperviseur open source de type 1 (base Debian + KVM + conteneurs LXC), cluster HA intégré et sauvegarde native via **Proxmox Backup Server**.\n` +
      `• **VMware (ESXi / Workstation)** : Standard historique d'entreprise en virtualisation de serveurs et postes de lab.`
    );
  }
  if (/\bsisr\b/.test(q) && /\bslam\b/.test(q)) {
    return (
      `**BTS SIO — Option SISR (choisie par Muslim) vs Option SLAM :**\n\n` +
      `• **SISR (Solutions d'Infrastructure, Systèmes et Réseaux)** : Administration serveurs Windows/Linux, réseaux Cisco, VLANs, virtualisation, pare-feux pfSense et cybersécurité.\n` +
      `• **SLAM (Solutions Logicielles et Applications Métiers)** : Développement web/mobile, POO/MVC, APIs REST et bases de données (compétences complémentaires également pratiquées par Muslim sur ses projets web).`
    );
  }
  return null;
}

// ============================================================================
// 3. COMPÉTENCES DÉTAILLÉES PAR SOUS-DOMAINE ET OUTIL
// ============================================================================
const SKILLS_KNOWLEDGE = [
  {
    id: 'skill_linux',
    patterns: [/\blinux\b/, /\bdebian\b/, /\bubuntu\b/, /\bkali\b/, /\bbash\b/, /\bchmod\b/, /\bchown\b/, /\blvm\b/, /\bufw\b/, /\bshell\b/],
    reply: () =>
      `**Compétence Systèmes Linux & Scripting — Muslim Bayschanov :**\n\n` +
      `• **Distributions maîtrisées** : **Debian** et **Ubuntu Server** (hébergement de services, Zabbix, GLPI, Nextcloud) ainsi que **Kali Linux** (audits et tests de robustesse).\n` +
      `• **Sécurité système** : Gestion granulaire des droits et habilitations (**chmod, chown**, groupes), pare-feu **UFW**, durcissement SSH (Ed25519) + **Fail2ban**.\n` +
      `• **Stockage & Automatisation** : Extension de volumes **LVM** (comme dans le scénario Zabbix du CyberLab) et écriture de scripts **Bash** pour automatiser sauvegardes et tâches d'administration.`
  },
  {
    id: 'skill_windows_ad',
    patterns: [/\bwindows\s*server\b/, /\bactive directory\b/, /\bad\s*ds\b/, /\bgpo\b/, /\bwds\b/, /\bclonezilla\b/, /\bpowershell\b/, /\bpxe\b/],
    reply: () =>
      `**Compétence Windows Server, Active Directory & Déploiement :**\n\n` +
      `• **Annuaire & Identités** : Déploiement complet de contrôleurs de domaine sous **Windows Server 2022** (**AD DS**, Unités d'Organisation, DNS/DHCP intégrés).\n` +
      `• **Stratégies de groupe (GPO)** : Restriction des privilèges, lecteur réseau mappé automatiquement, politique de mots de passe et durcissement des postes.\n` +
      `• **Automatisation & Masterisation** : Déploiement réseau PXE sans intervention via **WDS** (Windows Deployment Services), clonage via **Clonezilla** et scripting **PowerShell**.`
  },
  {
    id: 'skill_collab_db',
    patterns: [/\bnextcloud\b/, /\bmariadb\b/, /\bpython\b/, /\bsgbd\b/, /\bcollaboratif\b/],
    reply: () =>
      `**Compétence Services Collaboratifs, SGBD & Python :**\n\n` +
      `• **Cloud privé & Collaboration** : Installation et sécurisation de **Nextcloud** couplé à l'annuaire Active Directory (LDAPS) pour le partage interne de fichiers.\n` +
      `• **Bases de données** : Administration de **MariaDB / MySQL** et écriture de requêtes **SQL** pour les services applicatifs (GLPI, web).\n` +
      `• **Scripting Python** : Développement d'utilitaires d'automatisation et d'outillage système.`
  },
  {
    id: 'skill_cisco_net',
    patterns: [/\bcisco\b/, /\bpacket tracer\b/, /\bswitchs?\b/, /\brouteurs?\b/, /\bwireshark\b/, /\bntopng\b/, /\btrames?\b/, /\broutage\b/, /\bcablage\b/, /\bbrassage\b/],
    reply: () =>
      `**Compétence Réseaux Cisco & Analyse de Trafic :**\n\n` +
      `• **Équipements Cisco** : Configuration CLI de switchs Catalyst et routeurs Cisco (VLANs 802.1Q, Trunks, **routage inter-VLAN**, **OSPF**, **STP/RSTP**, IP Helper).\n` +
      `• **Simulation & Architecture** : Modélisation sous **Cisco Packet Tracer** (certification obtenue en 2024) et schématisation multi-périmètres.\n` +
      `• **Diagnostic & Métrologie** : Capture et dissection de trames avec **Wireshark** et surveillance des flux IP en temps réel avec **ntopNG**.`
  },
  {
    id: 'skill_firewall',
    patterns: [/\bpfsense\b/, /\bpare-feu\b/, /\bfirewall\b/, /\bportail captif\b/],
    reply: () =>
      `**Compétence Pare-feu pfSense, Filtrage & Portail Captif :**\n\n` +
      `• **Segmentation multi-zones** : Isolation stricte des flux LAN utilisateurs, serveurs, DMZ et réseau invités via **pfSense**.\n` +
      `• **Politiques de sécurité** : Règles de filtrage NAT/PAT, listes blanches, **portail captif authentifié** (via RADIUS/AD) et détection d'intrusions.\n` +
      `• **Tunnels chiffrés** : Interconnexion **VPN IPsec (IKEv2)** et **WireGuard / OpenVPN** pour le télétravail et les sites distants.`
  },
  {
    id: 'skill_virtualisation',
    patterns: [/\bproxmox\b/, /\bvmware\b/, /\bvirtualbox\b/, /\bdocker\b/, /\bvirtualisation\b/, /\bhyperviseur\b/, /\bhaute disponibilite\b/, /\bbackup\b/, /\bsauvegarde\b/, /\bbarracuda\b/, /\bcloud computing\b/],
    reply: () =>
      `**Compétence Cloud, Virtualisation & Haute Disponibilité :**\n\n` +
      `• **Hyperviseurs** : Installation, administration et réseau virtuel (bridges/VLANs) sous **Proxmox VE**, **VMware** et **VirtualBox**.\n` +
      `• **Conteneurisation** : Déploiement d'applications et services isolés avec **Docker**.\n` +
      `• **Continuité d'activité (PCA/PRA)** : Tolérance aux pannes, répartition de charge (**Haute Disponibilité / HA**) et sauvegardes automatisées via **Proxmox Backup Server** et **Barracuda**.`
  },
  {
    id: 'skill_cybersec',
    patterns: [/\bsnort\b/, /\bsuricata\b/, /\bids\b/, /\bips\b/, /\bgpg\b/, /\bgocryptfs\b/, /\bchiffrement\b/, /\brobustesse\b/, /\bintrusion\b/, /\bpentest\b/],
    reply: () =>
      `**Compétence Cybersécurité & Chiffrement :**\n\n` +
      `• **Détection & Prévention d'intrusions (IDS/IPS)** : Déploiement de sondes **Snort** et **Suricata** pour analyser les paquets et bloquer les comportements suspects (scans, C2).\n` +
      `• **Chiffrement avancé** : Protection de fichiers et disques avec **GPG** et **gocryptfs**, et chiffrement des flux réseau (**SSL/TLS 1.3**, **SSH Ed25519**).\n` +
      `• **Durcissement & Tests** : Politiques de mots de passe robustes, authentification centralisée (**Portail captif, RADIUS, AD**) et tests de vulnérabilité sous Kali Linux.`
  },
  {
    id: 'skill_glpi_supervision',
    patterns: [/\bglpi\b/, /\bocs\b/, /\bzabbix\b/, /\bnagios\b/, /\bsupervision\b/, /\bticketing\b/, /\bmonitoring\b/, /\binventaire\b/],
    reply: () =>
      `**Compétence Supervision, Inventaire & Ticketing (GLPI / Zabbix) :**\n\n` +
      `• **Gestion de parc & Ticketing** : Déploiement de **GLPI** couplé à **OCS Inventory** pour remonter automatiquement la configuration matérielle/logicielle et traiter les incidents N1/N2/N3 selon les SLA.\n` +
      `• **Supervision temps réel** : Monitoring de la disponibilité, charge CPU/RAM, espace disque et sécurité sur **Zabbix** et **Nagios** via agents et **SNMPv3** avec seuils d'alerte.`
  },
  {
    id: 'skill_iac_tools',
    patterns: [/\bpuppet\b/, /\bansible\b/, /\bkeepass\b/, /\binfrastructure as code\b/],
    reply: () =>
      `**Compétence Outillage Automation & Coffre-fort (Puppet, Ansible, KeePass) :**\n\n` +
      `• **Automatisation de configuration** : Utilisation de **Puppet** et **Ansible** pour maintenir l'état conforme des serveurs et automatiser les déploiements répétitifs.\n` +
      `• **Gestion des secrets** : Stockage chiffré et structuré des identifiants d'infrastructure dans **KeePass** selon le principe du moindre privilège.`
  },
  {
    id: 'skill_gestion_projet',
    patterns: [/\bgestion de projet\b/, /\bsla\b/, /\bdraw\.?io\b/, /\bvisio\b/, /\bcahier des charges\b/, /\bcahier de recette\b/, /\bcahier des? tests?\b/, /\bgantt\b/],
    reply: () =>
      `**Compétence Gestion de Projet & Documentation Technique :**\n\n` +
      `• **Livrables complets** : Rédaction de **cahiers des charges**, **cahiers de recettes**, **cahiers de tests** et planification par **diagrammes de Gantt** (consultables sur chaque projet dans la section Projets).\n` +
      `• **Architecture & Qualité de service** : Schématisation fonctionnelle réseau/systèmes sur **Draw.io** et **Visio**, et suivi des engagements **SLA** et contraintes de sécurité.`
  },
  {
    id: 'skill_web_dev',
    patterns: [/\breact\b/, /\btypescript\b/, /\btailwind\b/, /\bhtml\b/, /\bcss\b/, /\bjavascript\b/, /\bphp\b/, /\bsql\b/, /\bfirebase\b/, /\bfirestore\b/, /\bvite\b/, /\bdeveloppement\b/],
    reply: () =>
      `**Compétence Développement Web & Bases de Données (complémentaire) :**\n\n` +
      `• **Front-end moderne** : **HTML5, CSS3, JavaScript ES6, React 19, TypeScript et Tailwind CSS** (utilisés notamment pour ce portfolio et ses simulateurs).\n` +
      `• **Back-end & Données** : **PHP**, modélisation et requêtes **SQL (MariaDB)**, et **Firebase Firestore** (projet *Rituels du Monde*).`
  }
];

// ============================================================================
// 4. PROJETS DÉTAILLÉS (7 projets)
// ============================================================================
const PROJECTS_KNOWLEDGE = [
  {
    id: 'proj_rituels',
    patterns: [/\brituels?\b/, /\brituals\b/, /\bspa\b/, /\bollama\b/, /\bfailover\b/, /\bmistral cloud\b/],
    reply: () =>
      `**Projet — Rituels du Monde (2026) :**\n\n` +
      `• **Objectif** : Plateforme web complète pour un Spa & Bien-être intégrant réservation en 3 étapes sans rechargement, boutique en ligne et assistant virtuel.\n` +
      `• **Architecture IA Hybride & Résilience** : Appels vers **Mistral Cloud** en mode nominal avec bascule automatique (**Failover**) sur un modèle **Ollama local** en cas de perte de connectivité.\n` +
      `• **Données & Livrables** : Stockage **Firebase Firestore** conforme RGPD, avec **Cahier des charges, Cahier des recettes, Cahier des tests et Diagramme de Gantt** disponibles dans la fiche projet.`
  },
  {
    id: 'proj_shop',
    patterns: [/\bshop\s*ton\s*auto\b/, /\bconcession\b/, /\bvoiture\b/, /\bcrud\b/, /\breprise\b/],
    reply: () =>
      `**Projet — Shop Ton Auto (2026) :**\n\n` +
      `• **Front-Office** : Vitrine de concession automobile avec filtrage multicritères en temps réel (budget, carburant, année) et module d'estimation de reprise.\n` +
      `• **Back-Office sécurisé** : Interface d'administration **CRUD** complète pour gérer le stock de véhicules et traiter les demandes clients.\n` +
      `• **Documentation** : Site déployé sur GitHub Pages + les 4 livrables (**Cahier des charges, Recettes, Tests et Gantt**) consultables dans la section Projets.`
  },
  {
    id: 'proj_chicken',
    patterns: [/\bchicken\b/, /\baubervilliers\b/, /\brestaurant\b/, /\bscrollspy\b/, /\bformspree\b/],
    reply: () =>
      `**Projet — Chicken Point (2025) :**\n\n` +
      `• **Concept** : Vitrine web responsive sur-mesure réalisée en **HTML5 / CSS3 / JavaScript** pour un restaurant à Aubervilliers.\n` +
      `• **Fonctionnalités** : Carte interactive, navigation fluide **ScrollSpy**, lien direct de commande Uber Eats et formulaire de contact AJAX via Formspree.\n` +
      `• **Livrables** : Galerie de 10 captures, lien live GitHub Pages et dossier projet complet (Charges, Recettes, Tests, Gantt).`
  },
  {
    id: 'proj_eportfolio',
    patterns: [/\be-?portfolio\b/, /\bce site\b/, /\bce portfolio\b/],
    reply: () =>
      `**Projet — E-Portfolio BTS SIO SISR (2026) :**\n\n` +
      `• **Stack technique** : Application SPA **React 19 + TypeScript + Tailwind CSS + Vite**, servie par un backend **Express (Node.js)**.\n` +
      `• **Modules intégrés** : Référentiel technique de **24 protocoles**, simulateur interactif d'incidents en terminal **CyberLab**, ouverture directe des documents PDF et cet assistant conversationnel.`
  },
  {
    id: 'proj_ad_wds',
    patterns: [/\binfrastructure active directory\b/, /\bprojet.*active directory\b/, /\bprojet.*wds\b/, /\bdeploy.*wds\b/],
    reply: () =>
      `**Projet — Infrastructure Active Directory & WDS (2026) :**\n\n` +
      `• **Cœur système** : Déploiement d'un contrôleur de domaine sous **Windows Server 2022** avec annuaire **AD DS** hiérarchisé par Unités d'Organisation.\n` +
      `• **Services réseau critiques** : Configuration complète des rôles **DNS** et **DHCP** ainsi que de **stratégies de groupe (GPO)** sécurisées.\n` +
      `• **Automatisation** : Mise en œuvre de **WDS (Windows Deployment Services)** pour installer automatiquement les images systèmes sur le parc via le réseau (PXE).`
  },
  {
    id: 'proj_supervision',
    patterns: [/\bsupervision glpi\b/, /\bprojet.*glpi\b/, /\bprojet.*zabbix\b/, /\bglpi.*zabbix\b/],
    reply: () =>
      `**Projet — Supervision GLPI & Zabbix (2026) :**\n\n` +
      `• **Inventaire automatisé** : Remontée centralisée des machines, logiciels et licences via **OCS Inventory**.\n` +
      `• **Gestion des incidents (ITSM)** : Portails utilisateurs et traitement structuré des tickets N1/N2 sous **GLPI**.\n` +
      `• **Monitoring temps réel** : Sondes **Zabbix** (agents Linux/Windows et **SNMPv3**) surveillant charge CPU, mémoire, disques et disponibilité avec alertes.`
  },
  {
    id: 'proj_pfsense',
    patterns: [/\bsecurisation reseau\b/, /\bprojet.*pfsense\b/, /\bprojet.*pare-feu\b/, /\bpfsense.*vpn\b/],
    reply: () =>
      `**Projet — Sécurisation Réseau & Pare-feu pfSense (2026) :**\n\n` +
      `• **Architecture segmentée** : Découpage en **VLANs isolés** (Utilisateurs, Serveurs, DMZ, Invités) sur switchs **Cisco**.\n` +
      `• **Pare-feu & Contrôle** : Règles de filtrage inter-VLAN strictes sous **pfSense**, mise en place d'un **portail captif** et détection d'intrusions.\n` +
      `• **Accès distants** : Déploiement de tunnels **VPN chiffrés** pour les connexions nomades et inter-sites.`
  }
];

// ============================================================================
// 5. VEILLE TECHNOLOGIQUE GRANULAIRE
// ============================================================================
const VEILLE_KNOWLEDGE = [
  {
    id: 'veille_problematique',
    patterns: [/\bproblematique\b/, /\bsujet de veille\b/, /\bthematique\b/],
    reply: () =>
      `**Veille Technologique — Sujet & Problématique BTS SIO :**\n\n` +
      `• **Thématique** : *L'apport de l'Intelligence Artificielle dans la cyberdéfense proactive et l'anticipation des menaces.*\n` +
      `• **Problématique** : *Comment passer d'une posture de sécurité purement réactive à une cyberdéfense prédictive et automatisée face à des attaques de plus en plus sophistiquées ?*\n` +
      `• **Objectif SISR** : Comprendre comment UEBA, SOAR et LLM assistent concrètement les administrateurs et analystes SOC.`
  },
  {
    id: 'veille_axe1',
    patterns: [/\bueba\b/, /\bzero[- ]?day\b/, /\banalyse comportementale\b/, /\bia predictive\b/, /\baxe\s*1\b/, /\bpremier axe\b/],
    reply: () =>
      `**Veille Axe 1 — IA Prédictive & Analyse Comportementale (UEBA) :**\n\n` +
      `• **Principe** : Les modèles de Machine Learning apprennent la ligne de base (*baseline*) normale des utilisateurs et des flux réseau.\n` +
      `• **Intérêt Zero-Day** : Contrairement aux signatures d'antivirus classiques, l'**UEBA** détecte des déviations anormales (exfiltration, élévation de privilèges à 3h du matin) avant même qu'un CVE soit publié.\n` +
      `• **Source clé suivie** : *« Comment l'IA prédictive anticipe les attaques zero-day »* — **ANSSI / CERT-FR (Nov. 2024)**.`
  },
  {
    id: 'veille_axe2',
    patterns: [/\bsoc\b/, /\bsoar\b/, /\bmttr\b/, /\bcopilote\b/, /\btriage\b/, /\baxe\s*2\b/, /\bdeuxieme axe\b/],
    reply: () =>
      `**Veille Axe 2 — Automatisation des SOC, SOAR & Copilotes IA :**\n\n` +
      `• **Défi des SOC** : Surcharge d'alertes (*alert fatigue*) ralentissant les équipes de sécurité.\n` +
      `• **Apport des LLM & SOAR** : Triage automatique des faux positifs, corrélation des logs en langage naturel et exécution de playbooks (**SOAR**) qui réduisent drastiquement le **MTTR** (*Mean Time To Respond*).\n` +
      `• **Sources suivies** : *LeMagIT Cyber (Janv. 2025)* sur les SOC boostés par LLM et *ZDNet Sécurité (Mars 2025)* sur le SOAR.`
  },
  {
    id: 'veille_axe3',
    patterns: [/\bpolymorphe\b/, /\bia offensive\b/, /\bia defensive\b/, /\brancongiciel\b/, /\baxe\s*3\b/, /\btroisieme axe\b/],
    reply: () =>
      `**Veille Axe 3 — IA Défensive vs IA Offensive :**\n\n` +
      `• **La menace** : Les attaquants génèrent désormais des **malwares polymorphes** et du phishing hyper-ciblé capables de muter pour contourner les règles statiques.\n` +
      `• **La riposte** : Des moteurs défensifs autonomes analysent le comportement temps réel en sandbox/EDR et isolent l'hôte compromis en quelques millisecondes.\n` +
      `• **Source suivie** : *« L'automatisation SOAR face aux malwares polymorphes »* — **ZDNet Sécurité (Mars 2025)**.`
  },
  {
    id: 'veille_outils_articles',
    patterns: [/\bfeedly\b/, /\brss\b/, /\bgoogle alerts\b/, /\banssi\b/, /\bcert[- ]?fr\b/, /\blemagit\b/, /\bzdnet\b/, /\barticles?\b/, /\bsources?\b/],
    reply: () =>
      `**Outils, Flux RSS & Articles suivis pour la Veille :**\n\n` +
      `• **Dispositif** : Agrégateur **Feedly** (flux RSS automatisés avec capture d'écran de preuve dans la section Veille) + **Google Alerts** ciblés.\n` +
      `• **Sources officielles & médias** : **ANSSI / CERT-FR**, **LeMagIT Cyber**, **ZDNet Sécurité**, Le Monde Informatique, Gartner & IBM Security.\n` +
      `• **Articles clés archivés** : *IA prédictive & Zero-Day* (ANSSI, Nov. 2024), *SOC nouvelle génération & LLM* (LeMagIT, Janv. 2025), *SOAR vs malwares polymorphes* (ZDNet, Mars 2025).`
  }
];

// ============================================================================
// 6. PARCOURS, STAGES, CERTIFS, CYBERLAB, LANGUES & LOISIRS GRANULAIRES
// ============================================================================
function matchParcoursOrProfileSpecific(q) {
  // Stage 2ème année (2025)
  if (/(stage\s*(de\s*)?(2|deuxieme|2eme)|mai\s*2025|juil.*2025|dsi)/.test(q)) {
    return (
      `**Stage de 2ème année — Admin Systèmes & Réseaux (Mai – Juil. 2025) :**\n\n` +
      `• **Structure** : DSI / Entreprise partenaire.\n` +
      `• **Missions principales** : Administration de serveurs **Windows & Linux**, intégration **Active Directory (GPO)**, segmentation réseau **VLANs sur switchs Cisco**, support N1/N2 et gestion d'inventaire sous **GLPI / OCS**.\n` +
      `• **Document** : Le **Rapport de stage 2ème année (PDF)** est consultable dans un nouvel onglet depuis la section **Projets**.`
    );
  }

  // Stage 1ère année (2024)
  if (/(stage\s*(de\s*)?(1|premiere|1ere)|6\s*sem|brassage|rj45|cablage)/.test(q)) {
    return (
      `**Stage de 1ère année — Technicien Support & Infrastructure (2024 · 6 sem.) :**\n\n` +
      `• **Structure** : Service Informatique & Maintenance.\n` +
      `• **Missions principales** : Maintenance préventive et curative du parc informatique, **brassage de baies et câblage RJ45**, support utilisateurs **N1/N2** et déploiement de partages réseau sécurisés.\n` +
      `• **Document** : Le **Rapport de stage 1ère année (PDF)** est consultable dans un nouvel onglet depuis la section **Projets**.`
    );
  }

  // Rapports de stage / Les deux stages
  if (/(rapport.*stage|stages\b)/.test(q)) {
    return (
      `**Les 2 Stages BTS SIO de Muslim Bayschanov :**\n\n` +
      `• **Stage 2ème année (Mai – Juil. 2025)** : Stagiaire *Administrateur Systèmes & Réseaux* — Windows/Linux, Active Directory (GPO), VLANs Cisco, support & GLPI/OCS.\n` +
      `• **Stage 1ère année (2024, 6 semaines)** : Stagiaire *Technicien Support & Infrastructure* — Maintenance parc, brassage baies RJ45, partages sécurisés et support N1/N2.\n\n` +
      `Les deux **rapports de stage PDF** sont ouverts en un clic en bas de la section **Projets**.`
    );
  }

  // Emploi étudiant E.Leclerc
  if (/(leclerc|emploi etudiant|job\b|caiss)/.test(q)) {
    return (
      `**Expérience en Emploi Étudiant — E.Leclerc (2025 – Présent) :**\n\n` +
      `• **Poste** : Employé polyvalent chez **E.Leclerc (Vitry-Sur-Seine)** en parallèle du BTS SIO.\n` +
      `• **Apports professionnels** : Sens du service client, gestion des encaissements, rigueur organisationnelle et réactivité en équipe sous contrainte de rythme.`
    );
  }

  // Bac STMG
  if (/(bac\b|baccalaureat|stmg|jean mace|mercatique)/.test(q)) {
    return (
      `**Diplôme — Baccalauréat STMG (2024) :**\n\n` +
      `• **Établissement** : Lycée Jean Macé à **Vitry-Sur-Seine**.\n` +
      `• **Spécialité** : Mercatique & Ressources Humaines — acquérant des bases solides en gestion d'entreprise, communication professionnelle et droit avant d'intégrer le BTS SIO SISR.`
    );
  }

  // Tableau de synthèse / Epreuves E4 E5
  if (/(tableau de synthese|synthese|epreuve|e4|e5)/.test(q)) {
    return (
      `**Tableau de Synthèse BTS SIO & Épreuves E4 / E5 :**\n\n` +
      `• **Épreuves E4 / E5** : Évaluation officielle de la mise à disposition des services informatiques et de l'administration des infrastructures SISR.\n` +
      `• **Format disponible** : Le **Tableau de Synthèse officiel (PDF)** s'ouvre directement dans un nouvel onglet (sans téléchargement forcé) depuis la section **Compétences** ou le bouton ci-dessous.`
    );
  }

  // BTS SIO / Lycée Turgot / Filière
  if (/(bts\b|sio\b|sisr\b|slam\b|turgot|filiere|formation)/.test(q)) {
    return (
      `**Formation — BTS SIO option SISR (2024 – 2026) :**\n\n` +
      `• **Établissement** : **Lycée Turgot** (Paris 3ème) — Diplôme d'État Bac+2 (120 crédits ECTS).\n` +
      `• **Spécialité SISR** : Administration systèmes (Windows Server/AD, Linux), réseaux Cisco & pare-feux pfSense, virtualisation Proxmox/VMware et supervision GLPI/Zabbix.\n` +
      `• **Alternance 2026** : Muslim prépare la suite de son parcours en contrat d'alternance de 12 mois à la rentrée 2026.`
    );
  }

  // Certifications individuelles ou générales
  if (/(certif|credly|badge|bases reseaux)/.test(q)) {
    if (/packet tracer/.test(q)) {
      return (
        `**Certification Cisco — Packet Tracer (2024) :**\n\n` +
        `• **Délivrée par** : Cisco Networking Academy (badge vérifiable sur **Credly**).\n` +
        `• **Compétences validées** : Conception, câblage logique, configuration CLI d'équipements Cisco et simulation complète d'architectures réseau multi-VLANs.`
      );
    }
    if (/bases reseaux/.test(q)) {
      return (
        `**Certification Cisco — Bases Réseaux / Networking Basics (2024) :**\n\n` +
        `• **Délivrée par** : Cisco Networking Academy (badge officiel **Credly**).\n` +
        `• **Compétences validées** : Modèles OSI/TCP-IP, adressage IPv4/IPv6, sous-réseautage CIDR, routage statique/dynamique et commutation.`
      );
    }
    return (
      `**Certifications Cisco Networking Academy (2024 — Badges Credly) :**\n\n` +
      `• **Cisco Packet Tracer** : Simulation et conception d'architectures réseau.\n` +
      `• **Bases Réseaux** : Adressage IP, sous-réseaux, commutation et routage.\n` +
      `• **Cybersécurité** : Menaces, durcissement système et défense périmétrique.\n\n` +
      `Chaque certification dispose de son lien de vérification officiel **Credly** dans la section **Certifications**.`
    );
  }

  // CyberLab / Simulateur d'incidents
  if (/(cyberlab|simulateur|incident|depannage|memory|terminal cli)/.test(q)) {
    return (
      `**CyberLab Interactif & Memory Tech (Section Pratique) :**\n\n` +
      `• **Simulateur d'Incidents SISR (6 tickets réalistes)** : Panne DNS/AD, tempête de broadcast STP, attaque brute force SSH, relais DHCP inter-VLAN, saturation LVM sous Zabbix et alerte C2 Suricata.\n` +
      `• **Terminal CLI interactif** : Tapez des commandes réelles (` + '`diagnostic`, `ping`, `systemctl status`, `help`' + `) pour investiguer et appliquer le bon correctif.\n` +
      `• **Memory Tech** : Mini-jeu de mémoire autour des 6 piliers BTS SIO.`
    );
  }

  // Langues (séparées des loisirs)
  if (/(langue|parle|russe|anglais|tchetchene|francais)/.test(q)) {
    return (
      `**Langues parlées par Muslim Bayschanov :**\n\n` +
      `• **Français** : Courant (langue de scolarité).\n` +
      `• **Tchétchène** : Langue maternelle.\n` +
      `• **Russe** : Niveau B2 (bonne maîtrise orale et écrite).\n` +
      `• **Anglais** : Niveau B1 (lecture de documentations techniques & RFC).`
    );
  }

  // Sport & Loisirs (séparés des langues)
  if (/(loisir|sport|lutte|muscu|voyage|turquie|maroc|pays-bas|passion|interet)/.test(q)) {
    return (
      `**Sports, Voyages & Centres d'intérêt :**\n\n` +
      `• **Sport** : Pratique de la **lutte en club** et musculation régulière — développant discipline, gestion du stress et esprit de dépassement.\n` +
      `• **Voyages** : Découverte culturelle (Russie, Turquie, Pays-Bas, Maroc).\n` +
      `• **Tech & Veille** : Labs réseau personnels, cybersécurité offensive/défensive et veille technologique continue.`
    );
  }

  // CV spécifiquement
  if (/(\bcv\b|curriculum)/.test(q)) {
    return (
      `**Curriculum Vitae — Muslim Bayschanov :**\n\n` +
      `• **Profil** : Étudiant en BTS SIO SISR (Lycée Turgot), disponible à la rentrée 2026 pour une **alternance de 12 mois** en Systèmes, Réseaux & Cybersécurité.\n` +
      `• **Consultation directe** : Cliquez sur le bouton **« Consulter le CV »** juste ci-dessous pour ouvrir son CV PDF complet dans un nouvel onglet.`
    );
  }

  // Alternance / Recrutement / Contact / Localisation
  if (/(alternance|recrut|embauch|dispo|contrat|contact|email|mail|tel|telephone|numero|linkedin|github|adresse|vitry|ou habite|localisation|joindre)/.test(q)) {
    return (
      `**Alternance 2026 & Coordonnées — Muslim Bayschanov :**\n\n` +
      `• **Recherche** : Contrat d'alternance de **12 mois** (rentrée 2026) en Administration Systèmes, Réseaux ou Cybersécurité.\n` +
      `• **Localisation** : Vitry-Sur-Seine (mobile sur toute l'Île-de-France).\n` +
      `• **Email** : baysmuslim@gmail.com\n` +
      `• **Téléphone** : 06.95.13.05.64\n` +
      `• **LinkedIn & GitHub** : linkedin.com/in/muslimbays · github.com/msb94r`
    );
  }

  return null;
}

// ============================================================================
// 7. DÉTECTION DU CONTEXTE CONVERSATIONNEL (questions de suivi)
// ============================================================================
function detectExplicitTopic(text) {
  const protos = findMatchingProtocols(text);
  if (protos.length === 1) {
    return { type: 'protocol', proto: protos[0] };
  }
  for (const pr of PROJECTS_KNOWLEDGE) {
    if (pr.patterns.some((p) => p.test(text))) {
      return { type: 'project', project: pr };
    }
  }
  for (const vk of VEILLE_KNOWLEDGE) {
    if (vk.patterns.some((p) => p.test(text))) {
      return { type: 'veille', veille: vk };
    }
  }
  for (const sk of SKILLS_KNOWLEDGE) {
    if (sk.patterns.some((p) => p.test(text))) {
      return { type: 'skill', skill: sk };
    }
  }
  return null;
}

function inferActiveTopicFromHistory(history) {
  // 1. Inspecte d'abord le dernier message utilisateur précédent (source la plus fidèle du sujet demandé)
  for (let i = history.length - 2; i >= 0; i--) {
    if (history[i]?.role === 'user') {
      const userTopic = detectExplicitTopic(normalizeText(history[i]?.content || ''));
      if (userTopic) return userTopic;
    } else if (history[i]?.role === 'assistant') {
      // Ne regarde que la ligne de titre du message assistant pour éviter les faux positifs dans les descriptions
      const titleLine = normalizeText((history[i]?.content || '').split('\n')[0] || '');
      const assistantTopic = detectExplicitTopic(titleLine);
      if (assistantTopic) return assistantTopic;
    }
  }
  return null;
}

function handleFollowUp(q, history) {
  if (!Array.isArray(history) || history.length < 2) return null;
  const isShortFollowUp =
    q.length < 60 &&
    /(^et\b|\bquel\b|\bquelle\b|\bport\b|couche|\brfc\b|securit|durcis|risque|faille|attaque|pratique|projet|utilise|detail|developpe|precis|davantage|plus d'info|cahier|gantt|livrable|lien|pdf|rapport|comment ca marche|pourquoi|ce protocole|ce projet|cet outil)/.test(q);

  if (!isShortFollowUp) return null;

  // Si la question courte nomme elle-même un nouveau sujet précis (ex: "Explique SSH ?"), ne pas traiter comme suivi de l'ancien sujet
  if (findMatchingProtocols(q).length > 0) return null;

  const ctx = inferActiveTopicFromHistory(history);
  if (!ctx) return null;

  if (ctx.type === 'protocol') {
    if (/(securis|securit|durcis|risque|faille|attaque|proteg)/.test(q)) {
      return formatSingleProtocol(ctx.proto, 'security');
    }
    if (/(port|couche|osi|rfc|tcp|udp|transport)/.test(q)) {
      return formatSingleProtocol(ctx.proto, 'port');
    }
    if (/(pratique|projet|utilise|comment|pourquoi|sisr|muslim)/.test(q) && !/quel port/.test(q)) {
      return formatSingleProtocol(ctx.proto, 'practical');
    }
    return formatSingleProtocol(ctx.proto, 'full');
  }

  if (ctx.type === 'project') {
    if (/(cahier|gantt|recette|test|document|livrable)/.test(q)) {
      return (
        `**Livrables & Documentation du projet :**\n\n` +
        `• Les projets web (*Rituels du Monde, Shop Ton Auto, Chicken Point*) incluent chacun 4 documents consultables directement en nouvel onglet depuis la modale du projet :\n` +
        `  - **Cahier des charges**\n` +
        `  - **Cahier des recettes**\n` +
        `  - **Cahier des tests**\n` +
        `  - **Diagramme de Gantt**\n\n` +
        `Cliquez sur **« Voir les Projets »** ci-dessous puis sélectionnez la carte du projet.`
      );
    }
    return ctx.project.reply();
  }

  if (ctx.type === 'skill') {
    return ctx.skill.reply();
  }

  if (ctx.type === 'veille') {
    return ctx.veille.reply();
  }

  return null;
}

// ============================================================================
// 8. POINT D'ENTRÉE PRINCIPAL GRANULAIRE
// ============================================================================
export function generateSmartReply(input) {
  const history = Array.isArray(input)
    ? input
    : typeof input === 'string'
    ? [{ role: 'user', content: input }]
    : [];

  const lastUserMsg =
    [...history].reverse().find((m) => m.role === 'user')?.content || '';
  const q = normalizeText(lastUserMsg.trim());

  if (!q) {
    return "Posez-moi une question précise sur **Muslim Bayschanov** : un **protocole** (ex: OSPF, Kerberos, WireGuard), une **compétence** (ex: Proxmox, Zabbix, Suricata), un **projet**, sa **veille IA/Cyber**, ses **stages** ou son **alternance 2026** !";
  }

  // 1. Politesse / Salutations
  if (/^(merci|top|super|parfait|genial|nickel|cool|ok|daccord|d'accord)\b/.test(q) && q.length < 35) {
    return "Avec plaisir ! N'hésitez pas à me demander des précisions sur un **protocole**, un **outil/compétence**, un **projet** ou à consulter directement son **CV** ci-dessous.";
  }

  if (/^(au revoir|bye|ciao|a\+|bonne journee|bonne soiree)/.test(q)) {
    return "Au revoir et merci pour votre visite sur le portfolio de **Muslim Bayschanov** ! Contact direct : **baysmuslim@gmail.com**.";
  }

  if (/^(salut|bonjour|hello|coucou|hey|bonsoir|yo|ca va)/.test(q) && q.length < 30) {
    return (
      "Bonjour ! Je suis l'assistant virtuel du portfolio de **Muslim Bayschanov** (BTS SIO SISR).\n\n" +
      "Je peux répondre en détail sur chaque sujet précis :\n" +
      "• **Un protocole parmi les 24 fiches** (ex : *« Explique OSPF »*, *« TCP vs UDP »*, *« Kerberos »*)\n" +
      "• **Une compétence ou un outil** (ex : *« Proxmox »*, *« Suricata »*, *« Zabbix & GLPI »*, *« Active Directory »*)\n" +
      "• **Un projet précis** (ex : *« Rituels du Monde »*, *« pfSense »*, *« Shop Ton Auto »*)\n" +
      "• **Un axe de veille, un stage ou son alternance 2026**\n\n" +
      "Quelle question précise souhaitez-vous poser ?"
    );
  }

  // 2. Comparaisons explicites (TCP vs UDP, IPsec vs WireGuard, OSPF vs RIP, SISR vs SLAM...)
  const comparisonReply = matchComparison(q);
  if (comparisonReply) return comparisonReply;

  // 3. Questions de suivi contextuelles ("et la sécurité ?", "quel port ?", "les livrables ?")
  const followUpReply = handleFollowUp(q, history);
  if (followUpReply) return followUpReply;

  // 4. Projets spécifiques (avant compétences/protocoles si le nom exact du projet est cité)
  for (const proj of PROJECTS_KNOWLEDGE) {
    if (proj.patterns.some((p) => p.test(q))) {
      return proj.reply();
    }
  }

  // 5. Veille technologique granulaire (axes, problématique, outils/articles)
  for (const v of VEILLE_KNOWLEDGE) {
    if (v.patterns.some((p) => p.test(q))) {
      return v.reply();
    }
  }

  // 6. Détection des protocoles individuels (si 1 ou 2 protocoles précis sont demandés)
  const matchedProtos = findMatchingProtocols(q);
  const asksOverviewProtocols = /(tous les protocoles|liste.*protocoles|combien de protocoles|quels protocoles maitrise)/.test(q);
  if (!asksOverviewProtocols && matchedProtos.length === 1) {
    const p = matchedProtos[0];
    if (/(securis|securit|durcis|risque|faille|attaque)/.test(q)) {
      return formatSingleProtocol(p, 'security');
    }
    if (/(quel port|\bport\b|couche osi|\brfc\b)/.test(q) && q.length < 55) {
      return formatSingleProtocol(p, 'port');
    }
    if (/(pratique|muslim|utilise|stage|entreprise)/.test(q)) {
      return formatSingleProtocol(p, 'practical');
    }
    return formatSingleProtocol(p, 'full');
  }
  if (!asksOverviewProtocols && matchedProtos.length === 2) {
    // 2 protocoles cités dans la question -> on détaille les deux séparément !
    return (
      `**Focus sur ${matchedProtos[0].name} et ${matchedProtos[1].name} :**\n\n` +
      `• **${matchedProtos[0].name}** (*${matchedProtos[0].port}* · ${matchedProtos[0].layer}) : ${matchedProtos[0].shortDesc} **Sécurité** : ${matchedProtos[0].securityNote}\n\n` +
      `• **${matchedProtos[1].name}** (*${matchedProtos[1].port}* · ${matchedProtos[1].layer}) : ${matchedProtos[1].shortDesc} **Sécurité** : ${matchedProtos[1].securityNote}`
    );
  }

  // 7. Catégories de protocoles (si utilisateur demande uniquement une famille)
  if (/protocoles?/.test(q) && /(routage|niveau 2|couche 2|couche 3)/.test(q)) {
    const list = PROTOCOLS_DATA.filter((p) => p.category === 'routing')
      .map((p) => `• **${p.name}** (${p.port}) : ${p.shortDesc}`)
      .join('\n');
    return `**Protocoles Réseau & Routage (7 fiches) :**\n\n${list}`;
  }
  if (/protocoles?/.test(q) && /(securit|chiffrement|vpn|auth)/.test(q)) {
    const list = PROTOCOLS_DATA.filter((p) => p.category === 'security')
      .map((p) => `• **${p.name}** (${p.port}) : ${p.shortDesc}`)
      .join('\n');
    return `**Protocoles Sécurité & Chiffrement (6 fiches) :**\n\n${list}`;
  }
  if (/protocoles?/.test(q) && /(infra|service|annuaire)/.test(q)) {
    const list = PROTOCOLS_DATA.filter((p) => p.category === 'infra')
      .map((p) => `• **${p.name}** (${p.port}) : ${p.shortDesc}`)
      .join('\n');
    return `**Protocoles Services & Infrastructure (6 fiches) :**\n\n${list}`;
  }
  if (/protocoles?/.test(q) && /(transport|web|transfert|mail)/.test(q)) {
    const list = PROTOCOLS_DATA.filter((p) => p.category === 'transport')
      .map((p) => `• **${p.name}** (${p.port}) : ${p.shortDesc}`)
      .join('\n');
    return `**Protocoles Transport & Transfert Web (5 fiches) :**\n\n${list}`;
  }

  // 8. Compétences techniques précises par sous-domaine / outil
  for (const sk of SKILLS_KNOWLEDGE) {
    if (sk.patterns.some((p) => p.test(q))) {
      return sk.reply();
    }
  }

  // 9. Parcours, stages, certifs, CyberLab, langues, loisirs, CV, alternance
  const specificProfile = matchParcoursOrProfileSpecific(q);
  if (specificProfile) return specificProfile;

  // 10. Vues d'ensemble UNIQUEMENT quand l'utilisateur demande explicitement la vue globale
  if (/(protocole)/.test(q) || matchedProtos.length >= 3) {
    return (
      "**Les 24 Protocoles maîtrisés (4 familles dans la section Protocoles) :**\n\n" +
      "• **Routage & L2 (7)** : OSPF, BGP, RIP v2, 802.1Q (VLAN), STP/RSTP, ICMP, ARP.\n" +
      "• **Sécurité & Auth (6)** : SSH, IPsec (IKEv2), WireGuard, TLS 1.3, RADIUS/802.1X, Kerberos.\n" +
      "• **Services Infra (6)** : DNS/DNSSEC, DHCP, LDAP/LDAPS, NTP, SNMPv3, SMB/CIFS.\n" +
      "• **Transport & Web (5)** : TCP, UDP, HTTP/HTTPS, SFTP, SMTP/SMTPS.\n\n" +
      "Demandez-moi n'importe lequel par son nom (ex : *« Explique Kerberos »* ou *« WireGuard »*) pour obtenir sa fiche complète !"
    );
  }

  if (/(projet|realisation|travaux)/.test(q)) {
    return (
      "**Les 7 Projets de Muslim (Web & Infrastructure) :**\n\n" +
      "• **Infra & Réseaux** : *Infrastructure Active Directory & WDS*, *Supervision GLPI & Zabbix*, *Sécurisation Réseau pfSense*.\n" +
      "• **Web & Hybride** : *Rituels du Monde* (IA + Failover), *Shop Ton Auto* (CRUD), *Chicken Point*, *E-Portfolio*.\n\n" +
      "Demandez le nom d'un projet (ex : *« Détails sur Rituels du Monde »*) pour voir son architecture et ses livrables !"
    );
  }

  if (/(competence|skill|maitrise|techno|outil)/.test(q)) {
    return (
      "**Les 6 pôles de Compétences SISR de Muslim :**\n\n" +
      "• **Systèmes** : Windows Server 2022 (AD, GPO, WDS), Linux (Debian/Ubuntu/Kali), Bash, PowerShell, Python.\n" +
      "• **Réseaux** : Switchs/routeurs Cisco, VLANs, OSPF, pfSense, Wireshark, ntopNG.\n" +
      "• **Cloud & Virtualisation** : Proxmox VE, VMware, VirtualBox, Docker, HA, Proxmox Backup.\n" +
      "• **Cybersécurité** : Snort, Suricata, GPG, gocryptfs, portails captifs, durcissement SSH/SSL.\n" +
      "• **Supervision & Outils** : GLPI, OCS Inventory, Zabbix, Nagios, Puppet, Ansible, KeePass.\n" +
      "• **Gestion de projet** : Cahiers des charges/recettes/tests, Gantt, SLA, Draw.io.\n\n" +
      "Demandez un outil précis (ex : *« Proxmox »*, *« Suricata »*, *« Zabbix »*) pour une fiche détaillée !"
    );
  }

  if (/(veille|intelligence artificielle|\bia\b)/.test(q)) {
    return (
      "**Veille Technologique — IA & Cyberdéfense Proactive :**\n\n" +
      "• **Problématique** : *Comment passer d'une sécurité réactive à une cyberdéfense prédictive et automatisée ?*\n" +
      "• **Axe 1** : IA Prédictive & **UEBA** (détection zero-day).\n" +
      "• **Axe 2** : Automatisation **SOC / SOAR** & Copilotes IA (réduction du MTTR).\n" +
      "• **Axe 3** : IA Défensive vs IA Offensive (malwares polymorphes).\n" +
      "• **Outils** : Feedly (ANSSI / CERT-FR, LeMagIT, ZDNet) & Google Alerts.\n\n" +
      "Posez une question ciblée sur un axe (ex : *« C'est quoi l'UEBA ? »* ou *« Parle-moi du SOAR »*) !"
    );
  }

  if (/(parcours|experience|scolarite|qui est|presente|a propos|profil|muslim)/.test(q)) {
    return (
      "**Profil synthétique de Muslim Bayschanov :**\n\n" +
      "Étudiant en **BTS SIO option SISR** au **Lycée Turgot (Paris 3ème)** après un Bac STMG (2024), basé à **Vitry-Sur-Seine**.\n\n" +
      "• **Expériences** : 2 stages informatiques (Admin Systèmes & Réseaux 2025, Support & Infra 2024) + employé polyvalent E.Leclerc.\n" +
      "• **Certifications** : 3 badges Cisco Networking Academy (Packet Tracer, Bases Réseaux, Cybersécurité).\n" +
      "• **Objectif** : Alternance de **12 mois** à la rentrée 2026 en Systèmes, Réseaux ou Cybersécurité."
    );
  }

  // Fallback constructif avec exemples ciblés
  return (
    "Je n'ai pas identifié exactement le sujet de votre question, mais je peux vous répondre en détail sur chaque élément du portfolio :\n\n" +
    "• **Un protocole précis** : *« Explique OSPF »*, *« C'est quoi Kerberos ? »*, *« TCP vs UDP »*\n" +
    "• **Une compétence / un outil** : *« Comment utilise-t-il Proxmox ? »*, *« Parle-moi de Zabbix »*, *« Que fait-il avec pfSense ? »*\n" +
    "• **Un projet ou un stage** : *« Détails sur Rituels du Monde »*, *« Missions du stage de 1ère année »*\n" +
    "• **La veille** : *« C'est quoi l'UEBA ? »*, *« Quel est le rôle du SOAR ? »*"
  );
}
