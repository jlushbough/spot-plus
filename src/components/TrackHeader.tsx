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
  const needles = [
    isPlaying ? 25 : -30,
    isPlaying ? 10 : -45
  ];

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[32px] border border-amber-900/40 bg-[#140b06] shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(20,11,6,0.4) 60%)' }} />
        <div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }} />
        <div className="relative grid gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)] p-6 md:p-8">
          <div className="relative group">
            <div className="absolute inset-0 rounded-[26px] border border-amber-800/40" />
            <img
              src={coverUrl}
              alt={`${title} – ${artists.join(', ')}`}
              className="relative w-full aspect-square object-cover rounded-[26px] ring-2 ring-amber-700/30 shadow-[0_20px_45px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/70 border border-amber-700/60 text-[10px] tracking-[0.5em] uppercase text-amber-200/80">
              Studio Master
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.4em] text-amber-400/70">Playback chain</p>
              <h1 className="text-4xl md:text-5xl font-serif text-amber-50 leading-tight">
                {title}
              </h1>
              <p className="text-lg text-amber-200/70 tracking-wide">
                {artists.join(', ')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/30 border border-amber-900/40 rounded-2xl px-4 py-3 text-amber-200/80">
                <p className="text-[10px] uppercase tracking-[0.35em] text-amber-500">Album</p>
                <p className="font-semibold text-amber-50">{album}</p>
              </div>
              <div className="bg-black/30 border border-amber-900/40 rounded-2xl px-4 py-3 text-amber-200/80">
                <p className="text-[10px] uppercase tracking-[0.35em] text-amber-500">Release</p>
                <p className="font-semibold text-amber-50">{releaseDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {needles.map((angle, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-b from-[#1f120b] to-[#0b0502] border border-amber-900/50 rounded-3xl p-4 shadow-inner"
                >
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-amber-500">
                    <span>{index === 0 ? 'VU A' : 'VU B'}</span>
                    <span>{isPlaying ? 'Live' : 'Idle'}</span>
                  </div>
                  <svg viewBox="0 0 120 70" className="mt-2 w-full">
                    <path
                      d="M10 60 Q60 10 110 60"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth={3}
                    />
                    {[...Array(9)].map((_, markIndex) => {
                      const x = 10 + markIndex * 12.5;
                      return (
                        <line
                          key={markIndex}
                          x1={x}
                          y1={60}
                          x2={x}
                          y2={markIndex % 2 === 0 ? 50 : 54}
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth={markIndex % 2 === 0 ? 2 : 1}
                        />
                      );
                    })}
                    <g transform="translate(60,60)">
                      <line
                        x1={0}
                        y1={0}
                        x2={0}
                        y2={-40}
                        stroke={isPlaying ? '#f97316' : '#fcd34d'}
                        strokeWidth={3}
                        strokeLinecap="round"
                        transform={`rotate(${angle})`}
                      />
                      <circle r={4} fill="#111" stroke="#fcd34d" strokeWidth={2} />
                    </g>
                  </svg>
                  <p className="mt-2 text-xs font-mono text-amber-200/70">Calibration {index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
