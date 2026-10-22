import React, { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext();

const STORAGE_KEYS = {
  LIKED: 'vibefree_liked_songs',
  PLAYLISTS: 'vibefree_playlists',
  RECENT: 'vibefree_recently_played'
};

const DEFAULT_PLAYLISTS = [
  {
    id: 'pl-favorites-default',
    name: 'My Best Vibes',
    description: 'A handpicked personal collection of top tracks.',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    tracks: [
      {
        id: '4NRXx6U8ABQ',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        channel: 'TheWeekndVEVO',
        thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
        duration: 260,
        durationFormatted: '4:20'
      },
      {
        id: 'OPf0YbXqDm0',
        title: 'Uptown Funk ft. Bruno Mars',
        artist: 'Mark Ronson',
        channel: 'MarkRonsonVEVO',
        thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
        duration: 270,
        durationFormatted: '4:30'
      }
    ]
  }
];

export function LibraryProvider({ children }) {
  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      return saved ? JSON.parse(saved) : DEFAULT_PLAYLISTS;
    } catch {
      return DEFAULT_PLAYLISTS;
    }
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist liked songs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(likedSongs));
    } catch (e) {
      console.error('Failed to save liked songs:', e);
    }
  }, [likedSongs]);

  // Persist playlists
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (e) {
      console.error('Failed to save playlists:', e);
    }
  }, [playlists]);

  // Persist recently played
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentlyPlayed));
    } catch (e) {
      console.error('Failed to save recently played:', e);
    }
  }, [recentlyPlayed]);

  const toggleLike = (track) => {
    if (!track || !track.id) return;
    setLikedSongs(prev => {
      const exists = prev.some(t => t.id === track.id);
      if (exists) {
        return prev.filter(t => t.id !== track.id);
      } else {
        return [
          {
            id: track.id,
            title: track.title,
            artist: track.artist,
            thumbnail: track.thumbnail,
            duration: track.duration,
            durationFormatted: track.durationFormatted,
            channel: track.channel,
            likedAt: new Date().toISOString()
          },
          ...prev
        ];
      }
    });
  };

  const isLiked = (trackId) => {
    if (!trackId) return false;
    return likedSongs.some(t => t.id === trackId);
  };

  const createPlaylist = (name, description = '', cover = '') => {
    const newPlaylist = {
      id: `pl-${Date.now()}`,
      name: name.trim() || 'My Playlist',
      description: description.trim() || 'Custom playlist created on VibeFree',
      cover: cover || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      tracks: []
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  const renamePlaylist = (id, newName, newDescription) => {
    setPlaylists(prev =>
      prev.map(pl => {
        if (pl.id === id) {
          return {
            ...pl,
            name: newName !== undefined ? newName.trim() : pl.name,
            description: newDescription !== undefined ? newDescription.trim() : pl.description
          };
        }
        return pl;
      })
    );
  };

  const deletePlaylist = (id) => {
    setPlaylists(prev => prev.filter(pl => pl.id !== id));
  };

  const addTrackToPlaylist = (playlistId, track) => {
    if (!track || !track.id) return false;
    let added = false;
    setPlaylists(prev =>
      prev.map(pl => {
        if (pl.id === playlistId) {
          const exists = pl.tracks.some(t => t.id === track.id);
          if (!exists) {
            added = true;
            return {
              ...pl,
              tracks: [...pl.tracks, { ...track, addedAt: new Date().toISOString() }]
            };
          }
        }
        return pl;
      })
    );
    return added;
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists(prev =>
      prev.map(pl => {
        if (pl.id === playlistId) {
          return {
            ...pl,
            tracks: pl.tracks.filter(t => t.id !== trackId)
          };
        }
        return pl;
      })
    );
  };

  const addRecentlyPlayed = (track) => {
    if (!track || !track.id) return;
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 30);
    });
  };

  return (
    <LibraryContext.Provider
      value={{
        likedSongs,
        playlists,
        recentlyPlayed,
        toggleLike,
        isLiked,
        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        addRecentlyPlayed
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
