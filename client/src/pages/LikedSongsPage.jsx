import React, { useState } from 'react';
import { Heart, Play, Pause, Clock, Search, Music2 } from 'lucide-react';
import TrackRow from '../components/TrackRow';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';

export default function LikedSongsPage({ onAddToPlaylistClick }) {
  const { likedSongs } = useLibrary();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredTracks = likedSongs.filter(t =>
    t.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (t.artist && t.artist.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const totalSeconds = likedSongs.reduce((acc, t) => acc + (t.duration || 210), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  const isCurrentPlaylistPlaying =
    likedSongs.length > 0 &&
    currentTrack &&
    likedSongs.some(t => t.id === currentTrack.id) &&
    isPlaying;

  const handlePlayAll = () => {
    if (likedSongs.length === 0) return;
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playTrack(likedSongs[0], likedSongs);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-indigo-900/60 via-brand-elevated/40 to-transparent border border-white/5">
        <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-xl bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-500 flex items-center justify-center shadow-2xl shrink-0">
          <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-white fill-white drop-shadow-md" />
        </div>

        <div className="flex flex-col text-center sm:text-left min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">
            Playlist
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight py-1">
            Liked Songs
          </h1>
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm text-zinc-300 mt-2">
            <span className="font-semibold text-white">Your Collection</span>
            <span>•</span>
            <span>{likedSongs.length} songs</span>
            {likedSongs.length > 0 && (
              <>
                <span>•</span>
                <span className="text-zinc-400">about {totalMinutes} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <button
            onClick={handlePlayAll}
            disabled={likedSongs.length === 0}
            className="w-14 h-14 rounded-full bg-brand-green hover:bg-brand-neon text-black flex items-center justify-center shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            title={isCurrentPlaylistPlaying ? 'Pause' : 'Play all'}
          >
            {isCurrentPlaylistPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Filter input */}
        {likedSongs.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search in liked songs"
              className="w-full bg-brand-highlight/60 text-white text-xs rounded-full pl-9 pr-4 py-2 border border-white/5 focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-500"
            />
          </div>
        )}
      </div>

      {/* Tracks Table */}
      {likedSongs.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <Music2 className="w-16 h-16 mx-auto text-zinc-600 mb-2" />
          <h3 className="text-xl font-bold text-white">Songs you like will appear here</h3>
          <p className="text-xs text-brand-subtext max-w-sm mx-auto">
            Save songs by tapping the heart icon anywhere in VibeFree.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {/* Table Header */}
          <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_2fr_auto] items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-white/5 select-none">
            <span className="text-center">#</span>
            <span>Title</span>
            <span className="hidden md:block">Channel / Views</span>
            <div className="flex items-center space-x-3 w-16 justify-end pr-6">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {filteredTracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              playlist={filteredTracks}
              onAddToPlaylistClick={onAddToPlaylistClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
