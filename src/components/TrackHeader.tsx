import React from 'react';

interface TrackHeaderProps {
  title: string;
  artists: string[];
  album: string;
  releaseDate: string;
  coverUrl: string;
  isPlaying: boolean;
}

export const TrackHeader: React.FC<TrackHeaderProps> = ({
  title,
  artists,
  album,
  releaseDate,
  coverUrl,
  isPlaying
}) => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Album Art with Playing Indicator */}
      <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl blur-2xl transition-opacity duration-500 ${
          isPlaying ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`} />
        <img
          src={coverUrl}
          alt={`${title} – ${artists.join(', ')}`}
          className="relative w-full aspect-square object-cover rounded-2xl shadow-2xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {isPlaying && (
          <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-green-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <div className="flex space-x-0.5">
              <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-white text-xs font-medium">Now Playing</span>
          </div>
        )}
      </div>

      {/* Track Information */}
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
          {title}
        </h1>
        <p className="text-xl text-gray-300 font-medium">
          {artists.join(', ')}
        </p>
        <div className="flex flex-col space-y-1 text-sm text-gray-400">
          <p className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span>{album}</span>
          </p>
          <p className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>{releaseDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
