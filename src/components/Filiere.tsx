import { motion } from 'motion/react';
import { 
  Server, 
  Code, 
  CheckCircle2, 
  Terminal, 
  Clock, 
  Briefcase, 
  Award,
  Layers,
  ShieldCheck,
  Network
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Filiere() {
  const { t } = useLanguage();

  const sisrSkills = [
    'Windows Server & Active Directory',
    'Réseaux Cisco & VLANs',
    'Pare-feu pfSense & Routage',
    'Virtualisation Proxmox & VMware',
    'Supervision GLPI & Zabbix'
  ];

  const slamSkills = [
    'Développement Web & Mobile',
    'Bases de données SQL',
    'Architecture logicielle MVC & POO',
    'Cycle de vie & Versioning Git'
  ];

  return (
    <section id="filière" className="py-16 md:py-20 bg-zinc-100/50 dark:bg-zinc-950/40 border-y border-zinc-200 dark:border-white/5 transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* En-tête épuré */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200/80 dark:bg-white/5 border border-zinc-300/80 dark:border-white/10 text-xs font-semibold tracking-wider text-zinc-800 dark:text-zinc-300 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
            {t('filiere.badge')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
            {t('filiere.title')}
          </h2>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {t('filiere.desc')}
          </p>
        </motion.div>

        {/* Grille des 2 options Bento épurée */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* CARTE OPTION SISR - Spécialisation choisie */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-white/15 p-6 md:p-7 shadow-sm dark:shadow-none relative overflow-hidden flex flex-col justify-between group"
          >
            <Server 
              size={180} 
              className="absolute -bottom-8 -right-8 text-zinc-900/[0.03] dark:text-white/[0.03] pointer-events-none transition-transform duration-500 group-hover:scale-105" 
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold tracking-wide uppercase">
                  <CheckCircle2 size={13} className="text-white dark:text-zinc-950" />
                  {t('filiere.myChoice')}
                </div>
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10">
                  <Server size={18} />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                {t('filiere.sisrTitle')}
              </h3>
              <p className="text-xs md:text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                {t('filiere.sisrSubtitle')}
              </p>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
                {t('filiere.sisrDesc')}
              </p>

              {/* Badges de compétences clés SISR */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {sisrSkills.map((skill) => (
                  <span 
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/5 text-zinc-800 dark:text-zinc-200 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Métiers visés */}
            <div className="relative z-10 pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">Métiers visés :</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-right">
                Admin Systèmes & Réseaux · Tech Support N2/N3
              </span>
            </div>
          </motion.div>

          {/* CARTE OPTION SLAM - Parcours complémentaire */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 p-6 md:p-7 relative overflow-hidden flex flex-col justify-between group hover:border-zinc-300 dark:hover:border-white/10 transition-colors"
          >
            <Code 
              size={180} 
              className="absolute -bottom-8 -right-8 text-zinc-900/[0.02] dark:text-white/[0.02] pointer-events-none transition-transform duration-500 group-hover:scale-105" 
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200/70 dark:bg-white/5 border border-zinc-300/60 dark:border-white/5 text-zinc-700 dark:text-zinc-400 text-xs font-semibold tracking-wide uppercase">
                  <Terminal size={12} />
                  {t('filiere.complementary')}
                </div>
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">
                  <Code size={18} />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                {t('filiere.slamTitle')}
              </h3>
              <p className="text-xs md:text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-3">
                {t('filiere.slamSubtitle')}
              </p>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
                {t('filiere.slamDesc')}
              </p>

              {/* Badges de compétences clés SLAM */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {slamSkills.map((skill) => (
                  <span 
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 border border-zinc-200/70 dark:border-white/5 text-zinc-700 dark:text-zinc-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Métiers visés */}
            <div className="relative z-10 pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">Métiers visés :</span>
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold text-right">
                Développeur Web & Mobile · Concepteur Logiciel
              </span>
            </div>
          </motion.div>

        </div>

        {/* 3 Cartes métriques épurées */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
        >
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-900 dark:text-white shrink-0 border border-zinc-200/80 dark:border-white/5">
              <Clock size={16} />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-white">
                {t('filiere.stat1Value')}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {t('filiere.stat1Title')}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-900 dark:text-white shrink-0 border border-zinc-200/80 dark:border-white/5">
              <Briefcase size={16} />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-white">
                {t('filiere.stat2Value')}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {t('filiere.stat2Title')}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-900 dark:text-white shrink-0 border border-zinc-200/80 dark:border-white/5">
              <Award size={16} />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-white">
                {t('filiere.stat3Value')}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {t('filiere.stat3Title')}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
