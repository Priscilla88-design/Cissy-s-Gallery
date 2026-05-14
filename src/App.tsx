/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Camera, Search, Filter, Trash2, Heart, LogOut, BookOpen } from 'lucide-react';
import { Photo, Category, Album } from './types';
import { CATEGORIES, INITIAL_PHOTOS } from './constants';
import { PhotoGrid } from './components/PhotoGrid';
import { Lightbox } from './components/Lightbox';
import { UploadModal } from './components/UploadModal';
import { Login } from './components/Login';
import { useAuth } from './components/FirebaseProvider';
import { subscribeToPhotos, addPhoto, deletePhoto } from './services/photoService';
import { subscribeToAlbums, createAlbum } from './services/albumService';
import { compressImage } from './lib/imageCompression';
import { cn } from './lib/utils';

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Initialize albums and default album
  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToAlbums(user.uid, (data) => {
        if (data.length === 0) {
          // Create a default album if none exists
          createAlbum('General Memories', 'A default collection for your moments.', user.uid);
        } else {
          setAlbums(data);
          if (!activeAlbumId) setActiveAlbumId(data[0].id);
        }
      });
      return unsubscribe;
    }
  }, [user]);

  // Subscribe to photos in the active album
  useEffect(() => {
    if (user && activeAlbumId) {
      const unsubscribe = subscribeToPhotos(user.uid, activeAlbumId, (data) => {
        setPhotos(data);
        setIsInitializing(false);
      });
      return unsubscribe;
    } else if (!user) {
      setPhotos([]);
      setIsInitializing(false);
    }
  }, [user, activeAlbumId]);

  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' ? true : p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [photos, activeCategory, searchQuery]);

  const handleUpload = async (files: File[], title: string, description: string, category: Category, albumId: string) => {
    if (!user) return;
    
    for (const file of files) {
      try {
        const base64 = await compressImage(file);
        await addPhoto(base64, title || file.name, description, user.uid, category, albumId);
      } catch (error) {
        console.error('Failed to compress or upload image:', error);
        alert(`Failed to upload ${file.name}. It might be too large or corrupted.`);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      await deletePhoto(id);
    }
  };

  const seedSamplePhotos = async () => {
    if (!user || !activeAlbumId || isSeeding) return;
    setIsSeeding(true);
    try {
      const sample = INITIAL_PHOTOS.find(p => p.title === 'Parisian Sunset') || INITIAL_PHOTOS[0];
      await addPhoto(sample.url, sample.title, sample.description, user.uid, sample.category as Category, activeAlbumId);
      alert('Parisian memory added to your collection!');
    } catch (error) {
      console.error('Seeding failed:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  const seedNaturePhotos = async () => {
    if (!user || !activeAlbumId || isSeeding) return;
    setIsSeeding(true);
    try {
      const naturePhotos = INITIAL_PHOTOS.filter(p => ['Crimson Tide', 'Aurora Heart', 'Alpine Sanctuary'].includes(p.title));
      for (const photo of naturePhotos) {
        await addPhoto(photo.url, photo.title, photo.description, user.uid, 'Nature', activeAlbumId);
      }
      setActiveCategory('Nature');
      alert('Nature memories added to your collection!');
    } catch (error) {
      console.error('Nature seeding failed:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  const seedAllSamples = async () => {
    if (!user || !activeAlbumId || isSeeding) return;
    setIsSeeding(true);
    try {
      for (const photo of INITIAL_PHOTOS) {
        await addPhoto(photo.url, photo.title, photo.description, user.uid, photo.category as Category, activeAlbumId);
      }
      alert('Sample memories imported successfully!');
    } catch (error) {
      console.error('Bulk seeding failed:', error);
    } finally {
      setIsSeeding(false);
    }
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
              <div className="relative flex items-center">
                <BookOpen size={16} className="absolute left-3 text-ink/30" />
                <select
                  value={activeAlbumId}
                  onChange={(e) => setActiveAlbumId(e.target.value)}
                  className="rounded-full border border-ink/10 bg-white/50 pl-10 pr-8 py-2.5 text-sm transition-all focus:border-olive focus:bg-white focus:outline-none appearance-none"
                  id="album-selector"
                >
                  {albums.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

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
                (Note: Your photos are stored securely in the cloud).
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={seedSamplePhotos}
                  disabled={isSeeding}
                  className="rounded-full border border-ink/10 px-8 py-3 text-sm font-medium hover:bg-ink/5 transition-colors disabled:opacity-50"
                  id="add-paris-btn"
                >
                  {isSeeding ? 'Adding...' : 'Add Paris Travel Memory'}
                </button>
                <button
                  onClick={seedNaturePhotos}
                  disabled={isSeeding}
                  className="rounded-full border border-ink/10 px-8 py-3 text-sm font-medium hover:bg-ink/5 transition-colors disabled:opacity-50"
                  id="add-nature-btn"
                >
                  {isSeeding ? 'Adding...' : 'Add Nature Memories'}
                </button>
                <button
                  onClick={seedAllSamples}
                  disabled={isSeeding}
                  className="rounded-full border border-ink/10 px-8 py-3 text-sm font-medium hover:bg-ink/5 transition-colors disabled:opacity-50"
                  id="import-samples-btn"
                >
                  {isSeeding ? 'Importing...' : 'Import Sample Collection'}
                </button>
              </div>
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
        albums={albums}
        defaultAlbumId={activeAlbumId}
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

