import React from 'react';
import { X, Trash2, Music2, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function QueueDrawer({ isOpen, onClose }) {
  const { currentTrack, queue, queueIndex, playTrack, removeFromQueue, clearQueue } = usePlayer();

  if (!isOpen) return null;

  const upcomingTracks = queue.slice(queueIndex + 1);

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 sm:w-96 bg-brand-elevated/95 backdrop-blur-2xl border-l border-brand-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-brand-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-lg text-white">Play Queue</h3>
          <span className="text-xs bg-white/10 text-brand-neon px-2 py-0.5 rounded-full font-mono">
            {queue.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
              title="Clear Queue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Now Playing section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Now Playing
          </h4>
          {currentTrack ? (
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-brand-highlight/70 border border-brand-green/30 shadow-md">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-brand-green truncate block">
                  {currentTrack.title}
                </span>
                <span className="text-xs text-brand-subtext truncate block">
                  {currentTrack.artist || currentTrack.channel}
                </span>
              </div>
              <div className="flex items-end space-x-0.5 h-3">
                <span className="w-0.5 bg-brand-green h-full animate-equalizer-1 rounded-full" />
                <span className="w-0.5 bg-brand-green h-2/3 animate-equalizer-2 rounded-full" />
                <span className="w-0.5 bg-brand-green h-full animate-equalizer-3 rounded-full" />
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic">No track currently playing</p>
          )}
        </div>

        {/* Up Next Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Next in Queue
            </h4>
            <span className="text-xs text-zinc-500 font-mono">
              {upcomingTracks.length} tracks
            </span>
          </div>

          {upcomingTracks.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              <Music2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Queue is empty. Click 3-dots on any song to add it!
            </div>
          ) : (
            <div className="space-y-1.5">
              {upcomingTracks.map((track, i) => {
                const realIndex = queueIndex + 1 + i;
                return (
                  <div
                    key={`${track.id}-${realIndex}`}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => playTrack(track, queue)}
                  >
                    <div className="flex items-center space-x-3 min-w-0 mr-2">
                      <span className="text-xs font-mono text-zinc-500 w-4 text-center">
                        {i + 1}
                      </span>
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-9 h-9 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white truncate block group-hover:text-brand-green transition-colors">
                          {track.title}
                        </span>
                        <span className="text-[11px] text-brand-subtext truncate block">
                          {track.artist || track.channel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(realIndex);
                        }}
                        className="p-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from queue"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
