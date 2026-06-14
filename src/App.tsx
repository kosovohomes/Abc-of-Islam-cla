import { useState, useEffect, useRef, Fragment } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'motion/react';
import { Trophy, VolumeX, Volume2, Menu, X, ChevronLeft } from 'lucide-react';

import LanguagePicker from '@/components/layout/LanguagePicker';
import AgeSelector from '@/components/content/AgeSelector';
import BadgeBoard, { BADGES } from '@/components/gamification/BadgeBoard';

// ── New split views ────────────────────────────────────────────────────────────
import LandingPage from '@/components/views/LandingPage';
import TopicGrid from '@/components/views/TopicGrid';
import TopicReader from '@/components/views/TopicReader';
import CelebrationOverlays from '@/components/layout/CelebrationOverlays';
import AdminDashboard from '@/components/admin/AdminDashboard';

import { useAppStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import { isRTLLocale } from '@/i18n';
import { CATEGORIES, TOPICS, getTopics } from '@/lib/topics';
import { trackTopicView, trackQuizAttempt, getAdminSettings, isSuspended } from '@/lib/adminStore';
import { getContent } from '@/lib/content';
import { LANGUAGE_NAMES } from '@/lib/locales';

export default function App() {
  // ── Global store ─────────────────────────────────────────────────────────────
  const {
    locale,
    setLocale,
    ageLevel,
    progress,
    markTopicRead,
    setQuizScore,
    addBadge,
    audioEnabled,
    toggleAudio,
    isOnline,
    setOnline,
    toggleSaveChapter,
  } = useAppStore();

  // ── i18next ──────────────────────────────────────────────────────────────────
  const { t, i18n } = useTranslation();

  // Sync i18next language with Zustand store (bidirectional)
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  // Also listen for i18next language changes (e.g. from browser detection) and sync to store
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const supported = ['en', 'ar', 'ur', 'tr', 'fr', 'es', 'hi', 'id', 'de', 'ru', 'bn', 'pt', 'zh', 'ja', 'sw', 'ko'];
      const baseLng = lng.split('-')[0]; // 'ar-SA' → 'ar'
      if (supported.includes(baseLng) && baseLng !== locale) {
        setLocale(baseLng as any);
      }
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, [locale, i18n, setLocale]);

  // ── View / navigation state ───────────────────────────────────────────────────
  // Parse initial state from URL hash (e.g. #/topic/shahada, #/topics, #/)
  const parseHashState = (): { view: 'landing' | 'grid' | 'topic'; topicId: string } => {
    if (typeof window === 'undefined') return { view: 'landing', topicId: 'shahada' };
    const hash = window.location.hash.replace(/^#\//, '');
    if (hash === 'admin') return { view: 'admin' as any, topicId: 'shahada' };
    if (hash.startsWith('topic/')) {
      const id = hash.slice('topic/'.length) || 'shahada';
      return { view: 'topic', topicId: id };
    }
    if (hash === 'topics') return { view: 'grid', topicId: 'shahada' };
    return { view: 'landing', topicId: 'shahada' };
  };

  const [currentView, setCurrentView] = useState<'landing' | 'grid' | 'topic' | 'admin'>(() => parseHashState().view as any);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => parseHashState().topicId);

  // Keep URL hash in sync with view state
  const pushHash = (view: 'landing' | 'grid' | 'topic', topicId?: string) => {
    if (typeof window === 'undefined') return;
    let hash = '#/';
    if ((view as string) === 'admin') hash = '#/admin';
    else if (view === 'grid') hash = '#/topics';
    else if (view === 'topic' && topicId) hash = `#/topic/${topicId}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
  };

  // Sync hash → state when user presses Back/Forward
  useEffect(() => {
    const onPopState = () => {
      const { view, topicId } = parseHashState();
      setCurrentView(view);
      setSelectedTopicId(topicId);
    };
    window.addEventListener('popstate', onPopState);
    // ── Maintenance mode gate ───────────────────────────────────────────────────
  const adminSettings = getAdminSettings();
  if (adminSettings.maintenanceMode && currentView !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-8 text-center">
        <div>
          <div className="text-7xl mb-6">🔧</div>
          <h1 className="text-3xl font-extrabold text-white mb-3">{t('underMaintenance')}</h1>
          <p className="text-white/60 text-lg">{t('maintenanceMsg', { siteName: adminSettings.siteName })}</p>
        </div>
      </div>
    );
  }

  return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Sync state → hash whenever view or topic changes
  useEffect(() => {
    pushHash(currentView, selectedTopicId);
  }, [currentView, selectedTopicId]);

  // ── Overlay state ─────────────────────────────────────────────────────────────
  const [showBadges, setShowBadges] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unlockedBadgeName, setUnlockedBadgeName] = useState<string | null>(null);
  const [masteredCategory, setMasteredCategory] = useState<{ name: string; emoji: string } | null>(null);

  // ── Grid filter state ─────────────────────────────────────────────────────────
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Category-mastery tracking ─────────────────────────────────────────────────
  const [completedQuizCategories, setCompletedQuizCategories] = useState<string[]>([]);
  const hasInitializedCompletedCategories = useRef(false);

  useEffect(() => {
    const currentCompleted = CATEGORIES.filter(cat => {
      const topicsInCat = getTopics().filter(tp => tp.category === cat.id);
      return (
        topicsInCat.length > 0 &&
        topicsInCat.every(tp => progress.quizzesCompleted[tp.id] !== undefined)
      );
    }).map(cat => cat.id);

    if (!hasInitializedCompletedCategories.current) {
      setCompletedQuizCategories(currentCompleted);
      hasInitializedCompletedCategories.current = true;
      return;
    }

    const newlyCompleted = currentCompleted.find(
      catId => !completedQuizCategories.includes(catId),
    );
    if (newlyCompleted) {
      setCompletedQuizCategories(currentCompleted);
      const category = CATEGORIES.find(c => c.id === newlyCompleted);
      if (category) {
        triggerCategoryCelebration(t('categories.' + category.id), category.emoji);
      }
    } else if (currentCompleted.length < completedQuizCategories.length) {
      setCompletedQuizCategories(currentCompleted);
    }
  }, [progress.quizzesCompleted, locale]);

  // ── Browser online status ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      setOnline(navigator.onLine);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [setOnline]);

  // ── Derived content values ────────────────────────────────────────────────────
  const isRtlLayout = isRTLLocale(locale);
  const content = getContent(locale);
  const activeTopic = content.find(tp => tp.id === selectedTopicId) ?? content[0];
  const topicsReadCount = progress.topicsRead.length;
  const totalTopics = getTopics().filter(t => !isSuspended(t.id)).length;
  const currentIdx = content.findIndex(tp => tp.id === selectedTopicId);

  // ── Mark topic read when entering topic view ──────────────────────────────────
  useEffect(() => {
    if (currentView === 'topic' && activeTopic) {
      // Track real view count in adminStore
      trackTopicView(activeTopic.id);
      if (!progress.topicsRead.includes(activeTopic.id)) {
        markTopicRead(activeTopic.id);
        checkBadgeTriggers();
      }
    }
  }, [currentView, selectedTopicId]);

  // ── Live admin re-render on dashboard changes ────────────────────────────────
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    window.addEventListener('abc_admin_updated', handler);
    return () => window.removeEventListener('abc_admin_updated', handler);
  }, []);

  // ── Badge checker ─────────────────────────────────────────────────────────────
  const checkBadgeTriggers = () => {
    const updatedProgress = useAppStore.getState().progress;
    for (const badge of BADGES) {
      if (
        !updatedProgress.badges.includes(badge.id) &&
        badge.condition(updatedProgress)
      ) {
        addBadge(badge.id);
        setUnlockedBadgeName(badge.nameKey);
      }
    }
  };

  // ── Category celebration ──────────────────────────────────────────────────────
  const triggerCategoryCelebration = (name: string, emoji: string) => {
    const duration = 4_000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 5, angle: 60, spread: 60,
        origin: { x: 0, y: 0.8 },
        colors: ['#34D399', '#059669', '#FBBF24', '#F59E0B', '#3B82F6', '#EC4899'],
      });
      confetti({
        particleCount: 5, angle: 120, spread: 60,
        origin: { x: 1, y: 0.8 },
        colors: ['#34D399', '#059669', '#FBBF24', '#F59E0B', '#3B82F6', '#EC4899'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    confetti({
      particleCount: 150, spread: 90, origin: { y: 0.6 },
      colors: ['#34D399', '#059669', '#FBBF24', '#F59E0B', '#3B82F6', '#9333EA'],
    });
    frame();
    setMasteredCategory({ name, emoji });
  };

  // ── Navigation handlers ───────────────────────────────────────────────────────
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCurrentView('topic');
  };

  const handleNavigateNext = () => {
    if (currentIdx !== -1 && currentIdx < content.length - 1) {
      setSelectedTopicId(content[currentIdx + 1].id);
    }
  };

  const handleNavigatePrev = () => {
    if (currentIdx > 0) {
      setSelectedTopicId(content[currentIdx - 1].id);
    }
  };

  const handleHeaderBack = () => {
    if (currentView === 'topic') setCurrentView('grid');
    else setCurrentView('landing');
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`min-h-screen ${
        currentView === 'topic' ? 'lg:h-screen lg:max-h-screen lg:overflow-hidden' : ''
      } flex flex-col antialiased relative selection:bg-emerald-500/10 selection:text-emerald-700 bg-[#F8FAF5]`}
      dir={isRtlLayout ? 'rtl' : 'ltr'}
    >
      {/* ── Sticky navigation header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm no-print shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">

          {/* LEFT: GIF logo on landing, back pill on inner views */}
          {currentView === 'landing' ? (
            <a href="#/" className="shrink-0 flex items-center">
              <img
                src="https://ik.imagekit.io/4zbzbdytp/ABC%20of%20ISLAM.gif"
                alt="ABC of Islam"
                className="h-9 sm:h-10 w-auto object-contain"
                draggable={false}
              />
            </a>
          ) : (
            <button
              onClick={handleHeaderBack}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors border border-emerald-100"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{currentView === 'topic' ? t('topicIndex') : t('home')}</span>
            </button>
          )}

          {/* CENTRE: Age selector — desktop */}
          <div className="hidden md:flex flex-1 justify-center">
            <AgeSelector />
          </div>

          {/* RIGHT: controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* Online pill — sm+ */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isOnline ? t('online') : t('offline')}
            </div>

            {/* Audio toggle */}
            <button
              id="header-audio-toggle"
              onClick={toggleAudio}
              title={audioEnabled ? 'Mute' : 'Unmute'}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>

            {/* Age selector — tablet only (sm, hidden on md+) */}
            <div className="hidden sm:block md:hidden">
              <AgeSelector />
            </div>

            {/* Badges */}
            <button
              id="header-badges-btn"
              onClick={() => setShowBadges(true)}
              className="relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full border border-amber-200 text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">{t('badges')}</span>
              {progress.badges.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-rose-500 text-white text-[8px] font-extrabold rounded-full shadow-sm">
                  {progress.badges.length}
                </span>
              )}
            </button>

            {/* Language picker — sm+ */}
            <div className="hidden sm:block">
              <LanguagePicker />
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="sm:hidden overflow-hidden border-t border-gray-100 bg-white"
            >
              <div className="px-4 py-4 space-y-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">{t('ageLevel')}</p>
                  <AgeSelector />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">{t('language')}</p>
                  <LanguagePicker />
                </div>
                <div className="flex items-center gap-2 pb-1">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-xs font-semibold text-gray-500">{isOnline ? t('online') : t('offline')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main content area ── */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <Fragment key="landing">
              <LandingPage
                locale={locale}
                onStart={() => setCurrentView('grid')}
                onTopicSelect={(topicId) => {
                  handleTopicSelect(topicId);
                }}
              />
            </Fragment>
          )}

          {currentView === 'grid' && (
            <Fragment key="grid">
              <TopicGrid
                locale={locale}
                content={content}
                progress={progress}
                isRtlLayout={isRtlLayout}
                showSavedOnly={showSavedOnly}
                setShowSavedOnly={setShowSavedOnly}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                topicsReadCount={topicsReadCount}
                totalTopics={totalTopics}
                onTopicSelect={handleTopicSelect}
              />
            </Fragment>
          )}

          {currentView === 'topic' && activeTopic && (
            <Fragment key="topic-shell">
              <TopicReader
                activeTopic={activeTopic}
                locale={locale}
                ageLevel={ageLevel}
                content={content}
                selectedTopicId={selectedTopicId}
                progress={progress}
                toggleSaveChapter={toggleSaveChapter}
                languageNames={LANGUAGE_NAMES}
                onNavigatePrev={handleNavigatePrev}
                onNavigateNext={handleNavigateNext}
                hasPrev={currentIdx > 0}
                hasNext={currentIdx < content.length - 1}
                onBackToGrid={() => setCurrentView('grid')}
                onSaveQuizScore={(topicId, score) => {
                  setQuizScore(topicId, score);
                  trackQuizAttempt(topicId);
                }}
                onBadgeCheck={checkBadgeTriggers}
              />
            </Fragment>
          )}
        </AnimatePresence>
      </main>

      {/* ── Admin Dashboard (full-page takeover via #/admin) ── */}
      {currentView === 'admin' && (
        <div className="fixed inset-0 z-[200]">
          <AdminDashboard onExit={() => { setCurrentView('landing'); }} />
        </div>
      )}

      {/* ── All celebration + badge overlays ── */}
      <CelebrationOverlays
        locale={locale}
        progress={progress}
        showBadges={showBadges}
        setShowBadges={setShowBadges}
        unlockedBadgeName={unlockedBadgeName}
        setUnlockedBadgeName={setUnlockedBadgeName}
        masteredCategory={masteredCategory}
        setMasteredCategory={setMasteredCategory}
      />
    </div>
  );
}
