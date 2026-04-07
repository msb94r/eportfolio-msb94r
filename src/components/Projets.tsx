import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Image as ImageIcon, FileText } from 'lucide-react';

export default function Projets() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Prevent scrolling when modal is open and reset image index
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
      setActiveImageIndex(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeIndex]);

  const projects = [
    {
      title: 'Chicken Point',
      desc: 'Vitrine web pour un restaurant rapide. Interface claire et présentation des menus. Ce projet m\'a permis de mettre en pratique mes compétences en intégration web et en design d\'interface utilisateur.',
      tags: ['HTML', 'CSS', 'JS'],
      year: '2025',
      images: [
        '/chickenpoint/chickenpoint1.png',
        '/chickenpoint/chickenpoint2.png',
        '/chickenpoint/chickenpoint3.png',
        '/chickenpoint/chickenpoint4.png',
        '/chickenpoint/chickenpoint5.png',
        '/chickenpoint/chickenpoint6.png',
        '/chickenpoint/chickenpoint7.png',
        '/chickenpoint/chickenpoint8.png',
        '/chickenpoint/chickenpoint9.png',
        '/chickenpoint/chickenpoint10.png'
      ],
      documents: {
        charges: '/chickenpoint/cahierdeschargeschickenpoint.pdf',
        recettes: '/chickenpoint/cahierderecettechickenpoint.pdf',
        tests: '/chickenpoint/cachierdetestchickenpoint.pdf',
        gantt: '/chickenpoint/chickenpointgants.png'
      }
    },
    {
      title: 'E-Portfolio',
      desc: 'Développement d\'une vitrine web pour un eportfolio personnel. Design minimaliste, mode sombre/clair, et animations fluides. Conçu pour mettre en valeur mes compétences et mon parcours de manière élégante.',
      tags: ['React', 'Tailwind', 'Vite'],
      year: '2026',
      images: [
        '/eportfolio/eportfolio.png',

      ],
      documents: {
        charges: '#',
        recettes: '#',
        tests: '#',
        gantt: '#'
      }
    },
    {
      title: 'Rituals Du Monde',
      desc: 'Plateforme web complète pour le spa Rituals du Monde. Interface claire intégrant un système de réservation pour les massages et événements, une boutique en ligne, ainsi qu\'un chatbot d\'assistance. Ce projet m\'a permis de mettre en pratique mes compétences en intégration web, en design d\'interface utilisateur et en développement de fonctionnalités interactives.',
      tags: ['HTML', 'CSS', 'JS'],
      year: '2026',
      images: [
        '/ritualsdumonde/ritualsdumonde1.png',
        '/ritualsdumonde/ritualsdumonde2.png',
        '/ritualsdumonde/ritualsdumonde3.png',
        '/ritualsdumonde/ritualsdumonde4.png',
        '/ritualsdumonde/ritualsdumonde5.png',
        '/ritualsdumonde/ritualsdumonde6.png',
        '/ritualsdumonde/ritualsdumonde7.png',
        '/ritualsdumonde/ritualsdumonde8.png',
        '/ritualsdumonde/ritualsdumonde9.png',
        '/ritualsdumonde/ritualsdumonde10.png',
        '/ritualsdumonde/ritualsdumonde11.png',
        '/ritualsdumonde/ritualsdumonde12.png',
        '/ritualsdumonde/ritualsdumonde13.png',
        '/ritualsdumonde/ritualsdumonde14.png',
        '/ritualsdumonde/ritualsdumonde15.png',
        '/ritualsdumonde/ritualsdumonde16.png'

      ],
      documents: {
        charges: '/ritualsdumonde/cachierdeschargesritualsdumonde.pdf',
        recettes: '/ritualsdumonde/cahierderecetteritualtsdumonde.pdf',
        tests: '/ritualsdumonde/cahierdetestritualsdumonde.pdf',
        gantt: '/ritualsdumonde/ritualsdumondegants.png'
      }
    },
    {
      title: 'Shop Ton Auto',
      desc: 'Vitrine web pour la concession Shop ton auto, spécialisée dans l\'achat et la vente de véhicules. Interface claire et présentation détaillée du parc automobile. Ce projet m\'a permis de mettre en pratique mes compétences en intégration web et en design d\'interface utilisateur.',
      tags: ['HTML', 'CSS', 'JS'],
      year: '2026',
      images: [
        '/shoptonauto/shoptonauto1.png',
        '/shoptonauto/shoptonauto2.png',
        '/shoptonauto/shoptonauto3.png',
        '/shoptonauto/shoptonauto4.png',
        '/shoptonauto/shoptonauto5.png',
        '/shoptonauto/shoptonauto6.png',
        '/shoptonauto/shoptonauto7.png',
        '/shoptonauto/shoptonauto8.png',
        '/shoptonauto/shoptonauto9.png'

      ],
      documents: {
        charges: '/shoptonauto/cachierdeschargesshoptonauto.pdf',
        recettes: '/shoptonauto/cahierderecetteshoptonauto.pdf',
        tests: '/shoptonauto/cahierdetestshoptonauto.pdf',
        gantt: '/shoptonauto/shoptonautogants.png'
      }
    }
  ];

  const nextProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => prev === null ? null : (prev + 1) % projects.length);
  };

  const prevProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => prev === null ? null : (prev - 1 + projects.length) % projects.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex === null) return;
    setActiveImageIndex((prev) => (prev + 1) % projects[activeIndex].images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex === null) return;
    setActiveImageIndex((prev) => (prev - 1 + projects[activeIndex].images.length) % projects[activeIndex].images.length);
  };

  return (
    <section id="projets" className="py-16 md:py-24 bg-zinc-100/50 dark:bg-zinc-900/20 border-y border-zinc-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-16">Projets</h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              className="group cursor-pointer flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveIndex(index)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl md:rounded-2xl mb-3 md:mb-6 bg-zinc-200 dark:bg-zinc-800 relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-colors z-10" />
                <img 
                  src={project.images[0]} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                {project.images.length > 1 && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20 bg-black/50 backdrop-blur-md px-1.5 py-0.5 md:px-2 md:py-1 rounded-md flex items-center gap-1 text-white text-[10px] md:text-xs font-medium">
                    <ImageIcon size={10} className="md:w-3 md:h-3" />
                    {project.images.length}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <h3 className="text-sm md:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors flex items-center gap-1 md:gap-2">
                    {project.title}
                  </h3>
                  <ArrowUpRight size={16} className="text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 md:w-5 md:h-5" />
                </div>
                <p className="text-zinc-800 dark:text-zinc-400 text-[10px] md:text-sm mb-3 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">{project.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 md:pt-4 border-t border-zinc-200 dark:border-white/10">
                <div className="flex gap-1 md:gap-2">
                  {project.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[8px] md:text-[10px] font-bold text-zinc-700 dark:text-zinc-500 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 2 && (
                    <span className="text-[8px] md:text-[10px] font-bold text-zinc-700 dark:text-zinc-500 uppercase tracking-wider">
                      +{project.tags.length - 2}
                    </span>
                  )}
                </div>
                <span className="text-zinc-600 dark:text-zinc-400 text-[10px] md:text-sm font-medium">{project.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal Slider */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12"
          >
            <div 
              className="absolute inset-0 bg-zinc-900/80 dark:bg-black/80 backdrop-blur-sm cursor-pointer" 
              onClick={() => setActiveIndex(null)} 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10 flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setActiveIndex(null)} 
                className="absolute top-4 right-4 z-30 p-2 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} className="text-zinc-900 dark:text-white" />
              </button>

              {/* Image Area with its own slider */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-zinc-100 dark:bg-zinc-900 group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImageIndex}
                    src={projects[activeIndex].images[activeImageIndex]} 
                    alt={`${projects[activeIndex].title} - Image ${activeImageIndex + 1}`} 
                    className="w-full h-full object-contain absolute inset-0 p-4 md:p-8" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Inner Image Navigation */}
                {projects[activeIndex].images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <ChevronRight size={20} />
                    </button>
                    
                    {/* Image Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                      {projects[activeIndex].images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === activeImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Content Area */}
              <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center relative overflow-y-auto">
                <div className="mb-8">
                  <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">{projects[activeIndex].title}</h3>
                  <p className="text-zinc-800 dark:text-zinc-400 leading-relaxed text-lg">{projects[activeIndex].desc}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {projects[activeIndex].tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-zinc-100 dark:bg-white/5 text-zinc-800 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Project Documents Buttons */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {projects[activeIndex].documents?.charges && (
                    <a href={projects[activeIndex].documents.charges} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[140px] px-3 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center shadow-sm flex items-center justify-center gap-2">
                      <FileText size={14} />
                      Cahier des charges
                    </a>
                  )}
                  {projects[activeIndex].documents?.recettes && (
                    <a href={projects[activeIndex].documents.recettes} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[140px] px-3 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center shadow-sm flex items-center justify-center gap-2">
                      <FileText size={14} />
                      Cahier des recettes
                    </a>
                  )}
                  {projects[activeIndex].documents?.tests && (
                    <a href={projects[activeIndex].documents.tests} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[140px] px-3 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center shadow-sm flex items-center justify-center gap-2">
                      <FileText size={14} />
                      Cahier des tests
                    </a>
                  )}
                  {projects[activeIndex].documents?.gantt && (
                    <a href={projects[activeIndex].documents.gantt} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[140px] px-3 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center shadow-sm flex items-center justify-center gap-2">
                      <FileText size={14} />
                      Diagramme de Gantt
                    </a>
                  )}
                </div>

                {/* Project Navigation */}
                <div className="mt-auto flex items-center justify-between pt-8 border-t border-zinc-200 dark:border-white/10">
                  <span className="text-zinc-700 dark:text-zinc-500 font-medium text-lg">{projects[activeIndex].year}</span>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={prevProject} 
                      className="p-4 rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group"
                      title="Projet précédent"
                    >
                      <ChevronLeft size={24} className="text-zinc-900 dark:text-white group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={nextProject} 
                      className="p-4 rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group"
                      title="Projet suivant"
                    >
                      <ChevronRight size={24} className="text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
