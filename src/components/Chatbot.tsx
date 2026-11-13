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
  "Bonjour ! Je suis l'assistant virtuel de **Muslim Bayschanov**.\n\nPosez-moi vos questions sur son **parcours BTS SIO SISR**, ses **7 projets**, ses **compétences & protocoles**, ou sa **recherche d'alternance 2026** — ou utilisez les suggestions rapides ci-dessous.";

const QUICK_QUESTIONS = [
  { label: 'Ses 7 projets', prompt: 'Quels sont les projets réalisés par Muslim ?' },
  { label: 'Stages & Parcours', prompt: 'Parle-moi de ses stages et de son parcours.' },
  { label: 'Protocoles & Compétences', prompt: 'Quelles compétences et protocoles maîtrise-t-il ?' },
  { label: 'Veille Cyber', prompt: 'Quel est le sujet de sa veille technologique ?' },
  { label: 'Alternance & CV', prompt: 'Comment le contacter pour une alternance en 2026 ?' },
];

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

// Boutons d'action contextuels selon le contenu de la réponse
function getContextualActions(content: string): Array<{ label: string; href: string; external?: boolean }> {
  const lower = content.toLowerCase();
  const actions: Array<{ label: string; href: string; external?: boolean }> = [];

  if (lower.includes('cv') || lower.includes('alternance') || lower.includes('baysmuslim@gmail.com')) {
    actions.push({ label: 'Consulter le CV', href: '/cvmuslim.pdf', external: true });
    actions.push({ label: 'Aller au Contact', href: '#contact' });
  } else if (lower.includes('projet') || lower.includes('rituels') || lower.includes('shop ton auto') || lower.includes('active directory')) {
    actions.push({ label: 'Voir les Projets', href: '#projets' });
  } else if (lower.includes('protocole') || lower.includes('ospf') || lower.includes('wireguard')) {
    actions.push({ label: 'Explorer les Protocoles', href: '#protocoles' });
  } else if (lower.includes('veille') || lower.includes('ueba') || lower.includes('soar')) {
    actions.push({ label: 'Voir la Veille', href: '#veille' });
  } else if (lower.includes('cyberlab') || lower.includes('simulateur')) {
    actions.push({ label: 'Ouvrir CyberLab', href: '#soft-skills' });
  }

  return actions;
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

            {/* Suggestions rapides */}
            <div className="px-3 py-2 bg-zinc-900/70 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {QUICK_QUESTIONS.map((q) => (
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
