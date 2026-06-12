import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Shield, Star, Heart } from 'lucide-react';
import AgeSelector from '@/components/content/AgeSelector';
import { t } from '@/lib/translations';
import type { Locale } from '@/types';

interface LandingPageProps {
  locale: Locale;
  onStart: () => void;
}

const isRtl = (locale: Locale) => ['ar', 'fa', 'ur', 'he'].includes(locale);

export default function LandingPage({ locale, onStart }: LandingPageProps) {
  const rtl = isRtl(locale);

  return (
    <motion.div
      key="landing-view"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex-1 px-6 py-16 sm:py-24 flex flex-col items-center justify-center relative overflow-hidden isolate bg-[#fdf8ed]"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      {/* Fonts – move to your app index.html / layout if you want, safe to leave here for Vite */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Cairo:wght@700;800;900&family=Poppins:wght@400;500;600;700;800;900&family=Tajawal:wght@500;700;800&display=swap');
        .font-display { font-family: 'Cairo', 'Tajawal', 'Poppins', system-ui, sans-serif; }
        .font-ui { font-family: 'Poppins', 'Tajawal', system-ui, sans-serif; }
        @keyframes floatY { 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-14px)} }
        .float-animation { animation: floatY 6s ease-in-out infinite; }
        @keyframes spin-slow { to { transform: rotate(360deg) } }
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }
      `}</style>

      {/* Background giant watermark A – original */}
      <div className="absolute -left-20 -top-20 text-[540px] sm:text-[640px] font-display font-black text-[#0d9488]/[0.035] leading-none select-none pointer-events-none z-0">
        A
      </div>

      {/* Floating emoji decorations – ORIGINAL SET */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <span className="absolute top-12 left-[12%] text-5xl sm:text-6xl opacity-[0.38] float-animation select-none" style={{ animationDelay: '0s' }}>🕌</span>
        <span className="absolute top-[20%] right-[11%] text-4xl sm:text-5xl opacity-[0.38] float-animation select-none" style={{ animationDelay: '1.2s' }}>📖</span>
        <span className="absolute bottom-20 left-[15%] text-4xl sm:text-5xl opacity-[0.38] float-animation select-none" style={{ animationDelay: '0.6s' }}>🌙</span>
        <span className="absolute bottom-24 right-[13%] text-5xl sm:text-6xl opacity-[0.38] float-animation select-none" style={{ animationDelay: '1.8s' }}>🕋</span>
        <span className="absolute top-[45%] left-[8%] text-3xl sm:text-4xl opacity-25 float-animation select-none" style={{ animationDelay: '2.5s' }}>🌴</span>
        <span className="absolute top-[60%] right-[7%] text-3xl sm:text-4xl opacity-25 float-animation select-none" style={{ animationDelay: '0.9s' }}>🐪</span>
      </div>

      {/* Soft teal/gold wash – new ABC theme */}
      <div className="absolute inset-0 -z-10 opacity-80 pointer-events-none">
        <div className="absolute -top-24 right-0 w-[420px] h-[420px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(13,148,136,.10), transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(245,180,0,.06), transparent 70%)' }} />
      </div>

      <div className="relative text-center max-w-3xl mx-auto z-10 flex flex-col items-center font-ui">
        {/* Eyebrow – ORIGINAL */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/85 backdrop-blur text-teal-800 font-extrabold text-[10px] uppercase tracking-wider rounded-full border border-teal-100 shadow-sm mb-8">
          <span>🦄 Discovering Islam Series</span>
        </div>

        {/* Title – t(locale,'title') */}
        <h1 className="font-display font-black tracking-tight leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(44px, 9vw, 88px)' }}>
          <span className="bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#f5b400] bg-clip-text text-transparent drop-shadow-sm">
            {t(locale, 'title')}
          </span>
        </h1>

        {/* Subtitle – t(locale,'subtitle') */}
        <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#3d5f56]/90 leading-relaxed max-w-2xl mb-10">
          {t(locale, 'subtitle')}
        </p>

        {/* AgeSelector – ORIGINAL WRAPPER */}
        <div className="bg-white border-2 border-teal-100 p-2.5 rounded-full mb-10 flex items-center gap-1.5 shadow-md">
          <AgeSelector />
        </div>

        {/* CTA – ORIGINAL ID, onStart, spinning Sparkles */}
        <button
          id="landing-cta-start"
          onClick={onStart}
          className="font-ui inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-[#0d9488] via-[#14b8a6] to-[#0a7a70] text-white rounded-full font-bold text-sm uppercase tracking-wider hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 cursor-pointer shadow-md shadow-teal-200"
        >
          <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
          <span>{t(locale, 'startReading')}</span>
          <ArrowRight className={`w-4 h-4 stroke-[3] ${rtl ? 'rotate-180' : ''}`} />
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

        {/* Trust badges – ORIGINAL TEXT */}
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
    </motion.div>
  );
}
