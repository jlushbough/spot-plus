import React from 'react';

interface InterestingFacts {
  facts: string[];
}

interface SongStory {
  text: string;
  source: 'spotify' | 'llm';
  confidence: 'high' | 'medium' | 'low';
}

interface TrackInsightsCardProps {
  interestingFacts: InterestingFacts;
  aiInsights?: SongStory;
}

export const TrackInsightsCard: React.FC<TrackInsightsCardProps> = ({
  interestingFacts,
  aiInsights
}) => {
  const hasWikipediaFacts = interestingFacts.facts.length > 0;
  const hasAiInsights = aiInsights && aiInsights.text.trim().length > 0;

  if (!hasWikipediaFacts && !hasAiInsights) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-[#1f1209] via-[#120903] to-[#090402] border border-[#4a2a15] rounded-[28px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      <h3 className="text-amber-50 font-semibold text-lg mb-5 flex items-center space-x-2 tracking-[0.2em] uppercase">
        <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span>Track & Artist Insights</span>
      </h3>

      {/* From Wikipedia Section */}
      {hasWikipediaFacts && (
        <div className="mb-5">
          <h4 className="text-amber-400 font-medium text-sm mb-3 flex items-center space-x-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>From Wikipedia</span>
          </h4>

          <ul className="space-y-2.5">
            {interestingFacts.facts.slice(0, 6).map((fact, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 text-amber-100/90 text-sm leading-relaxed"
              >
                <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Insights Section */}
      {hasAiInsights && (
        <div className="pt-5 border-t border-[#3a1f10]">
          <h4 className="text-amber-400 font-medium text-xs mb-3 flex items-center space-x-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548-.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="uppercase tracking-wide">AI Insights</span>
          </h4>

          <p className="text-amber-100/80 text-sm leading-relaxed">
            {aiInsights.text}
          </p>
        </div>
      )}
    </div>
  );
};
