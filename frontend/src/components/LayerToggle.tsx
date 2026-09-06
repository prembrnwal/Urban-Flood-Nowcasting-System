import React from 'react';
import { Layers } from 'lucide-react';

interface LayerToggleProps {
  layers: {
    floodRisk: boolean;
    drainageNetwork: boolean;
    infrastructure: boolean;
    floodedRoads: boolean;
    safeRoute: boolean;
    elevation: boolean;
  };
  onChange: (layer: string, val: boolean) => void;
}

const LAYER_DEFS = [
  { key: 'floodRisk',       label: 'Flood Risk',          color: '#ef4444' },
  { key: 'drainageNetwork', label: 'Drainage Network',    color: '#3b82f6' },
  { key: 'infrastructure',  label: 'Critical Infra.',     color: '#eab308' },
  { key: 'floodedRoads',    label: 'Flooded Roads',       color: '#7c3aed' },
  { key: 'safeRoute',       label: 'Safe Route',          color: '#22c55e' },
  { key: 'elevation',       label: 'DEM / Elevation',     color: '#64748b' },
] as const;

export default function LayerToggle({ layers, onChange }: LayerToggleProps) {
  return (
    <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg p-2 min-w-[180px]">
      <div className="flex items-center gap-1.5 mb-2 px-1">
        <Layers className="w-3 h-3 text-slate-400" />
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Layers</span>
      </div>
      {LAYER_DEFS.map(def => (
        <label key={def.key} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-[#1e3a5f]/30 cursor-pointer transition-colors">
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0`}
            style={{
              borderColor: def.color,
              background: layers[def.key] ? `${def.color}33` : 'transparent',
            }}
            onClick={() => onChange(def.key, !layers[def.key])}
          >
            {layers[def.key] && (
              <div className="w-2 h-2 rounded-sm" style={{ background: def.color }} />
            )}
          </div>
          <span className="text-xs text-slate-400">{def.label}</span>
        </label>
      ))}
    </div>
  );
}
