import React from 'react';
import { Clock } from 'lucide-react';
import { FORECAST_MINUTES } from '../utils/helpers';

interface ForecastSliderProps {
  value: number;
  onChange: (minute: number) => void;
}

export default function ForecastSlider({ value, onChange }: ForecastSliderProps) {
  const minuteIndex = FORECAST_MINUTES.indexOf(value as typeof FORECAST_MINUTES[number]);
  const safeIndex = minuteIndex >= 0 ? minuteIndex : 0;

  const handleSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value);
    onChange(FORECAST_MINUTES[idx]);
  };

  const pct = (safeIndex / (FORECAST_MINUTES.length - 1)) * 100;

  return (
    <div className="bg-[#06101e] border-t border-[#1e3a5f] px-6 py-3.5 z-40">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Clock className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">
            FORECAST TIMELINE
          </span>
        </div>

        {/* Timeline labels */}
        <div className="flex-1 relative">
          {/* Slider */}
          <div className="relative mb-2">
            <input
              type="range"
              min={0}
              max={FORECAST_MINUTES.length - 1}
              value={safeIndex}
              onChange={handleSlide}
              className="w-full h-2.5 appearance-none bg-[#1e3a5f] rounded-full outline-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pct}%, #1e3a5f ${pct}%, #1e3a5f 100%)`,
              }}
            />
          </div>

          {/* Tick marks */}
          <div className="flex justify-between">
            {FORECAST_MINUTES.map((m) => (
              <button
                key={m}
                onClick={() => onChange(m)}
                className={`text-xs font-mono font-bold transition-all px-2 py-0.5 rounded ${
                  m === value
                    ? 'text-white bg-blue-600 border border-blue-400 shadow-md scale-110'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {m === 0 ? 'NOW' : `+${m}m`}
              </button>
            ))}
          </div>
        </div>

        {/* Current selection */}
        <div className="flex-shrink-0 bg-[#0d2137] border border-purple-500/50 px-4 py-2 rounded-md text-center min-w-[90px] shadow-lg">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">VIEWING</div>
          <div className="text-base font-extrabold font-mono text-purple-300">
            {value === 0 ? 'NOW (T+0)' : `+${value} MIN`}
          </div>
        </div>
      </div>
    </div>
  );
}
