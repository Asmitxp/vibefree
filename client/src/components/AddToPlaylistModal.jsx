import React, { useState } from 'react';
import { X, Check, Plus, Music } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export default function AddToPlaylistModal({ isOpen, onClose, track, onOpenCreatePlaylist }) {
  const { playlists, addTrackToPlaylist, removeTrackFromPlaylist } = useLibrary();
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen || !track) return null;

  const handleToggle = (playlist) => {
    const isAlreadyIn = playlist.tracks.some(t => t.id === track.id);
    if (isAlreadyIn) {
      removeTrackFromPlaylist(playlist.id, track.id);
      setSuccessMsg(`Removed from "${playlist.name}"`);
    } else {
      addTrackToPlaylist(playlist.id, track);
      setSuccessMsg(`Added to "${playlist.name}"`);
    }
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-brand-elevated border border-white/10 rounded-2xl p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-2">Add to Playlist</h3>

        {/* Track Preview */}
        <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-white/5 border border-white/5 mb-4">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-white truncate">{track.title}</h4>
            <p className="text-xs text-brand-subtext truncate">{track.artist || track.channel}</p>
          </div>
        </div>

        {/* Feedback message */}
        {successMsg && (
          <div className="mb-3 px-3 py-1.5 rounded-lg bg-brand-green/20 border border-brand-green/30 text-brand-neon text-xs font-semibold animate-in fade-in">
            {successMsg}
          </div>
        )}

        {/* Playlists list */}
        <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 mb-4">
          {playlists.length === 0 ? (
            <div className="text-center py-6 text-xs text-zinc-500">
              No playlists found. Create one below!
            </div>
          ) : (
            playlists.map((pl) => {
              const inPlaylist = pl.tracks.some(t => t.id === track.id);
              return (
                <button
                  key={pl.id}
                  onClick={() => handleToggle(pl)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    inPlaylist
                      ? 'bg-brand-green/10 border border-brand-green/30 text-white'
                      : 'bg-brand-highlight/40 hover:bg-brand-highlight text-zinc-300 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate mr-2">
                    <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium truncate">{pl.name}</span>
                  </div>

                  <div className="shrink-0">
                    {inPlaylist ? (
                      <div className="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center text-black">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center text-transparent hover:border-zinc-400">
                        <Plus className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Action to create new */}
        <button
          onClick={() => {
            onClose();
            if (onOpenCreatePlaylist) onOpenCreatePlaylist();
          }}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-dashed border-white/20 hover:border-brand-green text-sm font-semibold text-zinc-300 hover:text-brand-green transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>
    </div>
  );
}
