import { Photo, Album } from './types';

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
    title: 'Alpine Serenity',
    description: 'A crisp morning at the edge of the mountains, finding peace in the stillness.',
    category: 'Nature',
    albumId: 'all',
    createdAt: Date.now() - 1000000,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1510784722466-f2aa9c52fed6?auto=format&fit=crop&q=80&w=1200',
    title: 'Golden Hour Walks',
    description: 'The way the light hits the field just before the sun disappears.',
    category: 'Nature',
    albumId: 'all',
    createdAt: Date.now() - 2000000,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200',
    title: 'Coastal Whispers',
    description: 'Listening to the ocean breathe in a forgotten cove.',
    category: 'Travel',
    albumId: 'all',
    createdAt: Date.now() - 3000000,
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1433086566608-573bb01ee43d?auto=format&fit=crop&q=80&w=800',
    title: 'Autumn Rain',
    description: 'The smell of wet earth and the vibrant change of seasons.',
    category: 'Nature',
    albumId: 'all',
    createdAt: Date.now() - 4000000,
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800',
    title: 'Ancient Pathways',
    description: 'Walking through a forest that has seen a thousand years pass.',
    category: 'Moments',
    albumId: 'all',
    createdAt: Date.now() - 5000000,
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    title: 'The Summit Breath',
    description: 'Standing above the clouds, where the air is thin and the world is wide.',
    category: 'Travel',
    albumId: 'all',
    createdAt: Date.now() - 6000000,
  }
];

export const CATEGORIES = ['All', 'Nature', 'Travel', 'Family', 'Moments'];
