import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock, Compass } from 'lucide-react';
import TrackRow from '../components/TrackRow';
import { usePlayer } from '../context/PlayerContext';
import { getGenreTracks } from '../services/api';

export default function GenreDetailPage({ genre, onAddToPlaylistClick }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getGenreTracks(genre.id).then((res) => {
      if (isMounted) {
        setTracks(res.tracks || []);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [genre.id]);

  const isCurrentPlaying =
    tracks.length > 0 &&
    currentTrack &&
    tracks.some(t => t.id === currentTrack.id) &&
    isPlaying;

  const handlePlayAll = () => {
    if (tracks.length === 0) return;
    if (isCurrentPlaying) {
      togglePlay();
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div
        className={`p-6 sm:p-10 rounded-2xl bg-gradient-to-br ${genre.color} text-white shadow-2xl relative overflow-hidden`}
      >
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">
            Genre & Mood
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{genre.name}</h1>
          <p className="text-xs sm:text-sm text-white/90">
            Top tracks and hits curated for {genre.name}.
          </p>
        </div>

        <div className="absolute right-4 bottom-2 text-white/10 -rotate-12 pointer-events-none">
          <Compass className="w-48 h-48" />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center space-x-4 px-2">
        <button
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          className="w-14 h-14 rounded-full bg-brand-green hover:bg-brand-neon text-black flex items-center justify-center shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          title={isCurrentPlaying ? 'Pause' : 'Play all'}
        >
          {isCurrentPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Tracks Table */}
      <div className="space-y-1">
        <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_2fr_auto] items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-white/5 select-none">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="hidden md:block">Channel / Views</span>
          <div className="flex items-center space-x-3 w-16 justify-end pr-6">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-zinc-500 animate-pulse">
            Loading tracks for {genre.name}...
          </div>
        ) : (
          tracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              playlist={tracks}
              onAddToPlaylistClick={onAddToPlaylistClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
