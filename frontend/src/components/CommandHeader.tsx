import React from 'react';
import { Droplets, ShieldAlert, Wifi, Clock } from 'lucide-react';

interface CommandHeaderProps {
  systemStatus: 'OPERATIONAL' | 'WARNING' | 'CRITICAL';
  currentRainfall: number;
  activeAlerts: number;
  forecastMinute: number;
  onDemoClick: () => void;
  demoPlaying: boolean;
}

export default function CommandHeader({
  systemStatus, currentRainfall, activeAlerts, forecastMinute, onDemoClick, demoPlaying,
}: CommandHeaderProps) {
  const statusColor = systemStatus === 'OPERATIONAL' ? 'text-green-400' :
                      systemStatus === 'WARNING'     ? 'text-yellow-400' : 'text-red-400';
  const statusBg    = systemStatus === 'OPERATIONAL' ? 'bg-green-400' :
                      systemStatus === 'WARNING'     ? 'bg-yellow-400' : 'bg-red-400';

  return (
    <header className="bg-[#06101e] border-b border-[#1e3a5f] px-5 py-2.5 flex items-center justify-between z-50 relative">
      {/* Left — Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-950">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
              URBAN FLOOD NOWCASTING
              <span className="bg-blue-900/60 text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-600/40">SIH PROTOTYPE</span>
            </div>
            <div className="text-xs text-slate-300 font-mono font-medium">EMERGENCY OPERATIONS COMMAND CENTER</div>
          </div>
        </div>
      </div>

      {/* Center — Status Bar */}
      <div className="hidden md:flex items-center gap-6">
        {/* System status */}
        <div className="flex items-center gap-2 bg-[#0a1628] border border-[#1e3a5f] px-3.5 py-1.5 rounded-md">
          <div className={`w-2.5 h-2.5 rounded-full ${statusBg} ${systemStatus !== 'OPERATIONAL' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-bold font-mono tracking-wider ${statusColor}`}>{systemStatus}</span>
        </div>

        {/* Rainfall */}
        <div className="flex items-center gap-2 bg-[#0a1628] border border-[#1e3a5f] px-3.5 py-1.5 rounded-md">
          <Droplets className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-300">Rainfall:</span>
          <span className="text-base font-extrabold font-mono text-blue-300">{currentRainfall.toFixed(0)}</span>
          <span className="text-xs text-slate-400">mm/hr</span>
        </div>

        {/* Forecast minute */}
        <div className="flex items-center gap-2 bg-[#0a1628] border border-[#1e3a5f] px-3.5 py-1.5 rounded-md">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-300">Forecast:</span>
          <span className="text-base font-extrabold font-mono text-purple-300">
            {forecastMinute === 0 ? 'NOW' : `+${forecastMinute} min`}
          </span>
        </div>

        {/* Active alerts */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md border ${
          activeAlerts > 0
            ? 'bg-red-950/60 border-red-600 animate-pulse'
            : 'bg-[#0a1628] border-[#1e3a5f]'
        }`}>
          <ShieldAlert className={`w-4 h-4 ${activeAlerts > 0 ? 'text-red-400' : 'text-slate-400'}`} />
          <span className="text-xs font-semibold text-slate-300">Alerts:</span>
          <span className={`text-base font-extrabold font-mono ${activeAlerts > 0 ? 'text-red-300' : 'text-slate-200'}`}>
            {activeAlerts}
          </span>
        </div>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 bg-[#0a1628] border border-[#1e3a5f] px-2.5 py-1.5 rounded">
          <Wifi className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs font-bold text-slate-300 font-mono">LIVE FEED</span>
        </div>

        <button
          onClick={onDemoClick}
          className={`px-4 py-2 rounded-md text-xs font-bold font-mono transition-all shadow-md ${
            demoPlaying
              ? 'bg-red-600 hover:bg-red-700 text-white border border-red-500'
              : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500'
          }`}
        >
          {demoPlaying ? '⏹ STOP STORM SIMULATION' : '▶ SIMULATE FLOOD EVENT'}
        </button>
      </div>
    </header>
  );
}
