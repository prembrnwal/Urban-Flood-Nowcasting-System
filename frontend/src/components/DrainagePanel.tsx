import React from 'react';
import { Activity } from 'lucide-react';
import type { DrainageNode } from '../types/flood.types';
import { getNodeStatusColor } from '../utils/helpers';

interface DrainagePanelProps {
  nodes: DrainageNode[];
}

export default function DrainagePanel({ nodes }: DrainagePanelProps) {
  const overloaded = nodes.filter(n => n.status === 'OVERLOADED' || n.status === 'BLOCKED').length;
  const warning = nodes.filter(n => n.status === 'WARNING').length;

  return (
    <div className="flex flex-col gap-3 p-3.5 bg-[#0a1628]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="panel-title text-sm font-bold text-slate-200">DRAINAGE NETWORK MONITORING</span>
        </div>
        <div className="flex gap-2">
          {overloaded > 0 && (
            <span className="text-xs text-red-300 bg-red-950/80 border border-red-700/60 px-2 py-0.5 rounded font-extrabold animate-pulse">
              {overloaded} OVERLOADED
            </span>
          )}
          {warning > 0 && (
            <span className="text-xs text-yellow-300 bg-yellow-950/80 border border-yellow-700/60 px-2 py-0.5 rounded font-extrabold">
              {warning} WARNING
            </span>
          )}
        </div>
      </div>

      {/* Node list */}
      <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
        {nodes.slice(0, 12).map(node => {
          const color = getNodeStatusColor(node.status);
          return (
            <div key={node.id} className="panel p-2.5 bg-[#0d2137] border border-[#1e3a5f]">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs font-mono font-bold text-slate-200">{node.id}</span>
                </div>
                <span className="text-xs font-extrabold flex-shrink-0" style={{ color }}>
                  {node.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#1e3a5f] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (node.utilization || 0))}%`,
                      background: (node.utilization || 0) > 100 ? '#ef4444' : (node.utilization || 0) > 85 ? '#eab308' : color,
                    }}
                  />
                </div>
                <span className="text-xs font-mono font-extrabold flex-shrink-0" style={{ color }}>
                  {node.utilization?.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-mono font-medium text-slate-400">
                  {node.flow?.toFixed(1)} / {node.capacity?.toFixed(1)} m³/s
                </span>
                {node.surcharging && (
                  <span className="text-xs font-extrabold text-red-400 animate-pulse bg-red-950/60 px-1.5 rounded">OVERFLOW BREACH</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
