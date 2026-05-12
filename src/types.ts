export interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  category: Category;
  albumId: string;
  createdAt: number;
}

export interface Album {
  id: string;
  name: string;
  description: string;
  coverId?: string; // ID of the photo used as cover
  createdAt: number;
}

export type Category = 'All' | 'Family' | 'Travel' | 'Nature' | 'Moments';
