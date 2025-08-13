import { useEffect, useState } from 'react';

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

interface TrackFact {
  text: string;
  source: 'spotify' | 'llm';
  confidence: 'high' | 'medium' | 'low';
}

interface SongStory {
  text: string;
  source: 'spotify' | 'llm';
  confidence: 'high' | 'medium' | 'low';
}

interface HeaviestLyrics {
  text: string;
  source: 'spotify' | 'llm';
  confidence: 'high' | 'medium' | 'low';
}

interface BandInfo {
  members: string[];
  formation_year?: string;
  origin?: string;
  notable_facts: string[];
}

interface InterestingFacts {
  facts: string[];
}

interface PanelData {
  artist_header: string;
  track_facts: TrackFact[];
  song_story: SongStory;
  heaviest_lyrics: HeaviestLyrics;
  band_info: BandInfo;
  interesting_facts: InterestingFacts;
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
  const [panelData, setPanelData] = useState<PanelData | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const loadPanelData = async (enrichmentData: EnrichmentData) => {
    try {
      const response = await fetch('/api/song-panel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichmentData),
      });
      
      if (response.ok) {
        const panel = await response.json();
        setPanelData(panel);
      } else {
        console.error('Failed to load panel data');
      }
    } catch (error) {
      console.error('Error loading panel data:', error);
    }
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
      setLastRefresh(new Date());
      
      // Determine if music is currently playing based on progress
      const isCurrentlyPlaying = json.track_core?.progress_ms > 0 && 
        json.track_core?.progress_ms < json.track_core?.duration_ms;
      setIsPlaying(isCurrentlyPlaying);
    } catch (err) {
      console.error(err);
    }
  };

  const manualRefresh = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
    
    // Smart polling strategy
    const createInterval = () => {
      let intervalTime;
      if (isPlaying) {
        intervalTime = 30000; // 30 seconds when playing
      } else if (data) {
        intervalTime = 120000; // 2 minutes when paused but track exists
      } else {
        intervalTime = 300000; // 5 minutes when no track
      }
      
      return setInterval(fetchData, intervalTime);
    };
    
    const interval = createInterval();
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, data?.track_core?.spotify_track_id]);

  // Load panel data when data changes
  useEffect(() => {
    if (data) {
      loadPanelData(data);
    }
  }, [data?.track_core?.spotify_track_id]);

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

  if (!data || !panelData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        Loading...
      </div>
    );
  }

  const core = data.track_core;
  const stats = data.stats;

  return (
    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10 min-h-screen bg-gray-900">
      {/* Header with refresh button */}
      <div className="md:col-span-2 flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-gray-400 text-sm">
              {isPlaying ? 'Playing' : 'Paused'}
            </span>
          </div>
          {lastRefresh && (
            <span className="text-gray-500 text-xs">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
        </div>
        <button
          onClick={manualRefresh}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-md transition-colors"
        >
          Refresh Now
        </button>
      </div>
      
      {/* Left pane - restored with track info */}
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
          
          {/* Track Facts under release date */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-3 text-sm">Track Facts</h3>
            <div className="space-y-1 text-xs text-gray-300">
              {panelData.track_facts.map((fact, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{fact.text}</span>
                  <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                    <span className={`text-xs px-1 py-0.5 rounded ${
                      fact.source === 'spotify' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-blue-900 text-blue-300'
                    }`}>
                      {fact.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right pane - band members and interesting facts */}
      <div className="space-y-6">
        {/* Critical Review */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 text-lg">{core.title}</h3>
          
          {/* Heaviest Lyrics - integrated at top */}
          <div className="text-gray-300 leading-relaxed text-sm mb-4 whitespace-pre-line pl-6 italic border-l-4 border-gray-600 bg-gray-700/30 p-3 rounded">
            {panelData.heaviest_lyrics ? panelData.heaviest_lyrics.text : 'Loading most impactful lyrics...'}
          </div>
          
          {/* Provocative review */}
          <div className="text-gray-300 leading-relaxed text-sm mb-2 whitespace-pre-line">
            {panelData.song_story.text}
          </div>
          <span className={`text-xs px-2 py-1 rounded ${
            panelData.song_story.source === 'spotify' 
              ? 'bg-green-900 text-green-300' 
              : 'bg-blue-900 text-blue-300'
          }`}>
            {panelData.song_story.source}
          </span>
        </div>

        {/* Band Members */}
        {panelData.band_info.members.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 text-lg">Band Members</h3>
            <div className="space-y-2">
              {panelData.band_info.members.map((member, index) => (
                <div key={index} className="text-gray-300 text-sm">
                  • {member}
                </div>
              ))}
            </div>
            {(panelData.band_info.formation_year || panelData.band_info.origin) && (
              <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
                {panelData.band_info.formation_year && `Formed: ${panelData.band_info.formation_year}`}
                {panelData.band_info.formation_year && panelData.band_info.origin && ' • '}
                {panelData.band_info.origin && `Origin: ${panelData.band_info.origin}`}
              </div>
            )}
          </div>
        )}

        {/* Band Notable Facts */}
        {panelData.band_info.notable_facts.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 text-lg">Notable Facts</h3>
            <div className="space-y-2">
              {panelData.band_info.notable_facts.map((fact, index) => (
                <div key={index} className="text-gray-300 text-sm">
                  • {fact}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interesting Facts */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 text-lg">Track Info</h3>
          <div className="space-y-2">
            {panelData.interesting_facts.facts.map((fact, index) => (
              <div key={index} className="text-gray-300 text-sm">
                • {fact}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}