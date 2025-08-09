import { useEffect, useState } from 'react';
import { marked } from 'marked';

interface TrackCore {
  title: string;
  artists: string[];
  album: string;
  release_date: string;
  duration_ms: number;
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

interface EnrichmentData {
  track_core: TrackCore;
  audio_features: AudioFeatures;
  credits: any;
  performance: any;
  critical: any;
  similar_recos: any;
  sidebar_markdown: string;
}

export default function Home() {
  const [data, setData] = useState<EnrichmentData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        </div>
      </div>

      {/* Right pane: sidebar */}
      <div
        className="prose prose-invert max-w-none overflow-auto md:h-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}