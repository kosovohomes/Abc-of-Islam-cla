import { Fragment } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AudioNarrator from '@/components/content/AudioNarrator';
import ImageCard from '@/components/content/ImageCard';
import ExportModal from '@/components/export/ExportModal';
import AgeSelector from '@/components/content/AgeSelector';
import QuizPanel from '@/components/content/QuizPanel';
import { getDefensiveTitle, getDefensiveFunFact, getDefensiveContent } from '@/lib/helpers';
import type { Topic, UserProgress, Locale, AgeLevel } from '@/types';

interface TopicReaderProps {
  activeTopic: Topic;
  locale: Locale;
  ageLevel: AgeLevel;
  content: Topic[];
  selectedTopicId: string;
  progress: UserProgress;
  toggleSaveChapter: (id: string) => void;
  languageNames: Record<string, string>;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onBackToGrid: () => void;
  onSaveQuizScore: (topicId: string, score: number) => void;
  onBadgeCheck: () => void;
}

export default function TopicReader({
  activeTopic,
  locale,
  ageLevel,
  content,
  selectedTopicId,
  progress,
  toggleSaveChapter,
  languageNames,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
  onBackToGrid,
  onSaveQuizScore,
  onBadgeCheck,
}: TopicReaderProps) {
  const { t } = useTranslation();
  const title = getDefensiveTitle(activeTopic, locale);
  const bodyText = getDefensiveContent(activeTopic, ageLevel, locale);
  const funFact = getDefensiveFunFact(activeTopic, locale);
  const isSaved = progress.savedChapters?.includes(activeTopic.id) ?? false;

  return (
    <motion.div
      key="topic-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="px-3 sm:px-5 lg:px-8 py-3 max-w-full mx-auto w-full flex-1 flex flex-col lg:h-[calc(100vh-64px)] lg:max-h-[calc(100vh-64px)] lg:overflow-hidden"
    >
      {/* ── Top action bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 no-print shrink-0">
        <button
          onClick={onBackToGrid}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 hover:scale-[1.03] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer group"
        >
          <div className="w-7 h-7 bg-emerald-100 group-hover:bg-emerald-200 rounded-full flex items-center justify-center transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>{t('exploreIndex')}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <div className="md:hidden">
            <AgeSelector />
          </div>
          <button
            onClick={() => toggleSaveChapter(activeTopic.id)}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 border-2 text-[10px] font-extrabold uppercase tracking-widest cursor-pointer transition-all rounded-full shadow-sm active:translate-y-px ${
              isSaved
                ? 'bg-amber-400 text-amber-950 border-amber-300'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-black/5'
            }`}
            title={isSaved ? t('saved') + '!' : t('saveOffline')}
          >
            <span>★ {isSaved ? t('saved') : t('saveOffline')}</span>
          </button>
          <ExportModal content={content} currentTopicId={activeTopic.id} />
        </div>
      </div>

      {/* ── Main two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1 min-h-0 lg:overflow-hidden mb-2">

        {/* Left column */}
        <div className="lg:col-span-8 bg-white border-2 border-emerald-100 rounded-3xl shadow-xl relative overflow-hidden flex flex-col h-full lg:overflow-y-auto custom-scrollbar">

          {/* Colourful top stripe */}
          <div className="h-1.5 w-full rainbow-border shrink-0" />

          <div className="p-4 sm:p-6 space-y-4 flex-1 flex flex-col">
            {/* Background watermark */}
            <div className="absolute right-0 top-0 text-[280px] font-sans font-black text-emerald-500/[0.018] select-none leading-none -mr-10 -mt-12 pointer-events-none">
              {activeTopic.emoji}
            </div>

            {/* Category + title */}
            <div className="flex flex-wrap items-start justify-between gap-3 relative z-10 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                  {t('categories.' + activeTopic.category)}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent mt-2 leading-tight">
                  {title}
                </h2>
              </div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-5xl sm:text-6xl leading-none select-none filter drop-shadow-md"
              >
                {activeTopic.emoji}
              </motion.div>
            </div>

            {/* BIG illustration — no max-w constraint, fills column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative z-10 w-full rounded-3xl overflow-hidden shadow-lg shrink-0"
            >
              <ImageCard src={activeTopic.image} alt={title} icon={activeTopic.emoji} />
            </motion.div>

            {/* Audio narrator bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl shadow-sm no-print relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full text-white shadow-md">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-emerald-800 uppercase tracking-wider block">{t('listenToStory')}</span>
                  <span className="text-[10px] text-emerald-600">{t('cheerfulVoice')}</span>
                </div>
              </div>
              <AudioNarrator text={bodyText} />
            </div>

            {/* Body text */}
            <div className="prose max-w-none text-[#2C3E50]/90 font-sans leading-relaxed text-sm sm:text-base font-medium relative z-10 flex-1">
              <p>{bodyText}</p>
            </div>

            {/* Fun fact */}
            {funFact && (
              <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 shadow-sm relative overflow-hidden z-10 shrink-0">
                <div className="absolute right-3 -bottom-3 text-6xl opacity-10 select-none">💡</div>
                <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-amber-900 flex items-center gap-1.5 border-b border-amber-200 pb-2 mb-2">
                  <span>🌟</span>
                  <span>{t('funFact')}</span>
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed relative z-10">{funFact}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: quiz panel */}
        <div className="lg:col-span-4 flex flex-col h-full lg:overflow-y-auto custom-scrollbar">
          <Fragment key={selectedTopicId}>
            <QuizPanel
              activeTopic={activeTopic}
              locale={locale}
              progress={progress}
              onSaveScore={onSaveQuizScore}
              onBadgeCheck={onBadgeCheck}
            />
          </Fragment>
        </div>
      </div>

      {/* ── Prev / Next navigation ── */}
      <div className="flex gap-3 justify-between no-print shrink-0">
        <button
          id="btn-prev-topic"
          onClick={onNavigatePrev}
          disabled={!hasPrev}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-650 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>{t('previous')}</span>
        </button>
        <button
          id="btn-next-topic"
          onClick={onNavigateNext}
          disabled={!hasNext}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-3 shimmer-btn text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>{t('nextTopic')}</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </motion.div>
  );
}
