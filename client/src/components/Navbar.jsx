import React from 'react';
import { ChevronLeft, ChevronRight, Settings, Sparkles, Search as SearchIcon } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  canGoBack,
  goBack,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
  hasApiKey
}) {
  return (
    <header className="h-16 px-4 sm:px-8 bg-brand-black/60 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between border-b border-brand-border/40 select-none">
      {/* Left: Navigation history controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          title="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Search Input when on Search page or quick search */}
        {currentView.type === 'search' && (
          <div className="relative w-64 sm:w-80 md:w-96 ml-2">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to play?"
              className="w-full bg-brand-highlight/70 text-white text-sm rounded-full pl-10 pr-4 py-2 border border-white/10 focus:outline-none focus:border-white/30 focus:bg-brand-highlight transition-all placeholder:text-zinc-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-3">
        {/* YouTube API Status Pill */}
        <button
          onClick={onOpenSettings}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-colors"
          title="Configure YouTube Data API v3"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              hasApiKey ? 'bg-brand-green shadow-glow' : 'bg-amber-400'
            }`}
          />
          <span className="hidden sm:inline font-medium">
            {hasApiKey ? 'YouTube API Live' : 'Demo Mode'}
          </span>
          <Settings className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        {/* User avatar / profile badge */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-brand-green flex items-center justify-center text-xs font-bold text-black border border-white/20 shadow-md">
          VF
        </div>
      </div>
    </header>
  );
}
