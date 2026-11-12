import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle, 
  ShieldCheck, 
  Cpu, 
  Network, 
  Server, 
  Sparkles, 
  ArrowRight, 
  Brain,
  Send,
  HelpCircle,
  Activity,
  Layers,
  Flame,
  Check,
  RefreshCw,
  Search
} from 'lucide-react';

interface Incident {
  id: number;
  ticketNumber: string;
  category: string;
  priority: 'Critique' | 'Haute' | 'Moyenne';
  title: string;
  description: string;
  environment: string;
  promptPrefix: string;
  diagnosticHint: string;
  diagnosticCommand: string;
  diagnosticOutput: string;
  options: {
    label: string;
    command: string;
    isCorrect: boolean;
    feedback: string;
    terminalLog: string[];
  }[];
}

const INCIDENTS_DATA: Incident[] = [
  {
    id: 1,
    ticketNumber: 'INC-2025-081',
    category: 'Systèmes & Active Directory',
    priority: 'Critique',
    title: 'Échec de résolution DNS et blocage des connexions AD',
    description: 'Les postes clients du sous-réseau 192.168.10.0/24 n’arrivent plus à joindre le domaine "corp.local" ni à authentifier les sessions utilisateurs. Les postes indiquent "Aucun serveur d’authentification disponible".',
    environment: 'Windows Server 2022 · Contrôleur de Domaine (DC01)',
    promptPrefix: 'C:\\Users\\Administrateur>',
    diagnosticHint: 'Vérifiez la disponibilité du service DNS et des enregistrements SRV Kerberos.',
    diagnosticCommand: 'dcdiag /test:dns /v',
    diagnosticOutput: 'Diagnostic Directory Server : Zone DNS locale chargée avec avertissement. Enregistrements SRV _kerberos._tcp.corp.local non résolus.',
    options: [
      {
        label: 'Vérifier le service DNS, recharger les zones et réenregistrer les SRV Active Directory',
        command: 'net stop dns && net start dns && nltest /dsgetdc:corp.local',
        isCorrect: true,
        feedback: 'Excellent réflexe ! Le service DNS héberge les enregistrements SRV indispensables aux tickets Kerberos.',
        terminalLog: [
          '[INFO] Arrêt du service Serveur DNS...',
          '[INFO] Démarrage du service Serveur DNS...',
          '[OK] Zone de recherche directe corp.local active.',
          '[OK] DC01 localisé avec succès sur le port 53 / 88. Authentification rétablie.'
        ]
      },
      {
        label: 'Redémarrer le spouleur d’impression et vider le cache ARP local',
        command: 'net stop spooler && arp -d *',
        isCorrect: false,
        feedback: 'Inapproprié : le spouleur d’impression et la table ARP locale n’ont aucun rapport avec les enregistrements DNS du domaine.',
        terminalLog: [
          '[WARN] Service d’impression arrêté.',
          '[ERROR] Le domaine corp.local reste introuvable pour les clients.'
        ]
      },
      {
        label: 'Réinitialiser la carte réseau du DC01 sans vérifier la configuration statique',
        command: 'netsh interface ip reset',
        isCorrect: false,
        feedback: 'Dangereux : réinitialiser l’IP statique d’un contrôleur de domaine entraîne la perte totale de contact sur le réseau.',
        terminalLog: [
          '[FATAL] Adresse IP 192.168.10.1 perdue. Contrôleur déconnecté du LAN.'
        ]
      }
    ]
  },
  {
    id: 2,
    ticketNumber: 'INC-2025-094',
    category: 'Réseaux & Commutation',
    priority: 'Critique',
    title: 'Tempête de broadcast et saturation des switchs de distribution',
    description: 'La bande passante du switch cœur de réseau est saturée à 100%. Les voyants LED clignotent de manière synchrone et les pings subissent 85% de perte de paquets.',
    environment: 'Switch Cisco Catalyst 2960-X · Cœur de Réseau',
    promptPrefix: 'Switch-Core(config)#',
    diagnosticHint: 'Inspectez l’état du protocole Spanning-Tree et identifiez les boucles de niveau 2.',
    diagnosticCommand: 'show spanning-tree summary',
    diagnosticOutput: 'Spanning tree enabled protocol ieee. Loop detected on GigabitEthernet0/12. Broadcast storm detected (> 15000 pkts/s).',
    options: [
      {
        label: 'Activer le protocole Rapid Spanning-Tree (RSTP) et BPDU Guard sur les ports d’accès',
        command: 'spanning-tree mode rapid-pvst && spanning-tree portfast bpduguard default',
        isCorrect: true,
        feedback: 'Parfait ! RSTP élimine les boucles Ethernet en moins d’une seconde et BPDU Guard isole le port parasite.',
        terminalLog: [
          '[CONFIG] Bascule vers Rapid-PVST appliquée.',
          '[SECURITY] BPDU Guard actif sur les interfaces d’accès.',
          '%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on Gi0/12 with BPDU Guard enabled.',
          '[OK] Port Gi0/12 placé en err-disable. Boucle neutralisée. Trafic normalisé à 2%.'
        ]
      },
      {
        label: 'Forcer tous les ports du switch en mode Full Duplex 1000 Mbps',
        command: 'interface range gi0/1-24 && speed 1000 && duplex full',
        isCorrect: false,
        feedback: 'Augmenter le débit ne résout pas la boucle logique de niveau 2 ; cela ne fait qu’accélérer la saturation du fond de panier.',
        terminalLog: [
          '[WARN] Vitesse forcée. Les trames de broadcast continuent de tourner en boucle infinie.'
        ]
      },
      {
        label: 'Désactiver le protocole Spanning-Tree pour libérer les ressources CPU',
        command: 'no spanning-tree vlan 1-4094',
        isCorrect: false,
        feedback: 'Catastrophique ! Désactiver STP supprime tout mécanisme de protection contre les boucles.',
        terminalLog: [
          '[CRITICAL] STP désactivé. Effondrement total du réseau d’entreprise.'
        ]
      }
    ]
  },
  {
    id: 3,
    ticketNumber: 'INC-2025-112',
    category: 'Cybersécurité & Durcissement',
    priority: 'Critique',
    title: 'Attaque par force brute SSH et tentatives d’intrusion sur serveur web',
    description: 'Le serveur web frontal hébergé en DMZ reçoit plus de 600 tentatives de connexion SSH par minute provenant d’adresses IP d’un botnet étranger.',
    environment: 'Serveur Linux Debian 12 (DMZ) · Pare-feu pfSense',
    promptPrefix: 'root@SRV-DEB12:~#',
    diagnosticHint: 'Analysez les journaux d’authentification pour repérer les adresses IP sources attaquantes.',
    diagnosticCommand: 'grep "Failed password" /var/log/auth.log | tail -n 5',
    diagnosticOutput: 'Failed password for invalid user admin from 198.51.100.42 port 48212 ssh2. 542 similar attempts in last 3 minutes.',
    options: [
      {
        label: 'Bannir les IP avec Fail2ban, forcer les clés Ed25519 et interdire le login root direct',
        command: 'fail2ban-client set sshd banip 198.51.100.42 && sed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config && systemctl restart sshd',
        isCorrect: true,
        feedback: 'Règle d’or du durcissement système (Hardening) : interdire les mots de passe et automatiser le blocage dynamique.',
        terminalLog: [
          '[SECURITY] Règle iptables insérée : DROP 198.51.100.42.',
          '[CONFIG] PermitRootLogin passé à "no".',
          '[CONFIG] PasswordAuthentication désactivé.',
          '[OK] Service SSH redémarré. Attaque repoussée avec succès.'
        ]
      },
      {
        label: 'Changer le mot de passe root en "Root2025@Password!"',
        command: 'echo "root:Root2025@Password!" | chpasswd',
        isCorrect: false,
        feedback: 'Insuffisant : conserver l’authentification par mot de passe laisse le serveur vulnérable aux attaques par dictionnaire continu.',
        terminalLog: [
          '[WARN] Mot de passe mis à jour mais le port 22 reste assailli de requêtes de connexion.'
        ]
      },
      {
        label: 'Désactiver le service pare-feu UFW pour tester si les attaques cessent',
        command: 'ufw disable',
        isCorrect: false,
        feedback: 'Désastreux : cela expose l’ensemble des ports et services du serveur aux attaquants.',
        terminalLog: [
          '[EXPOSURE] Pare-feu désactivé. Surface d’attaque démultipliée.'
        ]
      }
    ]
  },
  {
    id: 4,
    ticketNumber: 'INC-2025-135',
    category: 'Routage & Inter-VLAN',
    priority: 'Haute',
    title: 'Absence d’attribution IP dynamique sur le nouveau VLAN 30 (Visiteurs)',
    description: 'Les ordinateurs connectés aux prises réseau du VLAN 30 reçoivent une adresse APIPA 169.254.x.x et ne peuvent pas accéder à la passerelle ni à Internet.',
    environment: 'Routeur Cisco 2911 (Router-on-a-Stick) · Serveur DHCP 192.168.10.5',
    promptPrefix: 'Router-Cisco(config-subif)#',
    diagnosticHint: 'Vérifiez la présence d’un relais DHCP sur la sous-interface du VLAN 30.',
    diagnosticCommand: 'show run interface GigabitEthernet0/0.30',
    diagnosticOutput: 'interface GigabitEthernet0/0.30\n encapsulation dot1Q 30\n ip address 192.168.30.1 255.255.255.0\n ! Note: no ip helper-address configured',
    options: [
      {
        label: 'Configurer un relais DHCP (ip helper-address) vers le serveur DHCP d’entreprise',
        command: 'interface GigabitEthernet0/0.30 && ip helper-address 192.168.10.5',
        isCorrect: true,
        feedback: 'Exactement ! Le routeur bloque nativement le broadcast DHCP. L’ip helper-address le convertit en unicast vers le serveur DHCP.',
        terminalLog: [
          '[ROUTING] ip helper-address 192.168.10.5 appliqué sur Gi0/0.30.',
          '[DHCP] Requêtes DHCP Discover relayées avec succès.',
          '[OK] Les postes du VLAN 30 reçoivent leurs baux IP (192.168.30.50-100) et la passerelle 192.168.30.1.'
        ]
      },
      {
        label: 'Augmenter le masque de sous-réseau en /16 pour joindre le VLAN 10',
        command: 'ip address 192.168.30.1 255.255.0.0',
        isCorrect: false,
        feedback: 'Erreur d’adressage : modifier le masque brise le plan d’adressage réseau et génère des chevauchements de sous-réseaux.',
        terminalLog: [
          '[ERROR] Subnet overlap with GigabitEthernet0/0.10. Commande rejetée.'
        ]
      },
      {
        label: 'Désactiver le tagging 802.1Q sur la liaison trunk',
        command: 'no encapsulation dot1Q',
        isCorrect: false,
        feedback: 'Une sous-interface sans encapsulation 802.1Q ne peut plus router le trafic du VLAN tagué.',
        terminalLog: [
          '[ERROR] La sous-interface Gi0/0.30 passe à l’état DOWN.'
        ]
      }
    ]
  },
  {
    id: 5,
    ticketNumber: 'INC-2025-148',
    category: 'Supervision & Stockage',
    priority: 'Haute',
    title: 'Saturation de la partition système /var/log et plantage de Zabbix',
    description: 'Le serveur de monitoring Zabbix et GLPI ne répond plus. Les agents envoient des alertes de déconnexion. La partition /var est pleine à 100%.',
    environment: 'Ubuntu Server 22.04 LTS · LVM · Supervision Zabbix 7.0',
    promptPrefix: 'admin@srv-monit:~#',
    diagnosticHint: 'Analysez l’occupation disque et les journaux système volumineux.',
    diagnosticCommand: 'df -h /var/log && du -sh /var/log/* | sort -h | tail -n 3',
    diagnosticOutput: 'Filesystem /dev/mapper/vg0-lv_var 100% used (0 free). 18G /var/log/journal. 4.2G /var/log/zabbix/zabbix_server.log.',
    options: [
      {
        label: 'Purger les vieux journaux systemd, configurer logrotate et étendre le volume LVM',
        command: 'journalctl --vacuum-time=7d && logrotate -f /etc/logrotate.conf && lvextend -r -L +10G /dev/vg0/lv_var && systemctl restart zabbix-server',
        isCorrect: true,
        feedback: 'Procédure exemplaire d’administration système : libération d’espace, automatisation de la rétention et extension à chaud du volume LVM.',
        terminalLog: [
          '[CLEANUP] 14.8 Go de journaux supprimés par journalctl vacuum.',
          '[LVM] Volume /dev/vg0/lv_var étendu de +10 Go avec redimensionnement ext4.',
          '[INFO] Démarrage du démon zabbix-server...',
          '[OK] Zabbix Server en cours d’exécution. Interface web GLPI et supervision 100% opérationnelles.'
        ]
      },
      {
        label: 'Supprimer récursivement tout le dossier /var/log avec rm -rf',
        command: 'rm -rf /var/log/*',
        isCorrect: false,
        feedback: 'Mauvaise pratique : supprimer les dossiers de logs brise les permissions des démons système (Zabbix, Nginx, Auth) qui refuseront de démarrer.',
        terminalLog: [
          '[FATAL] Répertoires de travail de Zabbix et Nginx supprimés. Démons en échec de démarrage.'
        ]
      },
      {
        label: 'Ignorer l’alerte et désactiver la collecte de métriques Zabbix',
        command: 'systemctl stop zabbix-agent',
        isCorrect: false,
        feedback: 'Arrêter l’agent ne libère aucun espace disque sur le serveur central.',
        terminalLog: [
          '[WARN] Espace disque toujours saturé à 100%. Crash de la base de données imminent.'
        ]
      }
    ]
  },
  {
    id: 6,
    ticketNumber: 'INC-2025-162',
    category: 'Sécurité Réseau & Pare-feu',
    priority: 'Critique',
    title: 'Détection de communication C2 (Command & Control) vers une IP malveillante',
    description: 'Le système de détection d’intrusion Suricata sur pfSense signale un poste interne tentant de contacter un serveur de contrôle malveillant sur le port TCP 4444.',
    environment: 'Pare-feu pfSense 2.7.2 · IDS/IPS Suricata',
    promptPrefix: 'pfSense [admin@gw-firewall]:',
    diagnosticHint: 'Isolez immédiatement l’adresse IP infectée et bloquez le port 4444 en sortie.',
    diagnosticCommand: 'pfctl -ss | grep ":4444"',
    diagnosticOutput: 'all tcp 192.168.10.87:49812 -> 203.0.113.88:4444 ESTABLISHED:ESTABLISHED. Active reverse shell stream detected.',
    options: [
      {
        label: 'Isoler le poste du LAN via VLAN de quarantaine, bloquer l’IP C2 et réinitialiser les états pfSense',
        command: 'pfctl -t quarantine -T add 192.168.10.87 && pfctl -t c2_block -T add 203.0.113.88 && pfctl -k 192.168.10.87',
        isCorrect: true,
        feedback: 'Réaction immédiate de cyberdéfense (SOC N2) : rupture de la communication malveillante, isolation de l’hôte et analyse forensique.',
        terminalLog: [
          '[DEFENSE] Règle de blocage d’urgence injectée dans la table pf.',
          '[SECURITY] Connexions vers 203.0.113.88 terminées immédiatement (TCP RST).',
          '[ISOLATION] 192.168.10.87 basculé en VLAN Quarantaine.',
          '[OK] Menace neutralisée. Alerte transmise pour analyse forensique.'
        ]
      },
      {
        label: 'Envoyer un courriel à l’utilisateur du poste pour lui demander d’éteindre son PC',
        command: 'mail -s "Veuillez éteindre votre PC" user@corp.local',
        isCorrect: false,
        feedback: 'Totalement inadapté : l’attaquant a le temps d’exfiltrer toutes les données ou de propager un ransomware en quelques secondes.',
        terminalLog: [
          '[FAIL] Courriel envoyé mais les flux d’exfiltration continuent à pleine vitesse.'
        ]
      },
      {
        label: 'Autoriser temporairement le port 4444 pour observer le comportement de l’attaquant',
        command: 'easyrule pass wan tcp any any 4444',
        isCorrect: false,
        feedback: 'Inacceptable en environnement de production : cela accorde un accès direct non surveillé à l’attaquant.',
        terminalLog: [
          '[BREACH] Porte dérobée ouverte. Propagation latérale en cours sur le réseau interne.'
        ]
      }
    ]
  }
];

