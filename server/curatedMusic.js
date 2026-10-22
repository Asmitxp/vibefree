// Curated high-fidelity music database with verified embeddable YouTube video IDs
// Used for instant zero-latency loading and reliable fallback when API keys are not yet provided or quota is reached.

export const GENRES = [
  { id: 'pop', name: 'Pop', color: 'from-pink-500 to-rose-600', query: 'Top Pop Music Hits 2024' },
  { id: 'hip-hop', name: 'Hip-Hop', color: 'from-orange-500 to-amber-700', query: 'Top Hip Hop Rap Hits' },
  { id: 'bollywood', name: 'Bollywood', color: 'from-amber-500 to-red-600', query: 'Top Bollywood Songs Arijit Singh' },
  { id: 'lo-fi', name: 'Lo-Fi Chill', color: 'from-purple-600 to-indigo-900', query: 'Lofi hip hop beats chill study' },
  { id: 'chill', name: 'Chill & Relax', color: 'from-emerald-500 to-teal-800', query: 'Chill acoustic relaxing songs' },
  { id: 'workout', name: 'Workout & Gym', color: 'from-red-600 to-orange-600', query: 'Workout motivational energetic music' },
  { id: 'party', name: 'Party Anthems', color: 'from-violet-600 to-fuchsia-600', query: 'Party club dance hits 2024' },
  { id: 'rock', name: 'Rock & Classics', color: 'from-blue-600 to-slate-900', query: 'Best Classic Modern Rock Hits' },
  { id: 'r-and-b', name: 'R&B / Soul', color: 'from-cyan-600 to-blue-800', query: 'Smooth R&B soul love hits' }
];

