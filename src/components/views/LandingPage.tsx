import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shield,
  Star,
  Heart,
  BookOpen,
  Volume2,
  Globe,
  Check,
  ChevronRight,
  Moon,
  Sun,
  Search,
  Brain,
  Sprout,
  Lock,
} from 'lucide-react';
import { useState, useRef } from 'react';
import AgeSelector from '@/components/content/AgeSelector';
import { t } from '@/lib/translations';
import type { Locale } from '@/types';

interface LandingPageV2Props {
  locale: Locale;
  onStart: () => void;
}

const topicCards = [
  {
    id: 'sadaqah',
    title: 'Sadaqah',
    subtitle: 'Voluntary giving for the love of Allah',
    badge: 'CHARITY',
    accent: 'from-emerald-300 via-teal-200 to-cyan-200',
    icon: '🤲',
    color: 'text-emerald-900',
  },
  {
    id: 'ramadan',
    title: 'Ramadan',
    subtitle: 'The blessed month of fasting & reflection',
    badge: 'FASTING',
    accent: 'from-amber-300 via-orange-300 to-rose-300',
    icon: '🌙',
    color: 'text-amber-900',
    featured: true,
  },
  {
    id: 'myths-facts',
    title: 'Myths & Facts',
    subtitle: 'Separating truth from misconception',
    badge: 'TRUTH',
    accent: 'from-sky-300 via-blue-200 to-indigo-200',
    icon: '🧠',
    color: 'text-sky-900',
  },
  {
    id: 'prayer',
    title: 'The 5 Daily Prayers',
    subtitle: 'Connecting with Allah five times a day',
    badge: 'PRAYER',
    accent: 'from-violet-300 via-purple-200 to-fuchsia-200',
    icon: '🕌',
    color: 'text-violet-900',
  },
  {
    id: 'prophets',
    title: 'Stories of Prophets',
    subtitle: 'Inspiring tales of faith and courage',
    badge: 'STORIES',
    accent: 'from-rose-300 via-pink-200 to-orange-200',
    icon: '📖',
    color: 'text-rose-900',
  },
];

