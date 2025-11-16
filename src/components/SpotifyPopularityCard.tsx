import React from 'react';

interface SpotifyPopularityCardProps {
  popularity?: number;
}

const getTier = (score: number) => {
  if (score >= 85) return { label: 'Mainstream smash', color: 'from-green-500 via-emerald-500 to-green-400' };
  if (score >= 65) return { label: 'Playlist favorite', color: 'from-blue-500 via-indigo-500 to-purple-500' };
  if (score >= 40) return { label: 'Cult favorite', color: 'from-orange-500 via-amber-500 to-yellow-500' };
  return { label: 'Deep cut discovery', color: 'from-pink-500 via-rose-500 to-red-500' };
};

const getContextCopy = (score: number) => {
  if (score >= 85) return 'Dominating algorithmic radio and editorial playlists.';
  if (score >= 65) return 'Steady stream counts and strong playlist traction.';
  if (score >= 40) return 'Resonating with loyal fans as it grows.';
  return 'Underground vibes — loyal listeners keep this alive.';
};

export const SpotifyPopularityCard: React.FC<SpotifyPopularityCardProps> = ({ popularity }) => {
  if (typeof popularity !== 'number') {
    return null;
  }

  const score = Math.max(0, Math.min(100, Math.round(popularity)));
  const tier = getTier(score);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 shadow-xl">
      <h3 className="text-white font-semibold text-lg mb-6 flex items-center space-x-2">
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4v6h2v-6a2 2 0 014 0v6h2v-6c0-2.21-1.79-4-4-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 18h10" />
        </svg>
        <span>Spotify Popularity</span>
      </h3>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Score</p>
          <p className="text-4xl font-bold text-white mt-1">
            {score}
            <span className="text-lg text-gray-400">/100</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">{tier.label}</p>
        </div>
        <div className="text-right max-w-xs">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Momentum</p>
          <p className="text-sm text-gray-300 leading-relaxed">{getContextCopy(score)}</p>
        </div>
      </div>

      <div className="h-3 bg-gray-800/80 rounded-full overflow-hidden border border-gray-700/60">
        <div
          className={`h-full bg-gradient-to-r ${tier.color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Spotify does not share raw play counts, but this score reflects how the track performs relative to every song on the
        platform.
      </p>
    </div>
  );
};
