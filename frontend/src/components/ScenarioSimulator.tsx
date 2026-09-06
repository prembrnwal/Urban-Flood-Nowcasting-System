import React, { useState } from 'react';
import { Sliders, Play, RotateCcw, Loader } from 'lucide-react';
import type { SimulationRequest, SimulationResult } from '../types/flood.types';
import { formatPopulation } from '../utils/helpers';

interface ScenarioSimulatorProps {
  onRun: (req: SimulationRequest) => Promise<SimulationResult>;
  onReset: () => void;
  result: SimulationResult | null;
}

export default function ScenarioSimulator({ onRun, onReset, result }: ScenarioSimulatorProps) {
  const [rainfall, setRainfall] = useState(60);
  const [duration, setDuration] = useState(60);
  const [blockage, setBlockage] = useState(20);
  const [imperviousness, setImperviousness] = useState(80);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      await onRun({ rainfallIntensity: rainfall, rainfallDuration: duration, drainageBlockage: blockage, imperviousness });
    } finally {
      setLoading(false);
    }
  };

  const Slider = ({ label, value, min, max, unit, onChange, warningAt }: {
    label: string; value: number; min: number; max: number; unit: string;
    onChange: (v: number) => void; warningAt?: number;
  }) => (
    <div className="flex flex-col gap-1.5 bg-[#0d2137] p-2.5 rounded-md border border-[#1e3a5f]">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</span>
        <span className={`text-sm font-mono font-extrabold ${warningAt && value >= warningAt ? 'text-red-400' : 'text-blue-300'}`}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full h-2 appearance-none bg-[#1e3a5f] rounded-full cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${warningAt && value >= warningAt ? '#ef4444' : '#3b82f6'} 0%,
            ${warningAt && value >= warningAt ? '#ef4444' : '#3b82f6'} ${((value - min) / (max - min)) * 100}%,
            #1e3a5f ${((value - min) / (max - min)) * 100}%, #1e3a5f 100%)`,
        }}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-3.5 p-3.5 bg-[#0a1628]">
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-blue-400" />
        <span className="panel-title text-sm font-bold text-slate-200">INTERACTIVE WHAT-IF SIMULATOR</span>
      </div>

      <div className="text-xs font-medium text-slate-300 leading-relaxed bg-[#0d2137] p-2.5 rounded border border-[#1e3a5f]">
        Adjust rainfall intensity, storm duration, and drain blockage to evaluate urban inundation in real-time.
      </div>

      <div className="flex flex-col gap-2.5">
        <Slider label="Rainfall Intensity" value={rainfall} min={0} max={200} unit=" mm/hr" onChange={setRainfall} warningAt={80} />
        <Slider label="Storm Duration" value={duration} min={15} max={180} unit=" min" onChange={setDuration} />
        <Slider label="Drain Blockage %" value={blockage} min={0} max={95} unit="%" onChange={setBlockage} warningAt={60} />
        <Slider label="Impervious Surface %" value={imperviousness} min={10} max={100} unit="%" onChange={setImperviousness} warningAt={90} />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleRun}
          disabled={loading}
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-md flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {loading ? 'Simulating…' : 'RUN SCENARIO SIMULATION'}
        </button>
        <button
          onClick={onReset}
          className="px-3.5 py-2.5 bg-[#0d2137] border border-[#1e3a5f] hover:border-slate-400 text-slate-200 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="panel p-3.5 flex flex-col gap-2.5 bg-[#0d2137] border border-blue-500/40">
          <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">SIMULATION IMPACT RESULTS</div>
          {[
            { label: 'Max Flood Depth', value: `${result.maximumDepth?.toFixed(1)} cm`, color: result.maximumDepth > 60 ? 'text-purple-400' : result.maximumDepth > 30 ? 'text-red-400' : 'text-orange-400' },
            { label: 'Flooded Streets', value: result.affectedRoads, color: 'text-orange-400' },
            { label: 'Critical Risk Zones', value: result.criticalZones, color: result.criticalZones > 5 ? 'text-red-400' : 'text-yellow-400' },
            { label: 'Drain Overflows', value: result.drainOverflows, color: 'text-yellow-400' },
            { label: 'Population at Risk', value: formatPopulation(result.populationAtRisk || 0), color: 'text-cyan-400' },
            { label: 'Warning Lead Time', value: `${result.warningLeadTime} min`, color: result.warningLeadTime < 20 ? 'text-red-400' : 'text-green-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-[#1e3a5f] last:border-none">
              <span className="text-xs font-semibold text-slate-300">{item.label}</span>
              <span className={`text-sm font-extrabold font-mono ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
