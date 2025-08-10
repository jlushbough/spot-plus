import { useEffect, useState } from 'react';
import { marked } from 'marked';

interface TrackCore {
  title: string;
  artists: string[];
  album: string;
  release_date: string;
  duration_ms: number;
  progress_ms: number;
  isrc: string | null;
  spotify_track_id: string;
  cover_url: string;
}

interface AudioFeatures {
  tempo_bpm: number;
  key: string;
  mode: 'major' | 'minor';
  energy: number;
  danceability: number;
  valence: number;
}

interface ArtistInfo {
  name: string;
  followers?: number;
  popularity?: number;
  genres?: string[];
}

interface TrackStats {
  artist_info: ArtistInfo[];
  popularity: number;
  release_year: string;
  album_type: string;
  markets_available: number;
}

interface EnrichmentData {
  track_core: TrackCore;
  audio_features: AudioFeatures;
  stats: TrackStats;
  credits: any;
  performance: any;
  critical: any;
  similar_recos: any;
  sidebar_markdown: string;
}

export default function Home() {
  const [data, setData] = useState<EnrichmentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackFacts, setTrackFacts] = useState<string[]>([]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const generateTrackFacts = async (core: TrackCore, stats?: TrackStats): Promise<string[]> => {
    const facts = [];
    
    // Song length
    const minutes = Math.floor(core.duration_ms / 60000);
    const seconds = Math.floor((core.duration_ms % 60000) / 1000);
    facts.push(`Length: ${minutes}:${String(seconds).padStart(2, '0')}`);
    
    // Make API call to get real facts about this specific song
    try {
      const response = await fetch('/api/song-facts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: core.title,
          artist: core.artists[0],
          album: core.album,
          release_date: core.release_date,
        }),
      });
      
      if (response.ok) {
        const songFacts = await response.json();
        if (songFacts.studio) facts.push(`Studio: ${songFacts.studio}`);
        if (songFacts.producer) facts.push(`Producer: ${songFacts.producer}`);
        if (songFacts.albumSales) facts.push(`Album Sales: ${songFacts.albumSales}`);
      } else {
        // Fallback if API fails
        facts.push(`Studio: Information pending`);
        facts.push(`Producer: Information pending`);
        facts.push(`Album Sales: Information pending`);
      }
    } catch (error) {
      // Fallback if API call fails
      facts.push(`Studio: Information pending`);
      facts.push(`Producer: Information pending`);
      facts.push(`Album Sales: Information pending`);
    }
    
    // Additional stats if available
    if (stats) {
      facts.push(`Track Popularity: ${stats.popularity}/100`);
      facts.push(`Album Type: ${stats.album_type}`);
      if (stats.markets_available) {
        facts.push(`Available in ${stats.markets_available} markets`);
      }
    }
    
    return facts;
  };

  const loadTrackFacts = async (core: TrackCore, stats?: TrackStats) => {
    const facts = await generateTrackFacts(core, stats);
    setTrackFacts(facts);
  };

  const generateSongMeaning = (core: TrackCore) => {
    // Generate brief band facts for dashboard style
    const artist = core.artists[0];
    
    return {
      band: artist,
      facts: `Active since their debut, known for their distinctive sound and contributions to music. Part of the "${core.album}" era.`
    };
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/spotify/current');
      if (res.status === 401) {
        setError('unauthenticated');
        return;
      }
      if (!res.ok) {
        console.error('Failed to fetch current track');
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load track facts when data changes
  useEffect(() => {
    if (data?.track_core && data?.stats) {
      loadTrackFacts(data.track_core, data.stats);
    }
  }, [data?.track_core?.spotify_track_id]); // Remove loadTrackFacts from deps

  if (error === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <a
          href="/api/spotify/login"
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold"
        >
          Log in with Spotify
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        Loading...
      </div>
    );
  }

  const html = marked.parse(data.sidebar_markdown ?? '');
  const core = data.track_core;
  const audioFeatures = data.audio_features;
  const stats = data.stats;
  
  // Generate meaning using our own logic
  const songInfo = generateSongMeaning(core);

  return (
    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10 min-h-screen bg-gray-900">
      {/* Left pane */}
      <div className="flex flex-col items-center md:items-start space-y-4">
        {core.cover_url && (
          <img
            src={core.cover_url}
            alt={`${core.title} – ${core.artists.join(', ')}`}
            className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-lg shadow-lg"
          />
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{core.title}</h1>
          <p className="text-gray-300 text-lg mb-1">{core.artists.join(', ')}</p>
          <p className="text-gray-400 text-sm">Album: {core.album}</p>
          <p className="text-gray-400 text-sm">Released: {core.release_date}</p>
          
          {/* LLM Facts under release date */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-3 text-sm">Track Facts</h3>
            <div className="space-y-1 text-xs text-gray-300">
              {trackFacts.length > 0 ? trackFacts.map((fact, index) => (
                <div key={index} className="text-gray-300">
                  {fact}
                </div>
              )) : (
                <div className="text-gray-500">Loading facts...</div>
              )}
            </div>
          </div>
        </div>

        {/* Credits section below image */}
        {stats && stats.artist_info && (
          <div className="w-full max-w-sm">
            <h3 className="text-white font-semibold mb-3 text-base">Credits</h3>
            {stats.artist_info.map((artist, index) => (
              <div key={index} className="mb-3 last:mb-0 border-l-2 border-gray-600 pl-3">
                <h4 className="text-white font-medium text-sm mb-1">{artist.name}</h4>
                {artist.followers && (
                  <p className="text-gray-300 text-xs mb-1">
                    {formatNumber(artist.followers)} followers
                  </p>
                )}
                {artist.popularity && (
                  <p className="text-gray-300 text-xs mb-1">
                    Popularity: {artist.popularity}/100
                  </p>
                )}
                {artist.genres && artist.genres.length > 0 && (
                  <p className="text-gray-400 text-xs">
                    {artist.genres.slice(0, 3).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right pane: Dashboard Style */}
      <div className="space-y-6">
        {/* Band Info */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Band: {songInfo.band}</h3>
          <p className="text-gray-300 text-sm">{songInfo.facts}</p>
        </div>
        
        {/* Claude content if available - cleaned up */}
        {data.sidebar_markdown && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Song Story</h3>
            <div 
              className="prose prose-invert prose-sm max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>
    </div>
  );
}