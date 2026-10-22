import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function TrackCard({ track, playlist = [], onCardClick }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const isCurrent = currentTrack && currentTrack.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, playlist.length > 0 ? playlist : [track]);
    }
  };

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(track);
    } else {
      if (isCurrent) {
        togglePlay();
      } else {
        playTrack(track, playlist.length > 0 ? playlist : [track]);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group p-3.5 sm:p-4 rounded-xl bg-brand-elevated/70 hover:bg-brand-highlight/90 transition-all duration-300 cursor-pointer flex flex-col relative border border-transparent hover:border-white/5"
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-800 shadow-lg mb-3">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Floating Green Play Button on Hover */}
        <button
          onClick={handlePlayClick}
          className={`absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-brand-green hover:bg-brand-neon text-black flex items-center justify-center shadow-glow transition-all duration-300 hover:scale-110 active:scale-95 ${
            isThisPlaying
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
          title={isThisPlaying ? 'Pause' : 'Play'}
        >
          {isThisPlaying ? (
            <Pause className="w-5 h-5 fill-black" />
          ) : (
            <Play className="w-5 h-5 fill-black translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0">
        <h4
          className={`font-semibold text-sm truncate mb-1 ${
            isCurrent ? 'text-brand-green' : 'text-white group-hover:text-white'
          }`}
          title={track.title}
        >
          {track.title}
        </h4>
        <p className="text-xs text-brand-subtext truncate" title={track.artist || track.channel}>
          {track.artist || track.channel}
        </p>
      </div>
    </div>
  );
}
