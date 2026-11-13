import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Image as ImageIcon, FileText, ExternalLink } from 'lucide-react';

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
      url: 'https://msb94r.github.io/chickenpoint/',
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
      url: 'https://msb94r.github.io/eportfolio.msb94r/',
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
      url: 'https://msb94r.github.io/ritualsdumonde/',
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
      url: 'https://msb94r.github.io/shoptonauto/',
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
    },
    // Nouveaux Projets à la suite de Shop Ton Auto
    {
      title: 'Infrastructure Active Directory & WDS',
      desc: 'Mise en place d\'une infrastructure Windows Server 2022 avec contrôleur de domaine Active Directory, stratégies de groupe (GPO), serveur DHCP/DNS et automatisation du déploiement de postes clients via WDS.',
      tags: ['Windows Server', 'Active Directory', 'GPO', 'WDS'],
      year: '2026',
      url: 'https://github.com/msb94r/infrastructure-activedirectory',
      images: [
        '/projets/activedirectory.svg'
      ],
      documents: {
        charges: '#',
        recettes: '#',
        tests: '#',
        gantt: '#'
      }
    },
    {
      title: 'Supervision GLPI & Zabbix',
      desc: 'Déploiement d\'une solution complète d\'inventaire automatisé avec OCS Inventory, gestion centralisée des tickets d\'incidents sous GLPI, et monitoring des équipements réseaux et serveurs avec Zabbix.',
      tags: ['GLPI', 'Zabbix', 'OCS Inventory', 'Linux'],
      year: '2026',
      url: 'https://github.com/msb94r/supervision-glpi-zabbix',
      images: [
        '/projets/supervision.svg'
      ],
      documents: {
        charges: '#',
        recettes: '#',
        tests: '#',
        gantt: '#'
      }
    },
    {
      title: 'Sécurisation Réseau & Pare-feu pfSense',
      desc: 'Conception d\'une architecture réseau sécurisée multi-zones avec pare-feu pfSense, segmentation inter-VLANs, règles de filtrage avancées, portail captif et tunnel VPN d\'entreprise.',
      tags: ['pfSense', 'Cisco', 'VLAN', 'VPN'],
      year: '2026',
      url: 'https://github.com/msb94r/securisation-pfsense-vpn',
      images: [
        '/projets/pfsense.svg'
      ],
      documents: {
        charges: '#',
        recettes: '#',
        tests: '#',
        gantt: '#'
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              className="group cursor-pointer flex flex-col bg-zinc-100/60 dark:bg-zinc-900/40 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              onClick={() => setActiveIndex(index)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl md:rounded-2xl mb-3 md:mb-5 bg-zinc-200 dark:bg-zinc-800 relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-colors z-10" />
                <img 
                  src={project.images[0]} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                {project.images.length > 1 && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20 bg-black/60 backdrop-blur-md px-1.5 py-0.5 md:px-2 md:py-1 rounded-md flex items-center gap-1 text-white text-[10px] md:text-xs font-medium">
                    <ImageIcon size={10} className="md:w-3 md:h-3" />
                    {project.images.length}
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5 md:mb-2">
                    {/* Clickable Title directly linking to the project */}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-base md:text-lg font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors flex items-center gap-1.5 hover:underline"
                      title={`Visiter ${project.title} (nouvel onglet)`}
                    >
                      <span>{project.title}</span>
                    </a>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      title={`Ouvrir le site de ${project.title}`}
                    >
                      <ArrowUpRight size={16} className="md:w-4 md:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm mb-4 leading-relaxed line-clamp-2">{project.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-200/80 dark:border-white/10 mt-auto">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-white/5 text-[9px] md:text-[10px] font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-white/5 text-[9px] md:text-[10px] font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
                        +{project.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">{project.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rapports de stage BTS SIO (2 boutons blancs) */}
        <motion.div 
          className="mt-16 pt-10 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="/assets/aistudio/Rapport_de_Stage_BTS_SIO_SISR_-_E.Leclerc_0446e07b.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-zinc-900 font-semibold text-sm border border-zinc-200/90 shadow-sm hover:bg-zinc-100 hover:shadow-md transition-all group"
            title="Consulter le rapport de stage de 1ère année"
          >
            <FileText size={17} className="text-zinc-600 group-hover:text-zinc-900 transition-colors" />
            <span>Rapport de stage 1ère année</span>
          </a>

          <a
            href="/rapport-stage-2eme-annee.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-zinc-900 font-semibold text-sm border border-zinc-200/90 shadow-sm hover:bg-zinc-100 hover:shadow-md transition-all group"
            title="Consulter le rapport de stage de 2ème année"
          >
            <FileText size={17} className="text-zinc-600 group-hover:text-zinc-900 transition-colors" />
            <span>Rapport de stage 2ème année</span>
          </a>
        </motion.div>
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
              className="absolute inset-0 bg-zinc-900/80 dark:bg-black/85 backdrop-blur-sm cursor-pointer" 
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
                title="Fermer"
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
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
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between relative overflow-y-auto">
                <div>
                  <div className="mb-6">
                    {/* Clickable Title that redirects to the project's site */}
                    <a 
                      href={projects[activeIndex].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-2.5 text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mb-2"
                      title={`Visiter le site de ${projects[activeIndex].title} (s'ouvre dans un nouvel onglet)`}
                    >
                      <span>{projects[activeIndex].title}</span>
                      <ExternalLink size={20} className="text-zinc-400 group-hover/link:text-zinc-900 dark:group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                    </a>

                    {/* Direct live website button */}
                    <div className="mb-4">
                      <a 
                        href={projects[activeIndex].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors"
                      >
                        <ExternalLink size={13} />
                        <span>Visiter le site du projet</span>
                      </a>
                    </div>

                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base">{projects[activeIndex].desc}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {projects[activeIndex].tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-zinc-100 dark:bg-white/5 text-zinc-800 dark:text-zinc-300 text-xs font-semibold uppercase tracking-wider rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Project Documents Buttons: Systematic for all projects */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <a 
                      href={projects[activeIndex].documents?.charges || '#'} 
                      target={projects[activeIndex].documents?.charges && projects[activeIndex].documents.charges !== '#' ? '_blank' : undefined} 
                      rel="noopener noreferrer" 
                      onClick={(e) => {
                        if (!projects[activeIndex].documents?.charges || projects[activeIndex].documents.charges === '#') {
                          e.preventDefault();
                        }
                      }}
                      className="flex-1 min-w-[130px] px-3 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
                      title="Cahier des charges"
                    >
                      <FileText size={14} />
                      <span>Cahier des charges</span>
                    </a>

                    <a 
                      href={projects[activeIndex].documents?.recettes || '#'} 
                      target={projects[activeIndex].documents?.recettes && projects[activeIndex].documents.recettes !== '#' ? '_blank' : undefined} 
                      rel="noopener noreferrer" 
                      onClick={(e) => {
                        if (!projects[activeIndex].documents?.recettes || projects[activeIndex].documents.recettes === '#') {
                          e.preventDefault();
                        }
                      }}
                      className="flex-1 min-w-[130px] px-3 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
                      title="Cahier des recettes"
                    >
                      <FileText size={14} />
                      <span>Cahier des recettes</span>
                    </a>

                    <a 
                      href={projects[activeIndex].documents?.tests || '#'} 
                      target={projects[activeIndex].documents?.tests && projects[activeIndex].documents.tests !== '#' ? '_blank' : undefined} 
                      rel="noopener noreferrer" 
                      onClick={(e) => {
                        if (!projects[activeIndex].documents?.tests || projects[activeIndex].documents.tests === '#') {
                          e.preventDefault();
                        }
                      }}
                      className="flex-1 min-w-[130px] px-3 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
                      title="Cahier des tests"
                    >
                      <FileText size={14} />
                      <span>Cahier des tests</span>
                    </a>

                    <a 
                      href={projects[activeIndex].documents?.gantt || '#'} 
                      target={projects[activeIndex].documents?.gantt && projects[activeIndex].documents.gantt !== '#' ? '_blank' : undefined} 
                      rel="noopener noreferrer" 
                      onClick={(e) => {
                        if (!projects[activeIndex].documents?.gantt || projects[activeIndex].documents.gantt === '#') {
                          e.preventDefault();
                        }
                      }}
                      className="flex-1 min-w-[130px] px-3 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
                      title="Diagramme de Gantt"
                    >
                      <FileText size={14} />
                      <span>Diagramme de Gantt</span>
                    </a>
                  </div>
                </div>

                {/* Project Modal Footer Navigation */}
                <div className="pt-6 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between mt-auto">
                  <span className="text-zinc-500 font-medium text-sm">Année {projects[activeIndex].year}</span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={prevProject} 
                      className="p-3 rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group"
                      title="Projet précédent"
                    >
                      <ChevronLeft size={20} className="text-zinc-900 dark:text-white group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button 
                      onClick={nextProject} 
                      className="p-3 rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group"
                      title="Projet suivant"
                    >
                      <ChevronRight size={20} className="text-zinc-900 dark:text-white group-hover:translate-x-0.5 transition-transform" />
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
