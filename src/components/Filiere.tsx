import { motion } from 'motion/react';
import { Server, Code } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Filiere() {
  const { t } = useLanguage();
  return (
    <section id="filière" className="py-16 md:py-24 bg-zinc-100/50 dark:bg-zinc-900/20 border-y border-zinc-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">{t('filiere.title')}</h2>
          <p className="text-lg text-zinc-800 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {t('filiere.desc')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            className="p-6 md:p-8 rounded-[2rem] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Server size={120} className="text-zinc-900 dark:text-white" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white text-xs font-bold tracking-widest uppercase mb-6">
                {t('filiere.myChoice')}
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t('filiere.sisrTitle')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-6">{t('filiere.sisrSubtitle')}</p>
              <p className="text-zinc-800 dark:text-zinc-400 leading-relaxed text-sm">
                {t('filiere.sisrDesc')}
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="p-6 md:p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-white/5 opacity-80 hover:opacity-100 transition-opacity relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Code size={120} className="text-zinc-900 dark:text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 mt-10">{t('filiere.slamTitle')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-6">{t('filiere.slamSubtitle')}</p>
              <p className="text-zinc-800 dark:text-zinc-400 leading-relaxed text-sm">
                {t('filiere.slamDesc')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
