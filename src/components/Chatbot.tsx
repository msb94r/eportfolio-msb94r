import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RotateCcw, 
  FileDown, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { sendChatMessage } from '../services/mistralService';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const WELCOME_MESSAGE =
  "Bonjour ! Je suis l'assistant virtuel de **Muslim Bayschanov**.\n\nPosez-moi des questions **précises et détaillées** sur :\n• Un **protocole** précis (*OSPF, Kerberos, WireGuard, SNMPv3...*)\n• Une **compétence ou un outil** (*Proxmox, Suricata, Zabbix, GPO...*)\n• Un **projet** précis (*Rituels du Monde, pfSense, Active Directory...*)\n• Un **axe de veille** (*UEBA, SOAR, ANSSI*), un **stage** ou son **alternance 2026**.";

const INITIAL_SUGGESTIONS = [
  { label: 'Explique OSPF', prompt: 'Explique le protocole OSPF en détail.' },
  { label: 'TCP vs UDP', prompt: 'Quelle est la différence entre TCP et UDP ?' },
  { label: 'Proxmox & HA', prompt: 'Quelles sont ses compétences sur Proxmox et la haute disponibilité ?' },
  { label: 'Rituels du Monde', prompt: 'Explique en détail le projet Rituels du Monde.' },
  { label: 'Veille UEBA', prompt: 'Quel est le rôle de l’UEBA dans sa veille technologique ?' },
  { label: 'Stage 2ème année', prompt: 'Quelles ont été ses missions lors du stage de 2ème année ?' },
  { label: 'Alternance & CV', prompt: 'Est-il disponible pour une alternance en 2026 ?' },
];

// Suggestions dynamiques non regroupées adaptées au dernier sujet abordé
function getDynamicSuggestions(messages: Message[]): Array<{ label: string; prompt: string }> {
  if (messages.length <= 1) return INITIAL_SUGGESTIONS;

  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant')?.content.toLowerCase() || '';

  if (/\bprotocole\b/.test(lastAssistant) || lastAssistant.includes('durcissement —') || lastAssistant.includes('port, couche') || lastAssistant.includes('mise en pratique de') || lastAssistant.includes('couche osi') || lastAssistant.includes('comparaison tcp')) {
    return [
      { label: 'Et la sécurité ?', prompt: 'Et comment le sécuriser ?' },
      { label: 'IPsec vs WireGuard', prompt: 'Compare IPsec et WireGuard.' },
      { label: 'Explique Kerberos', prompt: 'Explique le protocole Kerberos en détail.' },
      { label: 'Explique SNMP v3', prompt: 'Comment utilise-t-il SNMP v3 ?' },
      { label: 'Rituels du Monde', prompt: 'Explique en détail le projet Rituels du Monde.' },
    ];
  }

  if (/\bcompétence\b/.test(lastAssistant) || /\b(proxmox|suricata|zabbix|puppet)\b/.test(lastAssistant)) {
    return [
      { label: 'Outils Puppet/Ansible', prompt: 'Que maîtrise-t-il sur Puppet, Ansible et KeePass ?' },
      { label: 'Sécurité Suricata/GPG', prompt: 'Détaille ses compétences en cybersécurité (Snort, Suricata, GPG).' },
      { label: 'Réseau Cisco/Wireshark', prompt: 'Quelles sont ses compétences Cisco et Wireshark ?' },
      { label: 'Supervision GLPI & Zabbix', prompt: 'Explique le projet Supervision GLPI & Zabbix.' },
    ];
  }

  if (lastAssistant.includes('projet —') || /\blivrables\b/.test(lastAssistant)) {
    return [
      { label: 'Cahiers & Gantt', prompt: 'Quels livrables et diagrammes de Gantt accompagnent ses projets ?' },
      { label: 'Projet pfSense', prompt: 'Détaille le projet Sécurisation Réseau & Pare-feu pfSense.' },
      { label: 'Infra Active Directory', prompt: 'Détaille le projet Infrastructure Active Directory & WDS.' },
      { label: 'Shop Ton Auto', prompt: 'Comment fonctionne le projet Shop Ton Auto ?' },
    ];
  }

  if (/\b(veille|ueba|soar|feedly|mttr)\b/.test(lastAssistant)) {
    return [
      { label: 'Axe 2 : SOC & SOAR', prompt: 'Explique l’axe 2 sur les SOC, Copilotes IA et SOAR.' },
      { label: 'Axe 3 : IA vs IA', prompt: 'Explique l’axe 3 sur les malwares polymorphes.' },
      { label: 'Outils Feedly & ANSSI', prompt: 'Quels outils et articles utilise-t-il pour sa veille ?' },
      { label: 'Problématique Veille', prompt: 'Quelle est la problématique exacte de sa veille ?' },
    ];
  }

  if (/\b(stage|parcours|turgot|e\.leclerc)\b/.test(lastAssistant)) {
    return [
      { label: 'Stage 1ère année', prompt: 'Quelles ont été ses missions au stage de 1ère année ?' },
      { label: 'Certifications Cisco', prompt: 'Quelles certifications Cisco a-t-il obtenues ?' },
      { label: 'Tableau de synthèse', prompt: 'Où consulter son tableau de synthèse BTS SIO ?' },
      { label: 'Alternance 2026', prompt: 'Comment le contacter pour une alternance ?' },
    ];
  }

  return INITIAL_SUGGESTIONS;
}

