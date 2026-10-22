import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, Music2, Radio, Sparkles } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export default function Sidebar({ currentView, setCurrentView, onCreatePlaylistOpen, onOpenSettings, hasApiKey }) {
  const { playlists, likedSongs } = useLibrary();

  return (
    <aside className="w-60 lg:w-64 bg-brand-black flex flex-col shrink-0 select-none border-r border-brand-border hidden md:flex h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)]">
      {/* Brand Header */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div
          onClick={() => setCurrentView({ type: 'home' })}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-green to-emerald-400 flex items-center justify-center shadow-glow group-hover:scale-105 transition-all">
            <Radio className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-brand-green transition-colors flex items-center gap-1">
              Vibe<span className="text-brand-green">Free</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className="px-3 py-2 space-y-1">
        <button
          onClick={() => setCurrentView({ type: 'home' })}
          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
            currentView.type === 'home'
              ? 'text-white bg-brand-elevated'
              : 'text-brand-subtext hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView.type === 'home' ? 'text-brand-green' : ''}`} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentView({ type: 'search' })}
          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
            currentView.type === 'search'
              ? 'text-white bg-brand-elevated'
              : 'text-brand-subtext hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className={`w-5 h-5 ${currentView.type === 'search' ? 'text-brand-green' : ''}`} />
          <span>Search</span>
        </button>

        <button
          onClick={() => setCurrentView({ type: 'library' })}
          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
            currentView.type === 'library'
              ? 'text-white bg-brand-elevated'
              : 'text-brand-subtext hover:text-white hover:bg-white/5'
          }`}
        >
          <Library className={`w-5 h-5 ${currentView.type === 'library' ? 'text-brand-green' : ''}`} />
          <span>Your Library</span>
        </button>
      </nav>

      <div className="px-6 py-2">
        <div className="h-px bg-white/10" />
      </div>

      {/* Library quick actions */}
      <div className="px-3 py-2 space-y-1">
        <button
          onClick={onCreatePlaylistOpen}
          className="w-full flex items-center space-x-4 px-4 py-2.5 rounded-lg text-sm font-semibold text-brand-subtext hover:text-white hover:bg-white/5 transition-all group"
        >
          <div className="w-6 h-6 rounded bg-zinc-700 group-hover:bg-zinc-600 flex items-center justify-center transition-colors">
            <PlusSquare className="w-4 h-4 text-white" />
          </div>
          <span>Create Playlist</span>
        </button>

        <button
          onClick={() => setCurrentView({ type: 'liked-songs' })}
          className={`w-full flex items-center space-x-4 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            currentView.type === 'liked-songs'
              ? 'text-white bg-brand-elevated'
              : 'text-brand-subtext hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-sm">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <div className="flex items-center justify-between flex-1">
            <span>Liked Songs</span>
            <span className="text-xs text-zinc-500 font-normal">
              {likedSongs.length}
            </span>
          </div>
        </button>
      </div>

      {/* Scrollable Playlists List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1">
          Custom Playlists
        </p>
        {playlists.map((pl) => {
          const isActive = currentView.type === 'playlist' && currentView.playlistId === pl.id;
          return (
            <button
              key={pl.id}
              onClick={() => setCurrentView({ type: 'playlist', playlistId: pl.id })}
              className={`w-full text-left px-3 py-2 rounded-md text-sm truncate block transition-colors ${
                isActive
                  ? 'text-brand-green font-semibold bg-white/5'
                  : 'text-brand-subtext hover:text-white'
              }`}
              title={pl.name}
            >
              {pl.name}
            </button>
          );
        })}
      </div>

      {/* API Status badge & Settings footer */}
      <div className="p-4 border-t border-brand-border bg-brand-black/60">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-400 hover:text-white transition-all border border-white/5"
        >
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? 'bg-brand-green shadow-glow' : 'bg-amber-400'
              }`}
            />
            <span className="font-medium truncate">
              {hasApiKey ? 'YouTube API Live' : 'Demo Mode'}
            </span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-brand-neon shrink-0" />
        </button>
      </div>
    </aside>
  );
}
