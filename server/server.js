import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { CURATED_TRACKS, FEATURED_PLAYLISTS, GENRES, POPULAR_ARTISTS } from './curatedMusic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from current dir or parent root dir
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

app.use(cors());
app.use(express.json());

// In-memory cache to save YouTube Data API v3 quota
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data, ttlMs = CACHE_TTL_MS) {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

// Convert ISO 8601 duration (PT4M13S) to seconds and mm:ss format
function parseISO8601Duration(isoDuration) {
  if (!isoDuration) return { seconds: 0, formatted: '0:00' };
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  if (!matches) return { seconds: 0, formatted: '0:00' };

  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return { seconds: totalSeconds, formatted };
}

// Format view counts (1240000 -> 1.2M views)
function formatViews(viewCount) {
  if (!viewCount) return '';
  const num = parseInt(viewCount, 10);
  if (isNaN(num)) return '';
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B views`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M views`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K views`;
  return `${num} views`;
}

// Sanitize YouTube titles (remove (Official Music Video), [HD], etc. for cleaner display)
function cleanTitle(title) {
  if (!title) return '';
  return title
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s*\(?(?:Official\s*(?:Music\s*)?Video|Audio|Lyric\s*Video|Visualizer|HD|4K|HQ)\)?/gi, '')
    .trim();
}

/**
 * Fetch video details (duration, views, high-res thumbnail) using YouTube Videos endpoint
 */
async function fetchVideoDetails(videoIds) {
  if (!YOUTUBE_API_KEY || videoIds.length === 0) return {};

  const cacheKey = `video_details_${videoIds.join(',')}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`YouTube video details request failed with status: ${res.status}`);
      return {};
    }
    const data = await res.json();
    const detailsMap = {};

    (data.items || []).forEach(item => {
      const { seconds, formatted } = parseISO8601Duration(item.contentDetails?.duration);
      detailsMap[item.id] = {
        duration: seconds,
        durationFormatted: formatted,
        views: formatViews(item.statistics?.viewCount),
        thumbnail:
          item.snippet?.thumbnails?.maxres?.url ||
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url
      };
    });

    setCache(cacheKey, detailsMap, CACHE_TTL_MS);
    return detailsMap;
  } catch (err) {
    console.error('Error fetching video details from YouTube:', err.message);
    return {};
  }
}

/**
 * Perform YouTube Data API v3 search
 */
async function searchYouTube(query, maxResults = 20) {
  const cacheKey = `search_${query}_${maxResults}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (!YOUTUBE_API_KEY) {
    throw new Error('NO_API_KEY');
  }

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
  const searchRes = await fetch(searchUrl);

  if (!searchRes.ok) {
    const errBody = await searchRes.text();
    console.error('YouTube search error:', searchRes.status, errBody);
    if (searchRes.status === 403) {
      throw new Error('QUOTA_EXCEEDED');
    }
    throw new Error(`YouTube API returned status ${searchRes.status}`);
  }

  const searchData = await searchRes.json();
  const videoIds = (searchData.items || [])
    .map(item => item.id?.videoId)
    .filter(Boolean);

  const detailsMap = await fetchVideoDetails(videoIds);

  const tracks = (searchData.items || []).map(item => {
    const vid = item.id.videoId;
    const details = detailsMap[vid] || {};
    return {
      id: vid,
      title: cleanTitle(item.snippet.title),
      rawTitle: item.snippet.title,
      artist: item.snippet.channelTitle,
      channel: item.snippet.channelTitle,
      thumbnail: details.thumbnail || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      duration: details.duration || 210,
      durationFormatted: details.durationFormatted || '3:30',
      views: details.views || 'Popular',
      publishedAt: item.snippet.publishedAt
    };
  });

  setCache(cacheKey, tracks, CACHE_TTL_MS);
  return tracks;
}

/**
 * Perform YouTube Data API v3 trending/mostPopular
 */
async function getTrendingYouTube(maxResults = 25) {
  const cacheKey = `trending_${maxResults}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (!YOUTUBE_API_KEY) {
    throw new Error('NO_API_KEY');
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&videoCategoryId=10&regionCode=US&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    const errBody = await res.text();
    console.error('YouTube trending error:', res.status, errBody);
    if (res.status === 403) {
      throw new Error('QUOTA_EXCEEDED');
    }
    throw new Error(`YouTube API returned status ${res.status}`);
  }

  const data = await res.json();
  const tracks = (data.items || []).map(item => {
    const { seconds, formatted } = parseISO8601Duration(item.contentDetails?.duration);
    return {
      id: item.id,
      title: cleanTitle(item.snippet.title),
      rawTitle: item.snippet.title,
      artist: item.snippet.channelTitle,
      channel: item.snippet.channelTitle,
      thumbnail:
        item.snippet.thumbnails?.maxres?.url ||
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url,
      duration: seconds || 210,
      durationFormatted: formatted || '3:30',
      views: formatViews(item.statistics?.viewCount),
      publishedAt: item.snippet.publishedAt
    };
  });

  setCache(cacheKey, tracks, CACHE_TTL_MS);
  return tracks;
}

// Fallback search over curated tracks
function fallbackSearch(query) {
  const q = query.toLowerCase().trim();
  if (!q) return CURATED_TRACKS;

  return CURATED_TRACKS.filter(track =>
    track.title.toLowerCase().includes(q) ||
    track.artist.toLowerCase().includes(q) ||
    (track.album && track.album.toLowerCase().includes(q)) ||
    (track.genre && track.genre.toLowerCase().includes(q))
  );
}

// ======================= API ROUTES ======================= //

