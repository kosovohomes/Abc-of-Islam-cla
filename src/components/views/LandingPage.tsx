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
import { useAppStore } from '@/lib/store';
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
  const [winW, setWinW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isMobile = winW < 640;
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { ageLevel, setAgeLevel } = useAppStore();
  // Map store ageLevel → display label
  const ageLabelMap: Record<string, 'Beginner' | 'Explorer' | 'Thinker'> = {
    starter: 'Beginner', explorer: 'Explorer', thinker: 'Thinker',
  };
  const ageLevelMap: Record<string, string> = {
    Beginner: 'starter', Explorer: 'explorer', Thinker: 'thinker',
  };
  const activeAge = ageLabelMap[ageLevel] ?? 'Explorer';
  const setActiveAge = (label: 'Beginner' | 'Explorer' | 'Thinker') => {
    setAgeLevel(ageLevelMap[label] as any);
  };
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
  const touchStartX = useRef(0);
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
         SNEAK PEEK CAROUSEL — rebuilt mobile-first
         ============================================================ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '32px 0 40px', width: '100%' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 28, padding: '0 16px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            background: 'linear-gradient(135deg,#ff7f5c,#e25c3a)',
            color: 'white', fontSize: 11, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 12,
            boxShadow: '0 6px 18px rgba(255,127,92,.35)',
          }}>
            📖 Sneak Peek
          </span>
          <h2 style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: winW < 400 ? 26 : winW < 640 ? 30 : 44,
            fontWeight: 900, lineHeight: 1.2,
            color: theme === 'dark' ? '#5cd5bd' : '#075f58',
            margin: '0 0 8px',
          }}>
            Topics ♥ Waiting for You
          </h2>
          <p style={{ fontSize: 14, color: theme === 'dark' ? '#7fa89f' : '#4a6b62', margin: 0 }}>
            {isMobile ? 'Swipe to explore • Tap to open' : 'Click any card to explore the full lesson'}
          </p>
        </div>

        {/* Cards grid — mobile: 2-col grid | desktop: horizontal scroll row */}
        {isMobile ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            padding: '0 12px',
          }}>
            {topicCards.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => { setActiveSlide(idx); setModalCard(card); }}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  aspectRatio: '3/4',
                  border: '3px solid white',
                  boxShadow: '0 8px 24px rgba(13,148,136,.2)',
                  background: '#000',
                }}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(5,28,24,.9) 100%)',
                }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 10px 12px' }}>
                  <span style={{
                    display: 'inline-block', fontSize: 9, fontWeight: 800,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '2px 8px', borderRadius: 5, marginBottom: 4,
                    background: card.tagColor,
                    color: card.tagTextDark ? '#6b4a00' : 'white',
                  }}>{card.tag}</span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'white', lineHeight: 1.25 }}>
                    {card.title}
                  </div>
                </div>
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#fbcb4d,#f5b400)',
                  color: '#6b4a00', fontSize: 11, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,.3)',
                }}>{idx + 1}</div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop horizontal scroll */
          <div style={{ position: 'relative' }}>
            <div
              ref={carouselRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              style={{
                display: 'flex',
                gap: 24,
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                cursor: 'grab',
                padding: '20px 40px',
              }}
            >
              {topicCards.map((card, idx) => {
                const isActive = idx === activeSlide;
                return (
                  <div
                    key={card.id}
                    onClick={() => { if (dragDistance.current > 6) return; setActiveSlide(idx); setModalCard(card); }}
                    style={{
                      flexShrink: 0,
                      width: 280,
                      height: 420,
                      borderRadius: 24,
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                      scrollSnapAlign: 'center',
                      border: '4px solid white',
                      boxShadow: isActive ? '0 30px 80px rgba(13,148,136,.38)' : '0 12px 40px rgba(13,148,136,.15)',
                      transform: isActive ? 'scale(1)' : 'scale(0.9)',
                      opacity: isActive ? 1 : 0.7,
                      transition: 'transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease',
                      background: '#000',
                    }}
                  >
                    <img
                      src={card.img}
                      alt={card.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 30%, rgba(6,36,31,.88) 100%)',
                    }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 20px' }}>
                      <span style={{
                        display: 'inline-block', fontSize: 10, fontWeight: 800,
                        letterSpacing: '0.07em', textTransform: 'uppercase',
                        padding: '3px 10px', borderRadius: 6, marginBottom: 6,
                        background: card.tagColor,
                        color: card.tagTextDark ? '#6b4a00' : 'white',
                      }}>{card.tag}</span>
                      <div style={{ fontSize: 20, fontWeight: 800, color: 'white', lineHeight: 1.25, marginBottom: 4 }}>
                        {card.title}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', fontWeight: 500 }}>
                        {card.subtitle}
                      </div>
                    </div>
                    <div style={{
                      position: 'absolute', top: 14, right: 14,
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#fbcb4d,#f5b400)',
                      color: '#6b4a00', fontSize: 13, fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,.3)',
                    }}>{idx + 1}</div>
                  </div>
                );
              })}
            </div>

            {/* Prev / dots / Next */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 16 }}>
              <button
                onClick={() => setActiveSlide(p => (p - 1 + topicCards.length) % topicCards.length)}
                style={{
                  width: 44, height: 44, borderRadius: '50%', border: '2px solid #2bbfa1',
                  background: 'white', color: '#0a7a70', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(13,148,136,.1)',
                }}
              ><ArrowLeft className="w-5 h-5" /></button>
              <div style={{ display: 'flex', gap: 8 }}>
                {topicCards.map((_, i) => (
                  <button key={i} onClick={() => setActiveSlide(i)} style={{
                    height: 10, width: i === activeSlide ? 28 : 10,
                    borderRadius: 99, border: 'none', cursor: 'pointer',
                    background: i === activeSlide ? '#0d9488' : '#93e7d5',
                    transition: 'width 0.25s ease, background 0.25s ease',
                  }} />
                ))}
              </div>
              <button
                onClick={() => setActiveSlide(p => (p + 1) % topicCards.length)}
                style={{
                  width: 44, height: 44, borderRadius: '50%', border: '2px solid #2bbfa1',
                  background: 'white', color: '#0a7a70', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(13,148,136,.1)',
                }}
              ><ArrowRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}
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
         VIDEO SECTION — Five Pillars of Islam
         ============================================================ */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 px-4 sm:px-8 py-10 sm:py-16 max-w-full sm:max-w-[512px] mx-auto"
      >
        {/* Section heading */}
        <div className="text-center mb-8">
          <span
            className="inline-block text-xs font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'linear-gradient(135deg,#d4f5ee,#b9f0e3)', color: '#0a7a70' }}
          >
            🎬 Watch & Learn
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold leading-tight"
            style={{ color: theme === 'dark' ? '#e2f5f1' : '#0a2520', fontFamily: 'Poppins, sans-serif' }}
          >
            The Five Pillars of Islam
          </h2>
          <p
            className="mt-2 text-sm sm:text-base max-w-lg mx-auto"
            style={{ color: theme === 'dark' ? '#7fa89f' : '#4a6b62' }}
          >
            A beautiful visual journey through the foundations of our faith
          </p>
        </div>

        {/* Video player */}
        <div
          className="relative rounded-3xl overflow-hidden mx-auto"
          style={{
            maxWidth: 820,
            boxShadow: theme === 'dark'
              ? '0 32px 80px rgba(0,0,0,0.6)'
              : '0 24px 60px rgba(13,148,136,0.22)',
            border: theme === 'dark' ? '2px solid rgba(43,191,161,0.15)' : '2px solid rgba(13,148,136,0.12)',
          }}
        >

          <video
            src="https://ik.imagekit.io/4zbzbdytp/five%20piller%20mp4.mp4"
            controls
            playsInline
            autoPlay
            muted
            loop
            preload="auto"
            className="w-full block"
            style={{
              background: '#000',
              display: 'block',
              width: '100%',
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Pill badges below video */}
        <div className="flex flex-wrap justify-center gap-3 mt-7">
          {['🕌 Shahada','🤲 Salah','💰 Zakat','🌙 Sawm','🕋 Hajj'].map(pill => (
            <span
              key={pill}
              className="px-4 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: theme === 'dark' ? 'rgba(43,191,161,0.12)' : 'rgba(13,148,136,0.08)',
                color:      theme === 'dark' ? '#2bbfa1' : '#0a7a70',
                border:     theme === 'dark' ? '1px solid rgba(43,191,161,0.2)' : '1px solid rgba(13,148,136,0.15)',
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </motion.section>

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
         TOPIC MODAL — 100% inline styles, zero CSS classes, JS-driven layout
         ============================================================ */}
      <AnimatePresence>
        {modalCard && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setModalCard(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.87)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: isMobile ? 'flex-end' : 'center',
              justifyContent: 'center',
              padding: isMobile ? 0 : 24,
            }}
          >
            <motion.div
              key="modal-card"
              initial={{ opacity: 0, y: isMobile ? 80 : 30, scale: isMobile ? 1 : 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isMobile ? 80 : 30, scale: isMobile ? 1 : 0.92 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: isMobile ? '100%' : 860,
                borderRadius: isMobile ? '24px 24px 0 0' : 24,
                overflow: 'hidden',
                boxShadow: '0 -8px 60px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                maxHeight: isMobile ? '88vh' : '85vh',
                overflowY: isMobile ? 'auto' : 'hidden',
                background: '#000',
              }}
            >
              {/* IMAGE */}
              <div style={{
                width: isMobile ? '100%' : '62%',
                flexShrink: 0,
                height: isMobile ? Math.round(winW * 0.75) : undefined,
                minHeight: isMobile ? 220 : undefined,
                maxHeight: isMobile ? 320 : undefined,
                overflow: 'hidden',
                background: '#111',
              }}>
                <img
                  src={modalCard.img}
                  alt={modalCard.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                />
              </div>

              {/* PANEL */}
              <div style={{
                flex: '1 1 0',
                minWidth: 0,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: isMobile ? '20px 20px 32px' : '36px 32px',
                background: 'linear-gradient(160deg,#0a2520,#061610)',
                borderTop: isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
                borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
                color: 'white',
              }}>
                {/* Top row: tag + close */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 800,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '4px 12px', borderRadius: 8,
                    background: modalCard.tagColor,
                    color: modalCard.tagTextDark ? '#6b4a00' : 'white',
                  }}>{modalCard.tag}</span>
                  <button
                    onClick={() => setModalCard(null)}
                    style={{
                      width: 32, height: 32, borderRadius: '50%', border: 'none',
                      background: 'rgba(255,255,255,0.12)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                    aria-label="Close"
                  ><X style={{ width: 16, height: 16 }} /></button>
                </div>

                {/* Title */}
                <div style={{ marginBottom: isMobile ? 10 : 16 }}>
                  <div style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: isMobile ? 20 : 26,
                    fontWeight: 800, lineHeight: 1.25,
                    color: 'white', marginBottom: 8,
                  }}>{modalCard.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.6 }}>
                    {modalCard.subtitle}
                  </div>
                </div>

                <div style={{ width: 36, height: 3, borderRadius: 99, background: modalCard.tagColor, marginBottom: isMobile ? 16 : 20 }} />

                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: isMobile ? 20 : 28 }}>
                  Tap below to open the full lesson — illustrations, explanations &amp; a quiz.
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => {
                      setModalCard(null);
                      if (onTopicSelect) onTopicSelect(modalCard.topicLink);
                      else onStart();
                    }}
                    style={{
                      width: '100%', padding: '14px 0', borderRadius: 14,
                      border: 'none', cursor: 'pointer',
                      fontWeight: 700, fontSize: 15, color: 'white',
                      background: 'linear-gradient(135deg,#0d9488,#075f58)',
                      boxShadow: '0 8px 24px rgba(13,148,136,.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    <ExternalLink style={{ width: 16, height: 16 }} />
                    Explore This Topic
                  </button>
                  <button
                    onClick={() => setModalCard(null)}
                    style={{
                      width: '100%', padding: '11px 0', borderRadius: 14,
                      border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                      fontWeight: 600, fontSize: 13,
                      color: 'rgba(255,255,255,0.4)',
                      background: 'rgba(255,255,255,0.05)',
                    }}
                  >Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
