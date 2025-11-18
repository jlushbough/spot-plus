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
    <div className="bg-gradient-to-r from-[#1f130b] to-[#150b06] border border-[#4a2a15] rounded-[28px] px-6 py-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-4 bg-[#0c0602]/80 border border-[#3f2210] rounded-2xl px-5 py-3 text-amber-100">
            <div className="relative">
              <div className={`h-4 w-8 rounded-full border border-[#d1a062]/40 bg-gradient-to-r from-[#221105] to-[#120803] flex items-center px-0.5 ${isPlaying ? 'justify-end' : 'justify-start'}`}>
                <div className={`h-3 w-3 rounded-full ${isPlaying ? 'bg-lime-400 shadow-[0_0_8px_rgba(166,255,138,0.9)]' : 'bg-[#332016]'}`} />
              </div>
              <span className="absolute -bottom-4 left-0 text-[10px] tracking-[0.3em] text-amber-500/80">transport</span>
            </div>
            <div className="text-sm uppercase tracking-[0.4em] text-amber-200/90">
              {isPlaying ? 'run' : 'hold'}
            </div>
          </div>

          {lastRefresh && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#1a100a]/70 border border-[#3a2212] text-amber-200/80 text-xs">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l2.5 2.5m5.5-2.5a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
              <div className="leading-tight">
                <p className="uppercase tracking-[0.3em]">last sync</p>
                <p className="font-mono text-base text-amber-100">{lastRefresh.toLocaleTimeString()}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-[#0b0502] border border-[#332012] rounded-2xl px-4 py-3 text-[11px] uppercase tracking-[0.4em] text-amber-300/80">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(255,196,140,0.8)]" />
            <span>analog mode</span>
          </div>
          <button
            onClick={onRefresh}
            className="relative overflow-hidden group flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-[#b8894c] via-[#e0c38d] to-[#a05f19] text-[#2b1406] font-semibold tracking-[0.2em] uppercase shadow-[inset_0_2px_8px_rgba(255,255,255,0.4),0_15px_30px_rgba(0,0,0,0.45)]"
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity" />
            <svg
              className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.6m14.8 2a8 8 0 00-15.4-2M4.6 9H9m11 11v-5h-.6m0 0a8 8 0 01-15.4-2m15.4 2H15" />
            </svg>
            <span>resync</span>
          </button>
        </div>
      </div>
    </div>
  );
};
