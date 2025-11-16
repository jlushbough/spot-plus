import React from 'react';

interface BandInfo {
  members: string[];
  formation_year?: string;
  origin?: string;
  notable_facts: string[];
}

interface BandInfoCardProps {
  bandInfo: BandInfo;
  artistName: string;
}

export const BandInfoCard: React.FC<BandInfoCardProps> = ({ bandInfo, artistName }) => {
  if (!bandInfo.members.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Band Members */}
      {bandInfo.members.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Band Members</span>
          </h3>

          <div className="space-y-2">
            {bandInfo.members.map((member, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 text-gray-300 text-sm bg-gray-700/20 rounded-lg p-2 hover:bg-gray-700/40 transition-colors"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                <span>{member}</span>
              </div>
            ))}
          </div>

          {(bandInfo.formation_year || bandInfo.origin) && (
            <div className="mt-4 pt-4 border-t border-gray-700/50 flex flex-wrap gap-3">
              {bandInfo.formation_year && (
                <div className="flex items-center space-x-2 text-xs">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">Formed: <span className="text-gray-300 font-medium">{bandInfo.formation_year}</span></span>
                </div>
              )}
              {bandInfo.origin && (
                <div className="flex items-center space-x-2 text-xs">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">Origin: <span className="text-gray-300 font-medium">{bandInfo.origin}</span></span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
