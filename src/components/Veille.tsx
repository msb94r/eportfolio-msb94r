import { motion } from 'motion/react';
import { Rss, Bell, Globe, BookOpen, ArrowUpRight, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Veille() {
  const { t } = useLanguage();
  const articles = [
    {
      title: t('veille.a1Title'),
      source: t('veille.a1Source'),
      date: t('veille.a1Date'),
      link: "#"
    },
    {
      title: t('veille.a2Title'),
      source: t('veille.a2Source'),
      date: t('veille.a2Date'),
      link: "#"
    },
    {
      title: t('veille.a3Title'),
      source: t('veille.a3Source'),
      date: t('veille.a3Date'),
      link: "#"
    }
  ];

  const tools = [
    { name: "Feedly", icon: <Rss size={16} /> },
    { name: "Google Alerts", icon: <Bell size={16} /> },
    { name: "Twitter/X", icon: <Globe size={16} /> },
    { name: "Newsletters", icon: <BookOpen size={16} /> }
  ];

  return (
    <section id="veille" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-16">{t('veille.title')}</h2>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Theme & Tools */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              className="p-6 md:p-8 rounded-[2rem] bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-500 uppercase tracking-widest mb-4">{t('veille.topic')}</h3>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight mb-6">
                {t('veille.subject')}
              </p>
              <p className="text-zinc-800 dark:text-zinc-400 leading-relaxed">
                {t('veille.desc')}
              </p>
            </motion.div>

            <motion.div 
              className="p-6 md:p-8 rounded-[2rem] border border-zinc-200 dark:border-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-500 uppercase tracking-widest mb-6">{t('veille.tools')}</h3>
              <div className="flex flex-wrap gap-3">
                {tools.map((tool, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 text-sm font-medium">
                    {tool.icon}
                    {tool.name}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Articles Feed */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-500 uppercase tracking-widest mb-6 lg:mt-0 mt-8">{t('veille.latest')}</h3>
            {articles.map((article, i) => (
              <motion.a 
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                key={i}
                className="group block p-5 md:p-6 rounded-[2rem] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm dark:shadow-none"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider px-2.5 py-1 bg-zinc-100 dark:bg-white/10 rounded-md">
                        {article.source}
                      </span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-500 font-medium">{article.date}</span>
                    </div>
                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors leading-tight">
                      {article.title}
                    </h4>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <ArrowUpRight size={20} className="text-zinc-900 dark:text-white" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bouton Veille PDF */}
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a 
            href="fichedeveille.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-zinc-900/20 dark:shadow-white/10"
          >
            <FileText size={18} />
            {t('Fiche de veille (PDF)')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
