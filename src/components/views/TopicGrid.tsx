import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, BookOpen, Check, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import ExportModal from '@/components/export/ExportModal';
import { t, getCategoryName } from '@/lib/translations';
import { CATEGORIES } from '@/lib/topics';
import { getContent } from '@/lib/content';
import { getDefensiveTitle, getDefensiveFunFact, getDefensiveContent } from '@/lib/helpers';
import type { Topic, UserProgress, Locale, AgeLevel } from '@/types';

// ─── Category colour themes ───────────────────────────────────────────────────
const CATEGORY_THEMES: Record<string, {
  bg: string; border: string; glow: string; badge: string; text: string;
  cardAccent: string; cardBorder: string; cardHoverShadow: string;
  modalAccent: string;
}> = {
  pillars_of_islam: {
    bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    border: 'border-emerald-300', glow: 'shadow-emerald-200',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 rounded-full',
    text: 'text-emerald-800',
    cardAccent: 'from-emerald-500 to-teal-500',
    cardBorder: 'border-emerald-200',
    cardHoverShadow: 'hover:shadow-emerald-200/50',
    modalAccent: 'from-emerald-600 to-teal-600',
  },
  core_beliefs: {
    bg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    border: 'border-amber-300', glow: 'shadow-amber-200',
    badge: 'bg-amber-50 text-amber-800 border-amber-200 rounded-full',
    text: 'text-amber-800',
    cardAccent: 'from-amber-500 to-yellow-500',
    cardBorder: 'border-amber-200',
    cardHoverShadow: 'hover:shadow-amber-200/50',
    modalAccent: 'from-amber-600 to-yellow-600',
  },
  daily_practices: {
    bg: 'bg-gradient-to-r from-sky-500 to-blue-500',
    border: 'border-sky-300', glow: 'shadow-sky-200',
    badge: 'bg-sky-50 text-sky-800 border-sky-200 rounded-full',
    text: 'text-sky-800',
    cardAccent: 'from-sky-500 to-blue-500',
    cardBorder: 'border-sky-200',
    cardHoverShadow: 'hover:shadow-sky-200/50',
    modalAccent: 'from-sky-600 to-blue-600',
  },
  islamic_values: {
    bg: 'bg-gradient-to-r from-rose-500 to-pink-500',
    border: 'border-rose-300', glow: 'shadow-rose-200',
    badge: 'bg-rose-50 text-rose-800 border-rose-200 rounded-full',
    text: 'text-rose-800',
    cardAccent: 'from-rose-500 to-pink-500',
    cardBorder: 'border-rose-200',
    cardHoverShadow: 'hover:shadow-rose-200/50',
    modalAccent: 'from-rose-600 to-pink-600',
  },
  stories_history: {
    bg: 'bg-gradient-to-r from-fuchsia-500 to-purple-500',
    border: 'border-fuchsia-300', glow: 'shadow-fuchsia-200',
    badge: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200 rounded-full',
    text: 'text-fuchsia-800',
    cardAccent: 'from-fuchsia-500 to-purple-500',
    cardBorder: 'border-fuchsia-200',
    cardHoverShadow: 'hover:shadow-fuchsia-200/50',
    modalAccent: 'from-fuchsia-600 to-purple-600',
  },
  special_times: {
    bg: 'bg-gradient-to-r from-violet-500 to-indigo-500',
    border: 'border-violet-300', glow: 'shadow-violet-200',
    badge: 'bg-violet-50 text-violet-800 border-violet-200 rounded-full',
    text: 'text-violet-800',
    cardAccent: 'from-violet-500 to-indigo-500',
    cardBorder: 'border-violet-200',
    cardHoverShadow: 'hover:shadow-violet-200/50',
    modalAccent: 'from-violet-600 to-indigo-600',
  },
};

// ─── Quick-search synonym map ─────────────────────────────────────────────────
function matchesSynonym(query: string, topic: Topic): boolean {
  const id = topic.id;
  const cat = topic.category;
  if (query === 'pillars') return cat === 'pillars_of_islam';
  if (query === 'wudu') return id === 'wudu' || cat === 'daily_practices';
  if (query === 'kaaba') return id === 'hajj' || id === 'salah' || cat === 'pillars_of_islam';
  if (query === 'ramadan') return id === 'sawm' || id === 'ramadan' || cat === 'special_times';
  if (query === 'arafat') return id === 'hajj' || id === 'eid_al_adha';
  if (query === 'values') return cat === 'islamic_values';
  if (query === 'stories') return cat === 'stories_history';
  return false;
}

