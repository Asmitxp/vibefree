import React, { useState, useEffect } from 'react';
import { Search, Play, Pause, Loader2, Sparkles, Music } from 'lucide-react';
import TrackRow from '../components/TrackRow';
import { usePlayer } from '../context/PlayerContext';
import { searchTracks, getGenres } from '../services/api';

export default function SearchPage({
  searchQuery,
  setSearchQuery,
  setCurrentView,
  onAddToPlaylistClick
}) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const [genres, setGenres] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Load genres
  useEffect(() => {
    let isMounted = true;
    getGenres().then((res) => {
      if (isMounted) setGenres(res);
    });
    return () => { isMounted = false; };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchTracks(searchQuery);
        setSearchResults(res.tracks || []);
        setIsDemo(Boolean(res.isDemo));
      } catch (e) {
        console.warn('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const topResult = searchResults[0];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* If no query, display Browse Categories */}
      {!searchQuery.trim() ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Browse All Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {genres.map((g) => (
              <div
                key={g.id}
                onClick={() => setCurrentView({ type: 'genre', genre: g })}
                className={`h-40 rounded-xl bg-gradient-to-br ${g.color} p-4 relative overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer group`}
              >
                <span className="font-extrabold text-xl text-white block">
                  {g.name}
                </span>

                <div className="absolute -bottom-2 -right-3 w-24 h-24 bg-black/20 rounded-xl rotate-[25deg] shadow-lg flex items-center justify-center backdrop-blur-sm group-hover:rotate-[15deg] group-hover:scale-110 transition-transform">
                  <Music className="w-12 h-12 text-white/50" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Search Results View */
        <div className="space-y-8">
          {isSearching && (
            <div className="flex items-center space-x-2 text-brand-green py-2 text-sm font-semibold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching music...</span>
            </div>
          )}

          {isDemo && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
              <span>Showing results from curated music catalog. (Add YouTube API Key to search entire YouTube catalog)</span>
              <button
                onClick={() => setCurrentView({ type: 'settings' })}
                className="underline font-semibold ml-2"
              >
                Learn More
              </button>
            </div>
          )}

          {searchResults.length > 0 && !isSearching && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Result Card on Left */}
              {topResult && (
                <div className="lg:col-span-5 space-y-3">
                  <h3 className="text-xl font-bold text-white">Top Result</h3>
                  <div
                    onClick={() => {
                      if (currentTrack && currentTrack.id === topResult.id) {
                        togglePlay();
                      } else {
                        playTrack(topResult, searchResults);
                      }
                    }}
                    className="group p-5 rounded-2xl bg-brand-elevated/70 hover:bg-brand-highlight/90 transition-all duration-300 cursor-pointer border border-white/5 relative flex flex-col justify-between h-[230px]"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={topResult.thumbnail}
                        alt={topResult.title}
                        className="w-24 h-24 rounded-xl object-cover shadow-xl"
                      />
                      <div className="min-w-0">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-black bg-brand-green px-2 py-0.5 rounded-full inline-block mb-1.5 shadow-sm">
                          Song
                        </span>
                        <h4 className="text-lg font-bold text-white truncate group-hover:text-brand-green transition-colors">
                          {topResult.title}
                        </h4>
                        <p className="text-xs text-brand-subtext truncate mt-0.5">
                          {topResult.artist || topResult.channel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-zinc-400 font-mono">
                        {topResult.views}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentTrack && currentTrack.id === topResult.id) {
                            togglePlay();
                          } else {
                            playTrack(topResult, searchResults);
                          }
                        }}
                        className="w-12 h-12 rounded-full bg-brand-green text-black flex items-center justify-center shadow-glow hover:scale-105 active:scale-95 transition-transform"
                      >
                        {currentTrack && currentTrack.id === topResult.id && isPlaying ? (
                          <Pause className="w-5 h-5 fill-black" />
                        ) : (
                          <Play className="w-5 h-5 fill-black translate-x-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Matching Songs List on Right */}
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-xl font-bold text-white">Songs</h3>
                <div className="space-y-1">
                  {searchResults.slice(0, 5).map((track, idx) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={idx}
                      playlist={searchResults}
                      onAddToPlaylistClick={onAddToPlaylistClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* More search results */}
          {searchResults.length > 5 && !isSearching && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xl font-bold text-white">All Matching Tracks</h3>
              <div className="space-y-1">
                {searchResults.slice(5).map((track, idx) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={idx + 5}
                    playlist={searchResults}
                    onAddToPlaylistClick={onAddToPlaylistClick}
                  />
                ))}
              </div>
            </div>
          )}

          {!isSearching && searchResults.length === 0 && (
            <div className="text-center py-16 text-zinc-400 space-y-3">
              <Search className="w-12 h-12 mx-auto text-zinc-600 mb-2" />
              <h4 className="text-lg font-bold text-white">No results found for "{searchQuery}"</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Please make sure your words are spelled correctly or try searching for another artist or song.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
