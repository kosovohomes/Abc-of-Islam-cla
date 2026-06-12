// @/components/content/LandingPage.tsx
// ABC of Islam – Final merged version
// - Visual design from abc-of-islam(8).html (teal/gold/coral, Cairo/Caveat)
// - 100% API parity with the original LandingPage
//   locale: Locale, onStart: () => void
//   t(locale,'title'/'subtitle'/'startReading'/'languages'/'audioNarration'/'pdfEbook')
//   <AgeSelector />
//   id="landing-cta-start"
//   motion scale 0.98
// - Original sections preserved verbatim:
//   * Giant watermark 'A'
//   * Floating emojis 🕌📖🌙🕋🌴🐪
//   * Eyebrow "🦄 Discovering Islam Series"
//   * Feature cards: Multi-lingual Support / Sweet Audio Reader / Printable Story sheets
//   * Trust badges: Kid-Friendly Basics / 26 Beautiful Chapters / 100% Peaceful & Safe
//   * Spinning Sparkles (6s) in CTA
// - New sections appended: Stats bar, ChaptersCarousel, Auth, TTS
'use client';

import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Shield, Star, Heart, Languages, Volume2, FileText, LogIn, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import AgeSelector from '@/components/content/AgeSelector';
import { t } from '@/lib/translations';
import type { Locale } from '@/types';

import ChaptersCarousel from './ChaptersCarousel.wired';
import AuthModal from '../AuthModal.supabase';
import TTSReader from '../TTSReader';
import { supabase, type AuthUser } from '@/lib/supabase';

interface LandingPageProps {
  locale: Locale;
  onStart: () => void;
}

const isRtl = (l: Locale) => ['ar','fa','ur','he'].includes(l);