// Rendu propre du gras (**texte**) et des puces sans dépendance externe
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');

  const renderInlineBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Italique simple *texte*
      const italicParts = part.split(/(\*[^*]+\*)/g);
      return italicParts.map((sub, j) => {
        if (sub.startsWith('*') && sub.endsWith('*') && sub.length > 2) {
          return (
            <em key={`${i}-${j}`} className="italic text-zinc-200">
              {sub.slice(1, -1)}
            </em>
          );
        }
        return <React.Fragment key={`${i}-${j}`}>{sub}</React.Fragment>;
      });
    });
  };

  return (
    <div className="space-y-1.5 text-[13px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        if (trimmed.startsWith('•') || trimmed.startsWith('- ')) {
          const bulletText = trimmed.replace(/^[•-]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-zinc-400 mt-0.5 shrink-0">•</span>
              <span>{renderInlineBold(bulletText)}</span>
            </div>
          );
        }
        return <p key={idx}>{renderInlineBold(line)}</p>;
      })}
    </div>
  );
}

// Boutons d'action contextuels selon le contenu de la réponse (strictement par mots entiers)
function getContextualActions(content: string): Array<{ label: string; href: string; external?: boolean }> {
  const lower = content.toLowerCase();
  const actions: Array<{ label: string; href: string; external?: boolean }> = [];

  if (/\b(cv|alternance)\b/.test(lower) || lower.includes('baysmuslim@gmail.com')) {
    actions.push({ label: 'Consulter le CV', href: '/assets/aistudio/CV_Muslim_Bayschanov_86a617a0.pdf', external: true });
    actions.push({ label: 'Aller au Contact', href: '#contact' });
    return actions;
  }
  if (lower.includes('tableau de synthèse') || /\bxlsx\b/.test(lower)) {
    actions.push({ label: 'Voir le Tableau de Synthèse', href: '#tableau-synthese' });
    return actions;
  }
  if (/\bprotocoles?\b/.test(lower) || lower.includes('couche osi') || lower.includes('durcissement —') || lower.includes('port, couche') || lower.includes('mise en pratique de') || /\bcomparaison (tcp|ipsec|ospf)\b/.test(lower) || /\bdifférence (ldap|sftp|ssh)\b/.test(lower)) {
    actions.push({ label: 'Explorer les Protocoles', href: '#protocoles' });
  }
  if (lower.includes('projet —') || /\blivrables\b/.test(lower) || lower.includes('rituels du monde') || lower.includes('shop ton auto') || lower.includes('chicken point') || lower.includes('les 7 projets')) {
    actions.push({ label: 'Voir les Projets', href: '#projets' });
  }
  if (/\b(veille|ueba|soar|feedly|mttr)\b/.test(lower)) {
    actions.push({ label: 'Voir la Veille', href: '#veille' });
  }
  if (/\b(compétence|compétences|proxmox|suricata|puppet|zabbix|gestion de projet)\b/.test(lower)) {
    actions.push({ label: 'Voir les Compétences', href: '#compétences' });
  }
  if (/\b(stage|stages|e\.leclerc|baccalauréat)\b/.test(lower)) {
    actions.push({ label: 'Voir le Parcours', href: '#parcours' });
  }
  if (/\b(certification|certifications|credly)\b/.test(lower)) {
    actions.push({ label: 'Voir les Certifications', href: '#certifications' });
  }
  if (/\bsisr\b/.test(lower) && /\bslam\b/.test(lower)) {
    actions.push({ label: 'Voir la Filière SIO', href: '#filière' });
  }
  if (/\b(cyberlab|simulateur)\b/.test(lower) || lower.includes('memory tech')) {
    actions.push({ label: 'Ouvrir CyberLab', href: '#soft-skills' });
  }

  return actions.slice(0, 2);
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll uniquement à l'intérieur du conteneur de chat (sans jamais faire défiler la page)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  // Focus automatique du champ texte à l'ouverture
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 180);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessageText = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));
      const response = await sendChatMessage(apiMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Désolé, je n'ai pas pu traiter votre demande. Essayez de cliquer sur une suggestion rapide ci-dessous !"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessageText(input);
  };

  const handleReset = () => {
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    setInput('');
  };

  return (
    <>
      {/* Bouton flottant d'ouverture */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white text-zinc-950 shadow-2xl border border-white/20 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        aria-label="Ouvrir l'assistant virtuel"
      >
        <MessageCircle size={24} />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0b0b0e]" />
      </motion.button>

      {/* Fenêtre de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[610px] max-h-[84vh] bg-zinc-950 rounded-3xl shadow-2xl border border-white/15 flex flex-col overflow-hidden"
          >
            {/* En-tête */}
            <div className="p-4 bg-zinc-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-950 shadow-sm">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    Assistant Portfolio
                    <Sparkles size={12} className="text-zinc-400" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-zinc-400 font-medium">Opérationnel · 24/7</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Nouvelle conversation"
                  aria-label="Nouvelle conversation"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Fermer"
                  aria-label="Fermer l'assistant"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Zone des messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b0b0e]"
            >
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const actions = !isUser && index > 0 ? getContextualActions(msg.content) : [];

                return (
                  <div key={index} className="space-y-2">
                    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isUser
                            ? 'bg-zinc-800 text-zinc-300 border border-white/10'
                            : 'bg-white text-zinc-950'
                        }`}
                      >
                        {isUser ? <User size={14} /> : <Bot size={14} />}
                      </div>

                      <div
                        className={`max-w-[82%] p-3.5 rounded-2xl ${
                          isUser
                            ? 'bg-white text-zinc-950 rounded-tr-sm font-medium text-[13px]'
                            : 'bg-zinc-900 border border-white/10 text-zinc-200 rounded-tl-sm shadow-sm'
                        }`}
                      >
                        {isUser ? (
                          <p className="leading-relaxed">{msg.content}</p>
                        ) : (
                          <FormattedMessage content={msg.content} />
                        )}
                      </div>
                    </div>

                    {/* Boutons d'action rapides contextuels */}
                    {actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pl-9">
                        {actions.map((act) =>
                          act.external ? (
                            <a
                              key={act.label}
                              href={act.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 text-[11px] font-bold transition-colors"
                            >
                              <FileDown size={12} />
                              {act.label}
                            </a>
                          ) : (
                            <a
                              key={act.label}
                              href={act.href}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10 text-[11px] font-semibold transition-colors"
                            >
                              {act.label}
                              <ArrowUpRight size={12} />
                            </a>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 text-zinc-950">
                    <Bot size={14} />
                  </div>
                  <div className="bg-zinc-900 border border-white/10 px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-zinc-400" />
                    <span className="text-xs text-zinc-400">Recherche en cours...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions rapides dynamiques */}
            <div className="px-3 py-2 bg-zinc-900/70 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {getDynamicSuggestions(messages).map((q) => (
                <button
                  key={q.label}
                  type="button"
                  disabled={isLoading}
                  onClick={() => sendMessageText(q.prompt)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-800/90 hover:bg-white hover:text-zinc-950 text-zinc-300 border border-white/10 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Champ de saisie */}
            <form onSubmit={handleSubmit} className="p-3 bg-zinc-950 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..."
                  className="w-full pl-4 pr-12 py-2.5 bg-zinc-900 border border-white/10 focus:border-white/30 rounded-full text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Envoyer le message"
                  className="absolute right-1.5 p-2 rounded-full bg-white text-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
