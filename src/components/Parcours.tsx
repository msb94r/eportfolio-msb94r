import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type FilterType = 'all' | 'experience' | 'education';

export default function Parcours() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const items = [
    // 1. Stage 2ème année - Nov. 2026 — Janv. 2027
    {
      id: 'stage2',
      category: 'experience' as FilterType,
      badge: t('parcours.badgeStage'),
      badgeType: 'stage',
      icon: Briefcase,
      period: t('parcours.stage2Period'),
      title: t('parcours.stage2Title'),
      location: t('parcours.stage2Loc'),
      desc: t('parcours.stage2Desc'),
      tags: [
        t('parcours.stage2Tag1'),
        t('parcours.stage2Tag2'),
        t('parcours.stage2Tag3'),
      ],
      spanAll: 'md:col-span-1',
      spanExp: 'md:col-span-1',
      spanEdu: '',
    },
    // 2. Stage 1ère année - Mai — Juil. 2026 (E.Leclerc Vitry-sur-Seine)
    {
      id: 'stage1',
      category: 'experience' as FilterType,
      badge: t('parcours.badgeStage'),
      badgeType: 'stage',
      icon: Briefcase,
      period: t('parcours.stage1Period'),
      title: t('parcours.stage1Title'),
      location: t('parcours.stage1Loc'),
      desc: t('parcours.stage1Desc'),
      tags: [
        t('parcours.stage1Tag1'),
        t('parcours.stage1Tag2'),
        t('parcours.stage1Tag3'),
      ],
      spanAll: 'md:col-span-2',
      spanExp: 'md:col-span-2',
      spanEdu: '',
    },
    // 3. Formation BTS SIO SISR
    {
      id: 'bts',
      category: 'education' as FilterType,
      badge: t('parcours.badgeEdu'),
      badgeType: 'education',
      icon: GraduationCap,
      period: t('parcours.btsPeriod'),
      title: t('parcours.btsTitle'),
      location: t('parcours.btsLoc'),
      desc: t('parcours.btsDesc'),
      tags: [
        t('parcours.btsTag1'),
        t('parcours.btsTag2'),
        t('parcours.btsTag3'),
      ],
      spanAll: 'md:col-span-2',
      spanExp: '',
      spanEdu: 'md:col-span-2',
    },
    // 4. Job étudiant - E.Leclerc
    {
      id: 'job',
      category: 'experience' as FilterType,
      badge: t('parcours.badgeJob'),
      badgeType: 'job',
      icon: Briefcase,
      period: t('parcours.jobPeriod'),
      title: t('parcours.jobTitle'),
      location: t('parcours.jobLoc'),
      desc: t('parcours.jobDesc'),
      tags: [
        t('parcours.jobTag1'),
        t('parcours.jobTag2'),
      ],
      spanAll: 'md:col-span-1',
      spanExp: 'md:col-span-3',
      spanEdu: '',
    },
    // 5. Bac STMG
    {
      id: 'bac',
      category: 'education' as FilterType,
      badge: t('parcours.badgeDiploma'),
      badgeType: 'diploma',
      icon: GraduationCap,
      period: t('parcours.bacPeriod'),
      title: t('parcours.bacTitle'),
      location: t('parcours.bacLoc'),
      desc: t('parcours.bacDesc'),
      tags: [
        t('parcours.bacSpec'),
      ],
      spanAll: 'md:col-span-3',
      spanExp: '',
      spanEdu: 'md:col-span-1',
    },
  ];

  const filteredItems = items.filter(
    (item) => activeFilter === 'all' || item.category === activeFilter
  );

  const getBadgeStyle = (badgeType: string) => {
    switch (badgeType) {
      case 'stage':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'job':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'education':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
      case 'diploma':
      default:
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    }
  };

  const getColSpan = (item: typeof items[0]) => {
    if (activeFilter === 'all') return item.spanAll;
    if (activeFilter === 'experience') return item.spanExp;
    return item.spanEdu;
  };

  return (
    <section id="parcours" className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header with Title and Segmented Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
              {t('parcours.title')}
            </h2>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              {t('parcours.subtitle')}
            </p>
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-200/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 w-fit">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {t('parcours.filterAll')}
            </button>
            <button
              onClick={() => setActiveFilter('experience')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                activeFilter === 'experience'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {t('parcours.filterExp')}
            </button>
            <button
              onClick={() => setActiveFilter('education')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                activeFilter === 'education'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {t('parcours.filterEdu')}
            </button>
          </div>
        </div>

        {/* Minimalist Bento Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className={`col-span-1 ${getColSpan(item)} p-5 md:p-6 rounded-[1.25rem] md:rounded-[1.75rem] bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15 transition-all flex flex-col justify-between`}
                >
                  <div>
                    {/* Top row: Date & Category Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                        <Calendar size={13} className="opacity-70" />
                        <span>{item.period}</span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeStyle(
                          item.badgeType
                        )}`}
                      >
                        <Icon size={11} />
                        {item.badge}
                      </span>
                    </div>

                    {/* Title & Location */}
                    <h3 className="text-base md:text-lg font-bold text-zinc-900 dark:text-white mb-1 leading-snug">
                      {item.title}
                    </h3>
                    <div className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
                      <MapPin size={12} className="shrink-0 opacity-70" />
                      <span>{item.location}</span>
                    </div>

                    {/* Concise single-sentence description */}
                    <p className="text-zinc-700 dark:text-zinc-300 text-xs md:text-sm leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>

                  {/* Sleek bottom tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-200/60 dark:border-white/5">
                      {item.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2.5 py-0.5 rounded-md bg-zinc-200/70 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
