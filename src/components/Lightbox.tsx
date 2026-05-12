import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Photo } from '../types';

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function Lightbox({ photo, onClose, onNext, onPrev }: LightboxProps) {
  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
        id="lightbox-overlay"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[60] text-white/60 transition-colors hover:text-white"
          id="close-lightbox"
        >
          <X size={32} />
        </button>

        {onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-6 z-[60] rounded-full bg-white/10 p-4 text-white hover:bg-white/20"
            id="prev-photo"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-6 z-[60] rounded-full bg-white/10 p-4 text-white hover:bg-white/20"
            id="next-photo"
          >
            <ChevronRight size={24} />
          </button>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-h-[85vh] max-w-[90vw]"
          id="lightbox-content"
        >
          <img
            src={photo.url}
            alt={photo.title}
            className="max-h-full max-w-full rounded-lg object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="mt-6 text-center text-white">
            <h2 className="text-3xl font-serif">{photo.title}</h2>
            <p className="mt-2 text-white/60">{photo.description}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
