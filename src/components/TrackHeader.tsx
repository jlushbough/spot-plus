import React from 'react';

interface TrackHeaderProps {
  title: string;
  artists: string[];
  album: string;
  releaseDate: string;
  coverUrl: string;
  isPlaying: boolean;
}

const VUMeter = ({ isActive }: { isActive: boolean }) => {
  const needleAngle = isActive ? 18 : -18;
  const ghostAngle = isActive ? 26 : -26;

  return (
    <div className="bg-[#120a05] border border-[#4c2d17] rounded-3xl p-4 shadow-inner text-amber-200">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-2">
        <span>vu</span>
        <span>program</span>
        <span>peak</span>
      </div>
      <div className="relative w-full aspect-[5/2]">
        <svg viewBox="0 0 120 60" className="w-full h-full text-amber-200/60">
          <path
            d="M5 55 A55 55 0 0 1 115 55"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.4}
          />
          {Array.from({ length: 11 }).map((_, index) => {
            const x = 10 + index * 10;
            return (
              <line
                key={index}
                x1={x}
                y1={48}
                x2={x}
                y2={index % 2 === 0 ? 42 : 45}
                stroke="currentColor"
                strokeWidth={index % 2 === 0 ? 2 : 1}
              />
            );
          })}
          <line
            x1={60}
            y1={55}
            x2={60}
            y2={15}
            stroke="url(#needleGradient)"
            strokeWidth={2}
            strokeLinecap="round"
            transform={`rotate(${needleAngle} 60 55)`}
          />
          <line
            x1={60}
            y1={55}
            x2={60}
            y2={15}
            stroke="#f0b35a55"
            strokeWidth={2}
            strokeLinecap="round"
            transform={`rotate(${ghostAngle} 60 55)`}
          />
          <defs>
            <linearGradient id="needleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffd27c" />
              <stop offset="100%" stopColor="#b96820" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-x-6 bottom-1 h-1 bg-gradient-to-r from-lime-500/50 via-amber-400/40 to-red-500/60 rounded-full" />
      </div>
    </div>
  );
};

export const TrackHeader: React.FC<TrackHeaderProps> = ({
  title,
  artists,
  album,
  releaseDate,
  coverUrl,
  isPlaying
}) => {
  return (
    <div className="bg-gradient-to-br from-[#2d190c] via-[#1b1007] to-[#120904] border border-[#5e3920] rounded-[32px] p-6 shadow-[0_35px_80px_rgba(0,0,0,0.5)]">
      <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent blur-lg opacity-70" />
          <div className="relative rounded-[28px] overflow-hidden bg-[#080402] border border-[#2f190b] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
            <img
              src={coverUrl}
              alt={`${title} – ${artists.join(', ')}`}
              className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#090502] via-transparent" />
            <div className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase text-amber-200/80 bg-black/60 px-3 py-1 rounded-full border border-amber-500/30">
              master tape
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-5">
          <div className="space-y-2">
            <p className="uppercase tracking-[0.5em] text-xs text-amber-400/80">studio cue</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-amber-50 drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
              {title}
            </h1>
            <p className="text-xl text-amber-200/90 font-medium">{artists.join(', ')}</p>
            <div className="flex flex-wrap gap-3 text-sm text-amber-200/80">
              <span className="px-3 py-1 rounded-full border border-[#c28a4a]/30 bg-black/30">{album}</span>
              <span className="px-3 py-1 rounded-full border border-[#c28a4a]/30 bg-black/30">{releaseDate}</span>
            </div>
          </div>

          <VUMeter isActive={isPlaying} />

          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-amber-400/70">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex h-3 w-3 rounded-full border border-amber-400/40 ${isPlaying ? 'bg-lime-400 shadow-[0_0_10px_rgba(190,255,110,0.8)]' : 'bg-[#281407]'}`} />
              <span>{isPlaying ? 'transport rolling' : 'standby'}</span>
            </div>
            <span>spot plus lab</span>
          </div>
        </div>
      </div>
    </div>
  );
};