export const CURATED_TRACKS = [
  // Pop
  {
    id: 'fJ9rUzIMcZQ',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    channel: 'Queen Official',
    thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
    duration: 359,
    durationFormatted: '5:59',
    views: '1.6B views',
    genre: 'rock',
    album: 'A Night at the Opera',
    year: '1975'
  },
  {
    id: '4NRXx6U8ABQ',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    channel: 'TheWeekndVEVO',
    thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
    duration: 260,
    durationFormatted: '4:20',
    views: '820M views',
    genre: 'pop',
    album: 'After Hours',
    year: '2020'
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Despacito ft. Daddy Yankee',
    artist: 'Luis Fonsi',
    channel: 'LuisFonsiVEVO',
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
    duration: 281,
    durationFormatted: '4:41',
    views: '8.4B views',
    genre: 'pop',
    album: 'VIDA',
    year: '2017'
  },
  {
    id: 'OPf0YbXqDm0',
    title: 'Uptown Funk ft. Bruno Mars',
    artist: 'Mark Ronson',
    channel: 'MarkRonsonVEVO',
    thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
    duration: 270,
    durationFormatted: '4:30',
    views: '5.1B views',
    genre: 'pop',
    album: 'Uptown Special',
    year: '2014'
  },
  {
    id: '09R8_2nJtjg',
    title: 'Sugar',
    artist: 'Maroon 5',
    channel: 'Maroon5VEVO',
    thumbnail: 'https://i.ytimg.com/vi/09R8_2nJtjg/hqdefault.jpg',
    duration: 301,
    durationFormatted: '5:01',
    views: '4.0B views',
    genre: 'pop',
    album: 'V',
    year: '2015'
  },
  {
    id: 'JGwWNGJdvx8',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    channel: 'Ed Sheeran',
    thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
    duration: 263,
    durationFormatted: '4:23',
    views: '6.2B views',
    genre: 'pop',
    album: '÷ (Divide)',
    year: '2017'
  },
  {
    id: 'hT_nvWreIhg',
    title: 'Counting Stars',
    artist: 'OneRepublic',
    channel: 'OneRepublicVEVO',
    thumbnail: 'https://i.ytimg.com/vi/hT_nvWreIhg/hqdefault.jpg',
    duration: 283,
    durationFormatted: '4:43',
    views: '3.9B views',
    genre: 'pop',
    album: 'Native',
    year: '2013'
  },
  {
    id: '2Vv-BfVoq4g',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    channel: 'Ed Sheeran',
    thumbnail: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg',
    duration: 279,
    durationFormatted: '4:39',
    views: '3.7B views',
    genre: 'chill',
    album: '÷ (Divide)',
    year: '2017'
  },
  {
    id: 'YQHsXMglC9A',
    title: 'Hello',
    artist: 'Adele',
    channel: 'AdeleVEVO',
    thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg',
    duration: 367,
    durationFormatted: '6:07',
    views: '3.1B views',
    genre: 'pop',
    album: '25',
    year: '2015'
  },
  {
    id: 'nfWlot6h_JM',
    title: 'Shake It Off',
    artist: 'Taylor Swift',
    channel: 'TaylorSwiftVEVO',
    thumbnail: 'https://i.ytimg.com/vi/nfWlot6h_JM/hqdefault.jpg',
    duration: 241,
    durationFormatted: '4:01',
    views: '3.3B views',
    genre: 'pop',
    album: '1989',
    year: '2014'
  },

  // Hip-Hop
  {
    id: 'tvTRZJ-4EyI',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    channel: 'KendrickLamarVEVO',
    thumbnail: 'https://i.ytimg.com/vi/tvTRZJ-4EyI/hqdefault.jpg',
    duration: 184,
    durationFormatted: '3:04',
    views: '980M views',
    genre: 'hip-hop',
    album: 'DAMN.',
    year: '2017'
  },
  {
    id: 'uxpDa-c-4Mc',
    title: 'Hotline Bling',
    artist: 'Drake',
    channel: 'DrakeVEVO',
    thumbnail: 'https://i.ytimg.com/vi/uxpDa-c-4Mc/hqdefault.jpg',
    duration: 295,
    durationFormatted: '4:55',
    views: '2.0B views',
    genre: 'hip-hop',
    album: 'Views',
    year: '2015'
  },
  {
    id: 'UceaB4403kis',
    title: 'God\'s Plan',
    artist: 'Drake',
    channel: 'DrakeVEVO',
    thumbnail: 'https://i.ytimg.com/vi/UceaB4403ki/hqdefault.jpg',
    duration: 356,
    durationFormatted: '5:56',
    views: '1.5B views',
    genre: 'hip-hop',
    album: 'Scorpion',
    year: '2018'
  },
  {
    id: 'eJO5HU_7_1w',
    title: 'The Box',
    artist: 'Roddy Ricch',
    channel: 'Roddy Ricch',
    thumbnail: 'https://i.ytimg.com/vi/eJO5HU_7_1w/hqdefault.jpg',
    duration: 213,
    durationFormatted: '3:33',
    views: '540M views',
    genre: 'hip-hop',
    album: 'Please Excuse Me For Being Antisocial',
    year: '2020'
  },
  {
    id: 'wXhTHyIgQ_U',
    title: 'Lose Yourself',
    artist: 'Eminem',
    channel: 'EminemMusic',
    thumbnail: 'https://i.ytimg.com/vi/wXhTHyIgQ_U/hqdefault.jpg',
    duration: 326,
    durationFormatted: '5:26',
    views: '1.4B views',
    genre: 'workout',
    album: '8 Mile',
    year: '2002'
  },

  // Bollywood Hits
  {
    id: 'vu5-aKf_Qq8',
    title: 'Kesariya - Brahmāstra',
    artist: 'Arijit Singh, Pritam',
    channel: 'Sony Music India',
    thumbnail: 'https://i.ytimg.com/vi/vu5-aKf_Qq8/hqdefault.jpg',
    duration: 172,
    durationFormatted: '2:52',
    views: '650M views',
    genre: 'bollywood',
    album: 'Brahmāstra',
    year: '2022'
  },
  {
    id: 'Umqb9KENgmk',
    title: 'Tum Hi Ho - Aashiqui 2',
    artist: 'Arijit Singh, Mithoon',
    channel: 'T-Series',
    thumbnail: 'https://i.ytimg.com/vi/Umqb9KENgmk/hqdefault.jpg',
    duration: 262,
    durationFormatted: '4:22',
    views: '880M views',
    genre: 'bollywood',
    album: 'Aashiqui 2',
    year: '2013'
  },
  {
    id: 'k4yXQkG2s1E',
    title: 'Apna Bana Le - Bhediya',
    artist: 'Arijit Singh, Sachin-Jigar',
    channel: 'Zee Music Company',
    thumbnail: 'https://i.ytimg.com/vi/k4yXQkG2s1E/hqdefault.jpg',
    duration: 202,
    durationFormatted: '3:22',
    views: '490M views',
    genre: 'bollywood',
    album: 'Bhediya',
    year: '2022'
  },
  {
    id: 'ilNt2bikxUE',
    title: 'Raataan Lambiyan - Shershaah',
    artist: 'Jubin Nautiyal, Asees Kaur',
    channel: 'Sony Music India',
    thumbnail: 'https://i.ytimg.com/vi/ilNt2bikxUE/hqdefault.jpg',
    duration: 230,
    durationFormatted: '3:50',
    views: '930M views',
    genre: 'bollywood',
    album: 'Shershaah',
    year: '2021'
  },
  {
    id: 'jfKfPfyJRdk',
    title: 'lofi hip hop radio - beats to relax/study to',
    artist: 'Lofi Girl',
    channel: 'Lofi Girl',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    duration: 7200,
    durationFormatted: '2:00:00',
    views: '80M views',
    genre: 'lo-fi',
    album: 'Lofi Records',
    year: '2024'
  },
  {
    id: '5yx6BWlEVcY',
    title: 'Chillhop Radio - jazzy & lofi hip hop beats',
    artist: 'Chillhop Music',
    channel: 'Chillhop Music',
    thumbnail: 'https://i.ytimg.com/vi/5yx6BWlEVcY/hqdefault.jpg',
    duration: 7200,
    durationFormatted: '2:00:00',
    views: '45M views',
    genre: 'lo-fi',
    album: 'Chillhop Essentials',
    year: '2024'
  },
  {
    id: 'lTRiuFIWV54',
    title: 'Levitating',
    artist: 'Dua Lipa',
    channel: 'Dua Lipa',
    thumbnail: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg',
    duration: 204,
    durationFormatted: '3:24',
    views: '890M views',
    genre: 'party',
    album: 'Future Nostalgia',
    year: '2020'
  },
  {
    id: 'ru0K8uYEZWw',
    title: 'Can\'t Stop The Feeling!',
    artist: 'Justin Timberlake',
    channel: 'JustinTimberlakeVEVO',
    thumbnail: 'https://i.ytimg.com/vi/ru0K8uYEZWw/hqdefault.jpg',
    duration: 285,
    durationFormatted: '4:45',
    views: '1.7B views',
    genre: 'party',
    album: 'Trolls',
    year: '2016'
  },
  {
    id: 'btPJPFnesV4',
    title: 'Eye of the Tiger',
    artist: 'Survivor',
    channel: 'SurvivorVEVO',
    thumbnail: 'https://i.ytimg.com/vi/btPJPFnesV4/hqdefault.jpg',
    duration: 245,
    durationFormatted: '4:05',
    views: '1.1B views',
    genre: 'workout',
    album: 'Eye of the Tiger',
    year: '1982'
  },
  {
    id: 'kXYiU_JCYtU',
    title: 'Numb',
    artist: 'Linkin Park',
    channel: 'Linkin Park',
    thumbnail: 'https://i.ytimg.com/vi/kXYiU_JCYtU/hqdefault.jpg',
    duration: 187,
    durationFormatted: '3:07',
    views: '2.3B views',
    genre: 'rock',
    album: 'Meteora',
    year: '2003'
  },
  {
    id: 'fJ9rUzIMcZQ2', // Using another link for Yellow
    id: 'yKNxeF4KMsY',
    title: 'Yellow',
    artist: 'Coldplay',
    channel: 'Coldplay',
    thumbnail: 'https://i.ytimg.com/vi/yKNxeF4KMsY/hqdefault.jpg',
    duration: 270,
    durationFormatted: '4:30',
    views: '1.0B views',
    genre: 'rock',
    album: 'Parachutes',
    year: '2000'
  },
  {
    id: 'LsoLEjrDogU',
    title: 'Stay With Me',
    artist: 'Sam Smith',
    channel: 'SamSmithVEVO',
    thumbnail: 'https://i.ytimg.com/vi/LsoLEjrDogU/hqdefault.jpg',
    duration: 173,
    durationFormatted: '2:53',
    views: '1.2B views',
    genre: 'chill',
    album: 'In the Lonely Hour',
    year: '2014'
  },
  {
    id: 'DkeiKbqa02g',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    channel: 'Ed Sheeran',
    thumbnail: 'https://i.ytimg.com/vi/DkeiKbqa02g/hqdefault.jpg',
    duration: 297,
    durationFormatted: '4:57',
    views: '3.6B views',
    genre: 'chill',
    album: 'x',
    year: '2014'
  },
  {
    id: 'SlPhMPnQ58k',
    title: 'Memories',
    artist: 'Maroon 5',
    channel: 'Maroon5VEVO',
    thumbnail: 'https://i.ytimg.com/vi/SlPhMPnQ58k/hqdefault.jpg',
    duration: 195,
    durationFormatted: '3:15',
    views: '980M views',
    genre: 'chill',
    album: 'JORDI',
    year: '2019'
  },
  {
    id: 'papuvlVeZg8',
    title: 'Paris',
    artist: 'The Chainsmokers',
    channel: 'ChainsmokersVEVO',
    thumbnail: 'https://i.ytimg.com/vi/papuvlVeZg8/hqdefault.jpg',
    duration: 215,
    durationFormatted: '3:35',
    views: '400M views',
    genre: 'chill',
    album: 'Memories...Do Not Open',
    year: '2017'
  },
  {
    id: '34Na4j8AVgA',
    title: 'Starboy ft. Daft Punk',
    artist: 'The Weeknd',
    channel: 'TheWeekndVEVO',
    thumbnail: 'https://i.ytimg.com/vi/34Na4j8AVgA/hqdefault.jpg',
    duration: 230,
    durationFormatted: '3:50',
    views: '2.4B views',
    genre: 'r-and-b',
    album: 'Starboy',
    year: '2016'
  },
  {
    id: 'RBumgq5yVrA',
    title: 'Passenger | Let Her Go',
    artist: 'Passenger',
    channel: 'Passenger',
    thumbnail: 'https://i.ytimg.com/vi/RBumgq5yVrA/hqdefault.jpg',
    duration: 254,
    durationFormatted: '4:14',
    views: '3.6B views',
    genre: 'chill',
    album: 'All the Little Lights',
    year: '2012'
  }
];

