import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  ShieldCheck, 
  Server, 
  Globe, 
  Search, 
  X, 
  Layers, 
  Hash, 
  FileText, 
  CheckCircle,
  Cpu,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface Protocol {
  id: string;
  name: string;
  fullName: string;
  category: 'routing' | 'security' | 'infra' | 'transport';
  layer: string;
  port: string;
  rfc?: string;
  shortDesc: string;
  practicalRole: string;
  securityNote: string;
}

export const PROTOCOLS_DATA: Protocol[] = [
  // Réseau & Routage
  {
    id: 'ospf',
    name: 'OSPF',
    fullName: 'Open Shortest Path First',
    category: 'routing',
    layer: 'Couche 3 · Réseau',
    port: 'Protocole IP 89',
    rfc: 'RFC 2328',
    shortDesc: 'Protocole de routage dynamique interne à état de liens (IGP) calculant les plus courts chemins via l’algorithme Dijkstra.',
    practicalRole: 'Convergence rapide et segmentation de réseaux d’entreprise multi-zones (Area 0 Backbone) sur routeurs Cisco.',
    securityNote: 'Authentification obligatoire des échanges par clé cryptographique MD5 ou HMAC-SHA.'
  },
  {
    id: 'bgp',
    name: 'BGP',
    fullName: 'Border Gateway Protocol (v4)',
    category: 'routing',
    layer: 'Couche 4/7 · Application/Transport',
    port: 'Port 179 · TCP',
    rfc: 'RFC 4271',
    shortDesc: 'Protocole de routage externe (EGP) à vecteur de chemins assurant l’interconnexion des systèmes autonomes (AS) sur Internet.',
    practicalRole: 'Routage multi-opérateurs, transit d’adresses IP publiques et politique de peering redondée.',
    securityNote: 'Filtrage strict des annonces BGP (RPKI, ROA, listes de préfixes) contre le BGP Hijacking.'
  },
  {
    id: 'rip',
    name: 'RIP v2',
    fullName: 'Routing Information Protocol',
    category: 'routing',
    layer: 'Couche 7 · UDP',
    port: 'Port 520 · UDP',
    rfc: 'RFC 2453',
    shortDesc: 'Protocole de routage à vecteur de distance basé sur le nombre de sauts (maximum 15 sauts).',
    practicalRole: 'Routage simple dans les topologies de maquettes de TP BTS et petits réseaux locaux isolés.',
    securityNote: 'Préférer OSPF pour la production ; activer l’authentification MD5 des mises à jour RIP.'
  },
  {
    id: '802-1q',
    name: '802.1Q (VLAN)',
    fullName: 'IEEE 802.1Q Frame Tagging',
    category: 'routing',
    layer: 'Couche 2 · Liaison',
    port: 'N/A · Trame Ethernet',
    rfc: 'IEEE 802.1Q',
    shortDesc: 'Standard d’encapsulation et d’étiquetage des trames Ethernet permettant le multiplexage de VLANs sur un lien trunk.',
    practicalRole: 'Isolation étanche des flux utilisateurs, serveurs, DMZ et voix sur IP (VoIP) sur switchs Cisco Catalyst.',
    securityNote: 'Changer le VLAN natif par défaut (VLAN 1) pour empêcher les attaques de VLAN Hopping.'
  },
  {
    id: 'stp',
    name: 'STP / RSTP',
    fullName: 'Spanning Tree Protocol (802.1w)',
    category: 'routing',
    layer: 'Couche 2 · Liaison',
    port: 'BPDU · Multicast',
    rfc: 'IEEE 802.1D / 802.1w',
    shortDesc: 'Protocole de prévention des boucles de commutation Ethernet garantissant une topologie arborescente sans boucle.',
    practicalRole: 'Tolérance aux pannes sur liaisons inter-switchs redondantes avec bascule automatique en moins d’une seconde (RSTP).',
    securityNote: 'Activer BPDU Guard, Root Guard et Loop Guard sur les ports d’accès utilisateurs.'
  },
  {
    id: 'icmp',
    name: 'ICMP',
    fullName: 'Internet Control Message Protocol',
    category: 'routing',
    layer: 'Couche 3 · Réseau',
    port: 'Protocole IP 1',
    rfc: 'RFC 792',
    shortDesc: 'Protocole de diagnostic et de contrôle réseau utilisé pour signaler les erreurs d’acheminement (Ping, Traceroute).',
    practicalRole: 'Vérification de connectivité bout-en-bout, tests de latence et détection de MTU (Path MTU Discovery).',
    securityNote: 'Limiter le débit ICMP Echo Request sur le pare-feu et bloquer le broadcast pour éviter les attaques Smurf.'
  },
  {
    id: 'arp',
    name: 'ARP',
    fullName: 'Address Resolution Protocol',
    category: 'routing',
    layer: 'Couche 2/3 · Liaison/Réseau',
    port: 'N/A · Broadcast Ethernet',
    rfc: 'RFC 826',
    shortDesc: 'Résolution dynamique des adresses IP en adresses physiques MAC correspondantes sur le réseau local.',
    practicalRole: 'Communication interne sur les segments locaux et consultation des tables de cache ARP sur les passerelles.',
    securityNote: 'Activer l’inspection dynamique ARP (Dynamic ARP Inspection - DAI) contre le spoofing et le Man-in-the-Middle.'
  },

  // Sécurité & Chiffrement
  {
    id: 'ssh',
    name: 'SSH',
    fullName: 'Secure Shell (v2)',
    category: 'security',
    layer: 'Couche 7 · Application',
    port: 'Port 22 · TCP',
    rfc: 'RFC 4253',
    shortDesc: 'Protocole cryptographique d’administration à distance sécurisée, d’exécution de commandes et de tunneling SFTP.',
    practicalRole: 'Gestion à distance des serveurs Debian, Ubuntu, pare-feux pfSense et équipements réseau Cisco.',
    securityNote: 'Désactiver le login direct de root, utiliser des paires de clés Ed25519 et configurer Fail2ban.'
  },
  {
    id: 'ipsec',
    name: 'IPsec',
    fullName: 'Internet Protocol Security (IKEv2)',
    category: 'security',
    layer: 'Couche 3 · Réseau',
    port: 'Ports 500/4500 (UDP) · ESP (IP 50)',
    rfc: 'RFC 4301 / 7296',
    shortDesc: 'Suite de protocoles assurant l’authentification, la confidentialité et l’intégrité des paquets IP pour tunnels VPN.',
    practicalRole: 'Interconnexion VPN Site-to-Site sécurisée entre le siège et les succursales distantes via pfSense.',
    securityNote: 'Utiliser IKEv2 avec des chiffrements modernes (AES-GCM-256) et groupes Diffie-Hellman supérieurs ou égaux à 14.'
  },
  {
    id: 'wireguard',
    name: 'WireGuard',
    fullName: 'WireGuard VPN Protocol',
    category: 'security',
    layer: 'Couche 3 · Réseau',
    port: 'Port 51820 · UDP',
    rfc: 'RFC WireGuard',
    shortDesc: 'Protocole VPN moderne et extrêmement rapide utilisant la cryptographie Curve25519 et ChaCha20-Poly1305.',
    practicalRole: 'Accès distant nomade des collaborateurs vers les ressources privées avec faible consommation de bande passante.',
    securityNote: 'Code source minimaliste réduisant la surface d’attaque ; rotation régulière des clés pré-partagées (PSK).'
  },
  {
    id: 'tls',
    name: 'TLS / SSL',
    fullName: 'Transport Layer Security (v1.3)',
    category: 'security',
    layer: 'Couche 5/6 · Session/Présentation',
    port: 'Associe aux flux (443, 636, 993...)',
    rfc: 'RFC 8446',
    shortDesc: 'Protocole de chiffrement des échanges réseau assurant la confidentialité, l’intégrité et l’authentification par certificat.',
    practicalRole: 'Chiffrement des sites web (HTTPS), des flux de messagerie et de l’accès aux annuaires LDAPS.',
    securityNote: 'Désactiver impérativement SSL v3, TLS 1.0 et TLS 1.1 ; appliquer le Perfect Forward Secrecy (PFS).'
  },
  {
    id: 'radius',
    name: 'RADIUS / 802.1X',
    fullName: 'Remote Authentication Dial-In User Service',
    category: 'security',
    layer: 'Couche 7 · Application',
    port: 'Ports 1812/1813 · UDP',
    rfc: 'RFC 2865',
    shortDesc: 'Protocole client/serveur centralisant l’authentification, l’autorisation et la traçabilité des accès réseau (AAA).',
    practicalRole: 'Contrôle d’accès au réseau local d’entreprise et au Wi-Fi sécurisé via FreeRADIUS ou NPS Windows Server.',
    securityNote: 'Utiliser EAP-TLS avec certificats machines/utilisateurs pour éliminer les risques de vol de mots de passe.'
  },
  {
    id: 'kerberos',
    name: 'Kerberos',
    fullName: 'Kerberos Authentication (v5)',
    category: 'security',
    layer: 'Couche 7 · Application',
    port: 'Port 88 · TCP/UDP',
    rfc: 'RFC 4120',
    shortDesc: 'Protocole d’authentification mutuelle basé sur des tickets chiffrés (TGT/ST) délivrés par un tiers de confiance (KDC).',
    practicalRole: 'Cœur de l’authentification Single Sign-On (SSO) des environnements Active Directory Windows Server.',
    securityNote: 'Surveiller les comptes de service contre les attaques Kerberoasting et synchroniser les horloges NTP (< 5 min).'
  },

  // Services & Infrastructure
  {
    id: 'dns',
    name: 'DNS / DNSSEC',
    fullName: 'Domain Name System',
    category: 'infra',
    layer: 'Couche 7 · Application',
    port: 'Port 53 · UDP/TCP',
    rfc: 'RFC 1035',
    shortDesc: 'Service de résolution de noms de domaine FQDN en adresses IP et de redirection de services réseau.',
    practicalRole: 'Indispensable au fonctionnement d’Active Directory (enregistrements SRV, Kerberos, LDAP) et résolution web.',
    securityNote: 'Activer DNSSEC pour signer les zones, bloquer les requêtes récursives non autorisées et limiter les transferts de zone.'
  },
  {
    id: 'dhcp',
    name: 'DHCP',
    fullName: 'Dynamic Host Configuration Protocol',
    category: 'infra',
    layer: 'Couche 7 · Application',
    port: 'Ports 67 (Serveur) / 68 (Client) · UDP',
    rfc: 'RFC 2131',
    shortDesc: 'Attribution automatique et dynamique de configurations IP, baux, masques, passerelles et serveurs DNS aux hôtes.',
    practicalRole: 'Déploiement sur Windows Server / pfSense avec relais DHCP (IP Helper-Address) pour servir chaque VLAN.',
    securityNote: 'Activer le DHCP Snooping sur les switchs pour interdire les serveurs DHCP pirates (Rogue DHCP).'
  },
  {
    id: 'ldap',
    name: 'LDAP / LDAPS',
    fullName: 'Lightweight Directory Access Protocol',
    category: 'infra',
    layer: 'Couche 7 · Application',
    port: 'Port 389 (LDAP) / 636 (LDAPS) · TCP',
    rfc: 'RFC 4511',
    shortDesc: 'Protocole standard d’interrogation et de modification des services d’annuaires d’entreprise centralisés.',
    practicalRole: 'Liaison d’authentification entre GLPI, Nextcloud, pfSense et l’annuaire Active Directory.',
    securityNote: 'Bannir le LDAP en clair sur le port 389 ; forcer LDAPS avec certificat SSL/TLS ou StartTLS.'
  },
  {
    id: 'ntp',
    name: 'NTP',
    fullName: 'Network Time Protocol (v4)',
    category: 'infra',
    layer: 'Couche 7 · Application',
    port: 'Port 123 · UDP',
    rfc: 'RFC 5905',
    shortDesc: 'Protocole de synchronisation temporelle ultra-précise des horloges système à travers le réseau.',
    practicalRole: 'Synchronisation critique pour la validation des tickets Kerberos AD et la corrélation des journaux de logs.',
    securityNote: 'Utiliser des sources d’horloge fiables (serveurs NTP ANSSI / pool NTP) et restreindre les requêtes monlist.'
  },
  {
    id: 'snmp',
    name: 'SNMP v3',
    fullName: 'Simple Network Management Protocol',
    category: 'infra',
    layer: 'Couche 7 · Application',
    port: 'Ports 161 (Polling) / 162 (Traps) · UDP',
    rfc: 'RFC 3411',
    shortDesc: 'Protocole de supervision, de monitoring et de collecte de métriques sur équipements réseau et serveurs.',
    practicalRole: 'Collecte continue des états CPU, RAM, bande passante des switchs et disques par le serveur Zabbix.',
    securityNote: 'Rejeter SNMP v1/v2c (communautés en clair) et employer impérativement SNMPv3 avec chiffrement (authPriv).'
  },
  {
    id: 'smb',
    name: 'SMB / CIFS',
    fullName: 'Server Message Block (v3.1.1)',
    category: 'infra',
    layer: 'Couche 7 · Application',
    port: 'Port 445 · TCP',
    rfc: 'MS-SMB2',
    shortDesc: 'Protocole de partage de fichiers, d’imprimantes et de communications inter-processus en environnement réseau.',
    practicalRole: 'Mise en place de partages réseau sécurisés, profils itinérants et dossiers partagés d’équipes sous Windows/Samba.',
    securityNote: 'Désactiver formellement SMBv1 (vecteur WannaCry) et forcer le chiffrement SMB Encryption sur les partages sensibles.'
  },

  // Transport & Transfert Web
  {
    id: 'tcp',
    name: 'TCP',
    fullName: 'Transmission Control Protocol',
    category: 'transport',
    layer: 'Couche 4 · Transport',
    port: 'Segments orientés connexion',
    rfc: 'RFC 793',
    shortDesc: 'Protocole de transport fiable, orienté connexion avec accusés de réception (ACK), contrôle de flux et réordonnancement.',
    practicalRole: 'Support de tous les services critiques nécessitant une intégrité parfaite : HTTP, SSH, SMB, bases de données.',
    securityNote: 'Protection contre le SYN Flood via l’activation des SYN Cookies sur le noyau Linux et les pare-feux.'
  },
  {
    id: 'udp',
    name: 'UDP',
    fullName: 'User Datagram Protocol',
    category: 'transport',
    layer: 'Couche 4 · Transport',
    port: 'Datagrammes sans connexion',
    rfc: 'RFC 768',
    shortDesc: 'Protocole de transport léger, sans connexion ni garantie de livraison, priorisant la rapidité et la faible latence.',
    practicalRole: 'Transport des requêtes DNS, flux VoIP, tunnels WireGuard et échanges de métriques SNMP.',
    securityNote: 'Surveiller les flux UDP contre les attaques par réflexion/amplification (DNS, NTP, SSDP).'
  },
  {
    id: 'https',
    name: 'HTTP / HTTPS',
    fullName: 'HyperText Transfer Protocol Secure',
    category: 'transport',
    layer: 'Couche 7 · Application',
    port: 'Port 80 (HTTP) / 443 (HTTPS) · TCP',
    rfc: 'RFC 9110 / 2818',
    shortDesc: 'Protocole de transfert hypertexte standard du Web, encapsulé dans un tunnel TLS pour la version sécurisée.',
    practicalRole: 'Hébergement de sites intranet, portails d’administration web (Proxmox, pfSense, Zabbix) et APIs REST.',
    securityNote: 'Redirection automatique HTTP vers HTTPS, en-têtes HSTS (Strict-Transport-Security) et certificats à jour.'
  },
  {
    id: 'sftp',
    name: 'SFTP',
    fullName: 'SSH File Transfer Protocol',
    category: 'transport',
    layer: 'Couche 7 · Application',
    port: 'Port 22 · TCP (via SSH)',
    rfc: 'IETF Draft',
    shortDesc: 'Protocole de transfert de fichiers sécurisé opérant au-dessus d’une session SSH chiffrée de bout en bout.',
    practicalRole: 'Téléversement sécurisé de configurations, sauvegardes automatiques et transfert de rapports techniques.',
    securityNote: 'Remplacer complètement le FTP non chiffré (ports 20/21) et chrooter les utilisateurs dans leur répertoire personnel.'
  },
  {
    id: 'smtp',
    name: 'SMTP / SMTPS',
    fullName: 'Simple Mail Transfer Protocol',
    category: 'transport',
    layer: 'Couche 7 · Application',
    port: 'Ports 25 / 587 (Submission) / 465 (SMTPS)',
    rfc: 'RFC 5321',
    shortDesc: 'Protocole d’envoi et de relais des courriers électroniques entre clients de messagerie et serveurs de messagerie (MTA).',
    practicalRole: 'Envoi d’alertes automatisées de supervision Zabbix et notifications de tickets GLPI par courriel.',
    securityNote: 'Mise en place de SPF, DKIM, DMARC et authentification TLS obligatoire (STARTTLS).'
  }
];

