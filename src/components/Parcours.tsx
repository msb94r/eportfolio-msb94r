import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Parcours() {
  const { t } = useLanguage();
  return (
    <section id="parcours" className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-16">{t('parcours.title')}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {/* Card 1: Current Education */}
          <motion.div 
            className="col-span-1 md:col-span-2 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[10px] md:text-sm font-medium text-zinc-500 mb-1 md:mb-4">2024 — 2026</div>
            <h3 className="text-sm md:text-2xl font-bold text-zinc-900 dark:text-white mb-1 md:mb-2">{t('parcours.btsTitle')}</h3>
            <p className="text-[10px] md:text-base text-zinc-800 dark:text-zinc-400 mb-2 md:mb-6">{t('parcours.btsLoc')}</p>
            <p className="text-zinc-800 dark:text-zinc-400 text-[10px] md:text-sm leading-relaxed line-clamp-4 md:line-clamp-none">
              {t('parcours.btsDesc')}
            </p>
          </motion.div>

          {/* Card 2: Experience */}
          <motion.div 
            className="col-span-1 md:col-span-1 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-[10px] md:text-sm font-medium text-zinc-500 mb-1 md:mb-4">2025 — {t('parcours.current')}</div>
            <h3 className="text-sm md:text-xl font-bold text-zinc-900 dark:text-white mb-1 md:mb-2">{t('parcours.jobTitle')}</h3>
            <p className="text-[10px] md:text-base text-zinc-800 dark:text-zinc-400 mb-2 md:mb-6">{t('parcours.jobLoc')}</p>
            <p className="text-zinc-800 dark:text-zinc-400 text-[10px] md:text-sm leading-relaxed line-clamp-4 md:line-clamp-none">
              {t('parcours.jobDesc')}
            </p>
          </motion.div>

          {/* Card 3: Past Education */}
          <motion.div 
            className="col-span-2 md:col-span-3 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <div className="text-[10px] md:text-sm font-medium text-zinc-500 mb-1 md:mb-2">2024</div>
              <h3 className="text-sm md:text-xl font-bold text-zinc-900 dark:text-white mb-1">{t('parcours.bacTitle')}</h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-[10px] md:text-sm">{t('parcours.bacLoc')}</p>
            </div>
            <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-zinc-200 dark:bg-white/10 text-zinc-800 dark:text-zinc-300 text-[10px] md:text-sm font-medium w-fit">
              {t('parcours.bacSpec')}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