// Health & Config check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VibeFree Music API',
    hasApiKey: Boolean(YOUTUBE_API_KEY),
    cachedEntries: cache.size,
    timestamp: new Date().toISOString()
  });
});

// Trending / Top Tracks
app.get('/api/trending', async (req, res) => {
  try {
    if (YOUTUBE_API_KEY) {
      try {
        const tracks = await getTrendingYouTube(25);
        return res.json({ source: 'youtube', isDemo: false, tracks });
      } catch (ytErr) {
        console.warn('YouTube Trending API error, falling back to curated:', ytErr.message);
      }
    }
    // Return curated trending tracks
    res.json({
      source: 'curated',
      isDemo: !YOUTUBE_API_KEY,
      demoReason: YOUTUBE_API_KEY ? 'YouTube quota limit reached or error' : 'No YOUTUBE_API_KEY provided in .env',
      tracks: CURATED_TRACKS
    });
  } catch (err) {
    res.status(500).json({ error: err.message, tracks: CURATED_TRACKS });
  }
});

// Search
app.get('/api/search', async (req, res) => {
  const query = req.query.q || '';
  const maxResults = parseInt(req.query.maxResults || '20', 10);

  if (!query.trim()) {
    return res.json({ source: 'curated', isDemo: !YOUTUBE_API_KEY, tracks: CURATED_TRACKS.slice(0, 10) });
  }

  if (YOUTUBE_API_KEY) {
    try {
      const tracks = await searchYouTube(query, maxResults);
      return res.json({
        source: 'youtube',
        isDemo: false,
        query,
        tracks
      });
    } catch (err) {
      console.warn(`Search error (${err.message}), using fallback search for "${query}"`);
    }
  }

  // Fallback search
  const results = fallbackSearch(query);
  res.json({
    source: 'curated',
    isDemo: !YOUTUBE_API_KEY,
    demoReason: YOUTUBE_API_KEY ? 'YouTube quota limit reached' : 'No YOUTUBE_API_KEY provided in .env',
    query,
    tracks: results
  });
});

// Available Genres & Moods
app.get('/api/genres', (req, res) => {
  res.json({
    genres: GENRES.map(g => ({
      ...g,
      trackCount: CURATED_TRACKS.filter(t => t.genre === g.id).length || 10
    }))
  });
});

// Specific Genre / Mood Tracks
app.get('/api/genre/:genreId', async (req, res) => {
  const { genreId } = req.params;
  const genre = GENRES.find(g => g.id.toLowerCase() === genreId.toLowerCase());

  if (!genre) {
    return res.status(404).json({ error: 'Genre not found' });
  }

  if (YOUTUBE_API_KEY) {
    try {
      const tracks = await searchYouTube(genre.query, 20);
      return res.json({
        genre,
        source: 'youtube',
        isDemo: false,
        tracks
      });
    } catch (err) {
      console.warn(`Genre search fallback for ${genreId}: ${err.message}`);
    }
  }

  const genreTracks = CURATED_TRACKS.filter(t => t.genre === genre.id);
  const fallbackList = genreTracks.length > 0 ? genreTracks : CURATED_TRACKS.slice(0, 8);

  res.json({
    genre,
    source: 'curated',
    isDemo: !YOUTUBE_API_KEY,
    tracks: fallbackList
  });
});

// Featured Playlists
app.get('/api/playlists', (req, res) => {
  const playlistsWithTracks = FEATURED_PLAYLISTS.map(pl => {
    const tracks = pl.tracks.map(tid => CURATED_TRACKS.find(t => t.id === tid)).filter(Boolean);
    return {
      ...pl,
      trackCount: tracks.length,
      trackDetails: tracks
    };
  });
  res.json({ playlists: playlistsWithTracks });
});

// Single Playlist Details
app.get('/api/playlist/:playlistId', async (req, res) => {
  const { playlistId } = req.params;
  const pl = FEATURED_PLAYLISTS.find(p => p.id === playlistId);

  if (!pl) {
    return res.status(404).json({ error: 'Playlist not found' });
  }

  const tracks = pl.tracks.map(tid => CURATED_TRACKS.find(t => t.id === tid)).filter(Boolean);
  res.json({
    playlist: {
      ...pl,
      trackCount: tracks.length,
      tracks
    }
  });
});

// Popular Artists
app.get('/api/artists', (req, res) => {
  res.json({ artists: POPULAR_ARTISTS });
});

// Artist top songs
app.get('/api/artist/:artistId', async (req, res) => {
  const { artistId } = req.params;
  const artist = POPULAR_ARTISTS.find(a => a.id === artistId);

  if (!artist) {
    return res.status(404).json({ error: 'Artist not found' });
  }

  if (YOUTUBE_API_KEY) {
    try {
      const tracks = await searchYouTube(artist.query, 15);
      return res.json({
        artist,
        source: 'youtube',
        isDemo: false,
        tracks
      });
    } catch (err) {
      console.warn(`Artist search fallback for ${artist.name}: ${err.message}`);
    }
  }

  const tracks = CURATED_TRACKS.filter(t => t.artist.toLowerCase().includes(artist.name.toLowerCase()));
  res.json({
    artist,
    source: 'curated',
    isDemo: !YOUTUBE_API_KEY,
    tracks: tracks.length > 0 ? tracks : CURATED_TRACKS.slice(0, 6)
  });
});

app.listen(PORT, () => {
  console.log(`🎵 VibeFree API Server running on http://localhost:${PORT}`);
  console.log(`🔑 YouTube API Key Status: ${YOUTUBE_API_KEY ? 'Configured ✅' : 'Not configured (Running in curated demo fallback mode) ℹ️'}`);
});
