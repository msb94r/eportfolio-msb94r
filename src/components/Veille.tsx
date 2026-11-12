import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Rss, Bell, Globe, BookOpen, ArrowUpRight, FileText, Eye, X, Radar, Cpu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Veille() {
  const { t } = useLanguage();
  const [showScreenModal, setShowScreenModal] = useState(false);

  const axes = [
    {
      id: 1,
      icon: Radar,
      title: t('veille.axe1Title'),
      desc: t('veille.axe1Desc'),
      tag: "UEBA & Anomaly Detection"
    },
    {
      id: 2,
      icon: Cpu,
      title: t('veille.axe2Title'),
      desc: t('veille.axe2Desc'),
      tag: "SOAR & GenAI Copilot"
    },
    {
      id: 3,
      icon: Shield,
      title: t('veille.axe3Title'),
      desc: t('veille.axe3Desc'),
      tag: "Realtime Mitigation"
    }
  ];

  const articles = [
    {
      title: t('veille.a1Title'),
      source: t('veille.a1Source'),
      date: t('veille.a1Date'),
      link: "https://www.ssi.gouv.fr/",
      tag: "Zero-Day & Menaces"
    },
    {
      title: t('veille.a2Title'),
      source: t('veille.a2Source'),
      date: t('veille.a2Date'),
      link: "https://www.lemagit.fr/securite",
      tag: "SOC & Machine Learning"
    },
    {
      title: t('veille.a3Title'),
      source: t('veille.a3Source'),
      date: t('veille.a3Date'),
      link: "https://www.zdnet.fr/actualites/securite/",
      tag: "SOAR & Automatisation"
    }
  ];

  const tools = [
    { name: "Feedly (Flux RSS)", icon: <Rss size={15} />, note: "ANSSI, LeMagIT, CERT-FR" },
    { name: "Google Alerts", icon: <Bell size={15} />, note: "Mots-clés IA & Cyber" },
    { name: "CERT-FR & ANSSI", icon: <Shield size={15} />, note: "Bulletins de vulnérabilités" },
    { name: "Newsletters Cyber", icon: <BookOpen size={15} />, note: "Gartner, IBM Security, ZDNet" }
  ];

  return (
    <section id="veille" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-200/70 dark:bg-white/5 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 mb-3">
            <Shield size={13} />
            <span>Cybersécurité & Intelligence Artificielle</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
            {t('veille.title')}
          </h2>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {t('veille.subjectDesc')}
          </p>
        </div>

        {/* Top Bento: Thématique & Problématique */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
          <motion.div 
            className="lg:col-span-7 p-6 md:p-8 rounded-[1.75rem] bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                {t('veille.subjectTitle')}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white leading-snug mb-4">
                {t('veille.subject')}
              </h3>
            </div>
            <div className="pt-4 border-t border-zinc-200/70 dark:border-white/5">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                {t('veille.problematiqueTitle')}
              </div>
              <p className="text-sm md:text-base text-zinc-800 dark:text-zinc-300 font-medium leading-relaxed italic">
                "{t('veille.problematique')}"
              </p>
            </div>
          </motion.div>

          {/* Outils & Preuve Feedly */}
          <motion.div 
            className="lg:col-span-5 p-6 md:p-8 rounded-[1.75rem] bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  {t('veille.toolsTitle')}
                </span>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Flux automatisé
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {tools.map((tool, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-zinc-200/70 dark:border-white/5">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white mb-1">
                      <span className="text-zinc-600 dark:text-zinc-300">{tool.icon}</span>
                      <span>{tool.name}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-tight">{tool.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton pour voir la capture Feedly */}
            <button
              onClick={() => setShowScreenModal(true)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-200/60 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-all group"
            >
              <div className="flex items-center gap-2">
                <Eye size={15} className="text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                <span>Voir la capture de mon flux Feedly</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 group-hover:opacity-100">Preuve BTS</span>
            </button>
          </motion.div>
        </div>

        {/* 3 Axes de recherche */}
        <div className="mb-12">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
            {t('veille.axesTitle')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {axes.map((axe, index) => {
              const Icon = axe.icon;
              return (
                <motion.div
                  key={axe.id}
                  className="p-5 md:p-6 rounded-[1.5rem] bg-zinc-100/70 dark:bg-zinc-900/20 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15 transition-all flex flex-col justify-between"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-zinc-200/80 dark:bg-white/10 flex items-center justify-center text-zinc-800 dark:text-zinc-200 mb-4">
                      <Icon size={18} />
                    </div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-2 leading-snug">
                      {axe.title}
                    </h4>
                    <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                      {axe.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pt-2 border-t border-zinc-200/60 dark:border-white/5">
                    {axe.tag}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Articles Feed */}
        <div className="space-y-4 mb-14">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
            {t('veille.articlesTitle')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {articles.map((article, i) => (
              <motion.a 
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                key={i}
                className="group p-5 md:p-6 rounded-[1.5rem] bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15 transition-all flex flex-col justify-between shadow-sm dark:shadow-none"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + (i * 0.08) }}
                title="Consulter la ressource"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider px-2 py-0.5 bg-zinc-100 dark:bg-white/10 rounded-md">
                      {article.source}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">{article.date}</span>
                  </div>
                  <h4 className="text-sm md:text-base font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors leading-snug mb-3">
                    {article.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-white/5 mt-auto">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{article.tag}</span>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform text-zinc-900 dark:text-white">
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bouton Veille PDF (Blanc, épuré) */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a 
            href="/fichedeveille.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-zinc-900 font-semibold text-sm border border-zinc-200/90 shadow-md hover:bg-zinc-100 hover:shadow-lg transition-all group"
            title="Consulter la fiche de veille technologique (PDF)"
          >
            <FileText size={18} className="text-zinc-700 group-hover:text-zinc-900 transition-colors" />
            <span>{t('veille.downloadPdf')}</span>
          </a>
        </motion.div>
      </div>

      {/* Modal Lightbox pour la preuve de veille Feedly */}
      <AnimatePresence>
        {showScreenModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10"
          >
            <div 
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer" 
              onClick={() => setShowScreenModal(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10"
            >
              <div className="p-4 bg-zinc-950/80 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Preuve d'automatisation des flux (Feedly)</h3>
                  <p className="text-xs text-zinc-400">Agrégation continue des sources ANSSI, LeMagIT et alertes de cybersécurité</p>
                </div>
                <button 
                  onClick={() => setShowScreenModal(false)} 
                  className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-3 bg-zinc-950 flex items-center justify-center max-h-[75vh] overflow-auto">
                <img 
                  src="/screen veille.png" 
                  alt="Capture du flux de veille technologique Feedly" 
                  className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