export default function LandingPageV2({ locale, onStart }: LandingPageV2Props) {
  const [activeSlide, setActiveSlide] = useState(2); // Center card (Ramadan)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const carouselRef = useRef<HTMLDivElement>(null);

  const slideNext = () => {
    setActiveSlide((prev) => (prev + 1) % topicCards.length);
  };
  const slidePrev = () => {
    setActiveSlide((prev) => (prev - 1 + topicCards.length) % topicCards.length);
  };

  return (
    <motion.div
      key="landing-view-v2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-gradient-to-b from-[#FFF7ED] via-[#FEF3E2] to-[#FFEDD5] text-slate-800 relative overflow-x-hidden"
    >
      {/* ============ TOP NAV ============ */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-4 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-md shadow-teal-200">
            <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-serif font-extrabold text-teal-900 text-base sm:text-lg">ABC of Islam</div>
            <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-teal-700/70">
              A Journey of Faith
            </div>
          </div>
        </div>

        {/* Center: theme + age selector */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center bg-white border-2 border-teal-100 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setTheme('light')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                theme === 'light' ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Light mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                theme === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Dark mode"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center bg-white border-2 border-teal-100 rounded-full p-1 shadow-sm">
            {[
              { label: 'Beginner', color: 'bg-emerald-100 text-emerald-800' },
              { label: 'Explorer', color: 'bg-teal-100 text-teal-800', active: true },
              { label: 'Thinker', color: 'bg-rose-100 text-rose-800' },
            ].map((lvl) => (
              <button
                key={lvl.label}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  lvl.active ? lvl.color + ' shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {lvl.label}
                <span className={`ml-1.5 w-1.5 h-1.5 rounded-full inline-block ${lvl.active ? 'bg-current' : 'bg-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Sign in */}
        <button className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-bold shadow-md shadow-teal-200 hover:shadow-lg hover:scale-[1.03] transition-all">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In</span>
        </button>
      </header>

      {/* ============ HERO ILLUSTRATED BANNER ============ */}
      <section className="relative px-4 sm:px-8 pt-2 pb-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl shadow-orange-200/60"
        >
          {/* Hero illustration background — gradient sky + mosque silhouette + kids reading */}
          <div className="relative h-[320px] sm:h-[420px] md:h-[480px] bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100">
            {/* Sun rays */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-200 rounded-full blur-2xl opacity-70" />

            {/* Stars and moons decorations */}
            <div className="absolute top-6 left-8 text-yellow-300 text-2xl">⭐</div>
            <div className="absolute top-12 right-16 text-yellow-400 text-3xl">✨</div>
            <div className="absolute top-4 right-1/3 text-rose-300 text-2xl">💗</div>
            <div className="absolute top-20 left-1/4 text-rose-200 text-xl">💗</div>
            <div className="absolute top-10 right-10 text-2xl">🌙</div>

            {/* Mosque silhouette */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[55%] flex items-end justify-center gap-1">
              <div className="w-12 sm:w-16 h-32 sm:h-44 bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-t-full" />
              <div className="w-20 sm:w-28 h-48 sm:h-64 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-t-full relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-300 rounded-full" />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-2 h-12 bg-emerald-700" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-emerald-700 rounded-full" />
              </div>
              <div className="w-12 sm:w-16 h-32 sm:h-44 bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-t-full" />
            </div>

            {/* Carpet floor */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-rose-300 via-rose-200 to-transparent" />

            {/* Children reading placeholder cards (decorative) */}
            <div className="absolute bottom-12 left-[6%] w-16 h-20 bg-gradient-to-br from-pink-300 to-rose-400 rounded-lg shadow-lg transform -rotate-6" />
            <div className="absolute bottom-10 left-[20%] w-16 h-20 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-lg shadow-lg transform rotate-3" />
            <div className="absolute bottom-12 right-[20%] w-16 h-20 bg-gradient-to-br from-violet-300 to-purple-400 rounded-lg shadow-lg transform -rotate-3" />
            <div className="absolute bottom-10 right-[6%] w-16 h-20 bg-gradient-to-br from-amber-300 to-orange-400 rounded-lg shadow-lg transform rotate-6" />

            {/* Lanterns */}
            <div className="absolute bottom-20 right-[8%] w-10 h-14 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-full shadow-lg" />
            <div className="absolute bottom-20 left-[8%] w-10 h-14 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-full shadow-lg" />

            {/* Hero title overlay */}
            <div className="absolute inset-0 flex items-end justify-center pb-8 sm:pb-10">
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 sm:px-12 py-3 sm:py-4 shadow-xl border-2 border-dashed border-teal-300">
                <h1 className="font-serif font-extrabold text-3xl sm:text-5xl md:text-6xl flex items-center gap-2 sm:gap-3 leading-none">
                  <span className="text-teal-600">Islamic</span>
                  <span className="text-amber-500">Basics</span>
                  <span className="text-emerald-600">for</span>
                  <span className="text-rose-500">Kids</span>
                  <span className="text-3xl sm:text-5xl">⭐</span>
                </h1>
              </div>
            </div>

            {/* Floating sparkles */}
            <div className="absolute top-1/3 left-12 text-3xl animate-pulse">✨</div>
            <div className="absolute top-1/2 right-12 text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
          </div>
        </motion.div>
      </section>

      {/* ============ TITLE + TAGLINE ============ */}
      <section className="relative px-4 sm:px-8 py-8 sm:py-12 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-serif font-extrabold text-5xl sm:text-7xl md:text-8xl leading-none tracking-tight mb-5"
        >
          <span className="text-rose-500">A</span>
          <span className="text-amber-500">B</span>
          <span className="text-teal-600">C</span>
          <span className="text-slate-700"> of </span>
          <span className="text-emerald-700">Islam</span>
          <span className="text-amber-400 ml-2 text-3xl sm:text-5xl">✦</span>
          <span className="text-rose-400 ml-1 text-3xl sm:text-5xl">✦</span>
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-serif italic text-xl sm:text-2xl text-rose-500 mb-5"
        >
          A Journey of Faith for Young Hearts
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto"
        >
          Discover the <span className="font-bold text-emerald-700">beautiful world of Islam</span> through{' '}
          <span className="font-bold text-rose-500">26 wonderful topics</span>. Learn through{' '}
          <span className="font-bold text-amber-500">play</span> &amp; <span className="font-bold text-teal-600">growth</span> with{' '}
          <span className="font-bold text-emerald-700">stories crafted just for you</span>!
        </motion.p>
      </section>

      {/* ============ STATS CARD ============ */}
      <section className="px-4 sm:px-8 max-w-5xl mx-auto pb-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl shadow-orange-200/40 border border-orange-100 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-5 gap-4"
        >
          {[
            { value: '26', label: 'Topics', color: 'text-rose-500', icon: '✦' },
            { value: '16', label: 'Languages', color: 'text-sky-500', icon: '🌐' },
            { value: '100%', label: 'Child Safe', color: 'text-emerald-600', icon: '🛡️' },
            { value: '3', label: 'Age Levels', color: 'text-amber-500', icon: '🎂' },
            { value: 'Free', label: 'Forever', color: 'text-rose-500', icon: '♥' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center py-2">
              <div className={`text-3xl sm:text-4xl font-serif font-extrabold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">
                <span className="mr-1">{stat.icon}</span>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ============ SNEAK PEEK CAROUSEL ============ */}
      <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            <span>📖</span> Sneak Peek
          </span>
          <h3 className="font-serif font-extrabold text-3xl sm:text-5xl text-teal-900 mb-3">
            Topics <span className="text-rose-500">♥</span> Waiting for You
          </h3>
          <p className="text-sm sm:text-base text-slate-500">Drag to explore the chapters of this beautiful journey</p>
        </div>

        <div className="relative" ref={carouselRef}>
          <div className="flex items-center justify-center gap-4 sm:gap-6 overflow-hidden py-6">
            {topicCards.map((card, idx) => {
              const offset = idx - activeSlide;
              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 2;
              if (!isVisible) return null;
              return (
                <motion.div
                  key={card.id}
                  animate={{
                    scale: isCenter ? 1.05 : 0.85,
                    opacity: Math.abs(offset) > 1 ? 0.3 : isCenter ? 1 : 0.6,
                    x: 0,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className={`flex-shrink-0 w-56 sm:w-64 cursor-pointer ${
                    isCenter ? 'z-20' : 'z-10'
                  }`}
                  onClick={() => setActiveSlide(idx)}
                >
                  <div
                    className={`relative bg-gradient-to-br ${card.accent} rounded-3xl p-4 shadow-xl border-2 border-white/60 overflow-hidden ${
                      isCenter ? 'shadow-2xl ring-4 ring-white/40' : ''
                    }`}
                    style={{ minHeight: isCenter ? 360 : 300 }}
                  >
                    {/* Card badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      {card.badge}
                    </div>
                    {/* Card number */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>

                    {/* Illustration placeholder */}
                    <div className="mt-8 mb-3 h-32 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center text-6xl shadow-inner">
                      {card.icon}
                    </div>

                    {/* Card content */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 mt-2">
                      <h4 className={`font-serif font-extrabold text-xl ${card.color}`}>{card.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{card.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={slidePrev}
              className="w-11 h-11 rounded-full bg-white border-2 border-teal-200 text-teal-700 flex items-center justify-center hover:bg-teal-50 transition-all shadow-sm"
              aria-label="Previous"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {topicCards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeSlide ? 'w-8 bg-teal-600' : 'w-2 bg-teal-200'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={slideNext}
              className="w-11 h-11 rounded-full bg-white border-2 border-teal-200 text-teal-700 flex items-center justify-center hover:bg-teal-50 transition-all shadow-sm"
              aria-label="Next"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ CHOOSE YOUR LEVEL ============ */}
      <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="font-serif font-extrabold text-3xl sm:text-5xl text-teal-900 mb-3 flex items-center justify-center gap-3 flex-wrap">
            <span className="text-3xl sm:text-4xl">👶</span>
            Choose Your Level
            <span className="text-3xl sm:text-4xl">👶</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-500">The content adapts automatically to your age</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              label: 'Beginner',
              age: 'Ages 5–7',
              color: 'from-rose-100 to-rose-200',
              iconBg: 'bg-rose-200',
              icon: <Sprout className="w-8 h-8 text-rose-600" />,
              border: 'border-rose-200',
              active: false,
            },
            {
              label: 'Explorer',
              age: 'Ages 8–11',
              color: 'from-teal-100 to-teal-200',
              iconBg: 'bg-teal-200',
              icon: <Search className="w-8 h-8 text-teal-600" />,
              border: 'border-teal-400',
              active: true,
            },
            {
              label: 'Thinker',
              age: 'Ages 12–14',
              color: 'from-amber-100 to-amber-200',
              iconBg: 'bg-amber-200',
              icon: <Brain className="w-8 h-8 text-amber-600" />,
              border: 'border-amber-200',
              active: false,
            },
          ].map((lvl) => (
            <motion.button
              key={lvl.label}
              whileHover={{ y: -4 }}
              className={`relative text-left p-6 rounded-3xl bg-gradient-to-br ${lvl.color} border-2 ${
                lvl.active ? lvl.border + ' shadow-xl' : 'border-transparent'
              } transition-all`}
            >
              {lvl.active && (
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
              )}
              <div className={`w-16 h-16 rounded-2xl ${lvl.iconBg} flex items-center justify-center mb-4 shadow-inner`}>
                {lvl.icon}
              </div>
              <h4 className="font-serif font-extrabold text-2xl text-slate-800">{lvl.label}</h4>
              <p className="text-xs text-slate-600 mt-1">{lvl.age}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ============ FEATURES (PDF, AUDIO, LANGUAGES) ============ */}
      <section className="px-4 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-teal-50 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-emerald-700" />
            </div>
            <h4 className="font-serif font-extrabold text-lg text-slate-800">PDF &amp; eBook</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Printable worksheets &amp; beautiful e-books available anytime
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-md border border-teal-50 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center mb-4">
              <Volume2 className="w-7 h-7 text-amber-700" />
            </div>
            <h4 className="font-serif font-extrabold text-lg text-slate-800">Audio Narration</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Read aloud in a calm, engaging voice with text-to-speech
            </p>
          </div>
          <div className="bg-rose-100 rounded-3xl p-6 shadow-md border border-rose-200 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-200 to-pink-200 flex items-center justify-center mb-4">
              <Globe className="w-7 h-7 text-rose-700" />
            </div>
            <h4 className="font-serif font-extrabold text-lg text-slate-800">16 Languages</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Full multilingual support for diaspora communities worldwide
            </p>
          </div>
        </div>
      </section>

      {/* ============ TRUST BADGES PILLS ============ */}
      <section className="px-4 sm:px-8 py-8 max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 text-sky-800 rounded-full text-xs font-bold border border-sky-100">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            100% Safe &amp; Child Friendly
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-100">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            26 Beautiful Topics
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 text-teal-800 rounded-full text-xs font-bold border border-teal-100">
            <Check className="w-3.5 h-3.5 text-teal-600" />
            Sadaqah Jariyah Model
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-800 rounded-full text-xs font-bold border border-rose-100">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            For Muslim Diaspora
          </span>
        </div>
      </section>

      {/* ============ PRIMARY CTA ============ */}
      <section className="px-4 sm:px-8 py-8 sm:py-12 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          id="landing-cta-start-v2"
          className="group inline-flex items-center gap-3 px-10 sm:px-14 py-4 sm:py-5 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white rounded-full font-extrabold text-base sm:text-lg shadow-2xl shadow-teal-300/60 hover:shadow-teal-400/80 transition-all"
        >
          <Sparkles className="w-5 h-5 text-yellow-200" />
          <span>Start the Islam Journey</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="px-4 sm:px-8 py-8 sm:py-10 max-w-4xl mx-auto text-center border-t border-orange-200/60 mt-4">
        <p className="text-sm text-slate-700 mb-1">
          ABC of Islam — Made with <span className="text-rose-500">♥</span> for Muslim children everywhere
        </p>
        <p className="text-xs text-slate-400 mb-3">
          Built on Next.js 14 · Supabase · TypeScript · Free Forever
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-teal-700">
          <a href="#" className="hover:text-teal-900 inline-flex items-center gap-1">
            <Lock className="w-3 h-3" /> Privacy Policy
          </a>
          <span className="text-slate-300">•</span>
          <a href="#" className="hover:text-teal-900">Terms of Use</a>
          <span className="text-slate-300">•</span>
          <a href="#" className="hover:text-teal-900">Contact Us</a>
          <span className="text-slate-300">•</span>
          <a href="#" className="hover:text-teal-900">About</a>
          <span className="text-slate-300">•</span>
          <a href="#" className="hover:text-teal-900 inline-flex items-center gap-1">
            Donate <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </a>
        </div>
      </footer>
    </motion.div>
  );
}
