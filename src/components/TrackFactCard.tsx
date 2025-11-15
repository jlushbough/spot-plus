import React from 'react';

interface TrackFact {
  text: string;
  source: 'spotify' | 'llm';
  confidence: 'high' | 'medium' | 'low';
}

interface TrackFactCardProps {
  facts: TrackFact[];
}

export const TrackFactCard: React.FC<TrackFactCardProps> = ({ facts }) => {
  const getSourceBadge = (source: 'spotify' | 'llm') => {
    if (source === 'spotify') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Spotify
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        AI
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 shadow-xl">
      <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Track Facts</span>
      </h3>

      <div className="space-y-3">
        {facts.map((fact, index) => (
          <div
            key={index}
            className="group bg-gray-700/20 hover:bg-gray-700/40 rounded-xl p-3 transition-all duration-200 border border-gray-600/20 hover:border-gray-500/40"
          >
            <div className="flex justify-between items-start gap-3">
              <p className="text-gray-300 text-sm leading-relaxed flex-1">
                {fact.text}
              </p>
              <div className="flex-shrink-0">
                {getSourceBadge(fact.source)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
