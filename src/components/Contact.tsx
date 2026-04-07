import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-[3rem] p-8 md:p-16 text-center transition-colors duration-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">{t('contact.title')}</h2>
          <p className="text-zinc-800 dark:text-zinc-400 mb-10 max-w-lg mx-auto leading-relaxed">
            {t('contact.desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:baysmuslim@gmail.com" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              baysmuslim@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/muslim-bayschanov-55404a28a/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-full border border-zinc-300 dark:border-white/10 text-zinc-900 dark:text-white font-medium hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
