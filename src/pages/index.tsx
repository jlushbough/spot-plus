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
  source: 'spotify' | 'llm' | 'database';
  confidence: 'high' | 'medium' | 'low';
}

interface SongwriterInfo {
  writers: string[];
  producer?: string;
  background: string;
  source: 'known' | 'inferred' | 'unknown';
}

interface SongStory {
  text: string;
  themes: string[];
  meaning: string;
  cultural_context: string;
  source: string;
}

interface CriticalReview {
  verdict: string;
  rating: number;
  strengths: string[];
  weaknesses: string[];
  source: string;
}

interface HeaviestLyrics {
  text: string;
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
  songwriter_info: SongwriterInfo;
  song_story: SongStory;
  critical_review: CriticalReview;
  heaviest_lyrics?: HeaviestLyrics;
  band_info: BandInfo;
  interesting_facts: InterestingFacts;
  sources_attribution: string;
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

// Tech Debug Window Component
function TechDebugWindow({ 
  techWindowExpanded, 
  setTechWindowExpanded, 
  data, 
  nextPollCountdown, 
  lastSongChange, 
  isLoadingPanel, 
  logs 
}: {
  techWindowExpanded: boolean;
  setTechWindowExpanded: (expanded: boolean) => void;
  data: EnrichmentData | null;
  nextPollCountdown: number;
  lastSongChange: Date | null;
  isLoadingPanel: boolean;
  logs: Array<{timestamp: Date, message: string, type: 'info' | 'success' | 'error'}>;
}) {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`bg-gray-900 border-2 border-blue-500 rounded-lg transition-all duration-300 ${
        techWindowExpanded ? 'w-96 h-80' : 'w-16 h-16'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setTechWindowExpanded(!techWindowExpanded)}
          className="absolute top-2 right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-mono font-bold border-2 border-blue-400"
        >
          {techWindowExpanded ? '−' : 'T'}
        </button>
        
        {techWindowExpanded && (
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-blue-400 font-mono text-sm mb-3">Tech Debug</h3>
            
            {/* Song Hash */}
            <div className="mb-2">
              <div className="text-gray-400 text-xs font-mono">Song ID Hash:</div>
              <div className="text-green-400 text-xs font-mono break-all">
                {data?.track_core?.spotify_track_id || 'none'}
              </div>
            </div>
            
            {/* Countdown */}
            <div className="mb-2">
              <div className="text-gray-400 text-xs font-mono">Next Poll:</div>
              <div className="text-yellow-400 text-xs font-mono">
                {nextPollCountdown > 0 ? `${nextPollCountdown}s` : 'polling...'}
              </div>
            </div>
            
            {/* Last Song Change */}
            {lastSongChange && (
              <div className="mb-2">
                <div className="text-gray-400 text-xs font-mono">Last Change:</div>
                <div className="text-purple-400 text-xs font-mono">
                  {((new Date().getTime() - lastSongChange.getTime()) / 1000).toFixed(1)}s ago
                </div>
              </div>
            )}
            
            {/* Status */}
            <div className="mb-3">
              <div className="text-gray-400 text-xs font-mono">Status:</div>
              <div className={`text-xs font-mono ${isLoadingPanel ? 'text-orange-400' : data ? 'text-green-400' : 'text-red-400'}`}>
                {isLoadingPanel ? 'Loading panel...' : data ? 'Ready' : 'No track playing'}
              </div>
            </div>
            
            {/* Logs */}
            <div className="flex-1 flex flex-col">
              <div className="text-gray-400 text-xs font-mono mb-1">Logs:</div>
              <div className="flex-1 overflow-y-auto bg-gray-800 rounded p-2 space-y-1">
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-xs font-mono">No logs yet...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-xs font-mono">
                      <span className="text-gray-500">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span className={`ml-2 ${
                        log.type === 'error' ? 'text-red-400' : 
                        log.type === 'success' ? 'text-green-400' : 
                        'text-gray-300'
                      }`}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default function SpotifyDashboard() {
  const [data, setData] = useState<EnrichmentData | null>(null);
  const [panelData, setPanelData] = useState<PanelData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingPanel, setIsLoadingPanel] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [nextPollCountdown, setNextPollCountdown] = useState(0);
  const [lastSongChange, setLastSongChange] = useState<Date | null>(null);
  const [techWindowExpanded, setTechWindowExpanded] = useState(true); // Always expanded by default
  const [logs, setLogs] = useState<Array<{timestamp: Date, message: string, type: 'info' | 'success' | 'error'}>>([]);

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [...prev, { timestamp: new Date(), message, type }].slice(-50)); // Keep last 50 logs
  };

  // Function to fetch current track
  const fetchCurrentTrack = async () => {
    try {
      const response = await fetch('/api/spotify/current');
      const result = await response.json();
      
      if (result.success && result.data) {
        const newData = result.data;
        const oldTrackId = data?.track_core?.spotify_track_id;
        const newTrackId = newData.track_core?.spotify_track_id;
        
        // Debug logging
        addLog(`Debug: oldTrackId=${oldTrackId}, newTrackId=${newTrackId}, hasPanelData=${!!panelData}`, 'info');
        
        setData(newData);
        setIsPlaying(result.is_playing);
        setLastRefresh(new Date());
        
        // Check if song changed
        if (oldTrackId && newTrackId && oldTrackId !== newTrackId) {
          setLastSongChange(new Date());
          setPanelData(null); // Clear panel data when song changes
          addLog(`Song changed: ${newData.track_core.title}`, 'success');
          
          // Fetch new panel data
          fetchPanelData(newData);
        } else if (!oldTrackId && newTrackId) {
          // First song load
          setLastSongChange(new Date());
          addLog(`First track loaded: ${newData.track_core.title}`, 'info');
          fetchPanelData(newData);
        } else if (!panelData && newTrackId) {
          // Panel data missing, fetch it
          addLog(`Panel data missing, fetching for: ${newData.track_core.title}`, 'info');
          fetchPanelData(newData);
        }
      } else {
        setData(null);
        setIsPlaying(false);
        if (result.error) {
          addLog(`Error: ${result.error}`, 'error');
        }
      }
    } catch (error) {
      console.error('Error fetching current track:', error);
      addLog('Failed to fetch current track', 'error');
    }
  };

  // Function to fetch panel data
  const fetchPanelData = async (trackData: any) => {
    setIsLoadingPanel(true);
    try {
      // Send the current track data to the panel endpoint
      if (!trackData) {
        addLog('No track data available for panel', 'error');
        setIsLoadingPanel(false);
        return;
      }

      const response = await fetch('/api/song-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackData) // Send the full track data
      });
      const result = await response.json();
      
      if (result.success) {
        setPanelData(result.data);
        addLog('Panel data loaded', 'success');
      } else {
        addLog(`Panel error: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Error fetching panel data:', error);
      addLog('Failed to fetch panel data', 'error');
    } finally {
      setIsLoadingPanel(false);
    }
  };

  // Manual refresh function
  const manualRefresh = () => {
    addLog('Manual refresh triggered', 'info');
    fetchCurrentTrack();
  };

  // Set up polling
  useEffect(() => {
    fetchCurrentTrack(); // Initial fetch
    const interval = setInterval(fetchCurrentTrack, 5000); // Poll every 5 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setNextPollCountdown(prev => prev > 0 ? prev - 1 : 5);
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  }, []);

  if (!data) {
    return (
      <>
        <TechDebugWindow 
          techWindowExpanded={techWindowExpanded}
          setTechWindowExpanded={setTechWindowExpanded}
          data={data}
          nextPollCountdown={nextPollCountdown}
          lastSongChange={lastSongChange}
          isLoadingPanel={isLoadingPanel}
          logs={logs}
        />
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
            <p className="text-gray-300">Connecting to Spotify...</p>
            <a 
              href="/api/spotify/login" 
              className="inline-block mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Login to Spotify
            </a>
          </div>
        </div>
      </>
    );
  }

  const core = data.track_core;
  const stats = data.stats;

  return (
    <>
      <TechDebugWindow 
        techWindowExpanded={techWindowExpanded}
        setTechWindowExpanded={setTechWindowExpanded}
        data={data}
        nextPollCountdown={nextPollCountdown}
        lastSongChange={lastSongChange}
        isLoadingPanel={isLoadingPanel}
        logs={logs}
      />
      
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
        
        {/* Left pane - LLM content */}
        <div className="space-y-6">
          {isLoadingPanel && !panelData && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-gray-300">Analyzing track...</span>
              </div>
            </div>
          )}
          
          {panelData && (
            <>
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
            </>
          )}
        </div>

        {/* Right pane - track info and album cover */}
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
            {panelData && (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