export default function Protocoles() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'routing' | 'security' | 'infra' | 'transport'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProtocol, setActiveModalProtocol] = useState<Protocol | null>(null);

  // Filtrage combiné par catégorie et recherche textuelle
  const filteredProtocols = useMemo(() => {
    return PROTOCOLS_DATA.filter(proto => {
      const matchesCategory = selectedCategory === 'all' || proto.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        proto.name.toLowerCase().includes(q) ||
        proto.fullName.toLowerCase().includes(q) ||
        proto.port.toLowerCase().includes(q) ||
        proto.shortDesc.toLowerCase().includes(q) ||
        proto.practicalRole.toLowerCase().includes(q) ||
        proto.layer.toLowerCase().includes(q)
      );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'Tous', count: PROTOCOLS_DATA.length },
    { id: 'routing', label: 'Réseau & Routage', count: PROTOCOLS_DATA.filter(p => p.category === 'routing').length },
    { id: 'security', label: 'Sécurité & Chiffrement', count: PROTOCOLS_DATA.filter(p => p.category === 'security').length },
    { id: 'infra', label: 'Services & Annuaire', count: PROTOCOLS_DATA.filter(p => p.category === 'infra').length },
    { id: 'transport', label: 'Transport & Web', count: PROTOCOLS_DATA.filter(p => p.category === 'transport').length }
  ];

  return (
    <section id="protocoles" className="py-20 md:py-28 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/5 transition-colors duration-500 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-semibold tracking-wider text-zinc-800 dark:text-zinc-300 uppercase mb-3">
              <Network size={13} className="text-zinc-900 dark:text-white" />
              <span>Référentiel Réseaux & Systèmes</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
              Protocoles Informatiques
            </h2>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Cartographie des protocoles fondamentaux maîtrisés et mis en application en administration systèmes, segmentation réseau et sécurisation des flux.
            </p>
          </motion.div>

          {/* Compteur interactif */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 shrink-0"
          >
            <div className="text-right">
              <div className="text-xl font-bold text-zinc-900 dark:text-white">
                {filteredProtocols.length} / {PROTOCOLS_DATA.length}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                Protocoles listés
              </div>
            </div>
          </motion.div>
        </div>

        {/* Barre de recherche et Filtres par catégorie */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          
          {/* Onglets Catégories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    active 
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' 
                      : 'bg-zinc-100 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:border-zinc-300 dark:hover:border-white/10'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active 
                      ? 'bg-white/20 dark:bg-zinc-950/20 text-white dark:text-zinc-950 font-bold' 
                      : 'bg-zinc-200 dark:bg-white/5 text-zinc-500 dark:text-zinc-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Champ de recherche */}
          <div className="relative min-w-[260px] lg:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher (ex: 22, DNS, Cisco...)"
              className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-white/30 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

        </div>

        {/* Grille Bento des cartes de protocoles */}
        {filteredProtocols.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProtocols.map((proto, index) => (
              <motion.div
                key={proto.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
                onClick={() => setActiveModalProtocol(proto)}
                className="group p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/90 dark:border-white/5 hover:border-zinc-400 dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-lg dark:hover:shadow-2xl"
              >
                <div>
                  {/* Ligne 1 : Nom & Acronyme */}
                  <div className="mb-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white font-mono group-hover:text-black dark:group-hover:text-white transition-colors">
                        {proto.name}
                      </span>
                      {proto.rfc && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-white/5 text-zinc-600 dark:text-zinc-400">
                          {proto.rfc}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      {proto.fullName}
                    </p>
                  </div>

                  {/* Résumé court */}
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                    {proto.shortDesc}
                  </p>
                </div>

                {/* Bas de carte : Couche OSI & Appel à l'action */}
                <div className="pt-3 border-t border-zinc-200/60 dark:border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 group-hover:bg-zinc-900 dark:group-hover:bg-white transition-colors" />
                    {proto.layer}
                  </span>
                  
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold group-hover:text-zinc-950 dark:group-hover:text-white flex items-center gap-1 transition-colors">
                    Détails <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5">
            <Search size={32} className="mx-auto text-zinc-400 mb-3" />
            <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              Aucun protocole ne correspond à votre recherche
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Essayez avec un autre mot-clé (ex: "routage", "22", "ssh", "ipsec")
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Modal de détail technique du protocole */}
        <AnimatePresence>
          {activeModalProtocol && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden"
              >
                {/* Bouton fermeture */}
                <button
                  onClick={() => setActiveModalProtocol(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>

                {/* En-tête du modal */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl md:text-3xl font-black font-mono text-zinc-900 dark:text-white">
                      {activeModalProtocol.name}
                    </span>
                    {activeModalProtocol.rfc && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-semibold">
                        {activeModalProtocol.rfc}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {activeModalProtocol.fullName}
                  </p>
                </div>

                {/* Grille des caractéristiques */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-white/5">
                    <div className="text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold mb-1">
                      Port / Transport
                    </div>
                    <div className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      {activeModalProtocol.port}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-white/5">
                    <div className="text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold mb-1">
                      Couche Réseau
                    </div>
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {activeModalProtocol.layer}
                    </div>
                  </div>
                </div>

                {/* Contenu détaillé */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                      Définition & Rôle
                    </h4>
                    <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {activeModalProtocol.shortDesc}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/30 border border-zinc-200/80 dark:border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-zinc-900 dark:text-zinc-100" />
                      Mise en pratique en BTS SIO (SISR)
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {activeModalProtocol.practicalRole}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/30 border border-zinc-200/80 dark:border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-zinc-900 dark:text-zinc-100" />
                      Sécurisation & Durcissement
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {activeModalProtocol.securityNote}
                    </p>
                  </div>
                </div>

                {/* Actions du modal : Bouton PDF du protocole et Bouton Fermer */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-zinc-200 dark:border-white/10">
                  <a
                    href={`/protocoles/${activeModalProtocol.id}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-bold transition-all shadow-sm"
                  >
                    <FileText size={15} />
                    <span>Consulter la fiche PDF du protocole</span>
                    <ExternalLink size={13} className="opacity-70" />
                  </a>

                  <button
                    onClick={() => setActiveModalProtocol(null)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors text-center"
                  >
                    Fermer la fiche
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