export default function LandingPage({ locale, onStart }: LandingPageProps) {
  const router = useRouter();
  const rtl = isRtl(locale);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Supabase session – non-blocking, does not affect onStart()
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) setUser({ id: u.id, email: u.email, name: u.user_metadata?.name ?? u.email?.split('@')[0] ?? '' });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      setUser(u ? { id: u.id, email: u.email, name: u.user_metadata?.name ?? u.email?.split('@')[0] ?? '' } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleChapter = (id: string) => {
    // Keep original onStart behavior as primary, then navigate
    onStart();
    // If you want direct deep-link instead, uncomment:
    // router.push(`/${locale}/read/${id}`);
  };

  return (
    <motion.div
      key="landing-view"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex-1 relative overflow-hidden isolate bg-[#fdf8ed]"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      {/* Fonts – move to app/layout.tsx in production */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Cairo:wght@700;800;900&family=Poppins:wght@400;500;600;700;800;900&family=Tajawal:wght@500;700;800&display=swap');
        .font-display { font-family: 'Cairo', 'Tajawal', 'Poppins', system-ui, sans-serif; }
        .font-script { font-family: 'Caveat', cursive; }
        .font-ui { font-family: 'Poppins', 'Tajawal', system-ui, sans-serif; }
        @keyframes floatY { 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-14px)} }
        .float-animation { animation: floatY 6s ease-in-out infinite; }
        @keyframes spin-slow { to { transform: rotate(360deg) } }
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }
      `}</style>

      {/* Optional topbar – does not interfere with original landing flow */}
      <header className="relative z-30 border-b border-teal-900/5 bg-white/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[62px] flex items-center justify-between font-ui">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] flex items-center justify-center text-white font-black text-sm"
                 style={{ background: 'linear-gradient(135deg,#0d9488,#075f58)' }}>أ</div>
            <div className="leading-tight">
              <div className="font-display font-black text-[15px] text-teal-900">ABC of Islam</div>
              <div className="text-[10.5px] text-[#5c8076] -mt-0.5">Discover the World</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!user ? (
              <button onClick={() => setAuthOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-teal-100 text-teal-800 text-[12px] font-bold shadow-sm hover:bg-teal-50 transition">
                <LogIn className="w-3.5 h-3.5" /> Sign in
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-[11.5px] font-bold">👋 {user.name}</span>
                <button onClick={() => supabase.auth.signOut()} className="p-1.5 rounded-full border border-teal-100 bg-white text-teal-700 hover:bg-rose-50" aria-label="Sign out"><LogOut className="w-3.5 h-3.5"/></button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========== ORIGINAL LANDING HERO – VISUALLY RESKINNED TO ABC THEME ========== */}
      <div className="relative px-6 py-16 sm:py-24 flex flex-col items-center justify-center overflow-hidden">
        {/* Background giant watermark letter A – from original */}
        <div className="absolute -left-20 -top-20 text-[540px] sm:text-[640px] font-display font-black text-[#0d9488]/[0.035] leading-none select-none pointer-events-none z-0">
          A
        </div>

        {/* Floating emoji decorations – ORIGINAL SET, kept verbatim */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <span className="absolute top-12 left-[12%] text-5xl sm:text-6xl opacity-[0.38] float-animation select-none" style={{ animationDelay: '0s' }}>🕌</span>
          <span className="absolute top-[20%] right-[11%] text-4xl sm:text-5xl opacity-[0.38] float-animation select-none" style={{ animationDelay: '1.2s' }}>📖</span>
          <span className="absolute bottom-20 left-[15%] text-4xl sm:text-5xl opacity-[0.38] float-animation select-none" style={{ animationDelay: '0.6s' }}>🌙</span>
          <span className="absolute bottom-24 right-[13%] text-5xl sm:text-6xl opacity-[0.38] float-animation select-none" style={{ animationDelay: '1.8s' }}>🕋</span>
          <span className="absolute top-[45%] left-[8%] text-3xl sm:text-4xl opacity-25 float-animation select-none" style={{ animationDelay: '2.5s' }}>🌴</span>
          <span className="absolute top-[60%] right-[7%] text-3xl sm:text-4xl opacity-25 float-animation select-none" style={{ animationDelay: '0.9s' }}>🐪</span>
        </div>

        {/* subtle teal/gold washes from new design */}
        <div className="absolute inset-0 -z-10 opacity-80 pointer-events-none">
          <div className="absolute -top-24 right-0 w-[420px] h-[420px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(13,148,136,.10), transparent 70%)' }} />
        </div>

        <div className="relative text-center max-w-3xl mx-auto z-10 flex flex-col items-center font-ui">
          {/* Eyebrow – ORIGINAL TEXT */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/85 backdrop-blur text-teal-800 font-extrabold text-[10px] uppercase tracking-wider rounded-full border border-teal-100 shadow-sm mb-8">
            <span>🦄 Discovering Islam Series</span>
          </div>

          {/* Title – uses t(locale,'title'), styled ABC */}
          <h1 className="font-display font-black tracking-tight leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(44px, 9vw, 96px)' }}>
            <span className="bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#f5b400] bg-clip-text text-transparent drop-shadow-sm">
              {t(locale, 'title') || 'ABC of Islam'}
            </span>
          </h1>

          {/* Subtitle – uses t(locale,'subtitle') */}
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#3d5f56]/90 leading-relaxed max-w-2xl mb-10">
            {t(locale, 'subtitle') || 'A Journey of Faith for Young Hearts'}
          </p>

          {/* Age level selector – ORIGINAL WRAPPER, recolored to teal */}
          <div className="bg-white border-2 border-teal-100 p-2.5 rounded-full mb-10 flex items-center gap-1.5 shadow-md">
            <AgeSelector />
          </div>

          {/* Primary CTA – ORIGINAL ID, onStart, spinning Sparkles */}
          <button
            id="landing-cta-start"
            onClick={onStart}
            className="font-ui inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#0a7a70] text-white rounded-full font-bold text-sm uppercase tracking-wider hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 cursor-pointer shadow-md shadow-teal-200"
          >
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
            <span>{t(locale, 'startReading') || 'Start Reading'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Feature stats – ORIGINAL 3 CARDS, EXACT TEXT */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-xl">
            <div className="flex flex-col items-center p-5 bg-white border border-teal-50 rounded-2xl shadow-md transition-transform hover:-translate-y-1">
              <span className="text-3xl mb-1.5">🌍</span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">{t(locale, 'languages')}</span>
              <span className="text-[11px] text-gray-500 mt-1">Multi-lingual Support</span>
            </div>
            <div className="flex flex-col items-center p-5 bg-white border border-teal-50 rounded-2xl shadow-md transition-transform hover:-translate-y-1">
              <span className="text-3xl mb-1.5">🔊</span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">{t(locale, 'audioNarration')}</span>
              <span className="text-[11px] text-gray-500 mt-1">Sweet Audio Reader</span>
            </div>
            <div className="flex flex-col items-center p-5 bg-white border border-teal-50 rounded-2xl shadow-md transition-transform hover:-translate-y-1">
              <span className="text-3xl mb-1.5">🎨</span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">{t(locale, 'pdfEbook')}</span>
              <span className="text-[11px] text-gray-500 mt-1">Printable Story sheets</span>
            </div>
          </div>

          {/* Trust badges – ORIGINAL TEXT, VERBATIM */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[#2C3E50]/70 text-[11px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-50 text-sky-800 rounded-full border border-sky-100">
              <Shield className="w-3.5 h-3.5 text-sky-600" /> Kid-Friendly Basics
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-800 rounded-full border border-amber-100">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 26 Beautiful Chapters
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 text-rose-800 rounded-full border border-rose-100">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> 100% Peaceful &amp; Safe
            </span>
          </div>
        </div>
      </div>
      {/* ========== END ORIGINAL HERO ========== */}

      {/* ========== NEW SECTIONS FROM abc-of-islam(8).html ========== */}
      
      {/* Stats bar */}
      <div className="px-6 pb-6 font-ui">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[28px] border border-teal-100 shadow-[0_18px_50px_rgba(13,148,136,.10)] px-4 sm:px-8 py-6 grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-teal-50/90 rtl:divide-x-reverse">
            <Stat n="26" label="✨ Topics" />
            <Stat n="16" label="🌍 Languages" />
            <Stat n="100%" label="🛡️ Child Safe" />
            <Stat n="3" label="🧒 Age Levels" />
            <Stat n="Free" label="💛 Forever" />
          </div>
        </div>
      </div>

      {/* Chapters Carousel – wired to onStart */}
      <ChaptersCarousel locale={locale} onChapterSelect={handleChapter} />

      {/* Extended feature cards – still using your t() keys */}
      <section className="px-6 pb-20 font-ui">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <FeatureCard icon={<Languages className="w-6 h-6 text-teal-700" />} accent="#ecfcf8"
            title={t(locale, 'languages') || '16 Languages'}
            desc="Read in Arabic, English, Turkish, French, Urdu and more – with RTL support." />
          <FeatureCard icon={<Volume2 className="w-6 h-6 text-amber-700" />} accent="#fff9ea"
            title={t(locale, 'audioNarration') || 'Audio Narration'}
            desc="Sweet, clear TTS narration for every chapter. Select any text to hear it." />
          <FeatureCard icon={<FileText className="w-6 h-6 text-rose-700" />} accent="#fff2f6"
            title={t(locale, 'pdfEbook') || 'PDF eBook'}
            desc="Download beautiful, printable story sheets for offline learning." />
        </div>
        <div className="text-center text-[12px] text-[#6b8a81] mt-14">
          ABC of Islam · Discover the World of Islam
        </div>
      </section>

      {/* Auth + TTS – non-blocking, do not affect onStart */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSignedIn={(u) => setUser(u)} />
      <TTSReader />
    </motion.div>
  );
}

/* helpers */
function Stat({ n, label }: { n: string; label: string }) {
  return <div className="py-4 md:py-1 px-4 text-center"><div className="font-display font-black text-[28px] text-[#0d9488] leading-none">{n}</div><div className="text-[11.5px] font-bold text-[#5c8076] mt-1.5">{label}</div></div>;
}
function FeatureCard({ icon, title, desc, accent }: { icon: React.ReactNode; title: string; desc: string; accent: string }) {
  return (
    <div className="bg-white rounded-[24px] border border-teal-100 p-[26px] shadow-[0_12px_34px_rgba(13,148,136,.08)] hover:-translate-y-1 transition-transform duration-300">
      <div className="w-12 h-12 rounded-[16px] flex items-center justify-center mb-4" style={{ backgroundColor: accent }}>{icon}</div>
      <h3 className="font-display font-extrabold text-[18px] text-[#06241f]">{title}</h3>
      <p className="text-[13.8px] text-[#56736b] leading-relaxed mt-2">{desc}</p>
    </div>
  );
}
