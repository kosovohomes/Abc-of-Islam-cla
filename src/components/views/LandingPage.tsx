import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shield,
  Heart,
  BookOpen,
  Check,
  Sun,
  Moon,
  X,
  ExternalLink,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AgeSelector from '@/components/content/AgeSelector';
import { t } from '@/lib/translations';
import type { Locale } from '@/types';

interface LandingPageV2Props {
  locale: Locale;
  onStart: () => void;
  onTopicSelect?: (topicId: string) => void;
}

/* =====================================================
   9 chapter cards with REAL images from the new design
   ===================================================== */
const topicCards = [
  {
    id: 'hajj',
    title: 'Hajj',
    subtitle: 'The sacred journey to Makkah',
    tag: 'Pilgrimage',
    tagColor: '#0d9488',
    topicLink: 'hajj',
    img: 'https://ik.imagekit.io/4zbzbdytp/hajj_overview-9BS5YUf8qgFKvNgAVo2DpT.webp?updatedAt=1781117901446',
  },
  {
    id: 'umrah',
    title: 'Umrah',
    subtitle: 'The lesser pilgrimage, full of reward',
    tag: 'Pilgrimage',
    tagColor: '#ff7f5c',
    topicLink: 'hajj',
    img: 'https://ik.imagekit.io/4zbzbdytp/imgi_24_topic_myths_facts-9XosEGtJZUumCGvLgPN7Zd.webp?updatedAt=1781117901326',
  },
  {
    id: 'sadaqah',
    title: 'Sadaqah',
    subtitle: 'Voluntary giving for the love of Allah',
    tag: 'Charity',
    tagColor: '#f5b400',
    tagTextDark: true,
    topicLink: 'zakat',
    img: 'https://ik.imagekit.io/4zbzbdytp/imgi_46_sadaqah_voluntary-metCJkjaZZWHwc3n86346d.webp?updatedAt=1781117902191',
  },
  {
    id: 'ramadan',
    title: 'Ramadan',
    subtitle: 'The blessed month of fasting & reflection',
    tag: 'Fasting',
    tagColor: '#0d9488',
    topicLink: 'ramadan',
    img: 'https://ik.imagekit.io/4zbzbdytp/imgi_39_ramadan_overview-KSNdX85Mzos8r2Xf3JL6rh.webp?updatedAt=1781117901328',
  },
  {
    id: 'myths-facts',
    title: 'Myths & Facts',
    subtitle: 'Separating truth from misconception',
    tag: 'Truth',
    tagColor: '#ff7f5c',
    topicLink: 'day_of_judgment',
    img: 'https://ik.imagekit.io/4zbzbdytp/imgi_24_topic_myths_facts-9XosEGtJZUumCGvLgPN7Zd.webp?updatedAt=1781117901326',
  },
  {
    id: 'prophet-muhammad',
    title: 'Prophet Muhammad ﷺ',
    subtitle: 'The journey of the final messenger',
    tag: 'Prophet',
    tagColor: '#f5b400',
    tagTextDark: true,
    topicLink: 'prophet_muhammad',
    img: 'https://ik.imagekit.io/4zbzbdytp/imgi_19_topic_prophet_journey-8ffuT33CJYiTZzo3bCifJ9.webp?updatedAt=1781117900256',
  },
  {
    id: 'prophet-stories',
    title: 'Stories of Prophets',
    subtitle: 'Adam, Nuh, Musa & more — timeless tales',
    tag: 'Stories',
    tagColor: '#0d9488',
    topicLink: 'prophets',
    img: 'https://ik.imagekit.io/4zbzbdytp/imgi_3_prophet_stories_feature-FtRej2zvGTyPa9u6r2MF85.webp?updatedAt=1781117901347',
  },
  {
    id: 'eid',
    title: 'Eid al-Fitr & Eid al-Adha',
    subtitle: 'Two joyful celebrations for Muslims',
    tag: 'Celebration',
    tagColor: '#ff7f5c',
    topicLink: 'eid_al_fitr',
    img: 'https://ik.imagekit.io/4zbzbdytp/imgi_44_eid_fitr_vs_adha-5iDNf8qryiopWpY9KdzQY6.webp?updatedAt=1781117900159',
  },
  {
    id: 'halal-haram',
    title: 'Halal & Haram',
    subtitle: 'Understanding what is permitted in Islam',
    tag: 'Lifestyle',
    tagColor: '#0a7a70',
    topicLink: 'halal_food',
    img: 'https://ik.imagekit.io/4zbzbdytp/imgi_16_topic_halal_haram_food-2MdETNGseNCerrvGkHzkzE.webp?updatedAt=1781117900194',
  },
];

