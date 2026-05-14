import { motion } from 'motion/react';
import { Maximize2, Trash2, Heart } from 'lucide-react';
import { Photo } from '../types';
import { cn } from '../lib/utils';

interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
  onDelete: (id: string) => void;
}

export function PhotoCard({ photo, onClick, onDelete }: PhotoCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
      id={`photo-${photo.id}`}
    >
      <img
        src={photo.url}
        alt={photo.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/80 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium mb-1 block">{photo.category}</span>
              <h3 className="text-xl font-serif text-white leading-tight">{photo.title}</h3>
              <p className="mt-1 text-sm text-white/70 line-clamp-2 italic font-serif">{photo.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(photo);
                }}
                className="rounded-full bg-white/10 p-3 text-white backdrop-blur-xl border border-white/20 transition-all hover:bg-white/30 active:scale-90"
                title="View Large"
                id={`view-btn-${photo.id}`}
              >
                <Maximize2 size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(photo.id);
                }}
                className="rounded-full bg-red-500/10 p-3 text-red-200 backdrop-blur-xl border border-red-500/20 transition-all hover:bg-red-500/30 active:scale-90"
                title="Remove"
                id={`delete-btn-${photo.id}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
