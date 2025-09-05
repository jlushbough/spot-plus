import { useEffect, useState } from 'react';

export default function DebugCookies() {
  const [cookies, setCookies] = useState<string>('');
  const [parsedCookies, setParsedCookies] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get all cookies
    const allCookies = document.cookie;
    setCookies(allCookies);
    
    // Parse cookies
    const parsed: Record<string, string> = {};
    allCookies.split(';').forEach((pair) => {
      const [name, ...rest] = pair.trim().split('=');
      if (name) {
        parsed[name] = decodeURIComponent(rest.join('='));
      }
    });
    setParsedCookies(parsed);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Cookie Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Raw Cookies:</h2>
        <pre className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
          {cookies || 'No cookies found'}
        </pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Parsed Cookies:</h2>
        <div className="space-y-2">
          {Object.entries(parsedCookies).map(([key, value]) => (
            <div key={key} className="bg-gray-800 p-2 rounded">
              <strong>{key}:</strong> {value.length > 100 ? value.substring(0, 100) + '...' : value}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Spotify-specific Cookies:</h2>
        <div className="space-y-2">
          {Object.entries(parsedCookies)
            .filter(([key]) => key.startsWith('spotify_'))
            .map(([key, value]) => (
              <div key={key} className="bg-green-900 p-2 rounded">
                <strong>{key}:</strong> 
                {key === 'spotify_access_token' || key === 'spotify_refresh_token' 
                  ? ' [REDACTED]' 
                  : value}
              </div>
            ))}
        </div>
      </div>
      
      <div>
        <a 
          href="/api/spotify/login" 
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          Login to Spotify
        </a>
        <a 
          href="/" 
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white ml-4"
        >
          Back to App
        </a>
      </div>
    </div>
  );
}
