import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import type { FloodZone, RainfallData } from '../types/flood.types';
import { BarChart2 } from 'lucide-react';

interface AnalyticsChartsProps {
  floodZones: FloodZone[];
  rainfallData: RainfallData | null;
}

const RISK_COLORS: Record<string, string> = {
  SAFE: '#22c55e', LOW: '#eab308', MODERATE: '#f97316', HIGH: '#ef4444', CRITICAL: '#7c3aed',
};

export default function AnalyticsCharts({ floodZones, rainfallData }: AnalyticsChartsProps) {
  // ── Rainfall forecast data
  const rainfallChartData = rainfallData?.forecast?.map(fp => ({
    name: fp.minute === 0 ? 'Now' : `+${fp.minute}m`,
    rainfall: fp.rainfall,
    uncertainty: fp.uncertainty,
    upper: fp.rainfall + (fp.uncertainty || 0),
    lower: Math.max(0, fp.rainfall - (fp.uncertainty || 0)),
  })) ?? [];

  // ── Risk distribution
  const riskDist = ['SAFE', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map(risk => ({
    name: risk,
    count: floodZones.filter(z => z.riskLevel === risk).length,
    fill: RISK_COLORS[risk],
  }));

  // ── Top flooded streets
  const topFlooded = [...floodZones]
    .filter(z => z.waterDepthCm > 0)
    .sort((a, b) => b.waterDepthCm - a.waterDepthCm)
    .slice(0, 6)
    .map(z => ({
      name: z.streetName.length > 14 ? z.streetName.slice(0, 12) + '…' : z.streetName,
      depth: z.waterDepthCm,
      fill: RISK_COLORS[z.riskLevel] || '#64748b',
    }));

  // ── Drain utilization for top overloaded
  const drainData = [...floodZones]
    .filter(z => z.drainUtilization > 0)
    .sort((a, b) => b.drainUtilization - a.drainUtilization)
    .slice(0, 6)
    .map(z => ({
      name: z.streetName.length > 14 ? z.streetName.slice(0, 12) + '…' : z.streetName,
      util: Math.min(z.drainUtilization, 200),
      fill: z.drainUtilization > 100 ? '#ef4444' : z.drainUtilization > 85 ? '#eab308' : '#22c55e',
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#0d2137] border border-blue-500/50 rounded-md p-2.5 text-xs shadow-xl">
        <p className="text-slate-200 font-bold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.fill }} className="font-mono">
            {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-3.5 bg-[#0a1628]">
      <div className="flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-blue-400" />
        <span className="panel-title text-sm font-bold text-slate-200">HYDRO-ANALYTICS & RISK METRICS</span>
      </div>

      {/* Rainfall Forecast Chart */}
      <div className="panel p-3.5 bg-[#0d2137]">
        <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          Rainfall Nowcast Profile (mm/hr)
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={rainfallChartData} margin={{ top: 4, right: 4, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#cbd5e1', fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 11, fill: '#cbd5e1', fontWeight: 600 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="#1e3a5f" fillOpacity={0.4} name="Upper Bound" />
            <Area type="monotone" dataKey="rainfall" stroke="#3b82f6" fill="rgba(59,130,246,0.3)" strokeWidth={2.5} name="Rainfall" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#0a1628" fillOpacity={1} name="Lower Bound" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Distribution */}
      <div className="panel p-3.5 bg-[#0d2137]">
        <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          Street Risk Level Breakdown
        </div>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={riskDist} margin={{ top: 4, right: 4, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 11, fill: '#cbd5e1', fontWeight: 600 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Streets">
              {riskDist.map((entry, index) => (
                <rect key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Flooded Streets */}
      {topFlooded.length > 0 && (
        <div className="panel p-3.5 bg-[#0d2137]">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            Critical Street Inundation (cm)
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={topFlooded} layout="vertical" margin={{ top: 0, right: 10, left: 15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 600 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 600 }} width={75} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="depth" name="Depth cm" radius={[0, 4, 4, 0]}>
                {topFlooded.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Drain Utilization */}
      {drainData.length > 0 && (
        <div className="panel p-3.5 bg-[#0d2137]">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            Top Drain Trunk Capacity Utilization (%)
          </div>
          <div className="flex flex-col gap-2">
            {drainData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 w-[70px] flex-shrink-0 truncate">{d.name}</span>
                <div className="flex-1 h-2.5 bg-[#1e3a5f] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, d.util / 2)}%`, background: d.fill }}
                  />
                </div>
                <span className="text-xs font-mono font-extrabold flex-shrink-0" style={{ color: d.fill }}>
                  {d.util.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
