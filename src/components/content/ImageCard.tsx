import { useState } from 'react';
import { createPortal } from 'react-dom';
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
        {/* Fixed aspect-ratio container */}
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

      {/* ── Lightbox — rendered via Portal at document.body to escape any
           parent CSS transform / stacking context that breaks fixed positioning ── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {zoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
              }}
              onClick={() => setZoomed(false)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                style={{ position: 'relative', maxWidth: 900, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                    style={{ width: '100%', height: 'auto', maxHeight: '88vh', objectFit: 'contain', borderRadius: 16, boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}
                  />
                )}

                <button
                  onClick={() => setZoomed(false)}
                  style={{ position: 'absolute', top: -14, right: -14, padding: 10, background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '50%', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
                  className="hover:bg-rose-500 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