export default function LandingPageV2({ locale, onStart, onTopicSelect }: LandingPageV2Props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeAge, setActiveAge] = useState<'Beginner' | 'Explorer' | 'Thinker'>('Explorer');
  const [modalCard, setModalCard] = useState<typeof topicCards[number] | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const stored = localStorage.getItem('abc_islam_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const reduceMotion = useReducedMotion();

  /* Auto-center the active slide */
  useEffect(() => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const card = container.children[activeSlide] as HTMLElement | undefined;
    if (!card) return;
    const target = card.offsetLeft - container.clientWidth / 2 + card.clientWidth / 2;
    container.scrollTo({ left: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [activeSlide, reduceMotion]);

  /* Drag-to-scroll on the carousel */
  const dragDistance = useRef(0);
  const onPointerDown = (e: React.PointerEvent) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = 'grabbing';
    carouselRef.current.style.scrollBehavior = 'auto';
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const delta = x - startX.current;
    dragDistance.current = Math.abs(delta);
    carouselRef.current.scrollLeft = scrollLeft.current - delta * 1.4;
  };
  const onPointerUp = () => {
    if (!carouselRef.current) return;
    isDragging.current = false;
    carouselRef.current.style.cursor = 'grab';
    carouselRef.current.style.scrollBehavior = 'smooth';
    // snap to nearest card
    const container = carouselRef.current;
    const center = container.scrollLeft + container.clientWidth / 2;
    let nearest = 0;
    let nearestDist = Infinity;
    Array.from(container.children).forEach((c, i) => {
      const el = c as HTMLElement;
      const cardCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setActiveSlide(nearest);
  };

  return (
    <motion.div
      key="landing-view-v2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen w-full relative overflow-x-hidden font-['Poppins','Tajawal','system-ui'] ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-[#0a1a18] via-[#0c2420] to-[#081e1b] text-[#d4e8e3]'
          : 'bg-gradient-to-b from-[#fdf6ee] via-[#f0ece4] to-[#e8f0f0] text-[#06241f]'
      }`}
    >
      {/* ============================================================
         ANIMATED BACKGROUND (radial pulse + stars + falling lanterns)
         ============================================================ */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              theme === 'dark'
                ? 'radial-gradient(circle at 15% 15%, rgba(13,148,136,.06), transparent 45%), radial-gradient(circle at 85% 25%, rgba(245,180,0,.04), transparent 45%), radial-gradient(circle at 50% 75%, rgba(78,167,255,.04), transparent 50%)'
                : 'radial-gradient(circle at 15% 15%, rgba(13,148,136,.15), transparent 45%), radial-gradient(circle at 85% 25%, rgba(245,180,0,.10), transparent 45%), radial-gradient(circle at 50% 75%, rgba(78,167,255,.10), transparent 50%)',
          }}
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.1, 1], rotate: [0, 1.5, 0] }
          }
          transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity }}
        />

        {/* Twinkling stars */}
        {[
          { x: 8, y: 12, big: false, color: 'var(--teal-400, #2bbfa1)' },
          { x: 22, y: 6, big: true, color: '#fbcb4d' },
          { x: 35, y: 18, big: false, color: 'var(--teal-400, #2bbfa1)' },
          { x: 50, y: 9, big: true, color: '#ff7f5c' },
          { x: 64, y: 22, big: false, color: 'var(--teal-400, #2bbfa1)' },
          { x: 78, y: 14, big: true, color: '#ff97c2' },
          { x: 90, y: 6, big: false, color: '#fbcb4d' },
          { x: 15, y: 78, big: false, color: '#ff7f5c' },
          { x: 75, y: 88, big: true, color: 'var(--teal-400, #2bbfa1)' },
          { x: 45, y: 92, big: false, color: '#ff97c2' },
        ].map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.big ? 6 : 4,
              height: s.big ? 6 : 4,
              background: s.color,
              boxShadow: `0 0 ${s.big ? 10 : 8}px ${s.color}`,
            }}
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.15, 1, 0.15], scale: [0.9, 1.4, 0.9] }
            }
            transition={{
              duration: 3,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Falling lanterns */}
        {[
          { left: 10, delay: 0 },
          { left: 28, delay: 3 },
          { left: 48, delay: 6 },
          { left: 68, delay: 9 },
          { left: 88, delay: 12 },
        ].map((l, i) => (
          <motion.span
            key={`lantern-${i}`}
            className="absolute w-8 h-13 rounded-md"
            style={{
              top: -40,
              left: `${l.left}%`,
              width: 32,
              height: 52,
              background: 'linear-gradient(180deg, #fbcb4d, #f5b400)',
              borderRadius: '8px 8px 12px 12px',
              boxShadow: '0 0 30px rgba(245,180,0,.45)',
            }}
            animate={
              reduceMotion
                ? undefined
                : { y: ['0vh', '60vh', '110vh'], rotate: [-2, 3, -2], opacity: [0, 1, 1, 0] }
            }
            transition={{
              duration: 14,
              ease: 'linear',
              repeat: Infinity,
              delay: l.delay,
            }}
          />
        ))}
      </div>

      {/* ============================================================
         TOP NAV
         ============================================================ */}
      <header className="relative z-30 flex items-center justify-between gap-3 px-4 sm:px-8 py-4 sm:py-5 max-w-[1320px] mx-auto flex-wrap">
        {/* Brand */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={reduceMotion ? undefined : { scale: 1.05, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.div
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0d9488] to-[#075f58]"
            style={{ width: 52, height: 52, borderRadius: 16 }}
            animate={
              reduceMotion
                ? undefined
                : {
                    boxShadow: [
                      '0 8px 22px rgba(13,148,136,.4)',
                      '0 8px 32px rgba(13,148,136,.7), 0 0 0 8px rgba(13,148,136,.18)',
                      '0 8px 22px rgba(13,148,136,.4)',
                    ],
                  }
            }
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
          >
            <img
              src="/images/brand-mark.jpg"
              alt="ABC of Islam"
              className="w-full h-full object-cover"
              style={{ borderRadius: 14 }}
            />
          </motion.div>
          <div className="leading-tight">
            <div
              className={`font-extrabold text-base sm:text-lg ${
                theme === 'dark' ? 'text-[#5cd5bd]' : 'text-[#075f58]'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              ABC of Islam
            </div>
            <div
              className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-[2px] ${
                theme === 'dark' ? 'text-[#a8ccc4]' : 'text-[#4a6b62]'
              }`}
              style={{ fontFamily: 'Caveat, cursive', textTransform: 'uppercase', letterSpacing: 2 }}
            >
              A Journey of Faith
            </div>
          </div>
        </motion.div>

        {/* Center: theme + age pills */}
        <div className="order-3 md:order-2 w-full md:w-auto flex items-center gap-2 sm:gap-3 overflow-x-auto md:overflow-visible">
          {/* Theme toggle */}
          <div
            className={`flex items-center rounded-2xl p-1 backdrop-blur-md ${
              theme === 'dark'
                ? 'bg-[#0a1a18]/85 border border-[#0d9488]/30'
                : 'bg-white/85 border border-[#0d9488]/20 shadow-sm'
            }`}
            style={{ boxShadow: theme === 'dark' ? undefined : '0 4px 12px rgba(13,148,136,.08)' }}
          >
            <motion.button
              onClick={() => setTheme('light')}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                theme === 'light' ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Light mode"
            >
              <Sun className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => setTheme('dark')}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                theme === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Dark mode"
            >
              <Moon className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Age pills */}
          <div
            className={`flex items-center rounded-2xl p-1 backdrop-blur-md ${
              theme === 'dark'
                ? 'bg-[#0a1a18]/85 border border-[#0d9488]/30'
                : 'bg-white/85 border border-[#0d9488]/20 shadow-sm'
            }`}
            style={{ boxShadow: theme === 'dark' ? undefined : '0 4px 12px rgba(13,148,136,.08)' }}
          >
            {[
              { label: 'Beginner', dotColor: '#0d9488' },
              { label: 'Explorer', dotColor: '#0d9488', active: true },
              { label: 'Thinker', dotColor: '#ff6fa5' },
            ].map((lvl) => {
              const active = (lvl.label === 'Explorer' && theme === 'light') || (lvl.label === activeAge && theme === 'dark');
              return (
                <motion.button
                  key={lvl.label}
                  whileHover={reduceMotion ? undefined : { y: -2, backgroundColor: theme === 'dark' ? 'rgba(13,148,136,.15)' : '#ecfcf8', color: theme === 'dark' ? '#5cd5bd' : '#0a7a70' }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'text-white shadow-md'
                      : theme === 'dark'
                      ? 'text-[#a8ccc4]'
                      : 'text-[#0a3a32]'
                  }`}
                  style={
                    active
                      ? {
                          background:
                            lvl.label === 'Thinker'
                              ? 'linear-gradient(135deg, #ff6fa5, #ff97c2)'
                              : 'linear-gradient(135deg, #0d9488, #075f58)',
                          boxShadow: '0 6px 16px rgba(13,148,136,.4)',
                        }
                      : undefined
                  }
                >
                  {lvl.label}
                  <motion.span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: lvl.dotColor,
                      boxShadow: lvl.label === 'Thinker' ? '0 0 8px #ffc8df' : '0 0 8px #93e7d5',
                    }}
                    animate={
                      reduceMotion ? undefined : { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }
                    }
                    transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Sign In / Sign Up */}
        {currentUser ? (
          <div className="order-2 md:order-3 flex items-center gap-2">
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -2 }}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-sm font-bold ${
                theme === 'dark' ? 'bg-[#0e2522] border border-[#1a3d38] text-[#5cd5bd]' : 'bg-white border border-[#c8f4ea] text-[#0a7a70]'
              }`}
            >
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0d9488] to-[#075f58] text-white flex items-center justify-center text-xs font-black">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline">{currentUser.name}</span>
            </motion.div>
            <motion.button
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              onClick={() => {
                localStorage.removeItem('abc_islam_user');
                setCurrentUser(null);
              }}
              className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                theme === 'dark' ? 'text-[#7fa89f] hover:text-[#5cd5bd]' : 'text-[#4a6b62] hover:text-[#0a7a70]'
              }`}
            >
              Sign out
            </motion.button>
          </div>
        ) : (
          <div className="order-2 md:order-3 flex items-center gap-2">
            <motion.button
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              onClick={() => { setAuthTab('signin'); setAuthError(''); setAuthSuccess(''); setShowAuthModal(true); }}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-sm font-bold border ${
                theme === 'dark'
                  ? 'bg-transparent border-[#0d9488] text-[#5cd5bd] hover:bg-[#0e2522]'
                  : 'bg-white border-[#0d9488] text-[#0a7a70] hover:bg-[#ecfcf8]'
              }`}
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              onClick={() => { setAuthTab('signup'); setAuthError(''); setAuthSuccess(''); setShowAuthModal(true); }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#075f58] text-white text-sm font-bold"
              style={{ boxShadow: '0 4px 14px rgba(13,148,136,.4)' }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Up</span>
            </motion.button>
          </div>
        )}
      </header>

      {/* ============================================================
         HERO
         ============================================================ */}
      <section className="relative z-10 px-4 sm:px-8 pt-2 pb-6 max-w-[1280px] mx-auto">
        {/* Hero banner — REAL IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-[1100px] mx-auto rounded-3xl sm:rounded-[28px] overflow-hidden"
          style={{ boxShadow: '0 24px 60px rgba(13,148,136,.2)' }}
        >
          <img
            src="/images/hero-banner.jpg"
            alt="ABC of Islam — children learning together"
            className="w-full h-auto block"
          />
        </motion.div>

        {/* Title + tagline + lead */}
        <div className="text-center mt-7 sm:mt-8 px-2 sm:px-6">
          <div className="relative inline-block my-3">
            <motion.span
              className="absolute top-1/2 -translate-y-1/2 -left-12 text-3xl"
              animate={reduceMotion ? undefined : { y: [-3, 3, -3] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute top-1/2 -translate-y-1/2 -right-12 text-3xl"
              animate={reduceMotion ? undefined : { y: [3, -3, 3] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, delay: 1.5 }}
            >
              🌟
            </motion.span>

            <h1
              className="font-black leading-[0.9] tracking-tight inline-flex items-center justify-center flex-wrap gap-0"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(52px, 8vw, 100px)',
                fontWeight: 900,
                textShadow: '0 2px 0 rgba(13,148,136,.1), 0 6px 30px rgba(13,148,136,.18)',
              }}
            >
              <span className="inline-block whitespace-nowrap">
                {['A', 'B', 'C'].map((ch, i) => (
                  <motion.span
                    key={ch}
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.05 + i * 0.07,
                      type: 'spring',
                      stiffness: 350,
                      damping: 14,
                    }}
                    whileHover={reduceMotion ? undefined : { y: -10, scale: 1.12, rotate: -5 }}
                    className="inline-block cursor-pointer"
                    style={{
                      color: i === 0 ? '#0d9488' : i === 1 ? '#f5b400' : '#ff7f5c',
                      textShadow:
                        i === 0
                          ? '0 4px 20px rgba(13,148,136,.35)'
                          : i === 1
                          ? '0 4px 20px rgba(245,180,0,.35)'
                          : '0 4px 20px rgba(255,127,92,.35)',
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="inline-block mx-4 font-extrabold"
                style={{ color: '#ff7f5c' }}
              >
                of
              </motion.span>
              <span className="inline-block whitespace-nowrap ml-2 sm:ml-4">
                {'Islam'.split('').map((ch, i) => (
                  <motion.span
                    key={`islam-${i}`}
                    initial={{ opacity: 0, y: 60, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.38 + i * 0.06,
                      type: 'spring',
                      stiffness: 250,
                      damping: 12,
                    }}
                    className="inline-block"
                    style={{ color: '#065e54', textShadow: '0 4px 24px rgba(6,94,84,.4)' }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-3xl sm:text-4xl font-bold mt-1 mb-3"
            style={{
              fontFamily: 'Caveat, cursive',
              color: '#ff7f5c',
              transform: 'rotate(-2deg)',
            }}
          >
            A Journey of Faith for Young Hearts
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-medium ${
              theme === 'dark' ? 'text-[#7fa89f]' : 'text-[#4a6b62]'
            }`}
          >
            Discover the{' '}
            <span className={`relative inline-block font-extrabold px-1 ${theme === 'dark' ? 'text-[#5cd5bd]' : 'text-[#075f58]'}`}>
              beautiful world of Islam
              <span
                className="absolute bottom-0 left-0 right-0 -z-10 rounded"
                style={{ height: 8, background: theme === 'dark' ? '#064a45' : '#fde08a', opacity: 0.55 }}
              />
            </span>{' '}
            through{' '}
            <span className="font-extrabold" style={{ color: '#ff7f5c' }}>
              26 wonderful topics
            </span>
            . Learn through{' '}
            <span className="font-extrabold" style={{ color: '#f5b400' }}>
              play
            </span>{' '}
            &amp;{' '}
            <span className="font-extrabold" style={{ color: '#0d9488' }}>
              growth
            </span>{' '}
            with{' '}
            <span className="font-extrabold" style={{ color: '#0d9488' }}>
              stories crafted just for you
            </span>
            !
          </motion.p>
        </div>
      </section>

      {/* ============================================================
         STATS BAR
         ============================================================ */}
      <section className="relative z-10 px-4 sm:px-8 pb-8 max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className={`flex flex-wrap items-stretch justify-center rounded-3xl overflow-hidden ${
            theme === 'dark' ? 'bg-[#0e2522]' : 'bg-white'
          }`}
          style={{ boxShadow: theme === 'dark' ? undefined : '0 12px 30px rgba(13,148,136,.14)' }}
        >
          {[
            { num: '26', label: 'Topics', emoji: '✨' },
            { num: '16', label: 'Languages', emoji: '🌐' },
            { num: '100%', label: 'Child Safe', emoji: '🛡️' },
            { num: '3', label: 'Age Levels', emoji: '👶' },
            { num: 'Free', label: 'Forever', emoji: '♥' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              whileHover={reduceMotion ? undefined : { backgroundColor: theme === 'dark' ? '#12332f' : '#ecfcf8' }}
              className={`flex-1 min-w-[140px] sm:min-w-[160px] py-7 px-5 text-center border-r last:border-r-0 ${
                theme === 'dark' ? 'border-[#1a3d38]' : 'border-[#ecfcf8]'
              }`}
            >
              <div
                className="text-3xl sm:text-4xl font-black leading-none"
                style={{ color: theme === 'dark' ? '#2bbfa1' : '#0a7a70', fontFamily: 'Poppins, sans-serif' }}
              >
                {s.num}
              </div>
              <div
                className={`text-xs sm:text-sm font-semibold mt-1 ${
                  theme === 'dark' ? 'text-[#7fa89f]' : 'text-[#4a6b62]'
                }`}
              >
                <span className="mr-1">{s.emoji}</span>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================================================
         SNEAK PEEK CAROUSEL
         ============================================================ */}
      <section className="relative z-10 py-8 sm:py-12">
        <div className="text-center mb-7 px-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-br from-[#ff7f5c] to-[#e25c3a] text-white text-xs font-extrabold uppercase tracking-wider rounded-full mb-3"
            style={{ boxShadow: '0 6px 18px rgba(255,127,92,.35)' }}
          >
            <span>📖</span> Sneak Peek
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className={`text-3xl sm:text-5xl font-black leading-tight ${
              theme === 'dark' ? 'text-[#5cd5bd]' : 'text-[#075f58]'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Topics{' '}
            <motion.span
              animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
              transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
              className="inline-block"
              style={{ color: '#ff7f5c' }}
            >
              ♥
            </motion.span>{' '}
            Waiting for You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className={`text-base mt-1 ${theme === 'dark' ? 'text-[#7fa89f]' : 'text-[#4a6b62]'}`}
          >
            Drag to explore the chapters of this beautiful journey
          </motion.p>
        </div>

        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 py-4 sm:py-6">
          <div
            ref={carouselRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className="flex gap-7 overflow-x-auto snap-x snap-mandatory py-5 px-6"
            style={{
              scrollbarWidth: 'none',
              cursor: 'grab',
              scrollBehavior: 'smooth',
              perspective: 1600,
            }}
          >
            {topicCards.map((card, idx) => {
              const isActive = idx === activeSlide;
              return (
                <motion.div
                  key={card.id}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          scale: isActive ? 1 : 0.85,
                          rotateY: isActive ? 0 : 8,
                          opacity: isActive ? 1 : 0.6,
                        }
                  }
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className="flex-shrink-0 w-64 sm:w-72 h-[420px] rounded-3xl overflow-hidden relative snap-center cursor-pointer border-4 border-white"
                  style={{
                    background: theme === 'dark' ? '#0e2522' : 'white',
                    boxShadow: isActive
                      ? '0 30px 80px rgba(13,148,136,.35)'
                      : '0 20px 50px rgba(13,148,136,.18)',
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => {
                    if (dragDistance.current > 6) return; // was a drag, not a click
                    setActiveSlide(idx);
                    setModalCard(card);
                  }}
                  whileHover={reduceMotion ? undefined : { y: -8 }}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover block"
                    style={{ transition: 'transform .6s' }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 30%, rgba(6,36,31,.85) 100%)',
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse at top, rgba(255,255,255,.15), transparent 60%)',
                    }}
                  />
                  <div
                    className="absolute top-3.5 right-3.5 w-9.5 h-9.5 rounded-full flex items-center justify-center font-black text-sm border-3 border-white"
                    style={{
                      width: 38,
                      height: 38,
                      background: 'linear-gradient(135deg, #fbcb4d, #f5b400)',
                      color: '#6b4a00',
                      boxShadow: '0 4px 12px rgba(0,0,0,.3)',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <span
                      className="inline-block text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-md mb-2 uppercase"
                      style={{
                        background: card.tagColor,
                        color: card.tagTextDark ? '#6b4a00' : 'white',
                      }}
                    >
                      {card.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold leading-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,.5)' }}>
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] opacity-90 font-medium mt-1">{card.subtitle}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Carousel nav */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <motion.button
              whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: 8 }}
              onClick={() => setActiveSlide((p) => (p - 1 + topicCards.length) % topicCards.length)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                theme === 'dark' ? 'bg-[#0e2522] border border-[#1a3d38] text-[#5cd5bd]' : 'bg-white border-2 border-[#2bbfa1] text-[#0a7a70]'
              }`}
              style={{ boxShadow: '0 4px 12px rgba(13,148,136,.08)' }}
              aria-label="Previous chapter"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex gap-2">
              {topicCards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className="h-2.5 rounded-full transition-all"
                  style={{
                    width: i === activeSlide ? 30 : 10,
                    background: i === activeSlide ? '#0d9488' : theme === 'dark' ? '#1a3d38' : '#93e7d5',
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <motion.button
              whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: 8 }}
              onClick={() => setActiveSlide((p) => (p + 1) % topicCards.length)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                theme === 'dark' ? 'bg-[#0e2522] border border-[#1a3d38] text-[#5cd5bd]' : 'bg-white border-2 border-[#2bbfa1] text-[#0a7a70]'
              }`}
              style={{ boxShadow: '0 4px 12px rgba(13,148,136,.08)' }}
              aria-label="Next chapter"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ============================================================
         CHOOSE YOUR LEVEL
         ============================================================ */}
      <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-8 max-w-[900px] mx-auto">
        <div className="text-center mb-7">
          <h2
            className={`text-3xl sm:text-4xl font-black leading-tight inline-flex items-center gap-3 flex-wrap justify-center ${
              theme === 'dark' ? 'text-[#5cd5bd]' : 'text-[#075f58]'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <span className="text-3xl sm:text-4xl">👶</span>
            Choose Your Level
            <span className="text-3xl sm:text-4xl">👶</span>
          </h2>
          <p className={`text-sm sm:text-base mt-1 ${theme === 'dark' ? 'text-[#7fa89f]' : 'text-[#4a6b62]'}`}>
            The content adapts automatically to your age
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {[
            { label: 'Beginner', range: 'Ages 5–7', emoji: '🌱', color: 'coral' as const, active: activeAge === 'Beginner' },
            { label: 'Explorer', range: 'Ages 8–11', emoji: '🔍', color: 'teal' as const, active: activeAge === 'Explorer' },
            { label: 'Thinker', range: 'Ages 12–14', emoji: '🧠', color: 'gold' as const, active: activeAge === 'Thinker' },
          ].map((card, i) => (
            <motion.button
              key={card.label}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.6 + i * 0.2, type: 'spring', stiffness: 200, damping: 16 }}
              whileHover={reduceMotion ? undefined : { y: -12, scale: 1.05 }}
              onClick={() => setActiveAge(card.label as any)}
              className={`relative text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer ${
                card.active
                  ? theme === 'dark'
                    ? 'bg-[#0e2522] border-2 border-[#0d9488]'
                    : 'bg-gradient-to-br from-[#ecfcf8] to-white border-2 border-[#0d9488]'
                  : theme === 'dark'
                  ? 'bg-[#0e2522] border-2 border-[#1a3d38]'
                  : 'bg-white border-2 border-transparent'
              }`}
              style={{
                boxShadow: card.active
                  ? '0 0 0 6px rgba(13,148,136,.12), 0 12px 30px rgba(13,148,136,.14)'
                  : '0 4px 12px rgba(13,148,136,.08)',
              }}
            >
              {/* Spinning ray on hover */}
              <span className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />

              {card.active && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                  className="absolute top-3 left-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-sm font-black"
                >
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
                </motion.div>
              )}

              <div
                className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl mx-auto mb-2 sm:mb-4 flex items-center justify-center text-2xl sm:text-5xl"
                style={{
                  background:
                    card.color === 'coral'
                      ? 'linear-gradient(135deg, #ffc8b3, #ffd6c0)'
                      : card.color === 'teal'
                      ? 'linear-gradient(135deg, #c8f4ea, #93e7d5)'
                      : 'linear-gradient(135deg, #fde08a, #ffe9a0)',
                }}
              >
                {card.emoji}
              </div>
              <div
                className={`text-base sm:text-xl font-extrabold ${theme === 'dark' ? 'text-[#d4e8e3]' : 'text-[#06241f]'}`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {card.label}
              </div>
              <div className={`text-xs sm:text-sm font-semibold mt-0.5 sm:mt-1 ${theme === 'dark' ? 'text-[#7fa89f]' : 'text-[#4a6b62]'}`}>
                {card.range}
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ============================================================
         FEATURES
         ============================================================ */}
      <section className="relative z-10 py-4 sm:py-8 px-4 sm:px-8 max-w-[1080px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { title: 'PDF & eBook', desc: 'Printable worksheets & beautiful e-books available anytime', icon: '📚', color: 'teal' as const, corner: '⭐' },
            { title: 'Audio Narration', desc: 'Read aloud in a calm, engaging voice with text-to-speech', icon: '🔊', color: 'gold' as const, corner: '🌟' },
            { title: '16 Languages', desc: 'Full multilingual support for diaspora communities worldwide', icon: '🌐', color: 'coral' as const, corner: '✨' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.8 + i * 0.2, type: 'spring', stiffness: 200, damping: 16 }}
              whileHover={reduceMotion ? undefined : { y: -10, rotate: -1 }}
              className={`relative text-center p-6 sm:p-10 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer ${
                theme === 'dark' ? 'bg-[#0e2522] border-2 border-[#1a3d38]' : 'bg-white border-2 border-[#ecfcf8]'
              }`}
              style={{ boxShadow: '0 4px 12px rgba(13,148,136,.08)' }}
            >
              <span className="absolute top-3 right-3.5 text-lg">
                <motion.span
                  animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, delay: i * 0.5 }}
                  className="inline-block"
                >
                  {f.corner}
                </motion.span>
              </span>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl mx-auto mb-4 sm:mb-5 flex items-center justify-center text-3xl sm:text-5xl">
                <span
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl"
                  style={{
                    background:
                      f.color === 'teal'
                        ? 'linear-gradient(135deg, #c8f4ea, #ecfcf8)'
                        : f.color === 'gold'
                        ? 'linear-gradient(135deg, #fde08a, #ffe9a0)'
                        : 'linear-gradient(135deg, #ffc8b3, #ffd6c0)',
                    color: f.color === 'teal' ? '#0a7a70' : f.color === 'gold' ? '#b88a00' : '#e25c3a',
                  }}
                />
                <span
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2"
                  style={{ borderColor: f.color === 'teal' ? '#0d9488' : f.color === 'gold' ? '#b88a00' : '#e25c3a' }}
                />
                <motion.span
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2"
                  style={{ borderColor: f.color === 'teal' ? '#0d9488' : f.color === 'gold' ? '#b88a00' : '#e25c3a' }}
                  animate={reduceMotion ? undefined : { scale: [1, 1.4], opacity: [0.5, 0] }}
                  transition={{ duration: 2, ease: 'easeOut', repeat: Infinity }}
                />
                <span className="relative">{f.icon}</span>
              </div>
              <h3
                className={`text-lg sm:text-xl font-extrabold ${theme === 'dark' ? 'text-[#d4e8e3]' : 'text-[#06241f]'}`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {f.title}
              </h3>
              <p className={`text-xs sm:text-sm font-medium mt-1 ${theme === 'dark' ? 'text-[#7fa89f]' : 'text-[#4a6b62]'}`}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================================
         TRUST PILLS
         ============================================================ */}
      <section className="relative z-10 py-10 sm:py-12 px-4 sm:px-8 max-w-[800px] mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {[
            { ico: '🛡️', text: '100% Safe & Child Friendly' },
            { ico: '📚', text: '26 Beautiful Topics' },
            { check: true, text: 'Sadaqah Jariyah Model' },
            { ico: '🌍', text: 'For Muslim Diaspora' },
          ].map((p, i) => (
            <motion.span
              key={p.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 + i * 0.1 }}
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.05 }}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold ${
                theme === 'dark' ? 'bg-[#0e2522] border border-[#1a3d38] text-[#a8ccc4]' : 'bg-white border border-[#c8f4ea] text-[#0a3a32]'
              }`}
              style={{ boxShadow: '0 4px 12px rgba(13,148,136,.08)' }}
            >
              {p.check ? (
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-[10px] sm:text-xs font-black">
                  ✓
                </span>
              ) : (
                <span className="text-base sm:text-xl">{p.ico}</span>
              )}
              {p.text}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ============================================================
         CTA
         ============================================================ */}
      <section className="relative z-10 py-8 sm:py-12 px-4 sm:px-8 flex justify-center">
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, type: 'spring', stiffness: 200, damping: 16 }}
          whileHover={reduceMotion ? undefined : { y: -4, scale: 1.05 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          onClick={onStart}
          id="landing-cta-start-v2"
          className="relative inline-flex items-center gap-3.5 px-10 sm:px-14 py-4 sm:py-5 rounded-full text-white font-extrabold text-base sm:text-lg overflow-hidden bg-gradient-to-br from-[#0d9488] to-[#075f58]"
          style={{ boxShadow: '0 16px 36px rgba(13,148,136,.45)' }}
        >
          {/* Shine sweep */}
          <span
            className="absolute inset-0 -left-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent)',
              transition: 'left .6s',
            }}
          />
          <Sparkles className="w-5 h-5 text-yellow-200" />
          <span className="relative">Start the Islam Journey</span>
          <motion.span
            className="relative w-8.5 h-8.5 rounded-full flex items-center justify-center"
            style={{ width: 34, height: 34, background: 'rgba(255,255,255,.25)' }}
            whileHover={reduceMotion ? undefined : { x: 6 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
          {/* Floating sparks */}
          {[
            { pos: 'top-[10%] left-[10%]', delay: 0 },
            { pos: 'top-[20%] right-[10%]', delay: 0.4 },
            { pos: 'bottom-[10%] left-[30%]', delay: 0.8 },
          ].map((s, i) => (
            <motion.span
              key={i}
              className={`absolute text-xl pointer-events-none ${s.pos}`}
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0, 1, 0], y: [0, -12, 0], scale: [0.5, 1, 0.5] }
              }
              transition={{ duration: 1.5, ease: 'easeOut', repeat: Infinity, delay: s.delay }}
            >
              {i === 0 ? '✨' : i === 1 ? '⭐' : '💖'}
            </motion.span>
          ))}
        </motion.button>
      </section>

      {/* ============================================================
         FOOTER
         ============================================================ */}
      <footer
        className={`relative z-10 text-center py-8 sm:py-10 px-4 sm:px-8 text-sm font-semibold border-t ${
          theme === 'dark' ? 'text-[#7fa89f] border-[#1a3d38]' : 'text-[#4a6b62] border-[#ecfcf8]'
        }`}
      >
        <p>
          ABC of Islam — Made with{' '}
          <motion.span
            animate={reduceMotion ? undefined : { scale: [1, 1.2, 1] }}
            transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
            className="inline-block"
            style={{ color: '#ff7f5c' }}
          >
            ♥
          </motion.span>{' '}
          for Muslim children everywhere
        </p>
        <p className={`text-xs mt-1.5 opacity-70`}>
          Built on Next.js 14 · Supabase · TypeScript · Free Forever
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-3 text-xs sm:text-sm font-bold">
          {['Privacy Policy', 'Terms of Use', 'Contact Us', 'About', 'Donate'].map((link) => (
            <a
              key={link}
              href="#"
              className={`transition-colors ${
                theme === 'dark' ? 'text-[#2bbfa1] hover:text-[#5cd5bd]' : 'text-[#0a7a70] hover:text-[#2bbfa1]'
              }`}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>

      {/* ============================================================
         AUTH MODAL — Sign In / Sign Up
         ============================================================ */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            key="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              key="auth-modal-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden"
              style={{
                background: theme === 'dark' ? '#0a1a18' : 'white',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                border: theme === 'dark' ? '1px solid #1a3d38' : '1px solid #ecfcf8',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#0d9488] via-[#f5b400] to-[#ff7f5c]" />

              <div className="p-7 sm:p-8">
                {/* Logo + title */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🕌</div>
                  <h2
                    className={`text-2xl font-extrabold ${theme === 'dark' ? 'text-[#5cd5bd]' : 'text-[#075f58]'}`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    ABC of Islam
                  </h2>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#7fa89f]' : 'text-[#4a6b62]'}`}>
                    {authTab === 'signin' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
                  </p>
                </div>

                {/* Tabs */}
                <div
                  className={`flex rounded-2xl p-1 mb-6 ${theme === 'dark' ? 'bg-[#0e2522]' : 'bg-[#f0faf8]'}`}
                >
                  {(['signin', 'signup'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setAuthTab(tab); setAuthError(''); setAuthSuccess(''); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        authTab === tab
                          ? 'bg-gradient-to-br from-[#0d9488] to-[#075f58] text-white shadow-md'
                          : theme === 'dark' ? 'text-[#7fa89f]' : 'text-[#4a6b62]'
                      }`}
                    >
                      {tab === 'signin' ? 'Sign In' : 'Sign Up'}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {authTab === 'signup' && (
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-[#a8ccc4]' : 'text-[#0a3a32]'}`}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Aisha"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                          theme === 'dark'
                            ? 'bg-[#0e2522] border border-[#1a3d38] text-[#d4e8e3] placeholder-[#4a6b62] focus:border-[#0d9488]'
                            : 'bg-[#f8fdfc] border border-[#c8f4ea] text-[#06241f] placeholder-[#9bbfb8] focus:border-[#0d9488]'
                        }`}
                      />
                    </div>
                  )}
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-[#a8ccc4]' : 'text-[#0a3a32]'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                        theme === 'dark'
                          ? 'bg-[#0e2522] border border-[#1a3d38] text-[#d4e8e3] placeholder-[#4a6b62] focus:border-[#0d9488]'
                          : 'bg-[#f8fdfc] border border-[#c8f4ea] text-[#06241f] placeholder-[#9bbfb8] focus:border-[#0d9488]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-[#a8ccc4]' : 'text-[#0a3a32]'}`}>
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                        theme === 'dark'
                          ? 'bg-[#0e2522] border border-[#1a3d38] text-[#d4e8e3] placeholder-[#4a6b62] focus:border-[#0d9488]'
                          : 'bg-[#f8fdfc] border border-[#c8f4ea] text-[#06241f] placeholder-[#9bbfb8] focus:border-[#0d9488]'
                      }`}
                    />
                  </div>

                  {/* Error / success messages */}
                  {authError && (
                    <p className="text-xs font-semibold text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">{authError}</p>
                  )}
                  {authSuccess && (
                    <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">{authSuccess}</p>
                  )}

                  {/* Submit button */}
                  <motion.button
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    onClick={() => {
                      setAuthError('');
                      setAuthSuccess('');
                      if (!authEmail.includes('@')) { setAuthError('Please enter a valid email.'); return; }
                      if (authPassword.length < 6) { setAuthError('Password must be at least 6 characters.'); return; }

                      if (authTab === 'signup') {
                        if (!authName.trim()) { setAuthError('Please enter your name.'); return; }
                        const existing = localStorage.getItem(`abc_user_${authEmail}`);
                        if (existing) { setAuthError('An account with this email already exists.'); return; }
                        const user = { name: authName.trim(), email: authEmail };
                        localStorage.setItem(`abc_user_${authEmail}`, JSON.stringify({ ...user, password: authPassword }));
                        localStorage.setItem('abc_islam_user', JSON.stringify(user));
                        setCurrentUser(user);
                        setAuthSuccess('Account created! Welcome 🌟');
                        setTimeout(() => setShowAuthModal(false), 1200);
                      } else {
                        const stored = localStorage.getItem(`abc_user_${authEmail}`);
                        if (!stored) { setAuthError('No account found. Please sign up first.'); return; }
                        const record = JSON.parse(stored);
                        if (record.password !== authPassword) { setAuthError('Incorrect password. Please try again.'); return; }
                        const user = { name: record.name, email: record.email };
                        localStorage.setItem('abc_islam_user', JSON.stringify(user));
                        setCurrentUser(user);
                        setAuthSuccess(`Welcome back, ${user.name}! 🌟`);
                        setTimeout(() => setShowAuthModal(false), 1200);
                      }
                    }}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #0d9488, #075f58)', boxShadow: '0 8px 24px rgba(13,148,136,.4)' }}
                  >
                    {authTab === 'signin' ? 'Sign In →' : 'Create Account →'}
                  </motion.button>

                  <p className={`text-center text-xs ${theme === 'dark' ? 'text-[#4a6b62]' : 'text-[#9bbfb8]'}`}>
                    {authTab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      onClick={() => { setAuthTab(authTab === 'signin' ? 'signup' : 'signin'); setAuthError(''); }}
                      className="font-bold text-[#0d9488] hover:underline"
                    >
                      {authTab === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-[#0e2522] text-[#7fa89f]' : 'bg-[#f0faf8] text-[#4a6b62]'
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
         IMAGE MODAL — opens when a carousel card is clicked
         ============================================================ */}
      <AnimatePresence>
        {modalCard && (
          <motion.div
            key="carousel-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
            onClick={() => setModalCard(null)}
          >
            <motion.div
              key="carousel-modal-card"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative flex flex-col sm:flex-row rounded-3xl overflow-hidden"
              style={{
                width: 'min(92vw, 960px)',
                height: 'min(90vh, 620px)',
                background: '#000',
                boxShadow: '0 40px 100px rgba(0,0,0,0.75)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── LEFT: image (≈70% width) ── */}
              <div
                className="relative flex items-stretch justify-center overflow-hidden"
                style={{ flex: '0 0 68%', background: '#111' }}
              >
                <img
                  src={modalCard.img}
                  alt={modalCard.title}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                  }}
                />
              </div>

              {/* ── RIGHT: info panel (≈30% width) ── */}
              <div
                className="flex flex-col justify-between p-6 sm:p-8 overflow-y-auto text-white"
                style={{
                  flex: '1 1 0',
                  background: 'linear-gradient(160deg, #0e2522, #071510)',
                  borderLeft: '1px solid rgba(255,255,255,0.07)',
                  minWidth: 200,
                  maxWidth: 320,
                }}
              >
                <div>
                  <span
                    className="inline-block text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-lg mb-5 uppercase"
                    style={{ background: modalCard.tagColor, color: modalCard.tagTextDark ? '#6b4a00' : 'white' }}
                  >
                    {modalCard.tag}
                  </span>

                  <h3
                    className="text-2xl font-extrabold leading-snug mb-3"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {modalCard.title}
                  </h3>

                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {modalCard.subtitle}
                  </p>

                  <div className="w-10 h-0.5 rounded-full mb-6" style={{ background: modalCard.tagColor }} />

                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    Tap below to open the full lesson — illustrations, explanations &amp; a quiz.
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  <motion.button
                    whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    onClick={() => {
                      setModalCard(null);
                      if (onTopicSelect) onTopicSelect(modalCard.topicLink);
                      else onStart();
                    }}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm text-white"
                    style={{ background: 'linear-gradient(135deg,#0d9488,#075f58)', boxShadow: '0 8px 24px rgba(13,148,136,.45)' }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Explore This Topic
                  </motion.button>

                  <button
                    onClick={() => setModalCard(null)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold"
                    style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)' }}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* ✕ close */}
              <button
                onClick={() => setModalCard(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white z-10"
                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)' }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
