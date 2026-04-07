import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sendChatMessage } from '../services/mistralService';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: t('chatbot.welcome') }]);
    }
  }, [t, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Format messages for the API (excluding the initial welcome message if needed, but it's fine to include)
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await sendChatMessage(apiMessages, t);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: t('chatbot.error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{t('chatbot.title')}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">En ligne</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950/50">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300' 
                      : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-tr-sm'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-zinc-800 dark:text-zinc-200 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center shrink-0 text-white dark:text-zinc-900">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-zinc-500" />
                    <span className="text-xs text-zinc-500">Réflexion...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chatbot.placeholder')}
                  className="w-full pl-4 pr-12 py-3 bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 rounded-full text-sm text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
