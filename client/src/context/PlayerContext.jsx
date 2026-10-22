import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLibrary } from './LibraryContext';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const { addRecentlyPlayed } = useLibrary();

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('vibefree_volume');
    return saved !== null ? parseInt(saved, 10) : 80;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);

  // Queue & Navigation
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  // Video view modes
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isVideoDocked, setIsVideoDocked] = useState(false);

  // Reference to the YouTube player instance
  const ytPlayerRef = useRef(null);
  const isApiReadyRef = useRef(false);
  const progressTimerRef = useRef(null);
  const isSeekingRef = useRef(false);

  // Initialize YouTube IFrame API
  useEffect(() => {
    // If window.YT already exists
    if (window.YT && window.YT.Player) {
      isApiReadyRef.current = true;
      return;
    }

    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevOnReady) prevOnReady();
      isApiReadyRef.current = true;
    };

    // Check if script tag is already in DOM
    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Sync volume with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vibefree_volume', volume.toString());
    } catch (e) {
      console.error(e);
    }
  }, [volume]);

  // Handle auto-progress polling
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function' && !isSeekingRef.current) {
          try {
            const cur = ytPlayerRef.current.getCurrentTime() || 0;
            const dur = ytPlayerRef.current.getDuration() || 0;
            setCurrentTime(cur);
            if (dur > 0 && Math.abs(dur - duration) > 1) {
              setDuration(dur);
            }
          } catch (e) {
            // Player might not be ready or active
          }
        }
      }, 300);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, duration]);

  // Core player state callback called from YouTubePlayerEmbed component
  const onPlayerReady = useCallback((player) => {
    ytPlayerRef.current = player;
    try {
      player.setVolume(isMuted ? 0 : volume);
    } catch (e) {
      console.warn('Could not set initial volume', e);
    }
  }, [isMuted, volume]);

  const onPlayerStateChange = useCallback((event) => {
    const state = event.data;
    // YT.PlayerState: -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering, 5=video cued
    if (state === 1) {
      setIsPlaying(true);
      setIsBuffering(false);
      setPlaybackError(null);
      if (ytPlayerRef.current) {
        const dur = ytPlayerRef.current.getDuration();
        if (dur) setDuration(dur);
      }
    } else if (state === 2) {
      setIsPlaying(false);
      setIsBuffering(false);
    } else if (state === 3) {
      setIsBuffering(true);
    } else if (state === 0) {
      // Track Ended
      setIsPlaying(false);
      setIsBuffering(false);
      handleTrackEnd();
    }
  }, [repeatMode, queue, queueIndex, isShuffle]);

  const onPlayerError = useCallback((event) => {
    const code = event.data;
    console.warn('YouTube Player Error code:', code);
    let msg = 'Playback error occurred.';
    if (code === 101 || code === 150) {
      msg = 'Playback restricted by video owner for third-party embeds.';
    } else if (code === 100) {
      msg = 'Video not found or has been removed.';
    } else if (code === 2) {
      msg = 'Invalid video ID parameter.';
    }

    setPlaybackError(msg);
    setIsBuffering(false);
    setIsPlaying(false);
  }, []);

  // Track end logic
  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.seekTo(0, true);
        ytPlayerRef.current.playVideo();
      }
      return;
    }

    playNext();
  };

  // Play a specific track
  const playTrack = (track, newQueue = null) => {
    if (!track) return;
    setPlaybackError(null);
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.duration || 0);
    setIsBuffering(true);

    addRecentlyPlayed(track);

    if (newQueue && Array.isArray(newQueue) && newQueue.length > 0) {
      setQueue(newQueue);
      const foundIdx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(foundIdx !== -1 ? foundIdx : 0);
    } else {
      // If no new queue provided, ensure current track is in queue
      setQueue(prev => {
        const existingIdx = prev.findIndex(t => t.id === track.id);
        if (existingIdx !== -1) {
          setQueueIndex(existingIdx);
          return prev;
        } else {
          setQueueIndex(0);
          return [track, ...prev];
        }
      });
    }

    // Command the YouTube player
    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        ytPlayerRef.current.loadVideoById(track.id);
      } catch (e) {
        console.error('Error loading video:', e);
      }
    }
  };

  const togglePlay = () => {
    if (!currentTrack) {
      if (queue.length > 0) {
        playTrack(queue[0]);
      }
      return;
    }

    if (!ytPlayerRef.current) return;

    try {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      console.warn('Toggle play error:', e);
    }
  };

  const pauseTrack = () => {
    if (ytPlayerRef.current && isPlaying) {
      try {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const resumeTrack = () => {
    if (ytPlayerRef.current && !isPlaying) {
      try {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const seekTo = (seconds) => {
    setCurrentTime(seconds);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      try {
        ytPlayerRef.current.seekTo(seconds, true);
      } catch (e) {
        console.warn('Seek error:', e);
      }
    }
  };

  const setVolume = (val) => {
    const num = Math.max(0, Math.min(100, val));
    setVolumeState(num);
    if (num > 0 && isMuted) {
      setIsMuted(false);
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      try {
        ytPlayerRef.current.setVolume(num);
        if (ytPlayerRef.current.isMuted && ytPlayerRef.current.isMuted() && num > 0) {
          ytPlayerRef.current.unMute();
        }
      } catch (e) {
        console.warn('Set volume error:', e);
      }
    }
  };

  const toggleMute = () => {
    if (!ytPlayerRef.current) return;
    try {
      if (isMuted) {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(volume > 0 ? volume : 50);
        setIsMuted(false);
      } else {
        ytPlayerRef.current.mute();
        setIsMuted(true);
      }
    } catch (e) {
      console.warn('Toggle mute error:', e);
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;

    let nextIdx = -1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
      // Try to pick different track if queue > 1
      if (nextIdx === queueIndex && queue.length > 1) {
        nextIdx = (nextIdx + 1) % queue.length;
      }
    } else {
      if (queueIndex < queue.length - 1) {
        nextIdx = queueIndex + 1;
      } else if (repeatMode === 'all') {
        nextIdx = 0;
      }
    }

    if (nextIdx !== -1 && queue[nextIdx]) {
      setQueueIndex(nextIdx);
      playTrack(queue[nextIdx], queue);
    }
  };

  const playPrevious = () => {
    // If track has been playing for more than 3 seconds, restart it
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    if (queue.length === 0) return;

    let prevIdx = -1;
    if (queueIndex > 0) {
      prevIdx = queueIndex - 1;
    } else if (repeatMode === 'all') {
      prevIdx = queue.length - 1;
    }

    if (prevIdx !== -1 && queue[prevIdx]) {
      setQueueIndex(prevIdx);
      playTrack(queue[prevIdx], queue);
    } else {
      seekTo(0);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const addToQueue = (track) => {
    if (!track) return;
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (index) => {
    setQueue(prev => prev.filter((_, idx) => idx !== index));
    if (index === queueIndex) {
      playNext();
    } else if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(-1);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isBuffering,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackError,
        queue,
        queueIndex,
        isShuffle,
        repeatMode,
        showVideoModal,
        isVideoDocked,
        ytPlayerRef,
        isSeekingRef,
        onPlayerReady,
        onPlayerStateChange,
        onPlayerError,
        playTrack,
        togglePlay,
        pauseTrack,
        resumeTrack,
        seekTo,
        setVolume,
        toggleMute,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setShowVideoModal,
        setIsVideoDocked,
        toggleVideoModal: () => setShowVideoModal(prev => !prev),
        toggleVideoDock: () => setIsVideoDocked(prev => !prev)
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
