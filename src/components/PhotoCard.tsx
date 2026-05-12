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
      
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">{photo.title}</h3>
            <p className="text-xs text-white/80 line-clamp-1">{photo.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(photo);
              }}
              className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/40"
              title="View Large"
              id={`view-btn-${photo.id}`}
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(photo.id);
              }}
              className="rounded-full bg-red-500/20 p-2 text-red-200 backdrop-blur-md transition-colors hover:bg-red-500/40"
              title="Remove"
              id={`delete-btn-${photo.id}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
