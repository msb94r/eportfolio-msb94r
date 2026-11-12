import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const links = [
    { name: t('nav.profil'), href: '#profil' },
    { name: t('nav.filiere'), href: '#filière' },
    { name: t('nav.parcours'), href: '#parcours' },
    { name: t('nav.certifications'), href: '#certifications' },
    { name: t('nav.competences'), href: '#compétences' },
    { name: t('nav.protocoles'), href: '#protocoles' },
    { name: t('nav.projets'), href: '#projets' },
    { name: t('nav.veille'), href: '#veille' },
    { name: 'CyberLab', href: '#soft-skills' },
    { name: t('nav.synthese'), href: '#tableau-synthese' },
    { name: t('nav.contact'), href: '#contact' }
  ];

  return (
    <>
      <div className="fixed top-0 w-full z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
        <nav className={`pointer-events-auto transition-all duration-500 rounded-full border flex items-center justify-between lg:justify-center gap-4 lg:gap-6 w-full lg:w-auto ${scrolled ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-zinc-200 dark:border-white/10 shadow-2xl py-3 px-4 lg:px-6' : 'bg-white/50 dark:bg-zinc-950/50 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-zinc-200 dark:border-transparent py-3 px-4 lg:px-6'}`}>
          <div className="lg:hidden text-zinc-900 dark:text-zinc-100 text-sm font-bold pl-2">
            MB.
          </div>
          
          <ul className="hidden lg:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm font-medium text-zinc-800 dark:text-zinc-300">
            {links.map(link => (
              <li key={link.name}>
                <a href={link.href} className="hover:text-black dark:hover:text-white transition-colors whitespace-nowrap">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={16} />
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-zinc-950 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-white/10">
              <span className="text-zinc-900 dark:text-zinc-100 font-bold text-lg">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-8 px-6">
              <ul className="flex flex-col gap-6">
                {links.map((link, i) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <a 
                      href={link.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-medium text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors block"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 border-t border-zinc-200 dark:border-white/10">
              <p className="text-sm text-zinc-500 dark:text-zinc-500 text-center">
                © {new Date().getFullYear()} Muslim Bayschanov
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
