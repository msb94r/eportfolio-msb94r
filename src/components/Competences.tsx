import { motion } from 'motion/react';
import { Monitor, Network, Cloud, Lock, Wrench, User, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Competences() {
  const { t } = useLanguage();
  const skills = [
    {
      category: t('competences.sys'),
      icon: <Monitor size={32} strokeWidth={1.5} />,
      bullets: [
        t('competences.sys1'),
        t('competences.sys2'),
        t('competences.sys3'),
        t('competences.sys4'),
        t('competences.sys5')
      ],
      techs: 'Windows Server, AD, Debian, Ubuntu, Bash/PowerShell'
    },
    {
      category: t('competences.net'),
      icon: <Network size={32} strokeWidth={1.5} />,
      bullets: [
        t('competences.net1'),
        t('competences.net2'),
        t('competences.net3'),
        t('competences.net4'),
        t('competences.net5')
      ],
      techs: 'Cisco, Packet Tracer, pfSense, Wireshark, ntopNG'
    },
    {
      category: t('competences.cloud'),
      icon: <Cloud size={32} strokeWidth={1.5} />,
      bullets: [
        t('competences.cloud1'),
        t('competences.cloud2'),
        t('competences.cloud3')
      ],
      techs: 'Proxmox VE, VMware, VirtualBox, BackupManager'
    },
    {
      category: t('competences.sec'),
      icon: <Lock size={32} strokeWidth={1.5} />,
      bullets: [
        t('competences.sec1'),
        t('competences.sec2'),
        t('competences.sec3'),
        t('competences.sec4')
      ],
      techs: 'Snort, Suricata, GPG, gocryptfs, SSL/SSH'
    },
    {
      category: t('competences.tools'),
      icon: <Wrench size={32} strokeWidth={1.5} />,
      bullets: [
        t('competences.tools1'),
        t('competences.tools2'),
        t('competences.tools3'),
        t('competences.tools4')
      ],
      techs: 'GLPI, Zabbix, Nagios, Puppet, Ansible, KeePass'
    },
    {
      category: t('competences.proj'),
      icon: <User size={32} strokeWidth={1.5} />,
      bullets: [
        t('competences.proj1'),
        t('competences.proj2'),
        t('competences.proj3'),
        t('competences.proj4')
      ],
      techs: 'Cahier des charges, SLA, Schématisation (Draw.io / Visio)'
    }
  ];

  return (
    <section id="compétences" className="py-16 md:py-24 bg-zinc-100/50 dark:bg-zinc-900/20 border-y border-zinc-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-16 text-center md:text-left">{t('competences.title')}</h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {skills.map((skillGroup, index) => (
            <motion.div 
              key={index}
              className="p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none flex flex-col h-full hover:border-zinc-300 dark:hover:border-white/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center mb-4 md:mb-8 text-center">
                <div className="mb-2 md:mb-4 text-zinc-800 dark:text-zinc-200 scale-75 md:scale-100">
                  {skillGroup.icon}
                </div>
                <h3 className="text-xs md:text-lg font-bold tracking-widest text-zinc-900 dark:text-white uppercase">
                  {skillGroup.category}
                </h3>
              </div>
              
              <ul className="space-y-2 md:space-y-3 mb-4 md:mb-8 flex-grow">
                {skillGroup.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 md:gap-3 text-[10px] md:text-sm text-zinc-800 dark:text-zinc-400 leading-relaxed">
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-1 md:mt-1.5 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {skillGroup.techs && (
                <div className="mt-auto pt-4 md:pt-6 border-t border-zinc-100 dark:border-white/5 text-center">
                  <span className="text-[10px] md:text-sm font-semibold text-zinc-800 dark:text-zinc-300">
                    {skillGroup.techs}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bouton Tableau de synthèse (PDF uniquement) */}
        <motion.div 
          id="tableau-synthese"
          className="mt-16 flex items-center justify-center scroll-mt-32"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a 
            href="/assets/aistudio/tableausyntheseori_bedd6460.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-zinc-900/20 dark:shadow-white/10"
          >
            <FileText size={18} />
            {t('competences.pdf')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
