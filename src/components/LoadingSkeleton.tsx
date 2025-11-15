import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10">
      {/* Header Skeleton */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-8 bg-gray-800 rounded-lg animate-pulse" />
          <div className="w-32 h-6 bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="w-24 h-10 bg-gray-800 rounded-lg animate-pulse" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column Skeleton */}
        <div className="flex flex-col space-y-6">
          {/* Album Art Skeleton */}
          <div className="relative">
            <div className="w-full aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-transparent rounded-2xl animate-pulse" />
          </div>

          {/* Track Info Skeleton */}
          <div className="space-y-4">
            <div className="h-10 bg-gray-800 rounded-lg animate-pulse w-3/4" />
            <div className="h-6 bg-gray-800 rounded-lg animate-pulse w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3" />
              <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2" />
            </div>
          </div>

          {/* Audio Features Skeleton */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6">
            <div className="h-6 bg-gray-700 rounded-lg animate-pulse w-40 mb-6" />
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-700/30 rounded-xl p-3 border border-gray-600/30">
                  <div className="h-3 bg-gray-600 rounded animate-pulse w-12 mb-2" />
                  <div className="h-6 bg-gray-600 rounded animate-pulse w-16" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-20" />
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-10" />
                  </div>
                  <div className="h-2.5 bg-gray-700/50 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Track Facts Skeleton */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6">
            <div className="h-6 bg-gray-700 rounded-lg animate-pulse w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-700/20 rounded-xl p-3 border border-gray-600/20">
                  <div className="h-4 bg-gray-600 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6">
          {/* Critical Review Skeleton */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6">
            <div className="h-6 bg-gray-700 rounded-lg animate-pulse w-48 mb-6" />
            <div className="space-y-3 mb-6">
              <div className="h-4 bg-gray-700 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-700 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
            </div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-24" />
          </div>

          {/* Band Members Skeleton */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6">
            <div className="h-6 bg-gray-700 rounded-lg animate-pulse w-40 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-gray-700/20 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Notable Facts Skeleton */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6">
            <div className="h-6 bg-gray-700 rounded-lg animate-pulse w-36 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gradient-to-r from-gray-700/20 to-transparent rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Track Insights Skeleton */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6">
            <div className="h-6 bg-gray-700 rounded-lg animate-pulse w-32 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-700/20 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
