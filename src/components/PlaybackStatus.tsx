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
    <div className="relative overflow-hidden rounded-[30px] border border-amber-900/50 bg-[#130903] shadow-[0_20px_60px_rgba(0,0,0,0.5)] px-6 py-5">
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(18,9,3,0.8) 55%)' }} />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-10">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full border border-black shadow-inner ${
              isPlaying ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.9)]' : 'bg-gray-500'
            }`} />
            <div>
              <p className="text-[11px] uppercase tracking-[0.5em] text-amber-500">Transport</p>
              <p className="text-2xl font-semibold text-amber-50">{isPlaying ? 'Run' : 'Hold'}</p>
            </div>
          </div>

          {lastRefresh && (
            <div className="flex items-center gap-3 text-amber-200/70 text-sm">
              <span className="text-[10px] uppercase tracking-[0.4em] text-amber-500">Sync</span>
              <span className="font-mono">{lastRefresh.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            {['A/B', 'Stereo'].map((label) => (
              <button
                key={label}
                className="relative w-16 h-16 rounded-full border border-amber-900/60 bg-gradient-to-b from-[#1a1009] to-[#050302] text-[10px] uppercase tracking-[0.3em] text-amber-200/70 shadow-[inset_0_-8px_15px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.6)]"
              >
                <span className="absolute inset-0 flex items-center justify-center">
                  {label}
                </span>
                <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-500/60" />
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            className="group relative flex items-center gap-3 rounded-[18px] border border-amber-900/60 bg-gradient-to-r from-[#2b180c] to-[#140903] px-5 py-3 text-amber-50 shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
          >
            <div className="w-9 h-9 rounded-full border border-black bg-gradient-to-b from-amber-200 to-amber-500 text-black flex items-center justify-center font-bold group-hover:rotate-45 transition-transform duration-500">
              ↻
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.35em] text-amber-500">Manual</p>
              <p className="text-sm font-semibold">Refresh</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
