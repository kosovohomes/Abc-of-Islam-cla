import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, BookOpen, Check, ChevronRight, ArrowLeft, Star, Zap, Trophy } from 'lucide-react';
import ExportModal from '@/components/export/ExportModal';
import { t, getCategoryName } from '@/lib/translations';
import { CATEGORIES } from '@/lib/topics';
import { getContent } from '@/lib/content';
import { getDefensiveTitle, getDefensiveFunFact, getDefensiveContent } from '@/lib/helpers';
import type { Topic, UserProgress, Locale, AgeLevel, Category } from '@/types';

// ─── Category colour themes ───────────────────────────────────────────────────
const CATEGORY_THEMES: Record<string, {
  bg: string; cardBg: string; border: string; accent: string;
  lightBg: string; text: string; badge: string; buttonBg: string;
  buttonHover: string; gradientFrom: string; gradientTo: string;
  glow: string; pill: string;
}> = {
  pillars_of_islam: {
    bg: 'bg-emerald-500', cardBg: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600',
    border: 'border-emerald-400', accent: 'text-emerald-600', lightBg: 'bg-emerald-50',
    text: 'text-emerald-800', badge: 'bg-emerald-100 text-emerald-700',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700', buttonHover: 'hover:shadow-emerald-400/40',
    gradientFrom: 'from-emerald-400', gradientTo: 'to-teal-500',
    glow: 'shadow-emerald-400/50', pill: 'bg-emerald-500',
  },
  core_beliefs: {
    bg: 'bg-orange-500', cardBg: 'bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600',
    border: 'border-orange-400', accent: 'text-orange-600', lightBg: 'bg-orange-50',
    text: 'text-orange-800', badge: 'bg-orange-100 text-orange-700',
    buttonBg: 'bg-orange-600 hover:bg-orange-700', buttonHover: 'hover:shadow-orange-400/40',
    gradientFrom: 'from-orange-400', gradientTo: 'to-amber-500',
    glow: 'shadow-orange-400/50', pill: 'bg-orange-500',
  },
  daily_practices: {
    bg: 'bg-sky-500', cardBg: 'bg-gradient-to-br from-sky-400 via-blue-500 to-sky-600',
    border: 'border-sky-400', accent: 'text-sky-600', lightBg: 'bg-sky-50',
    text: 'text-sky-800', badge: 'bg-sky-100 text-sky-700',
    buttonBg: 'bg-sky-600 hover:bg-sky-700', buttonHover: 'hover:shadow-sky-400/40',
    gradientFrom: 'from-sky-400', gradientTo: 'to-blue-500',
    glow: 'shadow-sky-400/50', pill: 'bg-sky-500',
  },
  islamic_values: {
    bg: 'bg-rose-500', cardBg: 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600',
    border: 'border-rose-400', accent: 'text-rose-600', lightBg: 'bg-rose-50',
    text: 'text-rose-800', badge: 'bg-rose-100 text-rose-700',
    buttonBg: 'bg-rose-600 hover:bg-rose-700', buttonHover: 'hover:shadow-rose-400/40',
    gradientFrom: 'from-rose-400', gradientTo: 'to-pink-500',
    glow: 'shadow-rose-400/50', pill: 'bg-rose-500',
  },
  stories_history: {
    bg: 'bg-purple-500', cardBg: 'bg-gradient-to-br from-purple-400 via-violet-500 to-purple-700',
    border: 'border-purple-400', accent: 'text-purple-600', lightBg: 'bg-purple-50',
    text: 'text-purple-800', badge: 'bg-purple-100 text-purple-700',
    buttonBg: 'bg-purple-600 hover:bg-purple-700', buttonHover: 'hover:shadow-purple-400/40',
    gradientFrom: 'from-purple-400', gradientTo: 'to-violet-500',
    glow: 'shadow-purple-400/50', pill: 'bg-purple-500',
  },
  special_times: {
    bg: 'bg-indigo-500', cardBg: 'bg-gradient-to-br from-indigo-400 via-blue-500 to-indigo-700',
    border: 'border-indigo-400', accent: 'text-indigo-600', lightBg: 'bg-indigo-50',
    text: 'text-indigo-800', badge: 'bg-indigo-100 text-indigo-700',
    buttonBg: 'bg-indigo-600 hover:bg-indigo-700', buttonHover: 'hover:shadow-indigo-400/40',
    gradientFrom: 'from-indigo-400', gradientTo: 'to-blue-600',
    glow: 'shadow-indigo-400/50', pill: 'bg-indigo-500',
  },
};

