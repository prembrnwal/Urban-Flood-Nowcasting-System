import React from 'react';
import { Play, SkipForward, RotateCcw } from 'lucide-react';

const DEMO_STAGES = [
  { id: 'normal',           label: '① Normal Conditions',       rainfall: 8,  blockage: 0,  minute: 0  },
  { id: 'heavy_rain',       label: '② Heavy Rainfall Begins',   rainfall: 55, blockage: 0,  minute: 0  },
  { id: 'runoff_rising',    label: '③ Runoff Accumulation',      rainfall: 72, blockage: 10, minute: 30 },
  { id: 'drain_filling',    label: '④ Storm Drains Filling',    rainfall: 74, blockage: 20, minute: 60 },
  { id: 'drain_overloaded', label: '⑤ Drains Overloaded',      rainfall: 68, blockage: 40, minute: 90 },
  { id: 'street_flooding',  label: '⑥ Street Flooding Occurs',  rainfall: 58, blockage: 60, minute: 120 },
  { id: 'alerts_generated', label: '⑦ Emergency Alerts Active',  rainfall: 50, blockage: 65, minute: 120 },
  { id: 'routes_recalculated', label: '⑧ Safe Routes Re-calculated', rainfall: 45, blockage: 70, minute: 150 },
] as const;

interface DemoControllerProps {
  stageIndex: number;
  playing: boolean;
  onStageChange: (index: number, rainfall: number, blockage: number, minute: number) => void;
  onTogglePlay: () => void;
  onReset: () => void;
}

export default function DemoController({
  stageIndex, playing, onStageChange, onTogglePlay, onReset,
}: DemoControllerProps) {
  const current = DEMO_STAGES[stageIndex];

  return (
    <div className="flex flex-col gap-3 p-3.5 bg-[#0a1628]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          FLOOD EVENT PROGRESSION
        </span>
        <div className="flex gap-2">
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ${
              playing
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" /> {playing ? 'Pause' : 'Auto Play'}
          </button>
          <button
            onClick={onReset}
            className="px-2.5 py-1.5 rounded-md text-xs bg-[#0d2137] border border-[#1e3a5f] hover:border-slate-400 text-slate-200 flex items-center gap-1 font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Stage dots */}
      <div className="flex gap-1.5 justify-center my-1">
        {DEMO_STAGES.map((stage, i) => (
          <button
            key={stage.id}
            onClick={() => onStageChange(i, stage.rainfall, stage.blockage, stage.minute)}
            className={`w-3.5 h-3.5 rounded-full border transition-all ${
              i === stageIndex
                ? 'bg-blue-500 border-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.9)] scale-125'
                : i < stageIndex
                  ? 'bg-green-500 border-green-400'
                  : 'bg-transparent border-slate-600'
            }`}
            title={stage.label}
          />
        ))}
      </div>

      {/* Current stage */}
      {current && (
        <div className="panel p-3 text-center bg-[#0d2137] border border-blue-500/50 shadow-md">
          <div className="text-sm font-extrabold text-white">{current.label}</div>
          <div className="flex justify-center gap-3 mt-1.5 font-bold font-mono">
            <span className="text-xs text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">🌧 {current.rainfall} mm/hr</span>
            <span className="text-xs text-yellow-300 bg-yellow-950/60 px-2 py-0.5 rounded border border-yellow-800">🔧 {current.blockage}% blocked</span>
            <span className="text-xs text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">⏱ +{current.minute}m</span>
          </div>
        </div>
      )}

      {/* Stage list */}
      <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
        {DEMO_STAGES.map((stage, i) => (
          <button
            key={stage.id}
            onClick={() => onStageChange(i, stage.rainfall, stage.blockage, stage.minute)}
            className={`text-left px-3 py-2 rounded-md text-xs font-semibold transition-all ${
              i === stageIndex
                ? 'bg-blue-600/30 border border-blue-500 text-white font-extrabold shadow-sm'
                : i < stageIndex
                  ? 'text-slate-400 line-through bg-[#0d2137]/40'
                  : 'text-slate-300 hover:bg-[#1e3a5f]/40'
            }`}
          >
            {stage.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { DEMO_STAGES };
