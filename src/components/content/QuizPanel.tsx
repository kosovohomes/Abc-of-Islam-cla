import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, CheckCircle2, Star, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BadgeBoard from '@/components/gamification/BadgeBoard';
import {
  getDefensiveQuestion,
  getDefensiveOption,
  getDefensiveExplanation,
  getDefensiveTitle,
} from '@/lib/helpers';
import type { Topic, UserProgress, Locale } from '@/types';

interface QuizPanelProps {
  activeTopic: Topic;
  locale: Locale;
  progress: UserProgress;
  onSaveScore: (topicId: string, score: number) => void;
  onBadgeCheck: () => void;
}

const SCORE_CONFIG = [
  { emoji: '😢', labelKey: 'keepTrying', color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50' },
  { emoji: '😊', labelKey: 'goodTry',    color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
  { emoji: '🌟', labelKey: 'greatJob',   color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50' },
  { emoji: '🏆', labelKey: 'perfect',     color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50' },
];

// Floating particles for correct answer celebration
function Particles() {
  const items = ['⭐', '✨', '🎉', '💫', '🌟', '⚡'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {items.map((item, i) => (
        <motion.span
          key={i}
          initial={{ y: 0, x: `${15 + i * 13}%`, opacity: 1, scale: 0.8 }}
          animate={{ y: -90, opacity: 0, scale: 1.4, rotate: 360 }}
          transition={{ duration: 1.2, delay: i * 0.08, ease: 'easeOut' }}
          className="absolute bottom-4 text-xl select-none"
        >
          {item}
        </motion.span>
      ))}
    </div>
  );
}

export default function QuizPanel({
  activeTopic,
  locale,
  progress,
  onSaveScore,
  onBadgeCheck,
}: QuizPanelProps) {
  const { t } = useTranslation();
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const scoreRef = useRef(0);

  const totalQuestions = activeTopic.quiz?.length || 0;
  const previousBest = progress.quizzesCompleted[activeTopic.id];

  const resetQuiz = () => {
    setQuizActive(false);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setDisplayScore(0);
    setQuizCompleted(false);
    setShowParticles(false);
    scoreRef.current = 0;
  };

  const handleOptionPress = (choiceIdx: number, correctIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(choiceIdx);
    if (choiceIdx === correctIdx) {
      scoreRef.current += 1;
      setDisplayScore(scoreRef.current);
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1400);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      const finalScore = scoreRef.current;
      setQuizCompleted(true);
      const prevBest = progress.quizzesCompleted[activeTopic.id] ?? 0;
      if (finalScore > prevBest) {
        onSaveScore(activeTopic.id, finalScore);
        onBadgeCheck();
      }
    }
  };

  const scoreInfo = SCORE_CONFIG[Math.min(displayScore, 3)];
  const progressPct = totalQuestions > 0 ? ((currentQuestionIdx) / totalQuestions) * 100 : 0;

  return (
    <div className="relative flex flex-col h-full min-h-0 rounded-3xl overflow-hidden shadow-xl">
      {/* Gradient background that shifts based on quiz state */}
      <div className={`absolute inset-0 transition-all duration-700 ${
        !quizActive
          ? 'bg-gradient-to-b from-violet-500 via-purple-600 to-indigo-700'
          : quizCompleted
          ? `bg-gradient-to-b ${scoreInfo.color}`
          : 'bg-gradient-to-b from-indigo-600 via-violet-600 to-purple-700'
      }`} />

      {/* Decorative bubbles */}
      <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute bottom-16 left-2 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-1/3 right-2 w-10 h-10 rounded-full bg-white/8 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1 min-h-0 p-4 sm:p-5">

        {/* ── PRE-QUIZ STATE ── */}
        <AnimatePresence mode="wait">
        {!quizActive && (
          <motion.div
            key="pre-quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center flex-1 text-center py-4 gap-4"
          >
            {/* Big animated emoji */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl sm:text-8xl select-none filter drop-shadow-lg"
            >
              🎯
            </motion.div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-white leading-tight drop-shadow">
                {t('takeQuiz')}
              </h3>
              <p className="text-sm text-white/80 mt-2 max-w-xs mx-auto leading-relaxed font-medium">
                {t('quizPracticeAbout')}{' '}
                <span className="font-extrabold text-yellow-300">{getDefensiveTitle(activeTopic, locale)}</span>{' '}
                {t('quizWithPuzzle')}
              </p>
            </div>

            {/* Best score badge */}
            {previousBest !== undefined && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400/20 border-2 border-yellow-300/50 text-yellow-200 rounded-full text-sm font-bold backdrop-blur-sm"
              >
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                {t('bestScore')} {previousBest}/{totalQuestions}
              </motion.div>
            )}

            {/* Stars decoration */}
            <div className="flex gap-3 text-2xl">
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  className="select-none"
                >
                  {previousBest !== undefined && i < previousBest ? '⭐' : '☆'}
                </motion.span>
              ))}
            </div>

            {/* Start button */}
            <motion.button
              id="btn-start-quiz"
              onClick={() => setQuizActive(true)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 flex items-center gap-2.5 px-8 py-3.5 bg-white text-purple-700 rounded-2xl text-base font-extrabold shadow-xl hover:shadow-2xl transition-shadow cursor-pointer pulse-glow"
            >
              <Zap className="w-5 h-5 fill-yellow-400 text-yellow-500" />
              <span>{t('startQuiz')}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </motion.button>

            <p className="text-white/50 text-xs font-medium">{t('quizQuestionsCount', { count: totalQuestions, total: totalQuestions })}</p>
          </motion.div>
        )}

        {/* ── ACTIVE QUIZ ── */}
        {quizActive && !quizCompleted && (
          <motion.div
            key="active-quiz"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1 min-h-0 gap-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-xs font-bold uppercase tracking-wider">
                  Q {currentQuestionIdx + 1} / {totalQuestions}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: totalQuestions }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i < currentQuestionIdx
                          ? 'bg-yellow-300 scale-110'
                          : i === currentQuestionIdx
                          ? 'bg-white animate-pulse'
                          : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400/20 text-yellow-200 text-xs font-bold px-2 py-0.5 rounded-full border border-yellow-300/30">
                  ⭐ {displayScore}
                </span>
                <button
                  onClick={resetQuiz}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/60 hover:text-white cursor-pointer"
                  title="Quit quiz"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden shrink-0">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"
                initial={{ width: `${progressPct}%` }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {activeTopic.quiz && activeTopic.quiz[currentQuestionIdx] && (
              <>
                {/* Question */}
                <motion.div
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 shrink-0 border border-white/20"
                >
                  <h4 className="font-serif font-extrabold text-sm sm:text-base text-white leading-snug">
                    {getDefensiveQuestion(activeTopic.quiz[currentQuestionIdx], locale)}
                  </h4>
                </motion.div>

                {/* Options */}
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  {activeTopic.quiz[currentQuestionIdx].options.map((opt, oIdx) => {
                    const optText = getDefensiveOption(opt, locale);
                    const isCorrect = oIdx === activeTopic.quiz[currentQuestionIdx].correct;
                    const isSelected = selectedOption === oIdx;
                    const answered = selectedOption !== null;

                    return (
                      <motion.button
                        id={`quiz-option-${oIdx}`}
                        key={oIdx}
                        onClick={() => handleOptionPress(oIdx, activeTopic.quiz[currentQuestionIdx].correct)}
                        disabled={answered}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: oIdx * 0.06 }}
                        whileHover={!answered ? { scale: 1.02, x: 4 } : {}}
                        whileTap={!answered ? { scale: 0.97 } : {}}
                        className={`w-full py-3 px-4 text-left rounded-2xl text-sm font-bold border-2 transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          !answered
                            ? 'bg-white/15 border-white/30 text-white hover:bg-white/25 hover:border-white/50 backdrop-blur-sm'
                            : isCorrect
                            ? 'bg-emerald-400 border-emerald-300 text-white shadow-lg shadow-emerald-500/30'
                            : isSelected
                            ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30'
                            : 'bg-white/8 border-white/10 text-white/40 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                            !answered ? 'bg-white/20' : isCorrect ? 'bg-white/30' : isSelected ? 'bg-white/30' : 'bg-white/10'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-tight">{optText}</span>
                        </div>
                        {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                        {answered && isSelected && !isCorrect && <X className="w-5 h-5 text-white shrink-0" />}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Particles on correct */}
                <AnimatePresence>
                  {showParticles && <Particles />}
                </AnimatePresence>

                {/* Explanation */}
                <AnimatePresence>
                  {selectedOption !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-3 shrink-0"
                    >
                      <span className="font-extrabold block text-[9px] uppercase tracking-wider text-yellow-300 mb-1">
                        {t('learningMoment')}
                      </span>
                      <p className="text-xs text-white/90 leading-relaxed">
                        {getDefensiveExplanation(activeTopic.quiz[currentQuestionIdx], locale)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next button */}
                <AnimatePresence>
                  {selectedOption !== null && (
                    <motion.button
                      id="btn-quiz-continue"
                      onClick={handleNext}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white text-purple-700 rounded-2xl text-sm font-extrabold shadow-lg cursor-pointer transition-all shrink-0"
                    >
                      <span>
                        {currentQuestionIdx < totalQuestions - 1
                          ? t('nextQuestion')
                          : t('seeResults')}
                      </span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}

        {/* ── RESULTS ── */}
        {quizActive && quizCompleted && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            className="flex flex-col items-center justify-center flex-1 text-center gap-4 py-4"
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl sm:text-8xl select-none filter drop-shadow-xl"
            >
              {SCORE_CONFIG[Math.min(displayScore, 3)].emoji}
            </motion.div>

            <div>
              <h4 className="text-3xl font-serif font-extrabold text-white drop-shadow">
                {t(SCORE_CONFIG[Math.min(displayScore, 3)].labelKey)}
              </h4>
              <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 300 }}
                    className={`text-3xl select-none ${i < displayScore ? '' : 'opacity-30'}`}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-white/80 mt-3 font-semibold"
              >
                {t('youGotCorrect', { score: displayScore, total: totalQuestions })}
              </motion.p>
            </div>

            {/* Badge board */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="w-full bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20 max-h-28 overflow-y-auto custom-scrollbar"
            >
              <BadgeBoard />
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-3 w-full"
            >
              <button
                id="btn-quiz-retry"
                onClick={resetQuiz}
                className="flex-1 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer border border-white/30 hover:border-white/50"
              >
                {t('tryAgain')} 🔄
              </button>
              <button
                id="btn-quiz-complete"
                onClick={resetQuiz}
                className="flex-1 py-3 bg-white text-purple-700 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-105"
              >
                {t('continueBtn')} →
              </button>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
