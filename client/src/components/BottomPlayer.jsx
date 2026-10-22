import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Maximize2,
  ListMusic,
  Tv,
  Loader2
} from 'lucide-react';

function formatSeconds(secs) {
  if (isNaN(secs) || secs < 0) return '0:00';
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function BottomPlayer({ onToggleQueue, isQueueOpen }) {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isSeekingRef,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleVideoModal,
    toggleVideoDock,
    isVideoDocked,
    showVideoModal
  } = usePlayer();

  const { isLiked, toggleLike } = useLibrary();

  const [hoverSeek, setHoverSeek] = useState(null);
  const [localSeekTime, setLocalSeekTime] = useState(null);

  const displayTime = localSeekTime !== null ? localSeekTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;
  const liked = currentTrack ? isLiked(currentTrack.id) : false;

  const handleSeekChange = (e) => {
    const val = parseFloat(e.target.value);
    setLocalSeekTime(val);
  };

  const handleSeekStart = () => {
    isSeekingRef.current = true;
  };

  const handleSeekEnd = (e) => {
    isSeekingRef.current = false;
    const val = parseFloat(e.target.value);
    setLocalSeekTime(null);
    seekTo(val);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 h-20 sm:h-24 bg-brand-elevated/95 backdrop-blur-xl border-t border-brand-border px-3 sm:px-5 flex items-center justify-between z-30 select-none shadow-player">
      {/* Left: Track Details & Artwork */}
      <div className="flex items-center space-x-3 sm:space-x-4 w-1/4 min-w-[180px] max-w-[320px]">
        {currentTrack ? (
          <>
            <div
              onClick={toggleVideoModal}
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden group/art shrink-0 cursor-pointer shadow-md"
              title="Click to view official video"
            >
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-full h-full object-cover group-hover/art:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/art:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex flex-col overflow-hidden min-w-0 pr-1">
              <span
                onClick={toggleVideoModal}
                className="text-sm font-semibold text-white truncate hover:underline cursor-pointer"
                title={currentTrack.title}
              >
                {currentTrack.title}
              </span>
              <span
                className="text-xs text-brand-subtext truncate hover:text-white transition-colors"
                title={currentTrack.artist || currentTrack.channel}
              >
                {currentTrack.artist || currentTrack.channel}
              </span>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={() => toggleLike(currentTrack)}
                className={`p-1.5 rounded-full transition-all ${
                  liked
                    ? 'text-brand-green scale-110'
                    : 'text-brand-subtext hover:text-white hover:scale-105'
                }`}
                title={liked ? 'Remove from Liked Songs' : 'Save to Your Liked Songs'}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${liked ? 'fill-brand-green' : ''}`} />
              </button>

              <button
                onClick={toggleVideoDock}
                className={`p-1.5 rounded-full hidden sm:flex transition-all ${
                  isVideoDocked
                    ? 'text-brand-neon bg-white/10'
                    : 'text-brand-subtext hover:text-white'
                }`}
                title={isVideoDocked ? 'Hide Mini-Player' : 'Dock Mini-Player'}
              >
                <Tv className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-3 text-brand-subtext text-xs italic">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
              <ListMusic className="w-6 h-6 text-zinc-600" />
            </div>
            <span>Select a song to start listening</span>
          </div>
        )}
      </div>

      {/* Center: Controls & Seek Bar */}
      <div className="flex flex-col items-center max-w-xl w-2/4 px-2">
        {/* Buttons row */}
        <div className="flex items-center space-x-4 sm:space-x-6 mb-1">
          {/* Shuffle Button */}
          <button
            onClick={toggleShuffle}
            disabled={!currentTrack}
            className={`p-1.5 rounded-full transition-colors relative disabled:opacity-30 ${
              isShuffle ? 'text-brand-green' : 'text-brand-subtext hover:text-white'
            }`}
            title={isShuffle ? 'Disable Shuffle' : 'Enable Shuffle'}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-green" />
            )}
          </button>

          {/* Previous Button */}
          <button
            onClick={playPrevious}
            disabled={!currentTrack}
            className="p-1.5 text-brand-subtext hover:text-white disabled:opacity-30 transition-transform active:scale-95"
            title="Previous Track"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Big Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={!currentTrack}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-brand-neon text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-glow"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isBuffering ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black translate-x-0.5" />
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={playNext}
            disabled={!currentTrack}
            className="p-1.5 text-brand-subtext hover:text-white disabled:opacity-30 transition-transform active:scale-95"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat Button */}
          <button
            onClick={toggleRepeat}
            disabled={!currentTrack}
            className={`p-1.5 rounded-full transition-colors relative disabled:opacity-30 ${
              repeatMode !== 'off' ? 'text-brand-green' : 'text-brand-subtext hover:text-white'
            }`}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== 'off' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-green" />
            )}
          </button>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="w-full flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <span className="w-9 text-right tabular-nums select-none">
            {formatSeconds(displayTime)}
          </span>

          <div className="relative flex-1 group flex items-center py-1">
            {/* Custom Background Track */}
            <div className="w-full h-1 bg-zinc-700/80 rounded-full overflow-hidden group-hover:h-1.5 transition-all">
              <div
                className="h-full bg-white group-hover:bg-brand-green transition-colors rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Invisible native range slider over track */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={displayTime}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onChange={handleSeekChange}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              disabled={!currentTrack || duration <= 0}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
              aria-label="Seek track position"
            />
          </div>

          <span className="w-9 text-left tabular-nums select-none">
            {formatSeconds(duration)}
          </span>
        </div>
      </div>

      {/* Right: Extra Controls & Volume */}
      <div className="flex items-center justify-end space-x-2 sm:space-x-3 w-1/4 min-w-[140px]">
        {/* Toggle Official Video Modal */}
        <button
          onClick={toggleVideoModal}
          disabled={!currentTrack}
          className={`p-2 rounded-lg transition-colors hidden md:flex disabled:opacity-30 ${
            showVideoModal ? 'text-brand-neon bg-white/10' : 'text-brand-subtext hover:text-white'
          }`}
          title="Watch Official YouTube Video"
        >
          <Tv className="w-4 h-4" />
        </button>

        {/* Queue Drawer Toggle */}
        <button
          onClick={onToggleQueue}
          className={`p-2 rounded-lg transition-colors relative ${
            isQueueOpen ? 'text-brand-neon bg-white/10' : 'text-brand-subtext hover:text-white'
          }`}
          title="View Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume controls */}
        <div className="hidden sm:flex items-center space-x-2 group">
          <button
            onClick={toggleMute}
            className="p-1.5 text-brand-subtext hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : volume < 50 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="relative w-20 sm:w-24 flex items-center py-1">
            <div className="w-full h-1 bg-zinc-700/80 rounded-full overflow-hidden group-hover:h-1.5 transition-all">
              <div
                className="h-full bg-white group-hover:bg-brand-green transition-colors rounded-full"
                style={{ width: `${isMuted ? 0 : volume}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Volume control"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
