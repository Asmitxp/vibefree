import React, { useState } from 'react';
import { Heart, Plus, Play, Pause, Music } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';

export default function LibraryPage({ setCurrentView, onCreatePlaylistOpen }) {
  const { playlists, likedSongs } = useLibrary();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [filter, setFilter] = useState('all'); // 'all' | 'playlists' | 'liked'

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Your Library
        </h1>
        <button
          onClick={onCreatePlaylistOpen}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-green hover:bg-brand-neon text-black text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-glow"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('playlists')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            filter === 'playlists'
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Playlists
        </button>
        <button
          onClick={() => setFilter('liked')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            filter === 'liked'
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Liked Songs
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {/* Liked Songs Tile */}
        {(filter === 'all' || filter === 'liked') && (
          <div
            onClick={() => setCurrentView({ type: 'liked-songs' })}
            className="group col-span-2 sm:col-span-2 p-5 rounded-xl bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 cursor-pointer flex flex-col justify-between shadow-xl relative overflow-hidden transition-transform hover:scale-[1.02]"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                Playlist
              </span>
              <h3 className="text-2xl font-black text-white">Liked Songs</h3>
            </div>

            <div className="flex items-center justify-between pt-6">
              <p className="text-xs font-semibold text-white/90">
                {likedSongs.length} liked songs
              </p>

              <div className="w-12 h-12 rounded-full bg-brand-green text-black flex items-center justify-center shadow-glow opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 fill-black translate-x-0.5" />
              </div>
            </div>
          </div>
        )}

        {/* User Playlists */}
        {(filter === 'all' || filter === 'playlists') &&
          playlists.map((pl) => {
            const isThisPlaying =
              currentTrack &&
              pl.tracks.some((t) => t.id === currentTrack.id) &&
              isPlaying;

            return (
              <div
                key={pl.id}
                onClick={() => setCurrentView({ type: 'playlist', playlistId: pl.id })}
                className="group p-4 rounded-xl bg-brand-elevated/70 hover:bg-brand-highlight/90 transition-all duration-300 cursor-pointer flex flex-col relative"
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-800 shadow-lg mb-3">
                  {pl.cover ? (
                    <img
                      src={pl.cover}
                      alt={pl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
                      <Music className="w-10 h-10" />
                    </div>
                  )}

                  {pl.tracks.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isThisPlaying) {
                          togglePlay();
                        } else {
                          playTrack(pl.tracks[0], pl.tracks);
                        }
                      }}
                      className={`absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-brand-green hover:bg-brand-neon text-black flex items-center justify-center shadow-glow transition-all duration-300 hover:scale-110 active:scale-95 ${
                        isThisPlaying
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                      }`}
                      title="Play Playlist"
                    >
                      {isThisPlaying ? (
                        <Pause className="w-5 h-5 fill-black" />
                      ) : (
                        <Play className="w-5 h-5 fill-black translate-x-0.5" />
                      )}
                    </button>
                  )}
                </div>

                <h4 className="font-semibold text-sm text-white truncate mb-1">
                  {pl.name}
                </h4>
                <p className="text-xs text-brand-subtext truncate">
                  Playlist • {pl.tracks.length} songs
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
