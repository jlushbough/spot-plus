import React from 'react';

interface AudioFeature {
  label: string;
  value: number;
  color: string;
  icon?: string;
}

interface AudioFeatureVisualizerProps {
  tempo: number;
  key: string;
  mode: 'major' | 'minor';
  energy: number;
  danceability: number;
  valence: number;
}

export const AudioFeatureVisualizer: React.FC<AudioFeatureVisualizerProps> = ({
  tempo,
  key,
  mode,
  energy,
  danceability,
  valence
}) => {
  const features: AudioFeature[] = [
    { label: 'Energy', value: energy * 100, color: 'from-red-500 to-orange-500' },
    { label: 'Danceability', value: danceability * 100, color: 'from-purple-500 to-pink-500' },
    { label: 'Valence', value: valence * 100, color: 'from-blue-500 to-cyan-500' },
  ];

  const getMoodEmoji = (valence: number) => {
    if (valence > 0.7) return '😊';
    if (valence > 0.4) return '😐';
    return '😔';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 shadow-xl">
      <h3 className="text-white font-semibold text-lg mb-6 flex items-center space-x-2">
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <span>Audio Analysis</span>
      </h3>

      {/* Musical Attributes */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700/30 rounded-xl p-3 border border-gray-600/30">
          <p className="text-gray-400 text-xs mb-1">Tempo</p>
          <p className="text-white font-bold text-lg">{Math.round(tempo)} <span className="text-sm text-gray-400">BPM</span></p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-3 border border-gray-600/30">
          <p className="text-gray-400 text-xs mb-1">Key</p>
          <p className="text-white font-bold text-lg">{key} <span className="text-sm text-gray-400">{mode}</span></p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-3 border border-gray-600/30">
          <p className="text-gray-400 text-xs mb-1">Mood</p>
          <p className="text-white font-bold text-2xl">{getMoodEmoji(valence)}</p>
        </div>
      </div>

      {/* Feature Bars */}
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">{feature.label}</span>
              <span className="text-sm font-semibold text-white">{Math.round(feature.value)}%</span>
            </div>
            <div className="h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${feature.color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                style={{
                  width: `${feature.value}%`,
                  boxShadow: `0 0 10px rgba(${feature.value > 50 ? '59, 130, 246' : '239, 68, 68'}, 0.5)`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
