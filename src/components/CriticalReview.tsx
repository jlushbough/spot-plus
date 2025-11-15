import React from 'react';

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

interface CriticalReviewProps {
  title: string;
  songStory: SongStory;
  heaviestLyrics?: HeaviestLyrics;
}

export const CriticalReview: React.FC<CriticalReviewProps> = ({
  title,
  songStory,
  heaviestLyrics
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 shadow-xl overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span>Critical Analysis</span>
        </h3>

        {/* Heaviest Lyrics */}
        {heaviestLyrics && (
          <div className="mb-6 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            <blockquote className="pl-6 pr-4 py-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-r-xl">
              <svg className="w-8 h-8 text-purple-500/30 mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-200 text-base leading-relaxed italic font-light whitespace-pre-line">
                {heaviestLyrics.text}
              </p>
            </blockquote>
          </div>
        )}

        {/* Song Story */}
        <div className="space-y-3">
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {songStory.text}
          </p>

          <div className="flex items-center space-x-2 pt-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {songStory.source === 'llm' ? 'AI Analysis' : 'Spotify'}
            </span>
            {songStory.confidence && (
              <span className="text-xs text-gray-500">
                {songStory.confidence} confidence
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
