import { Photo } from '../types';
import { PhotoCard } from './PhotoCard';
import { motion } from 'motion/react';

interface PhotoGridProps {
  photos: Photo[];
  onOpenPhoto: (photo: Photo) => void;
  onDeletePhoto: (id: string) => void;
}

export function PhotoGrid({ photos, onOpenPhoto, onDeletePhoto }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={index % 7 === 0 ? "md:col-span-2 md:row-span-2" : ""}
        >
          <PhotoCard 
            photo={photo} 
            onClick={onOpenPhoto} 
            onDelete={onDeletePhoto}
          />
        </motion.div>
      ))}
    </div>
  );
}
