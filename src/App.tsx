import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Filiere from './components/Filiere';
import Parcours from './components/Parcours';
import Certifications from './components/Certifications';
import Competences from './components/Competences';
import Protocoles from './components/Protocoles';
import Projets from './components/Projets';
import Veille from './components/Veille';
import SoftSkills from './components/SoftSkills';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t } = useLanguage();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-black/10 dark:selection:bg-white/20 transition-colors duration-500">
      <Navbar />
      
      <main>
        <Hero />
        <Filiere />
        <Parcours />
        <Certifications />
        <Competences />
        <Protocoles />
        <Projets />
        <Veille />
        <SoftSkills />
        <Contact />
      </main>

      <footer className="py-12 text-center text-zinc-400 text-sm border-t border-white/10 transition-colors duration-500">
        <p>© {new Date().getFullYear()} Muslim Bayschanov. {t('footer.rights')}</p>
      </footer>

      <Chatbot />
    </div>
  );
}
