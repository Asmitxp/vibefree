import React, { useState, useEffect } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { LibraryProvider } from './context/LibraryContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import BottomPlayer from './components/BottomPlayer';
import YouTubePlayerEmbed from './components/YouTubePlayerEmbed';
import QueueDrawer from './components/QueueDrawer';
import PlaylistModal from './components/PlaylistModal';
import AddToPlaylistModal from './components/AddToPlaylistModal';
import SettingsModal from './components/SettingsModal';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import LikedSongsPage from './pages/LikedSongsPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import GenreDetailPage from './pages/GenreDetailPage';
import ArtistDetailPage from './pages/ArtistDetailPage';

import { checkApiHealth } from './services/api';
import { Home, Search, Library, Heart } from 'lucide-react';

function MainApp() {
  const [currentView, setCurrentViewInternal] = useState({ type: 'home' });
  const [historyStack, setHistoryStack] = useState([{ type: 'home' }]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState(null);
  const [trackToAddToPlaylist, setTrackToAddToPlaylist] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // API status
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    checkApiHealth().then((health) => {
      setHasApiKey(Boolean(health.hasApiKey));
    });
  }, []);

  const setCurrentView = (view) => {
    setHistoryStack((prev) => [...prev, view]);
    setCurrentViewInternal(view);
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const nextStack = [...historyStack];
      nextStack.pop();
      const prevView = nextStack[nextStack.length - 1];
      setHistoryStack(nextStack);
      setCurrentViewInternal(prevView);
    }
  };

  const openCreatePlaylist = () => {
    setPlaylistToEdit(null);
    setIsPlaylistModalOpen(true);
  };

  const openEditPlaylist = (playlist) => {
    setPlaylistToEdit(playlist);
    setIsPlaylistModalOpen(true);
  };

  const renderCurrentView = () => {
    switch (currentView.type) {
      case 'home':
        return (
          <HomePage
            setCurrentView={setCurrentView}
            onAddToPlaylistClick={(track) => setTrackToAddToPlaylist(track)}
          />
        );
      case 'search':
        return (
          <SearchPage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setCurrentView={setCurrentView}
            onAddToPlaylistClick={(track) => setTrackToAddToPlaylist(track)}
          />
        );
      case 'library':
        return (
          <LibraryPage
            setCurrentView={setCurrentView}
            onCreatePlaylistOpen={openCreatePlaylist}
          />
        );
      case 'liked-songs':
        return (
          <LikedSongsPage
            onAddToPlaylistClick={(track) => setTrackToAddToPlaylist(track)}
          />
        );
      case 'playlist':
        return (
          <PlaylistDetailPage
            playlistId={currentView.playlistId}
            onEditPlaylist={openEditPlaylist}
            setCurrentView={setCurrentView}
            onAddToPlaylistClick={(track) => setTrackToAddToPlaylist(track)}
          />
        );
      case 'featured-playlist':
        return (
          <PlaylistDetailPage
            featuredPlaylist={currentView.playlist}
            setCurrentView={setCurrentView}
            onAddToPlaylistClick={(track) => setTrackToAddToPlaylist(track)}
          />
        );
      case 'genre':
        return (
          <GenreDetailPage
            genre={currentView.genre}
            onAddToPlaylistClick={(track) => setTrackToAddToPlaylist(track)}
          />
        );
      case 'artist':
        return (
          <ArtistDetailPage
            artist={currentView.artist}
            onAddToPlaylistClick={(track) => setTrackToAddToPlaylist(track)}
          />
        );
      default:
        return <HomePage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-brand-black text-white">
      {/* Top Body (Sidebar + Scrollable Main Content) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onCreatePlaylistOpen={openCreatePlaylist}
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasApiKey={hasApiKey}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-b from-[#1a1a1a] via-brand-dark to-brand-black">
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            canGoBack={historyStack.length > 1}
            goBack={goBack}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenSettings={() => setIsSettingsOpen(true)}
            hasApiKey={hasApiKey}
          />

          {/* Scrollable Page Body */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-28 md:pb-32">
            {renderCurrentView()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-20 inset-x-0 h-14 bg-brand-elevated/95 backdrop-blur-lg border-t border-brand-border flex items-center justify-around z-20 px-2">
        <button
          onClick={() => setCurrentView({ type: 'home' })}
          className={`flex flex-col items-center justify-center p-1 ${
            currentView.type === 'home' ? 'text-brand-green' : 'text-brand-subtext'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Home</span>
        </button>

        <button
          onClick={() => setCurrentView({ type: 'search' })}
          className={`flex flex-col items-center justify-center p-1 ${
            currentView.type === 'search' ? 'text-brand-green' : 'text-brand-subtext'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Search</span>
        </button>

        <button
          onClick={() => setCurrentView({ type: 'library' })}
          className={`flex flex-col items-center justify-center p-1 ${
            currentView.type === 'library' ? 'text-brand-green' : 'text-brand-subtext'
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Library</span>
        </button>

        <button
          onClick={() => setCurrentView({ type: 'liked-songs' })}
          className={`flex flex-col items-center justify-center p-1 ${
            currentView.type === 'liked-songs' ? 'text-brand-green' : 'text-brand-subtext'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Liked</span>
        </button>
      </div>

      {/* Persistent Bottom Music Player */}
      <BottomPlayer
        onToggleQueue={() => setIsQueueOpen((prev) => !prev)}
        isQueueOpen={isQueueOpen}
      />

      {/* Official YouTube IFrame Player (Hidden audio engine + Docked mini-pip + Full video modal) */}
      <YouTubePlayerEmbed />

      {/* Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />

      {/* Create / Edit Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        playlistToEdit={playlistToEdit}
      />

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={Boolean(trackToAddToPlaylist)}
        onClose={() => setTrackToAddToPlaylist(null)}
        track={trackToAddToPlaylist}
        onOpenCreatePlaylist={openCreatePlaylist}
      />

      {/* Settings & API Info Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hasApiKey={hasApiKey}
      />
    </div>
  );
}

export default function App() {
  return (
    <LibraryProvider>
      <PlayerProvider>
        <MainApp />
      </PlayerProvider>
    </LibraryProvider>
  );
}
