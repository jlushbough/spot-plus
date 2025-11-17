import React from 'react';

interface CompactPopularityCardProps {
  popularity?: number;
}

const getTier = (score: number) => {
  if (score >= 85) return { label: 'Mainstream smash', color: 'from-green-500 via-emerald-500 to-green-400', percentile: 'Top 1%' };
  if (score >= 65) return { label: 'Playlist favorite', color: 'from-blue-500 via-indigo-500 to-purple-500', percentile: 'Top 10%' };
  if (score >= 40) return { label: 'Cult favorite', color: 'from-orange-500 via-amber-500 to-yellow-500', percentile: 'Top 40%' };
  return { label: 'Deep cut discovery', color: 'from-pink-500 via-rose-500 to-red-500', percentile: 'Hidden gem' };
};

export const CompactPopularityCard: React.FC<CompactPopularityCardProps> = ({ popularity }) => {
  if (typeof popularity !== 'number') {
    return null;
  }

  const score = Math.max(0, Math.min(100, Math.round(popularity)));
  const tier = getTier(score);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium text-sm flex items-center space-x-2">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Spotify Popularity</span>
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-white">{score}</span>
          <span className="text-sm text-gray-400">/100</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-2 bg-gray-800/80 rounded-full overflow-hidden border border-gray-700/60">
          <div
            className={`h-full bg-gradient-to-r ${tier.color} transition-all duration-700`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300 font-medium">{tier.label}</span>
          <span className="text-gray-400">{tier.percentile} on Spotify</span>
        </div>
      </div>
    </div>
  );
};
