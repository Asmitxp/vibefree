// API client service for VibeFree
// Communicates with the Express backend proxy or provides graceful local fallback

const API_BASE = '/api';

export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.warn('API health check error:', err);
    return { status: 'offline', hasApiKey: false };
  }
}

export async function getTrendingTracks() {
  try {
    const res = await fetch(`${API_BASE}/trending`);
    if (!res.ok) throw new Error('Failed to fetch trending');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Error fetching trending, using client fallback:', err);
    return { tracks: [], isDemo: true };
  }
}

export async function searchTracks(query) {
  if (!query || !query.trim()) return { tracks: [] };
  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Search API error:', err);
    return { tracks: [], error: err.message };
  }
}

export async function getGenres() {
  try {
    const res = await fetch(`${API_BASE}/genres`);
    if (!res.ok) throw new Error('Failed to fetch genres');
    const data = await res.json();
    return data.genres || [];
  } catch (err) {
    console.warn('Genres API error:', err);
    return [];
  }
}

export async function getGenreTracks(genreId) {
  try {
    const res = await fetch(`${API_BASE}/genre/${genreId}`);
    if (!res.ok) throw new Error('Failed to fetch genre tracks');
    return await res.json();
  } catch (err) {
    console.warn('Genre tracks error:', err);
    return { tracks: [] };
  }
}

export async function getFeaturedPlaylists() {
  try {
    const res = await fetch(`${API_BASE}/playlists`);
    if (!res.ok) throw new Error('Failed to fetch playlists');
    const data = await res.json();
    return data.playlists || [];
  } catch (err) {
    console.warn('Playlists API error:', err);
    return [];
  }
}

export async function getPlaylistDetails(id) {
  try {
    const res = await fetch(`${API_BASE}/playlist/${id}`);
    if (!res.ok) throw new Error('Failed to fetch playlist details');
    return await res.json();
  } catch (err) {
    console.warn('Playlist details error:', err);
    return { playlist: null };
  }
}

export async function getPopularArtists() {
  try {
    const res = await fetch(`${API_BASE}/artists`);
    if (!res.ok) throw new Error('Failed to fetch artists');
    const data = await res.json();
    return data.artists || [];
  } catch (err) {
    console.warn('Artists API error:', err);
    return [];
  }
}

export async function getArtistTracks(artistId) {
  try {
    const res = await fetch(`${API_BASE}/artist/${artistId}`);
    if (!res.ok) throw new Error('Failed to fetch artist tracks');
    return await res.json();
  } catch (err) {
    console.warn('Artist tracks error:', err);
    return { tracks: [] };
  }
}
