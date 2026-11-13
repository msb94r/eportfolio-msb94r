import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  ShieldCheck, 
  Server, 
  Globe, 
  Search, 
  X, 
  Layers, 
  Hash, 
  FileText, 
  CheckCircle,
  Cpu,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import { PROTOCOLS_DATA, type Protocol } from '../data/protocolsData';

export default function Protocoles() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'routing' | 'security' | 'infra' | 'transport'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProtocol, setActiveModalProtocol] = useState<Protocol | null>(null);

  // Filtrage combiné par catégorie et recherche textuelle
  const filteredProtocols = useMemo(() => {
    return PROTOCOLS_DATA.filter(proto => {
      const matchesCategory = selectedCategory === 'all' || proto.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        proto.name.toLowerCase().includes(q) ||
        proto.fullName.toLowerCase().includes(q) ||
        proto.port.toLowerCase().includes(q) ||
        proto.shortDesc.toLowerCase().includes(q) ||
        proto.practicalRole.toLowerCase().includes(q) ||
        proto.layer.toLowerCase().includes(q)
      );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'Tous', count: PROTOCOLS_DATA.length },
    { id: 'routing', label: 'Réseau & Routage', count: PROTOCOLS_DATA.filter(p => p.category === 'routing').length },
    { id: 'security', label: 'Sécurité & Chiffrement', count: PROTOCOLS_DATA.filter(p => p.category === 'security').length },
    { id: 'infra', label: 'Services & Annuaire', count: PROTOCOLS_DATA.filter(p => p.category === 'infra').length },
    { id: 'transport', label: 'Transport & Web', count: PROTOCOLS_DATA.filter(p => p.category === 'transport').length }
  ];

  return (
    <section id="protocoles" className="py-20 md:py-28 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/5 transition-colors duration-500 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-semibold tracking-wider text-zinc-800 dark:text-zinc-300 uppercase mb-3">
              <Network size={13} className="text-zinc-900 dark:text-white" />
              <span>Référentiel Réseaux & Systèmes</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
              Protocoles Informatiques
            </h2>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Cartographie des protocoles fondamentaux maîtrisés et mis en application en administration systèmes, segmentation réseau et sécurisation des flux.
            </p>
          </motion.div>

          {/* Compteur interactif */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 shrink-0"
          >
            <div className="text-right">
              <div className="text-xl font-bold text-zinc-900 dark:text-white">
                {filteredProtocols.length} / {PROTOCOLS_DATA.length}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                Protocoles listés
              </div>
            </div>
          </motion.div>
        </div>

        {/* Barre de recherche et Filtres par catégorie */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          
          {/* Onglets Catégories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    active 
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' 
                      : 'bg-zinc-100 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:border-zinc-300 dark:hover:border-white/10'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active 
                      ? 'bg-white/20 dark:bg-zinc-950/20 text-white dark:text-zinc-950 font-bold' 
                      : 'bg-zinc-200 dark:bg-white/5 text-zinc-500 dark:text-zinc-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Champ de recherche */}
          <div className="relative min-w-[260px] lg:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher (ex: 22, DNS, Cisco...)"
              className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-white/30 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

        </div>

        {/* Grille Bento des cartes de protocoles */}
        {filteredProtocols.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProtocols.map((proto, index) => (
              <motion.div
                key={proto.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
                onClick={() => setActiveModalProtocol(proto)}
                className="group p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/90 dark:border-white/5 hover:border-zinc-400 dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-lg dark:hover:shadow-2xl"
              >
                <div>
                  {/* Ligne 1 : Nom & Acronyme */}
                  <div className="mb-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white font-mono group-hover:text-black dark:group-hover:text-white transition-colors">
                        {proto.name}
                      </span>
                      {proto.rfc && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-white/5 text-zinc-600 dark:text-zinc-400">
                          {proto.rfc}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      {proto.fullName}
                    </p>
                  </div>

                  {/* Résumé court */}
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                    {proto.shortDesc}
                  </p>
                </div>

                {/* Bas de carte : Couche OSI & Appel à l'action */}
                <div className="pt-3 border-t border-zinc-200/60 dark:border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 group-hover:bg-zinc-900 dark:group-hover:bg-white transition-colors" />
                    {proto.layer}
                  </span>
                  
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold group-hover:text-zinc-950 dark:group-hover:text-white flex items-center gap-1 transition-colors">
                    Détails <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5">
            <Search size={32} className="mx-auto text-zinc-400 mb-3" />
            <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              Aucun protocole ne correspond à votre recherche
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Essayez avec un autre mot-clé (ex: "routage", "22", "ssh", "ipsec")
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Modal de détail technique du protocole */}
        <AnimatePresence>
          {activeModalProtocol && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden"
              >
                {/* Bouton fermeture */}
                <button
                  onClick={() => setActiveModalProtocol(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>

                {/* En-tête du modal */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl md:text-3xl font-black font-mono text-zinc-900 dark:text-white">
                      {activeModalProtocol.name}
                    </span>
                    {activeModalProtocol.rfc && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-semibold">
                        {activeModalProtocol.rfc}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {activeModalProtocol.fullName}
                  </p>
                </div>

                {/* Grille des caractéristiques */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-white/5">
                    <div className="text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold mb-1">
                      Port / Transport
                    </div>
                    <div className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      {activeModalProtocol.port}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-white/5">
                    <div className="text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold mb-1">
                      Couche Réseau
                    </div>
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {activeModalProtocol.layer}
                    </div>
                  </div>
                </div>

                {/* Contenu détaillé */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                      Définition & Rôle
                    </h4>
                    <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {activeModalProtocol.shortDesc}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/30 border border-zinc-200/80 dark:border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-zinc-900 dark:text-zinc-100" />
                      Mise en pratique en BTS SIO (SISR)
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {activeModalProtocol.practicalRole}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/30 border border-zinc-200/80 dark:border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-zinc-900 dark:text-zinc-100" />
                      Sécurisation & Durcissement
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {activeModalProtocol.securityNote}
                    </p>
                  </div>
                </div>

                {/* Actions du modal : Bouton PDF du protocole et Bouton Fermer */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-zinc-200 dark:border-white/10">
                  <a
                    href={`/protocoles/${activeModalProtocol.id}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-bold transition-all shadow-sm"
                  >
                    <FileText size={15} />
                    <span>Consulter la fiche PDF du protocole</span>
                    <ExternalLink size={13} className="opacity-70" />
                  </a>

                  <button
                    onClick={() => setActiveModalProtocol(null)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors text-center"
                  >
                    Fermer la fiche
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
