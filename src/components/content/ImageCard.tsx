import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, X } from 'lucide-react';

interface ImageCardProps {
  src: string;
  alt: string;
  icon: string;
}

export default function ImageCard({ src, alt, icon }: ImageCardProps) {
  const [zoomed, setZoomed] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isExternalUrl = src.startsWith('http');

  const getImagePath = (): string | null => {
    if (isExternalUrl) return src;
    const dotIndex = src.lastIndexOf('.');
    const base = dotIndex !== -1 ? src.substring(0, dotIndex) : src;
    const origExt = dotIndex !== -1 ? src.substring(dotIndex) : '';
    const candidateExtensions = [origExt, '.webp', '.png', '.jpg', '.jpeg'].filter(Boolean);
    const unique = candidateExtensions.filter((v, i, a) => a.indexOf(v) === i);
    if (unique.length > 0) return `/images/${base}${unique[0]}`;
    return null;
  };

  const imagePath = getImagePath();
  const isFailed = hasError || imagePath === null;

  return (
    <>
      {/* ── Card thumbnail ── */}
      <div
        id={`image-card-${src}`}
        className="relative rounded-3xl overflow-hidden border-2 border-emerald-100 cursor-pointer group
                   hover:shadow-xl hover:border-emerald-300 transition-all duration-300 bg-[#f8faf6] shadow-md"
        onClick={() => setZoomed(true)}
      >
        {/* Fixed aspect-ratio container — overflow-hidden lives HERE so image never escapes */}
        <div className="aspect-[16/9] w-full relative overflow-hidden">
          {isFailed ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-2 bg-gradient-to-b from-emerald-50/40 to-amber-50/20">
              <span className="text-7xl select-none">{icon}</span>
              <span className="text-sm font-bold uppercase tracking-wider text-emerald-800 mt-3">{alt}</span>
            </div>
          ) : (
            <img
              src={imagePath}
              alt={alt}
              onError={() => setHasError(true)}
              /* object-contain keeps the whole illustration visible; bg fills the letterbox */
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Hover zoom hint */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="p-2.5 bg-white/90 backdrop-blur border border-emerald-100 shadow-md rounded-full">
              <ZoomIn className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            </div>
          </div>

          {/* Emoji badge bottom-left */}
          {!isFailed && (
            <div className="absolute bottom-3 left-3 text-2xl drop-shadow-sm leading-none select-none z-10">
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm no-print"
            onClick={() => setZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative max-w-4xl w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {isFailed ? (
                <div className="w-full max-w-md bg-white border-4 border-emerald-200 rounded-3xl flex flex-col items-center justify-center text-center p-12 gap-4 shadow-2xl">
                  <span className="text-9xl">{icon}</span>
                  <h3 className="text-2xl font-serif font-bold text-emerald-800">{alt}</h3>
                </div>
              ) : (
                <img
                  src={imagePath}
                  alt={alt}
                  className="w-full h-auto max-h-[88vh] object-contain rounded-2xl shadow-2xl"
                />
              )}

              <button
                onClick={() => setZoomed(false)}
                className="absolute top-3 right-3 p-2.5 bg-white/90 text-gray-700 border border-black/10 rounded-full shadow-xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer hover:scale-110 z-10"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
