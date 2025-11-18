import { useEffect, useState } from 'react';
import { TrackHeader } from '@/components/TrackHeader';
import { BandInfoCard } from '@/components/BandInfoCard';
import { TrackInsightsCard } from '@/components/TrackInsightsCard';
import { PlaybackStatus } from '@/components/PlaybackStatus';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { CompactPopularityCard } from '@/components/CompactPopularityCard';

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
  track_stats: TrackStats;
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

  // Login Screen
  if (error === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        <div className="text-center space-y-8">
          {/* Spotify Logo Effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
            <svg className="w-24 h-24 mx-auto relative" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white">Welcome to Spot Plus</h1>
            <p className="text-gray-400">Discover deeper insights about your music</p>
          </div>

          <a
            href="/api/spotify/login"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Connect with Spotify</span>
          </a>
        </div>
      </div>
    );
  }

  // Loading State
  if (!data || !panelData) {
    return <LoadingSkeleton />;
  }

  const core = data.track_core;
  const trackStats = data.track_stats;

  return (
    <div className="min-h-screen bg-[#050301] p-6 md:p-10 text-amber-50">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,193,120,0.12),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(143,86,38,0.25),_transparent_40%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '120px' }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '140px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Playback Status Header */}
        <PlaybackStatus
          isPlaying={isPlaying}
          lastRefresh={lastRefresh}
          onRefresh={manualRefresh}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Track Info */}
          <div className="space-y-6">
            {/* Track Header with Album Art */}
            <TrackHeader
              title={core.title}
              artists={core.artists}
              album={core.album}
              releaseDate={core.release_date}
              coverUrl={core.cover_url}
              isPlaying={isPlaying}
            />

            {/* Compact Popularity Card */}
            <CompactPopularityCard popularity={trackStats?.popularity} />
          </div>

          {/* Right Column - Enriched Content */}
          <div className="space-y-6">
            {/* Unified Track & Artist Insights */}
            <TrackInsightsCard
              interestingFacts={panelData.interesting_facts}
              aiInsights={panelData.song_story}
            />

            {/* Band Information */}
            <BandInfoCard
              bandInfo={panelData.band_info}
              artistName={core.artists[0]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