// ─── Image Preview Modal ─────────────────────────────────────────────────────
function ImagePreviewModal({
  topic,
  locale,
  theme,
  onClose,
}: {
  topic: Topic;
  locale: Locale;
  theme: typeof CATEGORY_THEMES[string];
  onClose: () => void;
}) {
  const title = getDefensiveTitle(topic, locale);
  const funFact = getDefensiveFunFact(topic, locale);
  const bodyText = getDefensiveContent(topic, 'starter' as AgeLevel, locale);
  const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Emoji badge */}
          <div className="absolute top-4 left-4 text-3xl bg-white/20 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-2xl border border-white/20 shadow-lg">
            {topic.emoji}
          </div>

          {/* Title overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className={`inline-block px-3 py-1 bg-gradient-to-r ${theme.modalAccent} text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-2`}>
              {getCategoryName(topic.category, locale)}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight" style={{ fontFamily: "'Georgia', 'Noto Serif SC', serif" }}>
              {title}
            </h3>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 space-y-4">
          {/* Fun fact */}
          {funFact && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-2xl shrink-0 mt-0.5">🌟</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1">Fun Fact</p>
                <p className="text-sm text-amber-900 leading-relaxed">{funFact}</p>
              </div>
            </div>
          )}

          {/* Brief description */}
          {bodyText && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {bodyText}
            </p>
          )}

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r text-white rounded-2xl font-bold text-sm transition-all cursor-pointer hover:opacity-90 shadow-lg"
            style={{ fontFamily: "'Georgia', 'Noto Serif SC', serif" }}
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Full Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface TopicGridProps {
  locale: Locale;
  content: Topic[];
  progress: UserProgress;
  isRtlLayout: boolean;
  showSavedOnly: boolean;
  setShowSavedOnly: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  topicsReadCount: number;
  totalTopics: number;
  onTopicSelect: (id: string) => void;
}

