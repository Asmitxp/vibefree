# 🎵 VibeFree - Modern Dark Music Streaming Experience

> A sleek, Spotify-inspired music discovery and streaming web application with embedded YouTube playback, built with React, Vite, Tailwind CSS, Lucide icons, and Node.js/Express.

![VibeFree Interface Preview](https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Features

### 1. 🎨 Spotify Dark Aesthetics & Interface
- **Modern Dark Palette**: Charcoal (`#121212`), deep pitch blacks (`#070707`), elevated surfaces (`#181818`), and vibrant neon-green accents (`#1db954`, `#1ed760`).
- **Sidebar Navigation**: Quick access to **Home**, **Search**, **Your Library**, and **Liked Songs**.
- **Dynamic Greetings**: Contextual greetings ("Good morning", "Good afternoon", "Good evening") with 6 quick-pick cards.
- **Micro-Animations & Hover Effects**: Floating play buttons, smooth zoom transitions on album art, interactive range sliders, and pulsing equalizer audio bars.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices (with dedicated mobile bottom navigation).

### 2. 📺 YouTube Music Playback & IFrame API
- **Official YouTube IFrame Player API**: Embedded playback complying strictly with YouTube Terms of Service (zero audio extraction, no stream ripping).
- **Synchronized Controls**:
  - Play, Pause, Previous track, Next track
  - Interactive, seekable progress bar with real-time second timestamps
  - Volume slider with mute/unmute toggle and local memory
  - Shuffle mode and 3-stage Repeat mode (Off &rarr; All &rarr; One)
  - Play Queue drawer (view upcoming tracks, clear queue, remove tracks)
- **Multi-View Modes**:
  - **Background Audio Engine**: Keep listening while browsing playlists and searching.
  - **Mini-Player Dock**: Picture-in-picture floating view in the bottom-right corner.
  - **Full Official Video Modal**: Watch music videos in high-definition with artist and channel info.
- **Graceful Error Handling**: Detects restricted or blocked embeds and provides instantaneous "Skip to Next Track" actions.

### 3. 🔍 Search & Music Discovery
- **Debounced Live Search**: Instant queries for songs, artists, albums, and channels.
- **Curated & Live Fallback**: Runs out of the box in **High-Fidelity Curated Demo Mode** with 60+ verified embeddable tracks across Pop, Hip-Hop, Bollywood, Lo-Fi, Chill, Workout, and Rock. Once a `YOUTUBE_API_KEY` is provided, switches automatically to real-time YouTube Data API v3 search!
- **Browse Categories**: Spotify-style colorful gradient category cards.
- **Genre & Mood Pages**: Pop, Bollywood, Hip-Hop, Lo-Fi Chill, Workout, Party Anthems, Rock & Classics, R&B/Soul.
- **Popular Artist Pages**: View artist monthly listeners, verified badges, and top tracks.

### 4. 📚 Playlists & Library Management
- **Liked Songs**: Instant heart toggle with saved state and calculated playlist run-time.
- **Custom Playlists**: Create, rename, delete playlists, and add/remove songs from any track card or 3-dots context menu.
- **Recently Played**: Automatically keeps track of your latest listening history.
- **Persistent Storage**: All user preferences, playlists, volume levels, and liked tracks are saved locally via `localStorage`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 / 19, Vite, Tailwind CSS, Lucide React |
| **Backend** | Node.js, Express, CORS, Dotenv |
| **APIs** | YouTube Data API v3, YouTube IFrame Player API |
| **Caching** | Server-side in-memory cache with 1-hour TTL to preserve API quota |
| **Storage** | Client-side `localStorage` for library, playlists, and playback preferences |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/vibefree.git
   cd vibefree
   ```

2. **Install all dependencies** (root, client, and server):
   ```bash
   npm run install:all
   ```
   *Or install individually:*
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Note: VibeFree runs immediately out-of-the-box even without an API key!)*

4. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   This will launch:
   - 🖥️ **Frontend (Vite)**: [http://localhost:5173](http://localhost:5173)
   - ⚙️ **Backend API (Express)**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 How to Obtain a Free YouTube Data API v3 Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `VibeFree Music`).
3. In the sidebar, navigate to **APIs & Services** &gt; **Library**.
4. Search for **YouTube Data API v3** and click **Enable**.
5. Navigate to **APIs & Services** &gt; **Credentials**.
6. Click **+ Create Credentials** &gt; **API Key**.
7. Copy your generated key and paste it into `.env`:
   ```env
   YOUTUBE_API_KEY=AIzaSyYourGeneratedApiKeyHere
   PORT=5000
   ```
8. Restart the server with `npm run dev`. VibeFree will automatically switch from Demo Mode to **Live YouTube API**.

---

## 🚢 Deployment

### Deploying to Vercel
1. Set the root directory to `client` or configure `vercel.json`.
2. Set build command to `npm run build` and output directory to `dist`.
3. If running the Express API as a serverless function, add an `/api` rewrite in `vercel.json` pointing to `server/server.js`.
4. Add `YOUTUBE_API_KEY` to your Vercel Environment Variables.

### Deploying to Render / Railway
1. Create a **Web Service** pointing to the repository.
2. Build Command:
   ```bash
   npm run build && cd server && npm install
   ```
3. Start Command:
   ```bash
   npm start
   ```

---

## 📜 YouTube API Policies & Compliance

VibeFree adheres strictly to Google and YouTube Developer policies:
- Plays content exclusively using the official **YouTube IFrame Player API**.
- Does **not** download, extract, rip, or rehost audio streams or video files.
- Displays official video thumbnail art, channel attributions, and titles.
- Provides accessible official video views and respects creator monetization and embed restrictions.

---

## 📄 License
MIT License. Built for music lovers and open-source innovation.