function matchesSynonym(query: string, topic: Topic): boolean {
  const id = topic.id; const cat = topic.category;
  if (query === 'pillars') return cat === 'pillars_of_islam';
  if (query === 'wudu') return id === 'wudu' || cat === 'daily_practices';
  if (query === 'kaaba') return id === 'hajj' || id === 'salah' || cat === 'pillars_of_islam';
  if (query === 'ramadan') return id === 'sawm' || id === 'ramadan' || cat === 'special_times';
  if (query === 'arafat') return id === 'hajj' || id === 'eid_al_adha';
  if (query === 'values') return cat === 'islamic_values';
  if (query === 'stories') return cat === 'stories_history';
  return false;
}

// ─── Preview Modal ────────────────────────────────────────────────────────────
function ImagePreviewModal({ topic, locale, theme, onClose, onReadFull }: {
  topic: Topic; locale: Locale; theme: typeof CATEGORY_THEMES[string];
  onClose: () => void; onReadFull: (id: string) => void;
}) {
  const title = getDefensiveTitle(topic, locale);
  const funFact = getDefensiveFunFact(topic, locale);
  const bodyText = getDefensiveContent(topic, 'starter' as AgeLevel, locale);
  const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header band */}
        <div className={`${theme.cardBg} p-5 pb-0`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/30">
                {topic.emoji}
              </div>
              <div>
                <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest block">
                  {getCategoryName(topic.category, locale)}
                </span>
                <h3 className="text-xl font-serif font-extrabold text-white leading-tight">{title}</h3>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white cursor-pointer transition-all border border-white/20">
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
          {/* Image peek */}
          <div className="relative aspect-[16/7] overflow-hidden rounded-t-2xl">
            <img src={imageSrc} alt={title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>

        {/* Content card */}
        <div className="bg-white p-5 space-y-4">
          {funFact && (
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-2xl shrink-0">🌟</span>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-amber-700 mb-0.5">Fun Fact</p>
                <p className="text-sm text-amber-900 leading-relaxed line-clamp-2">{funFact}</p>
              </div>
            </div>
          )}
          {bodyText && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{bodyText}</p>
          )}
          <motion.button
            onClick={() => { onClose(); onReadFull(topic.id); }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} text-white rounded-2xl font-extrabold text-sm transition-all cursor-pointer shadow-lg`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Full Chapter</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({ category, topics, theme, locale, progress, onExplore }: {
  category: Category; topics: Topic[]; theme: typeof CATEGORY_THEMES[string];
  locale: Locale; progress: UserProgress; onExplore: (id: string) => void;
}) {
  const readInCat = topics.filter(t => progress.topicsRead.includes(t.id)).length;
  const quizzedInCat = topics.filter(t => progress.quizzesCompleted[t.id] !== undefined).length;
  const percent = Math.round((readInCat / topics.length) * 100);
  const allDone = readInCat === topics.length;
  const previewTopics = topics.slice(0, 4);
  const remaining = topics.length - previewTopics.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 250 }}
      className={`group relative rounded-3xl overflow-hidden ${theme.cardBg} shadow-xl ${theme.buttonHover} hover:shadow-2xl cursor-pointer transition-all duration-300`}
      onClick={() => onExplore(category.id)}
    >
      {/* Shiny highlight overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/10 pointer-events-none" />

      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-black/10 pointer-events-none" />

      {/* Progress ring badge */}
      <div className="absolute top-3.5 right-3.5 z-10">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="19" fill="rgba(0,0,0,0.2)" strokeWidth="0" />
            <circle cx="24" cy="24" r="16" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <circle cx="24" cy="24" r="16" fill="none" stroke="white" strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${percent * 1.005} 100.5`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-white">
            {percent}%
          </div>
        </div>
      </div>

      {/* Stars row */}
      <div className="absolute top-4 left-4 z-10 flex gap-0.5">
        {[1,2,3,4,5].map(s => (
          <span key={s} className={`text-sm ${s <= Math.ceil((quizzedInCat / topics.length) * 5) ? 'text-yellow-300' : 'text-white/25'}`}>★</span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 p-5 pt-14 flex flex-col items-center text-center text-white">
        {/* Big emoji with float */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl mb-3 filter drop-shadow-xl select-none"
        >
          {category.emoji}
        </motion.div>

        <h3 className="text-2xl font-serif font-extrabold leading-tight mb-1 drop-shadow">
          {getCategoryName(category.id, locale)}
        </h3>

        <p className="text-xs text-white/75 font-semibold mb-4 px-2">
          {readInCat === 0
            ? `${topics.length} lessons — start your journey! 🚀`
            : readInCat === topics.length
            ? 'All lessons complete! 🎉'
            : `${readInCat} of ${topics.length} lessons done — keep going!`}
        </p>

        {/* Topic pills */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {previewTopics.map(topic => (
            <span key={topic.id} className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[11px] font-bold text-white border border-white/20 shadow-sm">
              {topic.emoji} {getDefensiveTitle(topic, locale).split(' - ')[0].split(' ').slice(0,2).join(' ')}
            </span>
          ))}
          {remaining > 0 && (
            <span className="px-2.5 py-1 bg-black/20 rounded-full text-[11px] font-bold text-white/80">
              +{remaining} more
            </span>
          )}
        </div>

        {/* CTA button */}
        <motion.div
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white/25 backdrop-blur-sm hover:bg-white/35 rounded-2xl text-sm font-extrabold text-white border border-white/25 shadow-md transition-all"
        >
          {allDone
            ? <><Trophy className="w-4 h-4 fill-yellow-300 text-yellow-300" /> Mastered!</>
            : readInCat === topics.length
            ? <><Check className="w-4 h-4" /> All Read</>
            : <><Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" /> Explore →</>
          }
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Category Detail View ─────────────────────────────────────────────────────
function CategoryDetailView({ category, topics, theme, locale, progress, onBack, onTopicSelect, onPreview }: {
  category: Category; topics: Topic[]; theme: typeof CATEGORY_THEMES[string];
  locale: Locale; progress: UserProgress;
  onBack: () => void; onTopicSelect: (id: string) => void; onPreview: (topic: Topic) => void;
}) {
  const readInCat = topics.filter(t => progress.topicsRead.includes(t.id)).length;
  const quizzedInCat = topics.filter(t => progress.quizzesCompleted[t.id] !== undefined).length;
  const percent = Math.round((readInCat / topics.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      {/* Hero header for the category */}
      <div className={`${theme.cardBg} rounded-3xl p-5 mb-6 relative overflow-hidden shadow-xl`}>
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-black/10 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <button onClick={onBack}
            className="p-2.5 bg-white/20 hover:bg-white/30 rounded-2xl text-white cursor-pointer transition-all border border-white/25 shrink-0">
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div className="text-4xl select-none filter drop-shadow-lg">{category.emoji}</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-serif font-extrabold text-white leading-tight">
              {getCategoryName(category.id, locale)}
            </h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-xs text-white/80 font-semibold">{readInCat}/{topics.length} read</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-xs text-white/80 font-semibold">{quizzedInCat} quizzes done</span>
              {percent === 100 && <span className="text-xs font-bold text-yellow-300">🏆 Complete!</span>}
            </div>
          </div>
          {/* Progress pill */}
          <div className="shrink-0 bg-white/25 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/25 text-center">
            <div className="text-2xl font-extrabold text-white">{percent}%</div>
            <div className="text-[9px] font-bold text-white/70 uppercase tracking-wider">progress</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="relative z-10 mt-4 h-2 bg-black/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </div>

      {/* Topics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic, idx) => {
          const isRead = progress.topicsRead.includes(topic.id);
          const quizRecord = progress.quizzesCompleted[topic.id];
          const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;
          return (
            <motion.div
              key={topic.id}
              id={`topic-launcher-${topic.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <div
                className="relative aspect-[3/2] bg-gray-50 overflow-hidden"
                onClick={(e) => { e.stopPropagation(); onPreview(topic); }}
              >
                <img src={imageSrc} alt={getDefensiveTitle(topic, locale)}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo}`} />
                <div className="absolute top-2 left-2 text-xl bg-white/90 backdrop-blur-sm w-9 h-9 flex items-center justify-center rounded-xl shadow-sm border border-white/50">
                  {topic.emoji}
                </div>
                {isRead && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-[10px] font-bold uppercase tracking-wider text-gray-700">
                    👁 Preview
                  </div>
                </div>
              </div>

              {/* Card text */}
              <div className="p-3.5 cursor-pointer" onClick={() => onTopicSelect(topic.id)}>
                <h4 className={`text-sm font-bold text-gray-800 leading-snug group-hover:${theme.accent} transition-colors line-clamp-2 mb-2`}>
                  {getDefensiveTitle(topic, locale)}
                </h4>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.accent} opacity-70`}>Read →</span>
                  {quizRecord !== undefined ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-full text-amber-600 text-[9px] font-bold">
                      ⭐ {quizRecord}/3
                    </span>
                  ) : isRead ? (
                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">✓ Read</span>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface TopicGridProps {
  locale: Locale; content: Topic[]; progress: UserProgress; isRtlLayout: boolean;
  showSavedOnly: boolean; setShowSavedOnly: (v: boolean) => void;
  searchQuery: string; setSearchQuery: (v: string) => void;
  topicsReadCount: number; totalTopics: number; onTopicSelect: (id: string) => void;
}

export default function TopicGrid({
  locale, content, progress, isRtlLayout, showSavedOnly, setShowSavedOnly,
  searchQuery, setSearchQuery, topicsReadCount, totalTopics, onTopicSelect,
}: TopicGridProps) {
  const englishContent = getContent('en');
  const [previewTopic, setPreviewTopic] = useState<Topic | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getFilteredTopics = (categoryId: string) => {
    const query = searchQuery.toLowerCase().trim();
    return content.filter(topic => {
      if (topic.category !== categoryId) return false;
      if (showSavedOnly && !(progress.savedChapters || []).includes(topic.id)) return false;
      if (!query) return true;
      const eng = englishContent.find(t => t.id === topic.id) || topic;
      const titleLocal = getDefensiveTitle(topic, locale).toLowerCase();
      const titleEng = (typeof eng.title === 'string' ? eng.title : eng.title?.['en'] || '').toLowerCase();
      const factLocal = getDefensiveFunFact(topic, locale).toLowerCase();
      const factEng = (typeof eng.funFact === 'string' ? eng.funFact : eng.funFact?.['en'] || '').toLowerCase();
      const starterL = ((topic.content?.starter as any)?.[locale] || (topic.content?.starter as any)?.en || (typeof topic.content?.starter === 'string' ? topic.content.starter : '')).toLowerCase();
      const explorerL = ((topic.content?.explorer as any)?.[locale] || (topic.content?.explorer as any)?.en || (typeof topic.content?.explorer === 'string' ? topic.content.explorer : '')).toLowerCase();
      const thinkerL = ((topic.content?.thinker as any)?.[locale] || (topic.content?.thinker as any)?.en || (typeof topic.content?.thinker === 'string' ? topic.content.thinker : '')).toLowerCase();
      const catNameLocal = getCategoryName(topic.category, locale).toLowerCase();
      const catNameEng = getCategoryName(topic.category, 'en').toLowerCase();
      return (
        titleLocal.includes(query) || titleEng.includes(query) || factLocal.includes(query) ||
        factEng.includes(query) || starterL.includes(query) || explorerL.includes(query) ||
        thinkerL.includes(query) || catNameLocal.includes(query) || catNameEng.includes(query) ||
        topic.id.toLowerCase().includes(query) || topic.category.toLowerCase().includes(query) ||
        matchesSynonym(query, topic)
      );
    });
  };

  const hasAnyResults = CATEGORIES.some(cat => getFilteredTopics(cat.id).length > 0);
  const overallPercent = Math.round((topicsReadCount / totalTopics) * 100);

  // Category detail view
  if (expandedCategory && !searchQuery) {
    const cat = CATEGORIES.find(c => c.id === expandedCategory);
    const topics = getFilteredTopics(expandedCategory);
    const theme = CATEGORY_THEMES[expandedCategory] || CATEGORY_THEMES.pillars_of_islam;
    if (cat && topics.length > 0) {
      return (
        <motion.div key="detail-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-10 py-8">
          <CategoryDetailView category={cat} topics={topics} theme={theme} locale={locale}
            progress={progress} onBack={() => setExpandedCategory(null)}
            onTopicSelect={onTopicSelect} onPreview={setPreviewTopic} />
          <AnimatePresence>
            {previewTopic && (
              <ImagePreviewModal topic={previewTopic} locale={locale}
                theme={CATEGORY_THEMES[previewTopic.category] || CATEGORY_THEMES.pillars_of_islam}
                onClose={() => setPreviewTopic(null)} onReadFull={onTopicSelect} />
            )}
          </AnimatePresence>
        </motion.div>
      );
    }
  }

  return (
    <motion.div key="grid-view"
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
      className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-10 py-8"
    >

      {/* ── Hero Header ── */}
      <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 shadow-2xl">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-black/10" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white/5" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl select-none">🗺️</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white leading-tight drop-shadow-sm">
                My Learning Map
              </h2>
            </div>
            <p className="text-white/80 text-sm font-semibold mt-1">
              Choose a world to explore and grow your knowledge! ✨
            </p>
          </div>

          {/* Big progress display */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Circular progress */}
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="33" fill="rgba(0,0,0,0.15)" strokeWidth="0" />
                <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="5" />
                <motion.circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 188.5' }}
                  animate={{ strokeDasharray: `${overallPercent * 1.885} 188.5` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-white leading-none">{overallPercent}%</span>
                <span className="text-[9px] text-white/70 font-bold uppercase tracking-wide">done</span>
              </div>
            </div>

            <div className="text-white">
              <div className="text-3xl font-extrabold leading-none">
                <span className="text-yellow-300">{topicsReadCount}</span>
                <span className="text-white/50 mx-1 text-xl">/</span>
                <span>{totalTopics}</span>
              </div>
              <div className="text-xs text-white/70 font-bold uppercase tracking-wider mt-0.5">lessons unlocked</div>
              <div className="flex mt-1.5 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.ceil(overallPercent / 20) ? 'fill-yellow-300 text-yellow-300' : 'text-white/25'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="mb-7 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <span className={`absolute inset-y-0 ${isRtlLayout ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-gray-300`}>
            <Search className="w-4.5 h-4.5 stroke-[2]" />
          </span>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'ar' ? 'ابحث في الفصول...' : '🔍  Search topics...'}
            className={`w-full py-3.5 ${isRtlLayout ? 'pr-11 pl-9' : 'pl-11 pr-9'} border-2 border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 bg-white text-sm text-slate-800 shadow-sm transition-all font-medium`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className={`absolute inset-y-0 ${isRtlLayout ? 'left-3' : 'right-3'} flex items-center text-gray-300 hover:text-gray-500 cursor-pointer`}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['Pillars', 'Wudu', 'Kaaba', 'Ramadan', 'Values', 'Stories'].map((tag) => (
            <motion.button key={tag} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setSearchQuery(searchQuery.toLowerCase() === tag.toLowerCase() ? '' : tag)}
              className={`px-3.5 py-2 border-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700'
              }`}>
              {tag}
            </motion.button>
          ))}

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-2 text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
              showSavedOnly
                ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md shadow-amber-200'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'
            }`}>
            <span>★ Saved</span>
            {(progress.savedChapters || []).length > 0 && (
              <span className="bg-amber-500 text-white px-1.5 py-0.5 text-[8px] rounded-full font-bold">
                {(progress.savedChapters || []).length}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* ── Search results ── */}
      {searchQuery && hasAnyResults ? (
        <div className="space-y-8">
          {CATEGORIES.map(category => {
            const topicsInCat = getFilteredTopics(category.id);
            if (topicsInCat.length === 0) return null;
            const theme = CATEGORY_THEMES[category.id] || CATEGORY_THEMES.pillars_of_islam;
            return (
              <section key={category.id}>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <div className={`w-1.5 h-7 rounded-full bg-gradient-to-b ${theme.gradientFrom} ${theme.gradientTo}`} />
                  <span className="text-2xl">{category.emoji}</span>
                  <h3 className="text-lg font-bold text-gray-900">{getCategoryName(category.id, locale)}</h3>
                  <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">{topicsInCat.length} results</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topicsInCat.map(topic => {
                    const isRead = progress.topicsRead.includes(topic.id);
                    const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;
                    return (
                      <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -3, scale: 1.02 }} transition={{ duration: 0.2 }}
                        className="group rounded-2xl overflow-hidden bg-white border-2 border-gray-100 shadow-sm hover:shadow-lg cursor-pointer transition-all"
                        onClick={() => onTopicSelect(topic.id)}
                      >
                        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                          <img src={imageSrc} alt={getDefensiveTitle(topic, locale)}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"
                          />
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo}`} />
                          {isRead && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {getDefensiveTitle(topic, locale)}
                          </h4>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

      ) : searchQuery && !hasAnyResults ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-gray-100 p-10 text-center rounded-3xl shadow-sm flex flex-col items-center max-w-sm mx-auto my-8">
          <span className="text-6xl mb-4">🔍</span>
          <h3 className="text-xl font-bold text-gray-800">No Topics Found</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-xs leading-relaxed">
            No results for <strong className="text-gray-600">"{searchQuery}"</strong>. Try a different word!
          </p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setSearchQuery('')}
            className="mt-5 px-6 py-2.5 bg-emerald-500 text-white rounded-2xl text-sm font-bold shadow-md hover:bg-emerald-600 transition-colors cursor-pointer">
            Clear Search ✕
          </motion.button>
        </motion.div>

      ) : (
        /* ── Category cards 3×2 grid ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((category, idx) => {
            const topics = getFilteredTopics(category.id);
            if (topics.length === 0) return null;
            const theme = CATEGORY_THEMES[category.id] || CATEGORY_THEMES.pillars_of_islam;
            return (
              <motion.div key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
              >
                <CategoryCard category={category} topics={topics} theme={theme}
                  locale={locale} progress={progress} onExplore={setExpandedCategory} />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTopic && (
          <ImagePreviewModal topic={previewTopic} locale={locale}
            theme={CATEGORY_THEMES[previewTopic.category] || CATEGORY_THEMES.pillars_of_islam}
            onClose={() => setPreviewTopic(null)} onReadFull={onTopicSelect} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <p className="text-xs text-gray-400 font-medium">{t(locale, 'footer')}</p>
        <div className="shrink-0"><ExportModal content={content} /></div>
      </div>
    </motion.div>
  );
}
