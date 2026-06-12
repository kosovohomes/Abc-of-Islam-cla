import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AgeSelector from '@/components/content/AgeSelector';
import { t } from '@/lib/translations';
import { TOPICS } from '@/lib/topics';
import type { Locale } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface LandingPageProps {
  locale: Locale;
  onStart: () => void;
}

export default function LandingPage({ locale, onStart }: LandingPageProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [chapters, setChapters] = useState<typeof TOPICS>([]);

  useEffect(() => {
    setChapters(TOPICS.slice(0, 9));
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 350;
    const newScroll = carouselRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    carouselRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
  };

  const goToChapter = (index: number) => {
    setActiveChapterIndex(index);
    if (!carouselRef.current) return;
    const target = carouselRef.current.children[index] as HTMLElement;
    if (target) {
      const offset = target.offsetLeft - (carouselRef.current.clientWidth / 2 - target.clientWidth / 2);
      carouselRef.current.scrollTo({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      key="landing-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-gradient-to-b from-[#fdf6ee] via-[#f0ece4] to-[#e8f0f0]"
    >
      {/* Background animated elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated gradient circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-[rgba(255,200,160,0.1)] to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-[rgba(200,230,255,0.1)] to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight">
              <span className="block text-[#0d9488]">ABC</span>
              <span className="block text-[#0d9488]">of</span>
              <span className="block text-[#0d9488]">Islam</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#4a6b62] font-medium mb-6">
              A Journey of Faith for Young Hearts
            </p>
            <p className="text-lg text-[#4a6b62] max-w-2xl mx-auto leading-relaxed">
              Discover the <span className="font-bold text-[#0d9488]">beautiful world of Islam</span> through
              <span className="font-bold text-[#0d9488]"> 26 wonderful topics</span>.
              Learn through <span className="font-bold text-[#0d9488]">play</span> &amp; <span className="font-bold text-[#0d9488]">growth</span>
              with <span className="font-bold text-[#0d9488]">stories crafted just for you</span>!
            </p>
          </motion.div>
        </section>

        {/* STATS BAR */}
        <section className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
              <div className="p-8 text-center border-r border-b md:border-b-0 md:border-r border-[#ecfcf8]">
                <div className="text-4xl font-bold text-[#0a7a70] mb-2">26</div>
                <div className="text-sm font-semibold text-[#4a6b62]">✨ Topics</div>
              </div>
              <div className="p-8 text-center border-r border-b md:border-b-0 md:border-r border-[#ecfcf8]">
                <div className="text-4xl font-bold text-[#0a7a70] mb-2">16</div>
                <div className="text-sm font-semibold text-[#4a6b62]">🌍 Languages</div>
              </div>
              <div className="p-8 text-center border-r border-b md:border-b-0 md:border-r border-[#ecfcf8]">
                <div className="text-4xl font-bold text-[#0a7a70] mb-2">100%</div>
                <div className="text-sm font-semibold text-[#4a6b62]">👶 Child Safe</div>
              </div>
              <div className="p-8 text-center border-r border-b md:border-b-0 md:border-r border-[#ecfcf8]">
                <div className="text-4xl font-bold text-[#0a7a70] mb-2">3</div>
                <div className="text-sm font-semibold text-[#4a6b62]">👨‍👩‍👧 Age Levels</div>
              </div>
              <div className="p-8 text-center">
                <div className="text-4xl font-bold text-[#0a7a70] mb-2">Free</div>
                <div className="text-sm font-semibold text-[#4a6b62]">💝 Forever</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CAROUSEL SECTION */}
        <section className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-[#ff7f5c] to-[#e25c3a] text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider mb-4 shadow-lg">
              📖 Sneak Peek
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a7a70] mb-2">
              Topics <span className="text-[#ff7f5c]">❤️</span> Waiting for You
            </h2>
            <p className="text-[#4a6b62] text-lg">Drag to explore the chapters of this beautiful journey</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            {/* Carousel */}
            <div
              ref={carouselRef}
              className="flex gap-7 overflow-x-auto pb-4 px-4 scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  onClick={() => goToChapter(index)}
                  className={`flex-shrink-0 w-80 h-96 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 relative group ${
                    activeChapterIndex === index
                      ? 'scale-100 opacity-100 shadow-2xl border-4 border-[#2bbfa1]'
                      : 'scale-85 opacity-60 shadow-lg'
                  }`}
                >
                  {/* Chapter Image */}
                  <div className="w-full h-full bg-gradient-to-br from-[#0d9488] to-[#0a7a70] relative overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center" style={{
                      backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(6,36,31,.85) 100%), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect fill="%230d9488" width="400" height="500"/></svg>')`,
                    }}>
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Chapter Number Badge */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-[#fbcb4d] to-[#f5b400] rounded-full flex items-center justify-center font-bold text-[#6b4a00] shadow-lg border-2 border-white">
                        {index + 1}
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <span className={`inline-block w-fit px-3 py-1 rounded text-xs font-bold tracking-wider mb-3 ${
                          index % 3 === 0 ? 'bg-[#0d9488]' :
                          index % 3 === 1 ? 'bg-[#ff7f5c]' :
                          'bg-[#f5b400] text-[#6b4a00]'
                        }`}>
                          {chapter.category}
                        </span>
                        <h3 className="text-2xl font-bold mb-1 text-shadow">{chapter.title}</h3>
                        <p className="text-sm opacity-90">{chapter.description || 'Discover this amazing topic'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-12 h-12 rounded-full bg-white border-2 border-[#2bbfa1] text-[#0a7a70] flex items-center justify-center hover:bg-[#0d9488] hover:text-white hover:scale-110 transition-all shadow-md"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {chapters.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToChapter(index)}
                    className={`transition-all ${
                      activeChapterIndex === index
                        ? 'w-8 h-2.5 bg-[#0d9488] rounded'
                        : 'w-2.5 h-2.5 bg-[#93e7d5] rounded-full'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => scrollCarousel('right')}
                className="w-12 h-12 rounded-full bg-white border-2 border-[#2bbfa1] text-[#0a7a70] flex items-center justify-center hover:bg-[#0d9488] hover:text-white hover:scale-110 transition-all shadow-md"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        </section>

        {/* AGE CARDS SECTION */}
        <section className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a7a70] mb-2">
              👨‍👩‍👧 Choose Your Level 👨‍👩‍👧
            </h2>
            <p className="text-[#4a6b62] text-lg">The content adapts automatically to your age</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {/* Age Cards */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border-2 border-transparent hover:border-[#2bbfa1]">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#ffc8b3] to-[#ffd6c0] flex items-center justify-center text-4xl">
                🥕
              </div>
              <h3 className="text-xl font-bold text-[#06241f] mb-1">Beginner</h3>
              <p className="text-sm text-[#4a6b62]">Ages 5–7</p>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border-4 border-[#0d9488] bg-gradient-to-br from-[#ecfcf8] to-white">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#93e7d5] to-[#5cd5bd] flex items-center justify-center text-4xl">
                🔍
              </div>
              <h3 className="text-xl font-bold text-[#06241f] mb-1">Explorer</h3>
              <p className="text-sm text-[#4a6b62]">Ages 8–11</p>
              <div className="absolute top-3 left-3 w-6 h-6 bg-[#0d9488] text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
            </div>

            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border-2 border-transparent hover:border-[#2bbfa1]">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#fde08a] to-[#ffe9a0] flex items-center justify-center text-4xl">
                🧠
              </div>
              <h3 className="text-xl font-bold text-[#06241f] mb-1">Thinker</h3>
              <p className="text-sm text-[#4a6b62]">Ages 12–14</p>
            </div>
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all relative overflow-hidden group">
              <div className="absolute top-3 right-3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">⭐</div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#ecfcf8] to-[#93e7d5] flex items-center justify-center text-3xl">
                📚
              </div>
              <h3 className="text-xl font-bold text-[#06241f] mb-2">PDF & eBook</h3>
              <p className="text-sm text-[#4a6b62]">Printable worksheets & beautiful e-books available anytime</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all relative overflow-hidden group">
              <div className="absolute top-3 left-3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{animationDelay: '0.5s'}}>☀️</div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#fde08a] to-[#ffe9a0] flex items-center justify-center text-3xl">
                🔊
              </div>
              <h3 className="text-xl font-bold text-[#06241f] mb-2">Audio Narration</h3>
              <p className="text-sm text-[#4a6b62]">Read aloud in a calm, engaging voice with text-to-speech</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all relative overflow-hidden group">
              <div className="absolute top-3 right-3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{animationDelay: '1s'}}>✨</div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#ffc8b3] to-[#ffd6c0] flex items-center justify-center text-3xl">
                🌍
              </div>
              <h3 className="text-xl font-bold text-[#06241f] mb-2">16 Languages</h3>
              <p className="text-sm text-[#4a6b62]">Full multilingual support for diaspora communities worldwide</p>
            </div>
          </motion.div>
        </section>

        {/* TRUST PILLS */}
        <section className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <div className="bg-white rounded-full px-6 py-3 shadow-md border border-[#ecfcf8] inline-flex items-center gap-2 text-sm font-bold text-[#06241f]">
              <span>👶</span> 100% Safe & Child Friendly
            </div>
            <div className="bg-white rounded-full px-6 py-3 shadow-md border border-[#ecfcf8] inline-flex items-center gap-2 text-sm font-bold text-[#06241f]">
              <span>📚</span> 26 Beautiful Topics
            </div>
            <div className="bg-white rounded-full px-6 py-3 shadow-md border border-[#ecfcf8] inline-flex items-center gap-2 text-sm font-bold text-[#06241f]">
              <span className="w-5 h-5 bg-[#0d9488] text-white rounded-full flex items-center justify-center text-xs">✓</span> Sadaqah Jariyah Model
            </div>
            <div className="bg-white rounded-full px-6 py-3 shadow-md border border-[#ecfcf8] inline-flex items-center gap-2 text-sm font-bold text-[#06241f]">
              <span>🌍</span> For Muslim Diaspora
            </div>
          </motion.div>
        </section>

        {/* CTA SECTION */}
        <section className="container mx-auto px-4 mb-20 text-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            onClick={onStart}
            className="relative inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-[#0d9488] to-[#075f58] text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all overflow-hidden group"
          >
            <span className="relative z-10">Start the Islam Journey</span>
            <span className="relative z-10 text-xl">→</span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#2bbfa1] to-[#0a7a70] opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </motion.button>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#ecfcf8] py-8 text-center text-[#4a6b62] text-sm">
          <p className="mb-2">ABC of Islam — Made with <span className="text-[#ff7f5c]">❤️</span> for Muslim children everywhere</p>
          <p className="text-xs opacity-70 mb-4">Built on Next.js 14 · Supabase · TypeScript · Free Forever</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a href="#" className="text-[#0d9488] hover:text-[#2bbfa1] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#0d9488] hover:text-[#2bbfa1] transition-colors">Terms of Use</a>
            <a href="#" className="text-[#0d9488] hover:text-[#2bbfa1] transition-colors">Contact Us</a>
            <a href="#" className="text-[#0d9488] hover:text-[#2bbfa1] transition-colors">About</a>
            <a href="#" className="text-[#0d9488] hover:text-[#2bbfa1] transition-colors">Donate</a>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}
