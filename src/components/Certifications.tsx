import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Certifications() {
  const { t } = useLanguage();
  const certs = [
    { title: 'Packet Tracer', org: 'Cisco Networking Academy', date: '2024', link: 'https://www.credly.com/badges/69b6ffc9-da56-4f81-a7fc-1c4cb7db3dd4' },
    { title: 'Bases Réseaux', org: 'Cisco Networking Academy', date: '2024', link: 'https://www.credly.com/badges/e683abb2-29de-404f-9384-ba3ec3d9a6f9' },
    { title: 'Cybersécurité', org: 'Cisco Networking Academy', date: '2024', link: 'https://www.credly.com/badges/cf9111e8-3eb7-4b90-a7d5-dcad1aa5b2d3' }
  ];

  return (
    <section id="certifications" className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-16">{t('certifications.title')}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {certs.map((cert, index) => (
            <motion.a 
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 hover:bg-zinc-200 dark:hover:bg-zinc-900/50 transition-colors flex flex-col justify-between h-full cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-6 md:mb-10">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" 
                  alt="Cisco Logo" 
                  className="h-6 md:h-12 object-contain grayscale opacity-80 dark:invert dark:brightness-200"
                />
              </div>
              <div>
                <h3 className="text-sm md:text-xl font-bold text-zinc-900 dark:text-white mb-2 md:mb-3">{cert.title}</h3>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-0">
                  <p className="text-zinc-700 dark:text-zinc-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{cert.org}</p>
                  <span className="text-zinc-600 dark:text-zinc-400 text-[10px] md:text-sm font-medium">{cert.date}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
