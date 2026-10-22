import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, Maximize2, Minimize2, AlertCircle, SkipForward } from 'lucide-react';

export default function YouTubePlayerEmbed() {
  const {
    currentTrack,
    playbackError,
    showVideoModal,
    setShowVideoModal,
    isVideoDocked,
    setIsVideoDocked,
    onPlayerReady,
    onPlayerStateChange,
    onPlayerError,
    playNext
  } = usePlayer();

  const containerRef = useRef(null);
  const playerInstanceRef = useRef(null);

  // Initialize YT Player once API is ready
  useEffect(() => {
    let checkInterval = null;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return false;
      if (playerInstanceRef.current) return true;

      try {
        playerInstanceRef.current = new window.YT.Player('vibefree-yt-player', {
          height: '100%',
          width: '100%',
          videoId: currentTrack ? currentTrack.id : '',
          playerVars: {
            autoplay: 1,
            controls: 1, // Official YouTube controls are accessible
            disablekb: 0,
            enablejsapi: 1,
            fs: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              onPlayerReady(event.target);
            },
            onStateChange: (event) => {
              onPlayerStateChange(event);
            },
            onError: (event) => {
              onPlayerError(event);
            }
          }
        });
        return true;
      } catch (err) {
        console.error('Failed to instantiate YouTube player:', err);
        return false;
      }
    };

    if (!initPlayer()) {
      checkInterval = setInterval(() => {
        if (initPlayer()) {
          clearInterval(checkInterval);
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [onPlayerReady, onPlayerStateChange, onPlayerError]);

  return (
    <>
      {/* Full Modal Video View */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-brand-elevated rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-brand-highlight/40 border-b border-white/5">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse"></div>
                <span className="text-xs uppercase tracking-wider text-brand-subtext font-semibold">
                  Official YouTube Music Player
                </span>
                <span className="text-zinc-600">|</span>
                <p className="text-sm font-medium text-white truncate max-w-md">
                  {currentTrack?.title} • {currentTrack?.artist}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setShowVideoModal(false);
                    setIsVideoDocked(true);
                  }}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  title="Dock to bottom-right"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Container in Modal */}
            <div className="relative aspect-video w-full bg-black">
              {/* If modal is open and not docked, we position the iframe container here */}
              <div
                className="w-full h-full"
                ref={containerRef}
              >
                {/* Notice: The iframe lives in the persistent portal wrapper below */}
              </div>
            </div>

            {/* Track Info in Modal */}
            {currentTrack && (
              <div className="px-6 py-4 bg-brand-elevated flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{currentTrack.title}</h3>
                  <p className="text-sm text-brand-subtext">{currentTrack.artist} • {currentTrack.channel}</p>
                </div>
                <button
                  onClick={playNext}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  <SkipForward className="w-4 h-4 text-brand-neon" />
                  <span>Next Video</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Picture-in-Picture Dock in bottom-right corner */}
      <div
        className={`fixed z-40 transition-all duration-300 ease-in-out ${
          showVideoModal
            ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-video rounded-2xl shadow-2xl opacity-100 pointer-events-auto'
            : isVideoDocked
            ? 'bottom-24 right-6 w-80 sm:w-96 aspect-video rounded-xl shadow-2xl border border-white/10 overflow-hidden opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none w-1 h-1 overflow-hidden -top-[9999px] -left-[9999px]'
        }`}
      >
        {/* Floating dock controls */}
        {isVideoDocked && !showVideoModal && (
          <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-2 flex items-center justify-between z-10">
            <span className="text-xs text-zinc-300 font-medium px-2 py-0.5 bg-black/60 rounded-md backdrop-blur-md">
              Now Playing
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setIsVideoDocked(false);
                  setShowVideoModal(true);
                }}
                className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-md backdrop-blur-md transition-colors"
                title="Expand Full View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsVideoDocked(false)}
                className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-md backdrop-blur-md transition-colors"
                title="Minimize Video"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* The persistent YouTube player DOM element */}
        <div id="vibefree-yt-player" className="w-full h-full bg-black"></div>
      </div>

      {/* Playback Error Toast/Banner */}
      {playbackError && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-red-950/90 border border-red-500/50 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-4 animate-in slide-in-from-bottom duration-300">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-red-200">Video Unavailable in Embed</p>
            <p className="text-xs text-red-300/80">{playbackError}</p>
          </div>
          <button
            onClick={playNext}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors ml-2"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Play Next</span>
          </button>
        </div>
      )}
    </>
  );
}
