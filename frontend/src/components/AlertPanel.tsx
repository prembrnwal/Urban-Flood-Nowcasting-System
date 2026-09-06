import React from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, Zap } from 'lucide-react';
import type { FloodAlert } from '../types/flood.types';

interface AlertPanelProps {
  alerts: FloodAlert[];
  loading?: boolean;
}

const SeverityIcon = ({ severity }: { severity: string }) => {
  switch (severity) {
    case 'CRITICAL': return <Zap className="w-5 h-5 text-purple-400 flex-shrink-0" />;
    case 'HIGH':     return <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />;
    case 'WARNING':  return <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />;
    default:         return <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />;
  }
};

const severityClass = (s: string) => {
  switch (s) {
    case 'CRITICAL': return 'alert-critical';
    case 'HIGH':     return 'alert-high';
    case 'WARNING':  return 'alert-warning';
    default:         return 'alert-info';
  }
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  return `${Math.floor(min / 60)}h ago`;
}

export default function AlertPanel({ alerts, loading }: AlertPanelProps) {
  const sorted = [...alerts].sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, WARNING: 2, INFO: 3 };
    return (order[a.severity as keyof typeof order] ?? 3) - (order[b.severity as keyof typeof order] ?? 3);
  });

  return (
    <div className="flex flex-col h-full bg-[#0a1628]">
      {/* Header */}
      <div className="panel-header py-3 px-4 bg-[#0d2137] border-b border-[#1e3a5f] flex items-center gap-2">
        <Bell className="w-4 h-4 text-blue-400" />
        <span className="panel-title text-sm font-bold text-slate-200">ACTIVE EMERGENCY ALERTS</span>
        {alerts.length > 0 && (
          <span className="ml-auto text-xs font-extrabold text-white bg-red-600 px-2.5 py-0.5 rounded-full animate-pulse border border-red-400">
            {alerts.length} ALERTS
          </span>
        )}
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {loading && (
          <div className="text-center text-slate-400 text-xs py-8">Loading emergency alerts...</div>
        )}
        {!loading && sorted.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
            <Bell className="w-10 h-10 opacity-40 text-blue-400" />
            <span className="text-sm font-bold text-slate-300">No active emergency alerts</span>
            <span className="text-xs text-slate-400">System scanning drainage channels...</span>
          </div>
        )}
        {sorted.map(alert => (
          <div
            key={alert.id}
            className={`rounded-md p-3.5 shadow-sm border ${severityClass(alert.severity)}`}
          >
            <div className="flex items-start gap-2.5">
              <SeverityIcon severity={alert.severity} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-extrabold text-white truncate">{alert.title}</span>
                  <span className="text-xs font-mono font-medium text-slate-300 flex-shrink-0">
                    {alert.timestamp ? timeAgo(alert.timestamp) : ''}
                  </span>
                </div>
                <div className="text-xs font-semibold text-blue-300 mt-0.5 truncate">📍 {alert.location}</div>
                <div className="text-xs font-medium text-slate-200 mt-1.5 leading-relaxed">{alert.message}</div>
                {alert.expectedTime && (
                  <div className="text-xs text-slate-400 mt-1.5 font-medium">
                    ⏱ Peak Impact: <span className="text-slate-200 font-bold">{alert.expectedTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