export default function TopicGrid({
  locale,
  content,
  progress,
  isRtlLayout,
  showSavedOnly,
  setShowSavedOnly,
  searchQuery,
  setSearchQuery,
  topicsReadCount,
  totalTopics,
  onTopicSelect,
}: TopicGridProps) {
  const englishContent = getContent('en');
  const [previewTopic, setPreviewTopic] = useState<Topic | null>(null);
  const previewTheme = previewTopic ? (CATEGORY_THEMES[previewTopic.category] || CATEGORY_THEMES.pillars_of_islam) : CATEGORY_THEMES.pillars_of_islam;

  return (
    <motion.div
      key="grid-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10"
    >
      {/* ── Progress header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 p-6 sm:p-8 text-slate-800 border border-emerald-200/60 shadow-lg mb-10">
        <div className="absolute inset-y-0 right-0 opacity-[0.03] pointer-events-none select-none text-[320px] font-black leading-none -mr-16 -mt-16 text-emerald-600">🕌</div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-emerald-700 text-[10px] font-extrabold uppercase tracking-[0.15em] bg-emerald-100/80 border border-emerald-200 px-4 py-2 rounded-full shadow-sm">
              🎈 Little Muslim Adventure
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 leading-tight text-[#1a3a2a]" style={{ fontFamily: "'Georgia', 'Noto Serif SC', serif" }}>My Learning Map! 🗺️</h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2 font-medium">
              Read letters, play fun quizzes, and collect glowing gold badges! ✨
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`flex items-center gap-2 px-5 py-2.5 border-2 text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-sm active:translate-y-px cursor-pointer transition-all ${
                  showSavedOnly
                    ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-amber-100'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{showSavedOnly ? '★ Showing Offline Saved' : '★ Filter Offline Saved'}</span>
                {(progress.savedChapters || []).length > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-white px-2 py-0.5 text-[9px] rounded-full font-bold">
                    {(progress.savedChapters || []).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Progress bar widget */}
          <div className="w-full md:max-w-xs shrink-0 bg-white/80 backdrop-blur-sm border border-emerald-100 p-5 rounded-3xl shadow-md">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2 text-[#2C3E50]">
              <span className="flex items-center gap-1">🏆 Adventure Score</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {Math.round((topicsReadCount / totalTopics) * 100)}%
              </span>
            </div>
            <div className="h-3.5 bg-emerald-50 border border-emerald-100/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-750 ease-out"
                style={{ width: `${(topicsReadCount / totalTopics) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 mt-2.5 text-right font-bold uppercase tracking-wider">
              You've unlocked {topicsReadCount} of {totalTopics} secrets! 🔑
            </div>
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="bg-amber-50/50 border border-amber-100/60 p-5 sm:p-6 rounded-3xl shadow-sm mb-10 flex flex-col gap-4 text-[#2C3E50]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className={`absolute inset-y-0 ${isRtlLayout ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-amber-500/80`}>
              <Search className="w-4 h-4 stroke-[2.5]" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'ar' ? 'ابحث في الفصول بالاسم، الكلمات الرئيسية...' : 'Search chapters by name or concepts...'}
              className={`w-full py-3 ${isRtlLayout ? 'pr-11 pl-10' : 'pl-11 pr-10'} border-2 border-amber-200 rounded-full outline-none focus:ring-2 focus:ring-amber-300 bg-white text-sm tracking-wide font-medium text-slate-800 shadow-inner`}
              style={{ fontFamily: "'Georgia', 'Noto Serif SC', serif" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute inset-y-0 ${isRtlLayout ? 'left-3' : 'right-3'} flex items-center text-gray-400 hover:text-rose-500 cursor-pointer`}
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3E50]/70">Quick Searches:</span>
          {['Pillars', 'Wudu', 'Kaaba', 'Ramadan', 'Arafat', 'Values', 'Stories'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(searchQuery.toLowerCase() === tag.toLowerCase() ? '' : tag)}
              className={`px-3.5 py-1.5 border text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-150 cursor-pointer shadow-sm active:translate-y-px ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-amber-400 text-amber-950 border-amber-400 font-extrabold ring-2 ring-amber-300'
                  : 'bg-white text-gray-700 border-amber-200/50 hover:bg-amber-400 hover:text-amber-950 hover:border-amber-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category sections ── */}
      <div className="space-y-14">
        {(() => {
          let hasResults = false;
          const query = searchQuery.toLowerCase().trim();

          const sections = CATEGORIES.map(category => {
            const topicsInCat = content.filter(topic => {
              if (topic.category !== category.id) return false;
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
                titleLocal.includes(query) || titleEng.includes(query) ||
                factLocal.includes(query) || factEng.includes(query) ||
                starterL.includes(query) || explorerL.includes(query) || thinkerL.includes(query) ||
                catNameLocal.includes(query) || catNameEng.includes(query) ||
                topic.id.toLowerCase().includes(query) ||
                topic.category.toLowerCase().includes(query) ||
                matchesSynonym(query, topic)
              );
            });

            if (topicsInCat.length === 0) return null;
            hasResults = true;

            const theme = CATEGORY_THEMES[category.id] || CATEGORY_THEMES.pillars_of_islam;
            const readInCat = topicsInCat.filter(t => progress.topicsRead.includes(t.id)).length;
            const quizzedInCat = topicsInCat.filter(t => progress.quizzesCompleted[t.id] !== undefined).length;
            const allRead = readInCat === topicsInCat.length;
            const allQuizzed = quizzedInCat === topicsInCat.length;

            return (
              <section key={category.id} className="scroll-mt-20 text-black">
                {/* Category banner */}
                <div className={`relative rounded-3xl ${theme.bg} p-5 sm:p-6 text-white mb-6 overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/20 shadow-xl`}>
                  <div className="absolute right-6 text-[120px] select-none opacity-[0.1] leading-none pointer-events-none">{category.emoji}</div>
                  <div className="relative flex items-center gap-4">
                    <span className="text-4xl sm:text-5xl leading-none select-none filter drop-shadow-lg">{category.emoji}</span>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight" style={{ fontFamily: "'Georgia', 'Noto Serif SC', serif" }}>
                        {getCategoryName(category.id, locale)}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] sm:text-xs">
                        <span className="bg-white/15 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-semibold border border-white/10">
                          📖 {readInCat} of {topicsInCat.length} Read
                        </span>
                        <span className="bg-white/15 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-semibold border border-white/10">
                          🎯 {quizzedInCat} of {topicsInCat.length} Quizzes
                        </span>
                      </div>
                    </div>
                  </div>
                  {allQuizzed ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3, ease: 'easeInOut' }}
                      className="relative shrink-0 self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 border border-amber-300/50 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-amber-400/30"
                    >
                      <span>🏆 Category Mastered!</span>
                    </motion.div>
                  ) : allRead ? (
                    <div className="relative shrink-0 self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>All Read</span>
                    </div>
                  ) : null}
                </div>

                {/* Topic cards — BIGGER grid with 2 columns on lg */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                  {topicsInCat.map(topic => {
                    const isRead = progress.topicsRead.includes(topic.id);
                    const quizRecord = progress.quizzesCompleted[topic.id];
                    const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;
                    return (
                      <motion.div
                        id={`topic-launcher-${topic.id}`}
                        key={topic.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="group relative rounded-2xl overflow-hidden bg-white border-2 border-gray-100 shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-300"
                      >
                        {/* Image area — FULL COLOR, no grayscale */}
                        <div
                          className="relative aspect-[16/9] bg-gray-100 overflow-hidden cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); setPreviewTopic(topic); }}
                        >
                          <img
                            src={imageSrc}
                            alt={getDefensiveTitle(topic, locale)}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                          {/* Category accent bar at top */}
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.cardAccent}`} />

                          {/* Emoji badge */}
                          <div className="absolute top-3 left-3 text-xl bg-white/90 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-xl shadow-md border border-white/50">
                            {topic.emoji}
                          </div>

                          {/* Status badges */}
                          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                            {isRead && (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-full text-[9px] font-bold uppercase tracking-wider shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Read</span>
                              </div>
                            )}
                            {progress.savedChapters?.includes(topic.id) && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-amber-900 rounded-full text-[8px] font-bold uppercase tracking-wider shadow-sm">
                                <span>★ Saved</span>
                              </div>
                            )}
                          </div>

                          {/* Tap to preview hint */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-[10px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3" />
                              Preview
                            </div>
                          </div>
                        </div>

                        {/* Card content */}
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => onTopicSelect(topic.id)}
                        >
                          <h4 className="text-base font-bold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors" style={{ fontFamily: "'Georgia', 'Noto Serif SC', serif" }}>
                            {getDefensiveTitle(topic, locale)}
                          </h4>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Read details</span>
                            </span>
                            {quizRecord !== undefined ? (
                              <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-[9px] font-bold">
                                ⭐ {quizRecord}/3
                              </span>
                            ) : (
                              <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Quiz pending</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          });

          if (!hasResults) {
            return (
              <div className="bg-white border border-gray-200 p-10 sm:p-12 text-center rounded-3xl shadow-lg flex flex-col items-center max-w-xl mx-auto my-8">
                <span className="text-6xl mb-6">🔍</span>
                <h3 className="text-2xl font-bold text-gray-800 leading-tight" style={{ fontFamily: "'Georgia', 'Noto Serif SC', serif" }}>No Chapters Found</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-3 font-medium max-w-sm">
                  We couldn't find any results for <strong className="text-gray-800 bg-amber-100 px-1.5 py-0.5 rounded">"{searchQuery}"</strong>. Try checking your spelling or search for other pillars or values.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 active:translate-y-px transition-all cursor-pointer shadow-md"
                >
                  Clear Search Bar
                </button>
              </div>
            );
          }

          return sections;
        })()}
      </div>

      {/* ── Image Preview Modal ── */}
      <AnimatePresence>
        {previewTopic && (
          <ImagePreviewModal
            topic={previewTopic}
            locale={locale}
            theme={previewTheme}
            onClose={() => setPreviewTopic(null)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <p className="text-xs text-gray-400 font-medium">{t(locale, 'footer')}</p>
        <div className="shrink-0">
          <ExportModal content={content} />
        </div>
      </div>
    </motion.div>
  );
}
