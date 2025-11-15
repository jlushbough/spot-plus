import React from 'react';

interface PlaybackStatusProps {
  isPlaying: boolean;
  lastRefresh: Date | null;
  onRefresh: () => void;
}

export const PlaybackStatus: React.FC<PlaybackStatusProps> = ({
  isPlaying,
  lastRefresh,
  onRefresh
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-6">
        {/* Playback Status */}
        <div className="flex items-center space-x-3 bg-gray-800/50 border border-gray-700/50 rounded-full px-4 py-2">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-500'}`} />
            {isPlaying && (
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
            )}
          </div>
          <span className={`text-sm font-medium ${isPlaying ? 'text-green-400' : 'text-gray-400'}`}>
            {isPlaying ? 'Now Playing' : 'Paused'}
          </span>
        </div>

        {/* Last Updated */}
        {lastRefresh && (
          <div className="flex items-center space-x-2 text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        className="group flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <svg
          className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="font-medium">Refresh</span>
      </button>
    </div>
  );
};
