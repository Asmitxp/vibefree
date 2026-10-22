import React, { useState } from 'react';
import { Play, Pause, Trash2, Edit3, Clock, Music, Plus } from 'lucide-react';
import TrackRow from '../components/TrackRow';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';

export default function PlaylistDetailPage({
  playlistId,
  featuredPlaylist = null,
  onEditPlaylist,
  setCurrentView,
  onAddToPlaylistClick
}) {
  const { playlists, deletePlaylist } = useLibrary();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  // Find playlist from custom or featured
  const customPlaylist = playlists.find(p => p.id === playlistId);
  const playlist = featuredPlaylist || customPlaylist;

  if (!playlist) {
    return (
      <div className="py-20 text-center space-y-3">
        <h3 className="text-xl font-bold text-white">Playlist not found</h3>
        <button
          onClick={() => setCurrentView({ type: 'library' })}
          className="text-sm font-semibold text-brand-green hover:underline"
        >
          Return to Your Library
        </button>
      </div>
    );
  }

  const tracks = playlist.tracks || playlist.trackDetails || [];
  const totalSeconds = tracks.reduce((acc, t) => acc + (t.duration || 210), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

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

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
      setCurrentView({ type: 'library' });
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-brand-highlight/60 via-brand-elevated/40 to-transparent border border-white/5">
        <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-xl overflow-hidden bg-zinc-800 shadow-2xl shrink-0">
          <img
            src={playlist.cover}
            alt={playlist.name || playlist.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col text-center sm:text-left min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">
            {featuredPlaylist ? 'Featured Playlist' : 'Custom Playlist'}
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight py-1 truncate">
            {playlist.name || playlist.title}
          </h1>
          {playlist.description && (
            <p className="text-xs sm:text-sm text-brand-subtext max-w-xl line-clamp-2 mt-1">
              {playlist.description}
            </p>
          )}
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm text-zinc-300 mt-2">
            <span className="font-semibold text-white">VibeFree</span>
            <span>•</span>
            <span>{tracks.length} songs</span>
            {tracks.length > 0 && (
              <>
                <span>•</span>
                <span className="text-zinc-400">about {totalMinutes} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayAll}
            disabled={tracks.length === 0}
            className="w-14 h-14 rounded-full bg-brand-green hover:bg-brand-neon text-black flex items-center justify-center shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            title={isCurrentPlaying ? 'Pause' : 'Play playlist'}
          >
            {isCurrentPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black translate-x-0.5" />
            )}
          </button>

          {!featuredPlaylist && (
            <>
              <button
                onClick={() => onEditPlaylist(playlist)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Edit playlist name & description"
              >
                <Edit3 className="w-5 h-5" />
              </button>

              <button
                onClick={handleDelete}
                className="p-2 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors"
                title="Delete playlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setCurrentView({ type: 'search' })}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Find More Songs</span>
        </button>
      </div>

      {/* Tracks Table */}
      {tracks.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <Music className="w-16 h-16 mx-auto text-zinc-600 mb-2" />
          <h3 className="text-xl font-bold text-white">This playlist is empty</h3>
          <p className="text-xs text-brand-subtext max-w-sm mx-auto">
            Search for songs and click the 3-dots menu to add them to this playlist.
          </p>
          <button
            onClick={() => setCurrentView({ type: 'search' })}
            className="px-6 py-2.5 bg-brand-green text-black text-xs font-bold rounded-full hover:bg-brand-neon transition-all hover:scale-105 shadow-glow inline-block"
          >
            Search Music
          </button>
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

          {tracks.map((track, idx) => (
            <TrackRow
              key={`${track.id}-${idx}`}
              track={track}
              index={idx}
              playlist={tracks}
              playlistId={!featuredPlaylist ? playlist.id : null}
              onAddToPlaylistClick={onAddToPlaylistClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
