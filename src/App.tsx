/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Camera, Search, Filter, Trash2, Heart, LogOut } from 'lucide-react';
import { Photo, Category } from './types';
import { CATEGORIES } from './constants';
import { PhotoGrid } from './components/PhotoGrid';
import { Lightbox } from './components/Lightbox';
import { UploadModal } from './components/UploadModal';
import { Login } from './components/Login';
import { useAuth } from './components/FirebaseProvider';
import { subscribeToPhotos, addPhoto, deletePhoto } from './services/photoService';
import { cn } from './lib/utils';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToPhotos(user.uid, (data) => {
        setPhotos(data);
        setIsInitializing(false);
      });
      return unsubscribe;
    } else {
      setPhotos([]);
      setIsInitializing(false);
    }
  }, [user]);

  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' ? true : p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [photos, activeCategory, searchQuery]);

  const handleUpload = async (files: File[], title: string, description: string, category: Category) => {
    if (!user) return;
    
    for (const file of files) {
      const randomId = Math.floor(Math.random() * 1000);
      const url = `https://images.unsplash.com/photo-${randomId}?auto=format&fit=crop&q=80&w=1200`;
      
      await addPhoto(url, title || file.name, description, user.uid, category);
    }
  };

  const handleDelete = async (id: string) => {
    await deletePhoto(id);
  };

  const selectedIndex = useMemo(() => {
    return filteredPhotos.findIndex(p => p.id === selectedPhoto?.id);
  }, [filteredPhotos, selectedPhoto]);

  const handleNext = () => {
    if (selectedIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[selectedIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedPhoto(filteredPhotos[selectedIndex - 1]);
    }
  };

  if (loading || isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="font-serif text-2xl italic text-ink/20"
        >
          Moments...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-paper" id="app-root">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-xl border-b border-ink/5">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-serif text-ink">Moments</h1>
                <p className="mt-1 text-sm text-ink/40 italic">A curated diary of your life.</p>
              </div>
              <button 
                onClick={signOut}
                className="ml-4 p-2 text-ink/20 hover:text-ink/60 transition-colors"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full border border-ink/10 bg-white/50 pl-10 pr-6 py-2.5 text-sm transition-all focus:border-olive focus:bg-white focus:outline-none w-full md:w-64"
                  id="search-input"
                />
              </div>
              
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 rounded-full bg-olive px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-olive/20 transition-all hover:bg-olive/90 active:scale-95"
                id="add-memory-btn"
              >
                <Plus size={18} />
                <span>Add Memory</span>
              </button>
            </div>
          </div>

          {/* Categories */}
          <nav className="mt-8 flex gap-8 overflow-x-auto pb-1 scrollbar-hide" id="category-nav">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as Category)}
                className={cn(
                  "relative pb-2 text-sm font-medium transition-colors whitespace-nowrap",
                  activeCategory === cat ? "text-ink" : "text-ink/30 hover:text-ink/60"
                )}
                id={`cat-${cat}`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="active-cat"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-olive"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {filteredPhotos.length > 0 ? (
            <PhotoGrid 
              photos={filteredPhotos} 
              onOpenPhoto={setSelectedPhoto}
              onDeletePhoto={handleDelete}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
              id="empty-state"
            >
              <div className="rounded-full bg-ink/5 p-8 text-ink/20">
                <Camera size={48} />
              </div>
              <h2 className="mt-6 text-2xl font-serif text-ink/60">Your gallery is empty</h2>
              <p className="mt-2 text-ink/30 max-w-md mx-auto">
                Begin your collection by adding your first memory. Use the "Add Memory" button to get started. 
                (Note: This demo uses curated Unsplash images for uploads).
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Overlays */}
      <Lightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onNext={selectedIndex < filteredPhotos.length - 1 ? handleNext : undefined}
        onPrev={selectedIndex > 0 ? handlePrev : undefined}
      />
      
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />

      {/* Footer */}
      <footer className="border-t border-ink/5 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-serif italic text-ink/40">Made with love for the moments that matter.</p>
          <div className="flex gap-6 text-ink/30 items-center">
            <span className="text-[10px] uppercase tracking-widest">{user.email}</span>
            <Heart size={20} className="hover:text-red-400 transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}