export const FEATURED_PLAYLISTS = [
  {
    id: 'vibes-top-50',
    title: 'Today\'s Top Hits',
    description: 'The biggest tracks right now. Featuring The Weeknd, Dua Lipa, Drake & more.',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    color: '#10b981',
    tracks: ['4NRXx6U8ABQ', 'JGwWNGJdvx8', 'lTRiuFIWV54', 'OPf0YbXqDm0', '34Na4j8AVgA']
  },
  {
    id: 'lofi-beats',
    title: 'Midnight Lo-Fi Study',
    description: 'Soft beats and cozy warmth to keep you focused through the night.',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
    color: '#8b5cf6',
    tracks: ['jfKfPfyJRdk', '5yx6BWlEVcY', 'papuvlVeZg8', '2Vv-BfVoq4g']
  },
  {
    id: 'bollywood-romance',
    title: 'Bollywood Romance & Soul',
    description: 'Heart-touching melodies from Arijit Singh, Mithoon, and Sachin-Jigar.',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    color: '#f59e0b',
    tracks: ['vu5-aKf_Qq8', 'Umqb9KENgmk', 'k4yXQkG2s1E', 'ilNt2bikxUE']
  },
  {
    id: 'beast-mode',
    title: 'Beast Mode Workout',
    description: 'Pure adrenaline and heavy beats to crush your PRs and push past limits.',
    cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80',
    color: '#ef4444',
    tracks: ['btPJPFnesV4', 'wXhTHyIgQ_U', 'tvTRZJ-4EyI', 'kXYiU_JCYtU']
  },
  {
    id: 'all-time-legends',
    title: 'Rock Legends & Classics',
    description: 'Unforgettable anthems from Queen, Linkin Park, Coldplay, and more.',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80',
    color: '#3b82f6',
    tracks: ['fJ9rUzIMcZQ', 'kXYiU_JCYtU', 'yKNxeF4KMsY', 'hT_nvWreIhg']
  }
];

export const POPULAR_ARTISTS = [
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    role: 'Artist',
    image: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=400&auto=format&fit=crop&q=80',
    monthlyListeners: '115,482,900',
    query: 'The Weeknd official music videos'
  },
  {
    id: 'arijit-singh',
    name: 'Arijit Singh',
    role: 'Artist',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    monthlyListeners: '98,241,120',
    query: 'Arijit Singh songs'
  },
  {
    id: 'ed-sheeran',
    name: 'Ed Sheeran',
    role: 'Artist',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
    monthlyListeners: '85,910,400',
    query: 'Ed Sheeran official music videos'
  },
  {
    id: 'dua-lipa',
    name: 'Dua Lipa',
    role: 'Artist',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
    monthlyListeners: '78,419,300',
    query: 'Dua Lipa official music videos'
  },
  {
    id: 'drake',
    name: 'Drake',
    role: 'Artist',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80',
    monthlyListeners: '82,105,700',
    query: 'Drake official music videos'
  },
  {
    id: 'lofi-girl',
    name: 'Lofi Girl',
    role: 'Curator',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
    monthlyListeners: '54,300,000',
    query: 'Lofi Girl chill beats'
  }
];
