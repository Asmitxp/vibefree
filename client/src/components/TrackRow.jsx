import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Plus, ListPlus, Trash2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';

export default function TrackRow({
  track,
  index,
  playlist = [],
  playlistId = null,
  onAddToPlaylistClick
}) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue } = usePlayer();
  const { isLiked, toggleLike, removeTrackFromPlaylist } = useLibrary();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isCurrent = currentTrack && currentTrack.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const liked = isLiked(track.id);

  // Close context menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, playlist.length > 0 ? playlist : [track]);
    }
  };

  return (
    <div
      onClick={handlePlay}
      className={`group grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_2fr_auto] items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer select-none ${
        isCurrent ? 'bg-white/5' : ''
      }`}
    >
      {/* Index or Play / Equalizer */}
      <div className="w-4 flex items-center justify-center text-xs text-brand-subtext">
        {isThisPlaying ? (
          <div className="flex items-end space-x-0.5 h-3 group-hover:hidden">
            <span className="w-0.5 bg-brand-green h-full animate-equalizer-1 rounded-full" />
            <span className="w-0.5 bg-brand-green h-2/3 animate-equalizer-2 rounded-full" />
            <span className="w-0.5 bg-brand-green h-full animate-equalizer-3 rounded-full" />
          </div>
        ) : (
          <span className={`${isCurrent ? 'text-brand-green font-bold' : ''} group-hover:hidden`}>
            {index + 1}
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          className="hidden group-hover:flex text-white hover:text-brand-neon hover:scale-110 transition-transform"
        >
          {isThisPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>
      </div>

      {/* Title & Artist info */}
      <div className="flex items-center space-x-3 min-w-0 pr-2">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-10 h-10 rounded object-cover shrink-0 shadow-sm"
          loading="lazy"
        />
        <div className="flex flex-col min-w-0">
          <span
            className={`text-sm font-medium truncate ${
              isCurrent ? 'text-brand-green font-semibold' : 'text-white'
            }`}
          >
            {track.title}
          </span>
          <span className="text-xs text-brand-subtext truncate group-hover:text-zinc-300">
            {track.artist || track.channel}
          </span>
        </div>
      </div>

      {/* Views / Album / Channel (Hidden on mobile) */}
      <div className="hidden md:block text-xs text-brand-subtext truncate">
        {track.views || track.channel || 'Music'}
      </div>

      {/* Right Actions: Heart, Duration, Menu */}
      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track);
          }}
          className={`p-1 transition-all ${
            liked
              ? 'text-brand-green opacity-100'
              : 'text-brand-subtext opacity-0 group-hover:opacity-100 hover:text-white'
          }`}
          title={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-brand-green' : ''}`} />
        </button>

        <span className="text-xs text-brand-subtext font-mono w-10 text-right">
          {track.durationFormatted || '3:30'}
        </span>

        {/* 3-dots Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(prev => !prev);
            }}
            className="p-1 text-brand-subtext opacity-0 group-hover:opacity-100 hover:text-white transition-opacity rounded hover:bg-white/10"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-1 w-48 bg-brand-highlight border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button
                onClick={() => {
                  addToQueue(track);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/10 text-left transition-colors"
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span>Add to Queue</span>
              </button>

              <button
                onClick={() => {
                  if (onAddToPlaylistClick) onAddToPlaylistClick(track);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/10 text-left transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Playlist</span>
              </button>

              {playlistId && (
                <button
                  onClick={() => {
                    removeTrackFromPlaylist(playlistId, track.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-white/10 text-left transition-colors border-t border-white/5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove from Playlist</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
