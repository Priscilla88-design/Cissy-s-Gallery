import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], title: string, description: string, category: Category) => Promise<void>;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Moments');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => setSelectedFiles(prev => [...prev, ...acceptedFiles])
  } as any);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    try {
      await onUpload(selectedFiles, title, description, category);
      setSelectedFiles([]);
      setTitle('');
      setDescription('');
      setCategory('Moments');
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* ... */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl"
          id="upload-modal"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-serif">Add New Memory</h2>
            <button
              onClick={onClose}
              className="text-ink/40 transition-colors hover:text-ink"
              id="close-upload"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div
              {...getRootProps()}
              className={`flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
                isDragActive ? 'border-olive bg-olive/5' : 'border-ink/10 hover:border-olive/40'
              }`}
              id="dropzone"
            >
              <input {...getInputProps()} />
              <Upload className="mb-4 text-ink/20" size={32} />
              {selectedFiles.length > 0 ? (
                <p className="text-sm font-medium">{selectedFiles.length} images selected</p>
              ) : (
                <div className="text-center px-4">
                  <p className="text-sm font-medium">Drag & drop your photos here</p>
                  <p className="text-xs text-ink/40 mt-1">or click to browse your devices</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink/40">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="A day at the lake..."
                  className="mt-1 w-full rounded-xl border border-ink/10 px-4 py-3 text-sm focus:border-olive outline-none transition-colors"
                  id="photo-title-input"
                />
              </div>
              
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-ink/40">Category</label>
                <div className="relative mt-1">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full appearance-none rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-olive outline-none transition-colors pr-10"
                    id="category-select"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink/40">Story / Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the story behind this moment..."
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-ink/10 px-4 py-3 text-sm focus:border-olive outline-none transition-colors"
                  id="photo-desc-input"
                />
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-olive py-4 font-medium text-white shadow-lg transition-all hover:bg-olive/90 disabled:opacity-50"
              id="submit-upload"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Preserving moments...</span>
                </>
              ) : (
                <span>Add to Gallery</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
