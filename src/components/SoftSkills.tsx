import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SoftSkills() {
  const { t } = useLanguage();
  
  const CARDS = [
    { id: 1, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg', name: 'Windows Server', message: t('softskills.c1') },
    { id: 2, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', name: 'Linux', message: t('softskills.c2') },
    { id: 3, image: 'https://www.vectorlogo.zone/logos/cisco/cisco-icon.svg', name: 'Cisco', message: t('softskills.c3') },
    { id: 4, image: 'https://www.vectorlogo.zone/logos/kali/kali-icon.svg', name: 'Kali Linux', message: t('softskills.c4') },
    { id: 5, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', name: 'Docker', message: t('softskills.c5') },
    { id: 6, image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg', name: 'Nginx', message: t('softskills.c6') },
  ];

  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [lastFoundMessage, setLastFoundMessage] = useState<string | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = [...CARDS, ...CARDS]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, uniqueId: Math.random() }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setDisabled(false);
    setLastFoundMessage(null);
  };

  const handleCardClick = (index: number) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves((m) => m + 1);
      
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].id === cards[secondIndex].id) {
        setSolved([...solved, firstIndex, secondIndex]);
        setLastFoundMessage(cards[firstIndex].message);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <section id="soft-skills" className="py-16 md:py-24 bg-zinc-100/50 dark:bg-zinc-900/20 border-y border-zinc-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">{t('softskills.title')}</h2>
            <p className="text-zinc-800 dark:text-zinc-400 leading-relaxed mb-8">
              {t('softskills.desc')}
            </p>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="text-sm text-zinc-700 dark:text-zinc-500">
                {t('softskills.moves')} <span className="text-zinc-900 dark:text-white font-bold">{moves}</span>
              </div>
              <button 
                onClick={initializeGame}
                className="text-sm text-zinc-700 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors underline underline-offset-4 decoration-zinc-300 dark:decoration-white/20 hover:decoration-zinc-900 dark:hover:decoration-white"
              >
                {t('softskills.restart')}
              </button>
            </div>

            <div className="h-24">
              <AnimatePresence mode="wait">
                {lastFoundMessage && (
                  <motion.div
                    key={lastFoundMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-2xl bg-zinc-200/50 dark:bg-white/5 border border-zinc-300 dark:border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed">
                        {lastFoundMessage}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div 
            className="md:w-1/2 w-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {cards.map((card, index) => {
                const isFlipped = flipped.includes(index) || solved.includes(index);
                return (
                  <div 
                    key={card.uniqueId}
                    onClick={() => handleCardClick(index)}
                    className="relative aspect-square cursor-pointer group"
                    style={{ perspective: '1000px' }}
                  >
                    <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                      {/* Face cachée (dos de la carte) */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-2xl flex items-center justify-center [backface-visibility:hidden] group-hover:from-zinc-700 group-hover:to-zinc-900 transition-all duration-300 shadow-md">
                        <span className="text-4xl md:text-5xl font-black text-white/20">?</span>
                      </div>
                      
                      {/* Face visible (image) */}
                      <div className={`absolute inset-0 w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center p-3 md:p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-lg border border-zinc-200 transition-colors duration-300 ${solved.includes(index) ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}`}>
                        <img src={card.image} alt={card.name} className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2 md:mb-3 drop-shadow-sm" referrerPolicy="no-referrer" />
                        <span className="text-[10px] md:text-xs font-bold text-zinc-900 text-center leading-tight">{card.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
