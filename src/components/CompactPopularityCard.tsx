import React, { useMemo, useState } from 'react';

interface CompactPopularityCardProps {
  popularity?: number;
}

const getTier = (score: number) => {
  if (score >= 85) return { label: 'Mainstream smash', tone: 'Critical +4dB', accent: '#fbbf24' };
  if (score >= 65) return { label: 'Playlist favorite', tone: 'Balanced 0dB', accent: '#60a5fa' };
  if (score >= 40) return { label: 'Cult favorite', tone: 'Warm -2dB', accent: '#fb923c' };
  return { label: 'Deep cut discovery', tone: 'Lo-Fi -6dB', accent: '#f472b6' };
};

const rotaryModes = [
  { label: 'Studio', bias: 0 },
  { label: 'Club', bias: 5 },
  { label: 'Indie', bias: -7 }
];

const getNeedleAngle = (value: number) => -50 + (value / 100) * 100;

export const CompactPopularityCard: React.FC<CompactPopularityCardProps> = ({ popularity }) => {
  if (typeof popularity !== 'number') {
    return null;
  }

  const [activePreset, setActivePreset] = useState(rotaryModes[0]);
  const score = Math.max(0, Math.min(100, Math.round(popularity)));
  const tier = getTier(score);

  const cultScore = useMemo(() => {
    const derived = 100 - score + activePreset.bias;
    return Math.max(5, Math.min(100, Math.round(derived)));
  }, [score, activePreset]);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-amber-900/40 bg-[#130804] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 55%)' }} />
      <div className="relative space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-amber-500">Popularity console</p>
            <h3 className="text-2xl font-semibold text-amber-50">Spotify {score}/100</h3>
            <p className="text-sm text-amber-200/70">{tier.label}</p>
          </div>
          <div className="flex gap-3">
            {rotaryModes.map((mode) => (
              <button
                key={mode.label}
                onClick={() => setActivePreset(mode)}
                className={`relative w-16 h-16 rounded-full border border-amber-900/50 bg-gradient-to-b from-[#1d1107] to-[#050302] shadow-[inset_0_-10px_18px_rgba(0,0,0,0.75),0_8px_20px_rgba(0,0,0,0.6)] text-[10px] uppercase tracking-[0.35em] text-amber-200/70 ${
                  activePreset.label === mode.label ? 'ring-2 ring-amber-400/80' : 'ring-0'
                }`}
                aria-pressed={activePreset.label === mode.label}
              >
                <span className="absolute inset-0 flex items-center justify-center">{mode.label}</span>
                <span className={`absolute top-2 left-2 w-2 h-2 rounded-full ${activePreset.label === mode.label ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-amber-900/60'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[{ label: 'Mainstream Heat', value: score }, { label: 'Cult Status', value: cultScore }].map((meter) => (
            <div key={meter.label} className="rounded-[26px] border border-amber-900/40 bg-gradient-to-b from-[#1a0f08] to-[#060201] p-5 shadow-inner">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-amber-500">
                <span>{meter.label}</span>
                <span>{meter.value}/100</span>
              </div>
              <svg viewBox="0 0 140 80" className="mt-4 w-full">
                <path d="M10 70 Q70 10 130 70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={4} />
                {[...Array(10)].map((_, idx) => {
                  const x = 10 + idx * 12.5;
                  return (
                    <line
                      key={idx}
                      x1={x}
                      y1={70}
                      x2={x}
                      y2={idx % 2 === 0 ? 58 : 63}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={idx % 2 === 0 ? 2 : 1}
                    />
                  );
                })}
                <g transform="translate(70,70)">
                  <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={-50}
                    stroke={tier.accent}
                    strokeWidth={4}
                    strokeLinecap="round"
                    transform={`rotate(${getNeedleAngle(meter.value)})`}
                  />
                  <circle r={5} fill="#0c0602" stroke="#fef3c7" strokeWidth={2} />
                </g>
              </svg>
              <p className="mt-3 text-xs font-mono text-amber-200/80">{tier.tone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
