import React from 'react';
import { MapPin, Waves, Activity, AlertTriangle, Users, Timer } from 'lucide-react';
import type { FloodZone } from '../types/flood.types';
import { formatPopulation } from '../utils/helpers';

interface KpiPanelProps {
  floodZones: FloodZone[];
  currentRainfall: number;
}

export default function KpiPanel({ floodZones, currentRainfall }: KpiPanelProps) {
  const flooded = floodZones.filter(z => z.waterDepthCm > 5).length;
  const critical = floodZones.filter(z => z.riskLevel === 'HIGH' || z.riskLevel === 'CRITICAL').length;
  const maxDepth = Math.max(0, ...floodZones.map(z => z.waterDepthCm || 0));
  const drainOverflows = floodZones.filter(z => (z.drainUtilization || 0) > 100).length;
  const popAtRisk = floodZones.filter(z => z.waterDepthCm > 5).length * 450;
  const avgWarning = Math.max(10, 60 - Math.floor(currentRainfall / 3));

  const kpis = [
    {
      icon: <MapPin className="w-4.5 h-4.5 text-orange-400" />,
      label: 'Flooded Streets',
      value: flooded,
      unit: '',
      color: flooded > 10 ? 'text-red-400' : flooded > 5 ? 'text-orange-400' : 'text-green-400',
    },
    {
      icon: <AlertTriangle className="w-4.5 h-4.5 text-red-400" />,
      label: 'Critical Risk Zones',
      value: critical,
      unit: '',
      color: critical > 5 ? 'text-purple-400' : critical > 2 ? 'text-red-400' : 'text-green-400',
    },
    {
      icon: <Waves className="w-4.5 h-4.5 text-blue-400" />,
      label: 'Max Water Depth',
      value: maxDepth.toFixed(1),
      unit: 'cm',
      color: maxDepth > 60 ? 'text-purple-400' : maxDepth > 30 ? 'text-red-400' : maxDepth > 15 ? 'text-orange-400' : 'text-green-400',
    },
    {
      icon: <Activity className="w-4.5 h-4.5 text-yellow-400" />,
      label: 'Drain Overflows',
      value: drainOverflows,
      unit: '',
      color: drainOverflows > 5 ? 'text-red-400' : drainOverflows > 2 ? 'text-yellow-400' : 'text-green-400',
    },
    {
      icon: <Users className="w-4.5 h-4.5 text-cyan-400" />,
      label: 'Population at Risk',
      value: formatPopulation(popAtRisk),
      unit: '',
      color: popAtRisk > 10000 ? 'text-red-400' : popAtRisk > 5000 ? 'text-orange-400' : 'text-cyan-400',
    },
    {
      icon: <Timer className="w-4.5 h-4.5 text-purple-400" />,
      label: 'Warning Lead Time',
      value: avgWarning,
      unit: 'min',
      color: avgWarning < 20 ? 'text-red-400' : avgWarning < 35 ? 'text-yellow-400' : 'text-green-400',
    },
  ];

  return (
    <div className="flex flex-col gap-2.5 p-3">
      <div className="panel-title flex items-center gap-2 mb-1 text-sm font-bold text-slate-200">
        <Activity className="w-4 h-4 text-blue-400" /> KEY SYSTEM METRICS
      </div>
      {kpis.map((kpi, i) => (
        <div key={i} className="kpi-card !p-3 bg-[#0d2137] border border-[#1e3a5f] rounded-md shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {kpi.icon}
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">{kpi.label}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-2xl font-extrabold font-mono ${kpi.color}`}>{kpi.value}</span>
            {kpi.unit && <span className="text-xs font-semibold text-slate-400">{kpi.unit}</span>}
          </div>
        </div>
      ))}

      {/* Rainfall indicator */}
      <div className="panel p-3.5 mt-1 bg-[#0d2137]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Rainfall Intensity</span>
          <span className="text-base font-extrabold font-mono text-blue-300">{currentRainfall.toFixed(0)} mm/hr</span>
        </div>
        <div className="h-2.5 bg-[#1e3a5f] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (currentRainfall / 120) * 100)}%`,
              background: currentRainfall > 80 ? '#ef4444' : currentRainfall > 50 ? '#f97316' : currentRainfall > 25 ? '#eab308' : '#3b82f6',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5 font-medium text-xs text-slate-400">
          <span>0</span>
          <span>Light</span>
          <span>Heavy</span>
          <span>Extreme</span>
        </div>
      </div>
    </div>
  );
}
