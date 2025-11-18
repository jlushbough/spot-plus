import React from 'react';

interface CompactPopularityCardProps {
  popularity?: number;
}

const AnalogMeter = ({ label, value, accent }: { label: string; value: number; accent: string }) => {
  const safeValue = Math.max(0, Math.min(100, value));
  const angle = -45 + (safeValue / 100) * 90;

  return (
    <div className="bg-[#0c0602]/60 border border-[#3d2413] rounded-3xl p-4 flex-1">
      <div className="flex items-center justify-between mb-2 text-[11px] uppercase tracking-[0.3em] text-amber-400/70">
        <span>{label}</span>
        <span>{safeValue}</span>
      </div>
      <div className="relative w-full aspect-[4/2]">
        <svg viewBox="0 0 120 60" className="w-full h-full text-amber-200/70">
          <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="currentColor" strokeWidth={2} />
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={i}
              x1={15 + i * 9}
              y1={i % 2 === 0 ? 45 : 48}
              x2={15 + i * 9}
              y2={55}
              stroke="currentColor"
              strokeWidth={i % 2 === 0 ? 2 : 1}
              opacity={i % 2 === 0 ? 1 : 0.6}
            />
          ))}
          <line
            x1={60}
            y1={55}
            x2={60}
            y2={20}
            stroke={accent}
            strokeWidth={2.5}
            strokeLinecap="round"
            transform={`rotate(${angle} 60 55)`}
          />
        </svg>
        <div className="absolute inset-x-4 bottom-3 h-1 rounded-full" style={{ background: `linear-gradient(90deg, #3c2718, ${accent})` }} />
      </div>
    </div>
  );
};

const toggles = ['energy focus', 'cult signal', 'dance floor'];

export const CompactPopularityCard: React.FC<CompactPopularityCardProps> = ({ popularity }) => {
  if (typeof popularity !== 'number') {
    return null;
  }

  const mainstreamScore = Math.max(0, Math.min(100, Math.round(popularity)));
  const cultScore = Math.max(0, 100 - mainstreamScore);

  return (
    <div className="bg-gradient-to-br from-[#2c180d] via-[#1b0f07] to-[#0d0502] border border-[#5a331c] rounded-[32px] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.45)] space-y-5">
      <div className="flex items-center justify-between text-amber-100">
        <div>
          <p className="text-[11px] uppercase tracking-[0.5em] text-amber-400/70">analog telemetry</p>
          <h3 className="text-2xl font-semibold">Popularity Lab</h3>
        </div>
        <div className="text-right font-mono">
          <p className="text-sm text-amber-400/80">reading</p>
          <p className="text-3xl text-amber-50">{mainstreamScore}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <AnalogMeter label="mainstream" value={mainstreamScore} accent="#e7b86d" />
        <AnalogMeter label="cult" value={cultScore} accent="#f36d45" />
      </div>

      <div className="flex flex-wrap gap-3">
        {toggles.map((toggle, index) => (
          <button
            key={toggle}
            className={`relative px-5 py-2 rounded-2xl border border-[#d6a866]/30 bg-[#0c0502]/70 text-[11px] uppercase tracking-[0.3em] text-amber-200/80 transition-colors ${
              index === 0 ? 'shadow-[0_0_12px_rgba(255,211,129,0.2)] text-amber-100 border-amber-400/50' : ''
            }`}
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-40 transition-opacity rounded-2xl" />
            <span className="relative">{toggle}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