// Données du Memory Game (Mode alternatif)
const MEMORY_CARDS = [
  { id: 1, name: 'Windows Server', desc: 'Active Directory, gestion des GPO et rôles DNS/DHCP.' },
  { id: 2, name: 'Linux Debian', desc: 'Ligne de commande, gestion des droits, Bash et durcissement SSH.' },
  { id: 3, name: 'Réseaux Cisco', desc: 'Configuration de switchs et routeurs, VLANs 802.1Q et OSPF.' },
  { id: 4, name: 'Cybersécurité', desc: 'Pare-feu pfSense, règles de filtrage, VPN IPsec et WireGuard.' },
  { id: 5, name: 'Virtualisation', desc: 'Hyperviseur Proxmox VE, conteneurs Docker et sauvegardes.' },
  { id: 6, name: 'Supervision', desc: 'Monitoring Zabbix, métriques SNMP et gestion GLPI.' },
];

export default function SoftSkills() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'memory'>('simulator');

  // --- ÉTAT DU SIMULATEUR D'INCIDENTS ---
  const [currentIncidentIndex, setCurrentIncidentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [resolvedTickets, setResolvedTickets] = useState<number[]>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hasRunDiagnostic, setHasRunDiagnostic] = useState(false);
  const [cliInput, setCliInput] = useState('');
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'CyberLab SISR v3.0 [Pro Edition] initialized.',
    'Session: Muslim Bayschanov (Administrateur Systèmes & Réseaux).',
    'Tapez une commande ou sélectionnez une procédure technique ci-contre...'
  ]);

  const currentIncident = INCIDENTS_DATA[currentIncidentIndex];

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // Exécution du diagnostic préalable
  const handleRunDiagnostic = () => {
    if (hasRunDiagnostic) return;
    setHasRunDiagnostic(true);
    setTerminalHistory((prev) => [
      ...prev,
      `${currentIncident.promptPrefix} ${currentIncident.diagnosticCommand}`,
      `[DIAGNOSTIC] ${currentIncident.diagnosticOutput}`
    ]);
  };

  // Sélection d'une procédure d'intervention
  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOptionIndex(index);
    setIsAnswered(true);

    const opt = currentIncident.options[index];
    const newLogs = [
      `${currentIncident.promptPrefix} ${opt.command}`,
      ...opt.terminalLog
    ];
    setTerminalHistory((prev) => [...prev, ...newLogs]);

    if (opt.isCorrect) {
      setScore((s) => s + 100);
      if (!resolvedTickets.includes(currentIncident.id)) {
        setResolvedTickets((prev) => [...prev, currentIncident.id]);
      }
    }
  };

  // Exécution de commande manuelle dans la console CLI
  const handleCliSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cmd = cliInput.trim();
    if (!cmd) return;

    const userLine = `${currentIncident.promptPrefix} ${cmd}`;
    let reply = '';

    const lower = cmd.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setTerminalHistory(['Terminal nettoyé.', `Prêt sur l'incident ${currentIncident.ticketNumber}.`]);
      setCliInput('');
      return;
    } else if (lower === 'help') {
      reply = 'Commandes disponibles : diagnostic, solve, status, clear, help, ping, dcdiag, fail2ban, spanning-tree.';
    } else if (lower === 'diagnostic' || lower.includes('diag') || lower === currentIncident.diagnosticCommand.toLowerCase()) {
      handleRunDiagnostic();
      setCliInput('');
      return;
    } else if (lower === 'status') {
      reply = `Ticket actif: ${currentIncident.ticketNumber} [${currentIncident.category}] - Statut: ${isAnswered ? 'Traité' : 'En attente d’intervention'}. Score: ${score} pts.`;
    } else if (lower.includes('ping')) {
      reply = 'PING 192.168.10.1 (192.168.10.1): 56 data bytes. 64 bytes from 192.168.10.1: icmp_seq=0 ttl=64 time=0.482 ms.';
    } else {
      // Check if command matches one of the options
      const matchedIdx = currentIncident.options.findIndex(
        opt => opt.command.toLowerCase().includes(lower) || lower.includes(opt.command.toLowerCase().slice(0, 15))
      );

      if (matchedIdx !== -1 && !isAnswered) {
        handleOptionSelect(matchedIdx);
        setCliInput('');
        return;
      } else {
        reply = `Commande reconnue. Pour résoudre ce ticket, sélectionnez une procédure recommandée ci-contre ou tapez 'diagnostic'.`;
      }
    }

    setTerminalHistory((prev) => [...prev, userLine, reply]);
    setCliInput('');
  };

  // Passage au ticket suivant ou direct via sélecteur
  const handleSelectTicket = (index: number) => {
    setCurrentIncidentIndex(index);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setHasRunDiagnostic(false);
    setTerminalHistory((prev) => [
      ...prev,
      `--- Bascule vers ticket ${INCIDENTS_DATA[index].ticketNumber} [${INCIDENTS_DATA[index].category}] ---`
    ]);
  };

  const handleNextIncident = () => {
    const nextIdx = (currentIncidentIndex + 1) % INCIDENTS_DATA.length;
    handleSelectTicket(nextIdx);
  };

  const resetSimulator = () => {
    setCurrentIncidentIndex(0);
    setScore(0);
    setResolvedTickets([]);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setHasRunDiagnostic(false);
    setTerminalHistory([
      'Système réinitialisé avec succès.',
      'File d’attente GLPI rechargée : 6 incidents non résolus.'
    ]);
  };

  // --- ÉTAT DU MEMORY GAME ---
  const [memCards, setMemCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [memMoves, setMemMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [lastMatchMessage, setLastMatchMessage] = useState<string | null>(null);

  const initMemory = () => {
    const doubled = [...MEMORY_CARDS, ...MEMORY_CARDS]
      .sort(() => Math.random() - 0.5)
      .map((item) => ({ ...item, uniqueKey: Math.random() }));
    setMemCards(doubled);
    setFlipped([]);
    setSolved([]);
    setMemMoves(0);
    setDisabled(false);
    setLastMatchMessage(null);
  };

  useEffect(() => {
    initMemory();
  }, []);

  const handleCardClick = (index: number) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMemMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (memCards[first].id === memCards[second].id) {
        setSolved((prev) => [...prev, first, second]);
        setLastMatchMessage(`${memCards[first].name} : ${memCards[first].desc}`);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 900);
      }
    }
  };

  // Calcul du grade d'administration
  const getRank = () => {
    if (resolvedTickets.length >= 5) return 'Expert Cyber & Architecte SISR';
    if (resolvedTickets.length >= 3) return 'Administrateur Systèmes & Réseaux';
    if (resolvedTickets.length >= 1) return 'Technicien Support Réseau N2';
    return 'Technicien Support N1';
  };

  return (
    <section id="soft-skills" className="py-20 md:py-28 bg-zinc-100/50 dark:bg-zinc-950/60 border-y border-zinc-200 dark:border-white/5 transition-colors duration-500 relative">
      <div className="max-w-6xl mx-auto px-6">

        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200/80 dark:bg-white/5 border border-zinc-300/80 dark:border-white/10 text-xs font-semibold tracking-wider text-zinc-800 dark:text-zinc-300 uppercase mb-3">
              <Sparkles size={13} className="text-zinc-900 dark:text-white" />
              <span>CyberLab Interactif · BTS SIO SISR</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
              Simulateur d'Incidents & Dépannage
            </h2>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Mettez-vous dans la peau d'un administrateur systèmes et réseaux. Analysez des alertes réelles, inspectez les diagnostics en console et appliquez les bonnes procédures techniques.
            </p>
          </motion.div>

          {/* Sélecteur de mode (Tabs) */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-200/60 dark:bg-zinc-900/80 border border-zinc-300/80 dark:border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Terminal size={14} />
              <span>Simulateur d'Incidents (6)</span>
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'memory'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Brain size={14} />
              <span>Memory Tech BTS</span>
            </button>
          </div>
        </div>

        {/* CONTENU : MODE 1 - SIMULATEUR D'INCIDENTS APPROFONDI */}
        {activeTab === 'simulator' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Barre de tickets GLPI interactifs (Sélecteur direct de scénarios) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 shrink-0 mr-2 flex items-center gap-1.5">
                <Activity size={14} />
                <span>File d'incidents :</span>
              </span>
              {INCIDENTS_DATA.map((inc, idx) => {
                const isCurrent = currentIncidentIndex === idx;
                const isDone = resolvedTickets.includes(inc.id);
                return (
                  <button
                    key={inc.id}
                    onClick={() => handleSelectTicket(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                      isCurrent
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-sm'
                        : isDone
                        ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                        : 'bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/5 hover:border-zinc-400'
                    }`}
                  >
                    {isDone ? (
                      <Check size={12} className="text-emerald-500" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                    <span>{inc.ticketNumber}</span>
                    <span className="text-[10px] opacity-70 hidden sm:inline">
                      {inc.category.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Grille principale : Fiche d'incident & Console CLI */}
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Panneau de gauche : Détail du ticket & Procédures d'intervention */}
              <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-white/15 shadow-sm">
                <div>
                  {/* Header du ticket */}
                  <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-white/10">
                        {currentIncident.ticketNumber}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        {currentIncident.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        currentIncident.priority === 'Critique'
                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {currentIncident.priority}
                      </span>
                      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-mono bg-zinc-100 dark:bg-white/10 px-2 py-0.5 rounded">
                        Score : {score} pts
                      </div>
                    </div>
                  </div>

                  {/* Titre et détails de la panne */}
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    {currentIncident.title}
                  </h3>
                  <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-1.5">
                    <Server size={13} />
                    <span>Environnement : {currentIncident.environment}</span>
                  </p>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/80 dark:border-white/5 mb-5">
                    <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed flex items-start gap-2.5">
                      <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{currentIncident.description}</span>
                    </div>
                  </div>

                  {/* Bouton de diagnostic préalable */}
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/20 border border-zinc-200 dark:border-white/5">
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="font-semibold text-zinc-900 dark:text-white">Étape 1 : Diagnostic</span>
                      <p className="text-[11px] text-zinc-500">{currentIncident.diagnosticHint}</p>
                    </div>
                    <button
                      onClick={handleRunDiagnostic}
                      disabled={hasRunDiagnostic}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        hasRunDiagnostic 
                          ? 'bg-zinc-200 dark:bg-white/10 text-zinc-500 cursor-default'
                          : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800'
                      }`}
                    >
                      <Search size={12} />
                      <span>{hasRunDiagnostic ? 'Diagnostic exécuté' : 'Lancer le diagnostic'}</span>
                    </button>
                  </div>

                  {/* Choix des options d'intervention */}
                  <div className="space-y-3 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Étape 2 : Procédure de résolution à appliquer :
                    </p>
                    {currentIncident.options.map((opt, idx) => {
                      const isSelected = selectedOptionIndex === idx;
                      let btnStyle = 'bg-zinc-50 dark:bg-zinc-800/20 border-zinc-200 dark:border-white/5 hover:border-zinc-400 dark:hover:border-white/20 text-zinc-800 dark:text-zinc-200';
                      
                      if (isAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-semibold';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-800 dark:text-rose-300';
                        } else {
                          btnStyle = 'opacity-40 border-transparent';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleOptionSelect(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="font-mono font-bold text-zinc-400 dark:text-zinc-500 text-xs mt-0.5">
                            0{idx + 1}.
                          </span>
                          <div className="flex-1">
                            <div className="font-medium mb-1">{opt.label}</div>
                            <code className="text-[11px] font-mono opacity-70 block break-all">
                              {currentIncident.promptPrefix} {opt.command}
                            </code>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explication et feedback après réponse */}
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border text-xs leading-relaxed mb-6 ${
                        currentIncident.options[selectedOptionIndex!].isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-900 dark:text-rose-200'
                      }`}
                    >
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        {currentIncident.options[selectedOptionIndex!].isCorrect ? (
                          <>
                            <CheckCircle2 size={15} className="text-emerald-500" />
                            <span>Incident Résolu avec Succès</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={15} className="text-rose-500" />
                            <span>Procédure Incorrecte</span>
                          </>
                        )}
                      </div>
                      {currentIncident.options[selectedOptionIndex!].feedback}
                    </motion.div>
                  )}
                </div>

                {/* Navigation des tickets */}
                <div className="pt-4 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Ticket {currentIncidentIndex + 1} / {INCIDENTS_DATA.length} · {resolvedTickets.length} résolu(s)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={resetSimulator}
                      className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                      title="Réinitialiser l'ensemble des tickets"
                    >
                      <RotateCcw size={15} />
                    </button>

                    {isAnswered && (
                      <button
                        onClick={handleNextIncident}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                      >
                        <span>Ticket Suivant</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Panneau de droite : Console Terminal CLI Réaliste avec saisie manuelle */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-black border border-zinc-800 p-6 font-mono text-xs shadow-2xl relative overflow-hidden min-h-[500px]">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Header de la console */}
                    <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                        <span className="text-[11px] text-zinc-500 ml-2">console@cyberlab-sisr</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        TERMINAL ACTIF
                      </span>
                    </div>

                    {/* Historique du terminal */}
                    <div className="space-y-2 text-zinc-400 max-h-72 overflow-y-auto scrollbar-none pr-1">
                      {terminalHistory.map((line, i) => (
                        <div 
                          key={i} 
                          className={
                            line.startsWith('$') || line.includes('>') || line.includes('#')
                              ? 'text-white font-bold' 
                              : line.includes('[OK]') || line.includes('ONLINE')
                              ? 'text-emerald-400' 
                              : line.includes('[WARN]') || line.includes('[ERROR]') || line.includes('[FATAL]') || line.includes('[CRITICAL]')
                              ? 'text-amber-400' 
                              : line.includes('[DIAGNOSTIC]')
                              ? 'text-cyan-300'
                              : 'text-zinc-400'
                          }
                        >
                          {line}
                        </div>
                      ))}
                      <div ref={terminalEndRef} />
                    </div>
                  </div>

                  {/* Invite de commande interactive (CLI) */}
                  <div className="pt-4 mt-4 border-t border-zinc-800">
                    <form onSubmit={handleCliSubmit} className="flex items-center gap-2 mb-3">
                      <span className="text-emerald-400 font-bold shrink-0">
                        {currentIncident.promptPrefix}
                      </span>
                      <input
                        type="text"
                        value={cliInput}
                        onChange={(e) => setCliInput(e.target.value)}
                        placeholder="Tapez 'diagnostic', 'help' ou votre commande..."
                        className="flex-1 bg-transparent border-none text-white text-xs font-mono focus:outline-none placeholder:text-zinc-600"
                      />
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        title="Exécuter"
                      >
                        <Send size={12} />
                      </button>
                    </form>

                    {/* Statut & Grade du candidat */}
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-200">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white font-sans">
                            {getRank()}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-sans">
                            {resolvedTickets.length} / {INCIDENTS_DATA.length} tickets résolus avec succès
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setTerminalHistory(['Terminal nettoyé.', `Prêt sur l'incident ${currentIncident.ticketNumber}.`])}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 underline font-mono"
                      >
                        clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* CONTENU : MODE 2 - MEMORY DES COMPÉTENCES */}
        {activeTab === 'memory' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col lg:flex-row gap-10 items-center"
          >
            <div className="lg:w-5/12">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                Memory des Compétences BTS
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                Retrouvez les paires de briques technologiques maîtrisées au cours de la formation pour afficher leurs cas d'application concrets en entreprise.
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Coups joués : <span className="text-zinc-900 dark:text-white font-bold font-mono text-sm">{memMoves}</span>
                </div>
                <button 
                  onClick={initMemory}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white font-semibold transition-colors underline underline-offset-4"
                >
                  <RotateCcw size={13} />
                  <span>Recommencer la partie</span>
                </button>
              </div>

              {/* Message de la dernière carte trouvée */}
              <div className="min-h-24">
                <AnimatePresence mode="wait">
                  {lastMatchMessage && (
                    <motion.div
                      key={lastMatchMessage}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed">
                          {lastMatchMessage}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Grille du Memory */}
            <div className="lg:w-7/12 w-full">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {memCards.map((card, index) => {
                  const isFlipped = flipped.includes(index) || solved.includes(index);
                  return (
                    <div 
                      key={card.uniqueKey}
                      onClick={() => handleCardClick(index)}
                      className="aspect-square cursor-pointer select-none"
                      style={{ perspective: '1000px' }}
                    >
                      <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                        {/* Dos de carte */}
                        <div className="absolute inset-0 w-full h-full bg-zinc-900 text-white rounded-2xl border border-zinc-800 flex items-center justify-center [backface-visibility:hidden] hover:bg-zinc-800 transition-colors shadow-sm">
                          <Cpu size={24} className="text-zinc-600" />
                        </div>
                        
                        {/* Face visible */}
                        <div className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col items-center justify-center p-3 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-md border ${
                          solved.includes(index)
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white'
                        }`}>
                          <Network size={22} className="mb-1.5 opacity-80" />
                          <span className="text-[11px] font-bold leading-tight">
                            {card.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
