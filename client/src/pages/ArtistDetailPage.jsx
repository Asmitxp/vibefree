import React, { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle2, Clock } from 'lucide-react';
import TrackRow from '../components/TrackRow';
import { usePlayer } from '../context/PlayerContext';
import { getArtistTracks } from '../services/api';

export default function ArtistDetailPage({ artist, onAddToPlaylistClick }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getArtistTracks(artist.id).then((res) => {
      if (isMounted) {
        setTracks(res.tracks || []);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [artist.id]);

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
      <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-brand-highlight/60 via-brand-elevated/40 to-transparent border border-white/5">
        <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden bg-zinc-800 shadow-2xl shrink-0 border-2 border-white/10">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-brand-green text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 fill-brand-green text-black" />
            <span>Verified Artist</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight py-1">
            {artist.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-mono">
            {artist.monthlyListeners} monthly listeners
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center space-x-4 px-2">
        <button
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          className="w-14 h-14 rounded-full bg-brand-green hover:bg-brand-neon text-black flex items-center justify-center shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          title={isCurrentPlaying ? 'Pause' : 'Play top tracks'}
        >
          {isCurrentPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Tracks Table */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white px-2">Popular Tracks</h3>

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
              Loading popular tracks for {artist.name}...
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
    </div>
  );
}
