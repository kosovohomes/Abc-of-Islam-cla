import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, BookOpen, Check, CheckCircle2, ChevronRight, Sparkles, ChevronLeft, ChevronRight as ArrowRight, Eye } from 'lucide-react';
import ExportModal from '@/components/export/ExportModal';
import { t, getCategoryName } from '@/lib/translations';
import { CATEGORIES } from '@/lib/topics';
import { getContent } from '@/lib/content';
import { getDefensiveTitle, getDefensiveFunFact, getDefensiveContent } from '@/lib/helpers';
import type { Topic, UserProgress, Locale, AgeLevel, Category } from '@/types';

// ─── Category colour themes ───────────────────────────────────────────────────
const CATEGORY_THEMES: Record<string, {
  bg: string; border: string; glow: string; badge: string; text: string;
  cardAccent: string; cardBorder: string; cardHoverShadow: string;
  modalAccent: string; lightBg: string; softBorder: string;
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
    lightBg: 'bg-emerald-50/40',
    softBorder: 'border-emerald-100',
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
    lightBg: 'bg-amber-50/40',
    softBorder: 'border-amber-100',
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
    lightBg: 'bg-sky-50/40',
    softBorder: 'border-sky-100',
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
    lightBg: 'bg-rose-50/40',
    softBorder: 'border-rose-100',
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
    lightBg: 'bg-fuchsia-50/40',
    softBorder: 'border-fuchsia-100',
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
    lightBg: 'bg-violet-50/40',
    softBorder: 'border-violet-100',
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
        {/* Image section - compact */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-all cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Emoji badge */}
          <div className="absolute top-3 left-3 text-2xl bg-black/30 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-xl border border-white/10">
            {topic.emoji}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className={`inline-block px-2.5 py-0.5 bg-gradient-to-r ${theme.modalAccent} text-white text-[9px] font-bold uppercase tracking-widest rounded-full mb-1.5`}>
              {getCategoryName(topic.category, locale)}
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">
              {title}
            </h3>
          </div>
        </div>

        {/* Content section - compact */}
        <div className="p-4 space-y-3">
          {/* Fun fact */}
          {funFact && (
            <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-lg shrink-0 mt-0.5">🌟</span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-amber-700 mb-0.5">Fun Fact</p>
                <p className="text-xs text-amber-900 leading-relaxed line-clamp-2">{funFact}</p>
              </div>
            </div>
          )}

          {/* Brief description */}
          {bodyText && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
              {bodyText}
            </p>
          )}

          {/* Action button */}
          <button
            onClick={() => { onClose(); onReadFull(topic.id); }}
            className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r ${theme.modalAccent} text-white rounded-xl font-bold text-xs transition-all cursor-pointer hover:opacity-90 shadow-md`}
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

// ─── Shared props for category sections ────────────────────────────────────────
type CategorySectionProps = {
  topics: Topic[];
  category: Category;
  theme: typeof CATEGORY_THEMES[string];
  locale: Locale;
  progress: UserProgress;
  onTopicSelect: (id: string) => void;
  onPreview: (topic: Topic) => void;
};

// ─── Horizontal Scroll Carousel ───────────────────────────────────────────────
function CategoryCarousel({
  topics,
  category,
  theme,
  locale,
  progress,
  onTopicSelect,
  onPreview,
}: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const readInCat = topics.filter(t => progress.topicsRead.includes(t.id)).length;
  const quizzedInCat = topics.filter(t => progress.quizzesCompleted[t.id] !== undefined).length;
  const allQuizzed = quizzedInCat === topics.length;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="scroll-mt-20 text-black">
      {/* Category header - pill style */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {getCategoryName(category.id, locale)}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-semibold text-gray-400">
              <span>{topics.length} topics</span>
              <span>·</span>
              <span>{readInCat} read</span>
              {allQuizzed && <><span>·</span><span className="text-amber-500">🏆 Mastered</span></>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'thin' }}
      >
        {topics.map(topic => {
          const isRead = progress.topicsRead.includes(topic.id);
          const quizRecord = progress.quizzesCompleted[topic.id];
          const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;
          return (
            <motion.div
              key={topic.id}
              id={`topic-launcher-${topic.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="group shrink-0 w-56 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg cursor-pointer transition-shadow duration-300"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Image */}
              <div
                className="relative aspect-[3/2] bg-gray-50 overflow-hidden cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onPreview(topic); }}
              >
                <img
                  src={imageSrc}
                  alt={getDefensiveTitle(topic, locale)}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.cardAccent}`} />

                {/* Emoji */}
                <div className="absolute top-2 left-2 text-lg bg-white/90 backdrop-blur-sm w-8 h-8 flex items-center justify-center rounded-lg shadow-sm border border-white/50">
                  {topic.emoji}
                </div>

                {/* Read badge */}
                {isRead && (
                  <div className="absolute top-2 right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-600 text-white rounded-full text-[8px] font-bold uppercase tracking-wider shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                {/* Preview hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-[9px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
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
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[8px] font-bold">
                      ⭐ {quizRecord}/3
                    </span>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Featured + Grid Layout ───────────────────────────────────────────────────
function CategoryFeatured({
  topics,
  category,
  theme,
  locale,
  progress,
  onTopicSelect,
  onPreview,
}: CategorySectionProps) {
  const readInCat = topics.filter(t => progress.topicsRead.includes(t.id)).length;
  const quizzedInCat = topics.filter(t => progress.quizzesCompleted[t.id] !== undefined).length;
  const allQuizzed = quizzedInCat === topics.length;
  const featured = topics[0];
  const rest = topics.slice(1);
  const featuredImageSrc = featured.image.startsWith('http') ? featured.image : `/images/${featured.image}`;

  return (
    <section className="scroll-mt-20 text-black">
      {/* Category header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.bg} flex items-center justify-center text-xl shadow-md`}>
            {category.emoji}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {getCategoryName(category.id, locale)}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-semibold text-gray-400">
              <span>{topics.length} topics</span>
              <span>·</span>
              <span>{readInCat} read</span>
              {allQuizzed && <><span>·</span><span className="text-amber-500">🏆 Mastered</span></>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Featured card - large */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="group lg:w-1/2 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg cursor-pointer transition-shadow duration-300"
        >
          <div
            className="relative aspect-[16/9] bg-gray-50 overflow-hidden cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onPreview(featured); }}
          >
            <img
              src={featuredImageSrc}
              alt={getDefensiveTitle(featured, locale)}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.cardAccent}`} />
            <div className="absolute top-3 left-3 text-xl bg-white/90 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-xl shadow-md border border-white/50">
              {featured.emoji}
            </div>
            {progress.topicsRead.includes(featured.id) && (
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[8px] font-bold uppercase tracking-wider shadow-sm">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
                <span>Read</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="text-lg font-bold text-white leading-snug">
                {getDefensiveTitle(featured, locale)}
              </h4>
            </div>
          </div>
          <div className="p-4 cursor-pointer" onClick={() => onTopicSelect(featured.id)}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Read details</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </motion.div>

        {/* Rest of topics - grid */}
        <div className="lg:w-1/2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
          {rest.map(topic => {
            const isRead = progress.topicsRead.includes(topic.id);
            const quizRecord = progress.quizzesCompleted[topic.id];
            const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;
            return (
              <motion.div
                key={topic.id}
                id={`topic-launcher-${topic.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-300"
              >
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.cardAccent}`} />
                  <div className="absolute top-1.5 left-1.5 text-sm bg-white/90 backdrop-blur-sm w-7 h-7 flex items-center justify-center rounded-lg shadow-sm">
                    {topic.emoji}
                  </div>
                  {isRead && (
                    <div className="absolute top-1.5 right-1.5 inline-flex items-center px-1 py-0.5 bg-emerald-600 text-white rounded-full text-[7px] font-bold shadow-sm">
                      <Check className="w-2 h-2 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="p-2.5 cursor-pointer" onClick={() => onTopicSelect(topic.id)}>
                  <h4 className="text-xs font-semibold text-gray-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {getDefensiveTitle(topic, locale)}
                  </h4>
                  {quizRecord !== undefined && (
                    <span className="mt-1 inline-flex items-center px-1.5 py-0.5 bg-emerald-50 rounded-full text-emerald-600 text-[8px] font-bold">
                      ⭐ {quizRecord}/3
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Zigzag / Masonry-style Layout ────────────────────────────────────────────
function CategoryZigzag({
  topics,
  category,
  theme,
  locale,
  progress,
  onTopicSelect,
  onPreview,
}: CategorySectionProps) {
  const readInCat = topics.filter(t => progress.topicsRead.includes(t.id)).length;
  const quizzedInCat = topics.filter(t => progress.quizzesCompleted[t.id] !== undefined).length;
  const allQuizzed = quizzedInCat === topics.length;

  return (
    <section className="scroll-mt-20 text-black">
      {/* Category header with gradient badge */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.bg} flex items-center justify-center text-xl shadow-md`}>
            {category.emoji}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {getCategoryName(category.id, locale)}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-semibold text-gray-400">
              <span>{topics.length} topics</span>
              <span>·</span>
              <span>{readInCat} read</span>
              {allQuizzed && <><span>·</span><span className="text-amber-500">🏆 Mastered</span></>}
            </div>
          </div>
        </div>
      </div>

      {/* Zigzag grid: alternating tall and short cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {topics.map((topic, idx) => {
          const isRead = progress.topicsRead.includes(topic.id);
          const quizRecord = progress.quizzesCompleted[topic.id];
          const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;
          // Alternate between tall and standard cards
          const isTall = idx % 3 === 0;
          return (
            <motion.div
              key={topic.id}
              id={`topic-launcher-${topic.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className={`group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg cursor-pointer transition-shadow duration-300 ${isTall ? 'row-span-2' : ''}`}
            >
              <div
                className={`relative bg-gray-50 overflow-hidden cursor-pointer ${isTall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
                onClick={(e) => { e.stopPropagation(); onPreview(topic); }}
              >
                <img
                  src={imageSrc}
                  alt={getDefensiveTitle(topic, locale)}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.cardAccent}`} />
                <div className={`absolute top-2 left-2 text-base bg-white/90 backdrop-blur-sm w-8 h-8 flex items-center justify-center rounded-lg shadow-sm border border-white/50 ${isTall ? '!text-lg !w-9 !h-9' : ''}`}>
                  {topic.emoji}
                </div>
                {isRead && (
                  <div className="absolute top-2 right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-600 text-white rounded-full text-[8px] font-bold shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
                {/* Title overlay on tall cards */}
                {isTall && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                      {getDefensiveTitle(topic, locale)}
                    </h4>
                  </div>
                )}
              </div>
              {!isTall && (
                <div className="p-2.5 cursor-pointer" onClick={() => onTopicSelect(topic.id)}>
                  <h4 className="text-xs font-semibold text-gray-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {getDefensiveTitle(topic, locale)}
                  </h4>
                  {quizRecord !== undefined && (
                    <span className="mt-1 inline-flex items-center px-1.5 py-0.5 bg-emerald-50 rounded-full text-emerald-600 text-[8px] font-bold">
                      ⭐ {quizRecord}/3
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Compact Pill Layout (for smaller categories) ─────────────────────────────
function CategoryCompact({
  topics,
  category,
  theme,
  locale,
  progress,
  onTopicSelect,
  onPreview,
}: CategorySectionProps) {
  const readInCat = topics.filter(t => progress.topicsRead.includes(t.id)).length;
  const quizzedInCat = topics.filter(t => progress.quizzesCompleted[t.id] !== undefined).length;
  const allQuizzed = quizzedInCat === topics.length;

  return (
    <section className="scroll-mt-20 text-black">
      {/* Category header with colored bar */}
      <div className="mb-4">
        <div className="flex items-center gap-3 px-1">
          <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${theme.bg}`} />
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{category.emoji}</span>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {getCategoryName(category.id, locale)}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] font-semibold text-gray-400">
                <span>{topics.length} topics</span>
                <span>·</span>
                <span>{readInCat} read</span>
                {allQuizzed && <><span>·</span><span className="text-amber-500">🏆</span></>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact card list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {topics.map((topic, idx) => {
          const isRead = progress.topicsRead.includes(topic.id);
          const quizRecord = progress.quizzesCompleted[topic.id];
          const imageSrc = topic.image.startsWith('http') ? topic.image : `/images/${topic.image}`;
          return (
            <motion.div
              key={topic.id}
              id={`topic-launcher-${topic.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-300"
            >
              <div
                className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer"
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
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.cardAccent}`} />
                {isRead && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 text-sm bg-white/90 backdrop-blur-sm w-7 h-7 flex items-center justify-center rounded-lg shadow-sm">
                  {topic.emoji}
                </div>
              </div>
              <div className="p-2 cursor-pointer" onClick={() => onTopicSelect(topic.id)}>
                <h4 className="text-[11px] font-semibold text-gray-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {getDefensiveTitle(topic, locale)}
                </h4>
                {quizRecord !== undefined && (
                  <span className="mt-0.5 inline-flex items-center text-[8px] font-bold text-emerald-600">⭐ {quizRecord}/3</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
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
  const previewTheme = previewTopic ? (CATEGORY_THEMES[previewTopic.category] || CATEGORY_THEMES.pillars_of_islam) : CATEGORY_THEMES.pillars_of_islam;

  // Map category IDs to layout types for visual variety
  const layoutMap: Record<string, 'carousel' | 'featured' | 'zigzag' | 'compact'> = {
    pillars_of_islam: 'featured',
    core_beliefs: 'carousel',
    daily_practices: 'zigzag',
    islamic_values: 'compact',
    stories_history: 'carousel',
    special_times: 'featured',
  };

  return (
    <motion.div
      key="grid-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8"
    >
      {/* ── Progress header - compact ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            My Learning Map 🗺️
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Read, play quizzes, and collect badges! ✨
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

      {/* ── Search bar - minimal ── */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
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

      {/* ── Category sections with varied layouts ── */}
      <div className="space-y-10">
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
            const layout = layoutMap[category.id] || 'carousel';

            // When searching, use a simpler grid layout
            if (query) {
              return (
                <section key={category.id} className="scroll-mt-20 text-black">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${theme.bg}`} />
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
                            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.cardAccent}`} />
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
            }

            // Different layouts per category
            const catKey = category.id;
            const catTopics = topicsInCat;
            const catTheme = theme;

            switch (layout) {
              case 'carousel':
                return <div key={catKey}><CategoryCarousel topics={catTopics} category={category} theme={catTheme} locale={locale} progress={progress} onTopicSelect={onTopicSelect} onPreview={setPreviewTopic} /></div>;
              case 'featured':
                return <div key={catKey}><CategoryFeatured topics={catTopics} category={category} theme={catTheme} locale={locale} progress={progress} onTopicSelect={onTopicSelect} onPreview={setPreviewTopic} /></div>;
              case 'zigzag':
                return <div key={catKey}><CategoryZigzag topics={catTopics} category={category} theme={catTheme} locale={locale} progress={progress} onTopicSelect={onTopicSelect} onPreview={setPreviewTopic} /></div>;
              case 'compact':
                return <div key={catKey}><CategoryCompact topics={catTopics} category={category} theme={catTheme} locale={locale} progress={progress} onTopicSelect={onTopicSelect} onPreview={setPreviewTopic} /></div>;
              default:
                return <div key={catKey}><CategoryCarousel topics={catTopics} category={category} theme={catTheme} locale={locale} progress={progress} onTopicSelect={onTopicSelect} onPreview={setPreviewTopic} /></div>;
            }
          });

          if (!hasResults) {
            return (
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
