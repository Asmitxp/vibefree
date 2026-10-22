import React, { useState, useEffect } from 'react';
import { Play, Pause, Heart, Sparkles, Flame, Radio, Disc3, Mic2, Compass } from 'lucide-react';
import TrackCard from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';
import { getTrendingTracks, getFeaturedPlaylists, getPopularArtists, getGenres } from '../services/api';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage({ setCurrentView, onAddToPlaylistClick }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const { likedSongs, recentlyPlayed } = useLibrary();

  const [trendingTracks, setTrendingTracks] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [trendingRes, playlistsRes, artistsRes, genresRes] = await Promise.all([
          getTrendingTracks(),
          getFeaturedPlaylists(),
          getPopularArtists(),
          getGenres()
        ]);
        if (isMounted) {
          setTrendingTracks(trendingRes.tracks || []);
          setFeaturedPlaylists(playlistsRes || []);
          setArtists(artistsRes || []);
          setGenres(genresRes || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('Error loading home data:', err);
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Quick picks: 6 items for top grid (Liked Songs + first few trending/recent)
  const quickPicks = [
    {
      id: 'liked-quick',
      title: 'Liked Songs',
      type: 'liked',
      count: likedSongs.length,
      image: null
    },
    ...trendingTracks.slice(0, 5).map(t => ({
      id: t.id,
      title: t.title,
      type: 'track',
      track: t,
      image: t.thumbnail
    }))
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Dynamic Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {getGreeting()}
        </h1>
      </div>

      {/* Top 6 Quick Picks Grid (Spotify style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickPicks.map((item) => {
          if (item.type === 'liked') {
            return (
              <div
                key={item.id}
                onClick={() => setCurrentView({ type: 'liked-songs' })}
                className="group flex items-center bg-white/5 hover:bg-white/10 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer shadow-md pr-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 flex items-center justify-center shrink-0 shadow-lg">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white" />
                </div>
                <div className="flex-1 px-4 min-w-0">
                  <p className="font-bold text-sm text-white truncate">Liked Songs</p>
                  <p className="text-xs text-brand-subtext">{item.count} songs</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-green text-black flex items-center justify-center shadow-glow opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shrink-0">
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                </div>
              </div>
            );
          }

          const isCurrent = currentTrack && currentTrack.id === item.track?.id;
          const isThisPlaying = isCurrent && isPlaying;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isCurrent) {
                  togglePlay();
                } else if (item.track) {
                  playTrack(item.track, trendingTracks);
                }
              }}
              className="group flex items-center bg-white/5 hover:bg-white/10 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer shadow-md pr-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover shrink-0"
              />
              <div className="flex-1 px-4 min-w-0">
                <p className={`font-bold text-sm truncate ${isCurrent ? 'text-brand-green' : 'text-white'}`}>
                  {item.title}
                </p>
                <p className="text-xs text-brand-subtext truncate">{item.track?.artist}</p>
              </div>
              <div className={`w-10 h-10 rounded-full bg-brand-green text-black flex items-center justify-center shadow-glow shrink-0 transition-all transform ${
                isThisPlaying ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'
              }`}>
                {isThisPlaying ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trending Now Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Flame className="w-5 h-5 text-brand-neon" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Trending Music
            </h2>
          </div>
          <button
            onClick={() => setCurrentView({ type: 'search' })}
            className="text-xs font-semibold text-brand-subtext hover:text-white uppercase tracking-wider transition-colors"
          >
            Show All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-brand-elevated/40 animate-pulse space-y-3">
                  <div className="aspect-square bg-zinc-800 rounded-lg" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </div>
              ))
            : trendingTracks.slice(0, 12).map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlist={trendingTracks}
                />
              ))}
        </div>
      </section>

      {/* Featured Curated Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Disc3 className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Featured Playlists
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featuredPlaylists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => setCurrentView({ type: 'featured-playlist', playlist: pl })}
              className="group p-4 rounded-xl bg-brand-elevated/70 hover:bg-brand-highlight/90 transition-all duration-300 cursor-pointer flex flex-col relative"
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-800 shadow-lg mb-3">
                <img
                  src={pl.cover}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pl.trackDetails && pl.trackDetails.length > 0) {
                      playTrack(pl.trackDetails[0], pl.trackDetails);
                    }
                  }}
                  className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-brand-green hover:bg-brand-neon text-black flex items-center justify-center shadow-glow opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
                  title="Play Playlist"
                >
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                </button>
              </div>

              <h4 className="font-semibold text-sm text-white truncate mb-1">
                {pl.title}
              </h4>
              <p className="text-xs text-brand-subtext line-clamp-2 leading-relaxed">
                {pl.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Artists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Mic2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Popular Artists
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => setCurrentView({ type: 'artist', artist })}
              className="group p-4 rounded-xl bg-brand-elevated/60 hover:bg-brand-highlight transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 shadow-xl">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h4 className="font-bold text-sm text-white truncate w-full group-hover:text-brand-green transition-colors">
                {artist.name}
              </h4>
              <p className="text-xs text-brand-subtext capitalize">{artist.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Moods & Genres Quick Access */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Explore Genres & Moods
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => setCurrentView({ type: 'genre', genre: g })}
              className={`h-24 rounded-xl bg-gradient-to-br ${g.color} p-4 text-left relative overflow-hidden shadow-lg transition-transform hover:scale-[1.03] active:scale-95 group`}
            >
              <span className="font-extrabold text-base text-white block">
                {g.name}
              </span>
              <span className="text-[11px] text-white/80 uppercase font-semibold tracking-wider mt-1 block">
                Explore &rarr;
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
