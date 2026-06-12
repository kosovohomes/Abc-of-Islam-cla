import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, BookOpen, Check, ChevronRight, Sparkles, ArrowLeft, Lock } from 'lucide-react';
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
}> = {
  pillars_of_islam: {
    bg: 'bg-emerald-500',
    cardBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    border: 'border-emerald-400',
    accent: 'text-emerald-600',
    lightBg: 'bg-emerald-50',
    text: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
    buttonHover: 'hover:shadow-emerald-300',
    gradientFrom: 'from-emerald-400',
    gradientTo: 'to-teal-500',
  },
  core_beliefs: {
    bg: 'bg-amber-500',
    cardBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    border: 'border-amber-400',
    accent: 'text-amber-600',
    lightBg: 'bg-amber-50',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-700',
    buttonBg: 'bg-amber-600 hover:bg-amber-700',
    buttonHover: 'hover:shadow-amber-300',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-orange-500',
  },
  daily_practices: {
    bg: 'bg-sky-500',
    cardBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    border: 'border-sky-400',
    accent: 'text-sky-600',
    lightBg: 'bg-sky-50',
    text: 'text-sky-800',
    badge: 'bg-sky-100 text-sky-700',
    buttonBg: 'bg-sky-600 hover:bg-sky-700',
    buttonHover: 'hover:shadow-sky-300',
    gradientFrom: 'from-sky-400',
    gradientTo: 'to-blue-500',
  },
  islamic_values: {
    bg: 'bg-rose-500',
    cardBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    border: 'border-rose-400',
    accent: 'text-rose-600',
    lightBg: 'bg-rose-50',
    text: 'text-rose-800',
    badge: 'bg-rose-100 text-rose-700',
    buttonBg: 'bg-rose-600 hover:bg-rose-700',
    buttonHover: 'hover:shadow-rose-300',
    gradientFrom: 'from-rose-400',
    gradientTo: 'to-pink-500',
  },
  stories_history: {
    bg: 'bg-purple-500',
    cardBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
    border: 'border-purple-400',
    accent: 'text-purple-600',
    lightBg: 'bg-purple-50',
    text: 'text-purple-800',
    badge: 'bg-purple-100 text-purple-700',
    buttonBg: 'bg-purple-600 hover:bg-purple-700',
    buttonHover: 'hover:shadow-purple-300',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-violet-500',
  },
  special_times: {
    bg: 'bg-indigo-500',
    cardBg: 'bg-gradient-to-br from-indigo-500 to-blue-700',
    border: 'border-indigo-400',
    accent: 'text-indigo-600',
    lightBg: 'bg-indigo-50',
    text: 'text-indigo-800',
    badge: 'bg-indigo-100 text-indigo-700',
    buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
    buttonHover: 'hover:shadow-indigo-300',
    gradientFrom: 'from-indigo-400',
    gradientTo: 'to-blue-600',
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

// ─── Image Preview Modal (compact, well-proportioned) ─────────────────────────
function ImagePreviewModal({
  topic,
  locale,
  theme,
  onClose,
  onReadFull,
}: {
  topic: Topic;
  locale: Locale;
  theme: typeof CATEGORY_THEMES[string];
  onClose: () => void;
  onReadFull: (id: string) => void;
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
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-all cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="absolute top-3 left-3 text-2xl bg-black/30 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-xl border border-white/10">
            {topic.emoji}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className={`inline-block px-2.5 py-0.5 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} text-white text-[9px] font-bold uppercase tracking-widest rounded-full mb-1.5`}>
              {getCategoryName(topic.category, locale)}
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {funFact && (
            <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-lg shrink-0 mt-0.5">🌟</span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-amber-700 mb-0.5">Fun Fact</p>
                <p className="text-xs text-amber-900 leading-relaxed line-clamp-2">{funFact}</p>
              </div>
            </div>
          )}
          {bodyText && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{bodyText}</p>
          )}
          <button
            onClick={() => { onClose(); onReadFull(topic.id); }}
            className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} text-white rounded-xl font-bold text-xs transition-all cursor-pointer hover:opacity-90 shadow-md`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Full Chapter</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Category Card (for the 3x2 grid overview) ────────────────────────────────
function CategoryCard({
  category,
  topics,
  theme,
  locale,
  progress,
  onExplore,
}: {
  category: Category;
  topics: Topic[];
  theme: typeof CATEGORY_THEMES[string];
  locale: Locale;
  progress: UserProgress;
  onExplore: (categoryId: string) => void;
}) {
  const readInCat = topics.filter(t => progress.topicsRead.includes(t.id)).length;
  const quizzedInCat = topics.filter(t => progress.quizzesCompleted[t.id] !== undefined).length;
  const percent = Math.round((readInCat / topics.length) * 100);
  const allQuizzed = quizzedInCat === topics.length;
  // Show first 4 topic titles as pills
  const previewTopics = topics.slice(0, 4);
  const remaining = topics.length - previewTopics.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className={`group relative rounded-2xl overflow-hidden ${theme.cardBg} shadow-lg ${theme.buttonHover} hover:shadow-xl cursor-pointer transition-shadow duration-300`}
      onClick={() => onExplore(category.id)}
    >
      {/* Progress badge */}
      <div className="absolute top-3 right-3 w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-md">
        <span className="text-xs font-extrabold text-white">{percent}%</span>
      </div>

      {/* Star rating based on quizzes completed */}
      <div className="absolute top-3 left-3 flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={`text-xs ${star <= Math.ceil((quizzedInCat / topics.length) * 5) ? 'text-yellow-300' : 'text-white/30'}`}>
            ★
          </span>
        ))}
      </div>

      {/* Card content */}
      <div className="p-5 pt-10 flex flex-col items-center text-center text-white">
        {/* Category emoji/icon */}
        <div className="text-5xl mb-3 drop-shadow-lg filter">
          {category.emoji}
        </div>

        {/* Category title */}
        <h3 className="text-lg font-bold leading-tight mb-1">
          {getCategoryName(category.id, locale)}
        </h3>

        {/* Subtitle with progress */}
        <p className="text-[11px] text-white/75 font-medium mb-4">
          {readInCat} of {topics.length} lessons complete{readInCat > 0 ? 'd' : ''} — {readInCat === 0 ? 'start your journey!' : readInCat === topics.length ? 'all done! 🎉' : 'keep going!'}
        </p>

        {/* Topic pills */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {previewTopics.map(topic => (
            <span
              key={topic.id}
              className="px-2 py-0.5 bg-white/15 backdrop-blur-sm rounded-full text-[10px] font-semibold text-white/90 border border-white/10"
            >
              {topic.emoji} {getDefensiveTitle(topic, locale).split(' - ')[0].split(' ')[0]}
            </span>
          ))}
          {remaining > 0 && (
            <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] font-semibold text-white/70">
              +{remaining} more
            </span>
          )}
        </div>

        {/* Explore button */}
        <button
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl text-sm font-bold text-white border border-white/15 transition-all cursor-pointer shadow-sm`}
        >
          <span>{allQuizzed ? '🏆 Mastered!' : readInCat === topics.length ? '✅ All Read' : 'Explore →'}</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Category Detail View (when a category is selected) ───────────────────────
function CategoryDetailView({
  category,
  topics,
  theme,
  locale,
  progress,
  onBack,
  onTopicSelect,
  onPreview,
}: {
  category: Category;
  topics: Topic[];
  theme: typeof CATEGORY_THEMES[string];
  locale: Locale;
  progress: UserProgress;
  onBack: () => void;
  onTopicSelect: (id: string) => void;
  onPreview: (topic: Topic) => void;
}) {
  const readInCat = topics.filter(t => progress.topicsRead.includes(t.id)).length;
  const quizzedInCat = topics.filter(t => progress.quizzesCompleted[t.id] !== undefined).length;
  const percent = Math.round((readInCat / topics.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      {/* Back button + category header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className={`w-12 h-12 rounded-xl ${theme.cardBg} flex items-center justify-center text-2xl shadow-md`}>
          {category.emoji}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            {getCategoryName(category.id, locale)}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400 font-medium">{readInCat}/{topics.length} read</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400 font-medium">{quizzedInCat}/{topics.length} quizzes</span>
            {percent === 100 && <span className="text-xs text-amber-500 font-bold ml-1">🏆</span>}
          </div>
        </div>
        {/* Progress circle */}
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
            <circle
              cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3.5"
              strokeLinecap="round"
              className={theme.accent}
              strokeDasharray={`${(readInCat / topics.length) * 125.6} 125.6`}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${theme.accent}`}>
            {percent}%
          </div>
        </div>
      </div>

      {/* Topics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {topics.map((topic, idx) => {
          const isRead = progress.topicsRead.includes(topic.id);
          const quizRecord = progress.quizzesCompleted[topic.id];
          const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;
          return (
            <motion.div
              key={topic.id}
              id={`topic-launcher-${topic.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              whileHover={{ y: -3 }}
              className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg cursor-pointer transition-shadow duration-300"
            >
              {/* Image */}
              <div
                className="relative aspect-[4/3] bg-gray-50 overflow-hidden cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onPreview(topic); }}
              >
                <img
                  src={imageSrc}
                  alt={getDefensiveTitle(topic, locale)}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo}`} />

                {/* Emoji */}
                <div className="absolute top-2 left-2 text-base bg-white/90 backdrop-blur-sm w-8 h-8 flex items-center justify-center rounded-lg shadow-sm border border-white/50">
                  {topic.emoji}
                </div>

                {/* Read badge */}
                {isRead && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {/* Preview hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-[9px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Preview
                  </div>
                </div>
              </div>

              {/* Card text */}
              <div className="p-3 cursor-pointer" onClick={() => onTopicSelect(topic.id)}>
                <h4 className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {getDefensiveTitle(topic, locale)}
                </h4>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                  <span className="text-[9px] font-medium uppercase tracking-wider text-gray-400">Read more</span>
                  {quizRecord !== undefined ? (
                    <span className="flex items-center px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[8px] font-bold">
                      ⭐ {quizRecord}/3
                    </span>
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const previewTheme = previewTopic ? (CATEGORY_THEMES[previewTopic.category] || CATEGORY_THEMES.pillars_of_islam) : CATEGORY_THEMES.pillars_of_islam;

  // Filter topics by search and saved
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
        titleLocal.includes(query) || titleEng.includes(query) ||
        factLocal.includes(query) || factEng.includes(query) ||
        starterL.includes(query) || explorerL.includes(query) || thinkerL.includes(query) ||
        catNameLocal.includes(query) || catNameEng.includes(query) ||
        topic.id.toLowerCase().includes(query) ||
        topic.category.toLowerCase().includes(query) ||
        matchesSynonym(query, topic)
      );
    });
  };

  // Check if there are any results
  const hasAnyResults = CATEGORIES.some(cat => getFilteredTopics(cat.id).length > 0);

  // If a category is expanded, show its detail view
  if (expandedCategory && !searchQuery) {
    const cat = CATEGORIES.find(c => c.id === expandedCategory);
    const topics = getFilteredTopics(expandedCategory);
    const theme = CATEGORY_THEMES[expandedCategory] || CATEGORY_THEMES.pillars_of_islam;

    if (cat && topics.length > 0) {
      return (
        <motion.div
          key="detail-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8"
        >
          <CategoryDetailView
            category={cat}
            topics={topics}
            theme={theme}
            locale={locale}
            progress={progress}
            onBack={() => setExpandedCategory(null)}
            onTopicSelect={onTopicSelect}
            onPreview={setPreviewTopic}
          />

          {/* Preview modal */}
          <AnimatePresence>
            {previewTopic && (
              <ImagePreviewModal
                topic={previewTopic}
                locale={locale}
                theme={CATEGORY_THEMES[previewTopic.category] || CATEGORY_THEMES.pillars_of_islam}
                onClose={() => setPreviewTopic(null)}
                onReadFull={onTopicSelect}
              />
            )}
          </AnimatePresence>
        </motion.div>
      );
    }
  }

  return (
    <motion.div
      key="grid-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            My Learning Map 🗺️
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Choose a category to start exploring! ✨
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress ring */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#f0fdf4" strokeWidth="4" />
              <circle
                cx="24" cy="24" r="20" fill="none" stroke="url(#progressGrad)" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(topicsReadCount / totalTopics) * 125.6} 125.6`}
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-emerald-700">
              {Math.round((topicsReadCount / totalTopics) * 100)}%
            </div>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            <span className="text-emerald-600 font-bold">{topicsReadCount}</span>
            <span className="text-gray-300"> / </span>
            <span>{totalTopics}</span>
            <span className="text-gray-400 ml-1">unlocked</span>
          </div>

          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider rounded-full cursor-pointer transition-all ${
              showSavedOnly
                ? 'bg-amber-400 text-amber-950 border-amber-300'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{showSavedOnly ? '★ Saved Only' : '★ Saved'}</span>
            {(progress.savedChapters || []).length > 0 && (
              <span className="bg-amber-500 text-white px-1.5 py-0.5 text-[8px] rounded-full font-bold">
                {(progress.savedChapters || []).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <span className={`absolute inset-y-0 ${isRtlLayout ? 'right-3' : 'left-3'} flex items-center pointer-events-none text-gray-300`}>
            <Search className="w-4 h-4 stroke-[2]" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'ar' ? 'ابحث في الفصول...' : 'Search topics...'}
            className={`w-full py-2.5 ${isRtlLayout ? 'pr-9 pl-8' : 'pl-9 pr-8'} border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 bg-white text-sm text-slate-800 shadow-sm transition-all`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute inset-y-0 ${isRtlLayout ? 'left-2' : 'right-2'} flex items-center text-gray-300 hover:text-gray-500 cursor-pointer`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {['Pillars', 'Wudu', 'Kaaba', 'Ramadan', 'Values', 'Stories'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(searchQuery.toLowerCase() === tag.toLowerCase() ? '' : tag)}
              className={`px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-150 cursor-pointer ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search results view ── */}
      {searchQuery && hasAnyResults ? (
        <div className="space-y-8">
          {CATEGORIES.map(category => {
            const topicsInCat = getFilteredTopics(category.id);
            if (topicsInCat.length === 0) return null;
            const theme = CATEGORY_THEMES[category.id] || CATEGORY_THEMES.pillars_of_islam;

            return (
              <section key={category.id} className="text-black">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${theme.gradientFrom} ${theme.gradientTo}`} />
                  <span className="text-2xl">{category.emoji}</span>
                  <h3 className="text-base font-bold text-gray-900">
                    {getCategoryName(category.id, locale)}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-medium">{topicsInCat.length} results</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {topicsInCat.map(topic => {
                    const isRead = progress.topicsRead.includes(topic.id);
                    const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;
                    return (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-300"
                        onClick={() => onTopicSelect(topic.id)}
                      >
                        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                          <img
                            src={imageSrc}
                            alt={getDefensiveTitle(topic, locale)}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity duration-300" />
                          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo}`} />
                          {isRead && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-sm">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <h4 className="text-xs font-semibold text-gray-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
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
        /* No results */
        <div className="bg-white border border-gray-200 p-8 text-center rounded-2xl shadow-sm flex flex-col items-center max-w-md mx-auto my-8">
          <span className="text-5xl mb-4">🔍</span>
          <h3 className="text-xl font-bold text-gray-800">No Topics Found</h3>
          <p className="text-xs text-gray-400 mt-2 font-medium max-w-xs">
            No results for <strong className="text-gray-600 bg-amber-50 px-1.5 py-0.5 rounded">"{searchQuery}"</strong>. Try a different search.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all cursor-pointer shadow-md"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* ── Category cards grid (3x2) ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map(category => {
            const topics = getFilteredTopics(category.id);
            if (topics.length === 0) return null;
            const theme = CATEGORY_THEMES[category.id] || CATEGORY_THEMES.pillars_of_islam;
            return (
              <div key={category.id}>
                <CategoryCard
                  category={category}
                  topics={topics}
                  theme={theme}
                  locale={locale}
                  progress={progress}
                  onExplore={setExpandedCategory}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {previewTopic && (
          <ImagePreviewModal
            topic={previewTopic}
            locale={locale}
            theme={CATEGORY_THEMES[previewTopic.category] || CATEGORY_THEMES.pillars_of_islam}
            onClose={() => setPreviewTopic(null)}
            onReadFull={onTopicSelect}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <p className="text-xs text-gray-400 font-medium">{t(locale, 'footer')}</p>
        <div className="shrink-0">
          <ExportModal content={content} />
        </div>
      </div>
    </motion.div>
  );
}
