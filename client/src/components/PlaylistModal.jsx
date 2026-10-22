import React, { useState, useEffect } from 'react';
import { X, Music } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export default function PlaylistModal({ isOpen, onClose, playlistToEdit = null }) {
  const { createPlaylist, renamePlaylist } = useLibrary();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (playlistToEdit) {
      setName(playlistToEdit.name);
      setDescription(playlistToEdit.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [playlistToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (playlistToEdit) {
      renamePlaylist(playlistToEdit.id, name, description);
    } else {
      createPlaylist(name, description);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-brand-elevated border border-white/10 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-green/20 border border-brand-green/30 flex items-center justify-center text-brand-green">
            <Music className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {playlistToEdit ? 'Edit Playlist' : 'Create New Playlist'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Playlist Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chill Late Night Vibes"
              className="w-full bg-brand-highlight border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-green transition-colors"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a memorable description..."
              rows={3}
              className="w-full bg-brand-highlight border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-green transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2 rounded-full text-sm font-bold bg-brand-green hover:bg-brand-neon text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shadow-glow"
            >
              {playlistToEdit ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
