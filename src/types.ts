export interface Photo {
  id: string;
  url: string; // This will be the base64 string
  title: string;
  description: string;
  category: Category;
  albumId: string;
  userId: string;
  createdAt: number;
}

export interface Album {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  coverUrl?: string;
  createdAt: number;
}

export type Category = 'All' | 'Family' | 'Travel' | 'Nature' | 'Moments';
