import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section id="profil" className="min-h-screen flex items-center pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-6 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16">
        <motion.div 
          className="md:w-3/5 space-y-8 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-6 leading-[1.1]">
              Muslim <br />
              <span className="text-zinc-600 dark:text-zinc-400">Bayschanov.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-800 dark:text-zinc-400 max-w-lg leading-relaxed font-light mx-auto md:mx-0">
              {t('hero.subtitle')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <a href="/assets/aistudio/CV_Muslim_Bayschanov_86a617a0.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              {t('hero.downloadCv')}
            </a>
            <a href="#contact" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-medium hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
              {t('hero.contactMe')} <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          className="md:w-2/5 flex justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-48 h-48 md:w-80 md:h-80 rounded-full overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-100 hover:grayscale-0 transition-all duration-700">
            <img src="muslim.jpg" alt="Muslim Bayschanov" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
