import React, { useState } from 'react';
import { Navigation, Search, RotateCcw, Loader, ShieldCheck } from 'lucide-react';
import type { RouteRequest, RouteResponse } from '../types/flood.types';
import { getRiskColor, KNOWN_LOCATIONS } from '../utils/helpers';

interface RoutingPanelProps {
  onRoute: (request: RouteRequest) => Promise<RouteResponse>;
  route: RouteResponse | null;
  forecastMinute: number;
}

export default function RoutingPanel({ onRoute, route, forecastMinute }: RoutingPanelProps) {
  const [source, setSource] = useState('Sector 17 Main');
  const [destination, setDestination] = useState('City General Hospital');
  const [vehicleType, setVehicleType] = useState<'NORMAL' | 'EMERGENCY'>('NORMAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoute = async () => {
    if (!source.trim() || !destination.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onRoute({ source, destination, vehicleType, forecastMinute });
    } catch {
      setError('Could not compute route. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const exposureColor = route ? getRiskColor(route.floodExposure as any) : '#64748b';

  return (
    <div className="flex flex-col gap-3.5 p-3.5 bg-[#0a1628]">
      <div className="flex items-center gap-2">
        <Navigation className="w-4 h-4 text-blue-400" />
        <span className="panel-title text-sm font-bold text-slate-200">FLOOD-SAFE ROUTING ENGINE</span>
      </div>

      {/* Vehicle type */}
      <div className="flex gap-2">
        {(['NORMAL', 'EMERGENCY'] as const).map(v => (
          <button
            key={v}
            onClick={() => setVehicleType(v)}
            className={`flex-1 py-2 text-xs font-bold rounded-md border transition-all ${
              vehicleType === v
                ? v === 'EMERGENCY'
                  ? 'bg-red-600/40 border-red-500 text-white shadow-md'
                  : 'bg-blue-600/40 border-blue-500 text-white shadow-md'
                : 'bg-[#0d2137] border-[#1e3a5f] text-slate-400 hover:border-slate-400'
            }`}
          >
            {v === 'EMERGENCY' ? '🚑 Emergency Vehicle' : '🚗 Civilian Vehicle'}
          </button>
        ))}
      </div>

      {/* Source & Destination */}
      <div className="flex flex-col gap-2.5">
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Origin Location</label>
          <select
            value={source}
            onChange={e => setSource(e.target.value)}
            className="w-full bg-[#0d2137] border border-[#1e3a5f] text-slate-100 font-medium text-xs rounded-md px-3 py-2 outline-none focus:border-blue-500"
          >
            {KNOWN_LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Destination Location</label>
          <select
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="w-full bg-[#0d2137] border border-[#1e3a5f] text-slate-100 font-medium text-xs rounded-md px-3 py-2 outline-none focus:border-blue-500"
          >
            {KNOWN_LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Find route button */}
      <button
        onClick={handleRoute}
        disabled={loading}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-colors shadow-md"
      >
        {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
        {loading ? 'Computing Safe Route…' : 'COMPUTE FLOOD-SAFE ROUTE'}
      </button>

      {error && (
        <div className="text-xs text-red-400 font-medium text-center py-1">{error}</div>
      )}

      {/* Route result */}
      {route && (
        <div className="panel p-3.5 flex flex-col gap-2.5 bg-[#0d2137] border border-blue-500/40">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 pb-2.5 border-b border-[#1e3a5f]">
            <div className="text-center">
              <div className="text-sm font-extrabold font-mono text-white">{route.distanceKm} km</div>
              <div className="text-xs font-semibold text-slate-400">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-extrabold font-mono text-white">{route.estimatedTimeMinutes} min</div>
              <div className="text-xs font-semibold text-slate-400">Est. Time</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-extrabold font-mono" style={{ color: exposureColor }}>
                {route.floodExposure}
              </div>
              <div className="text-xs font-semibold text-slate-400">Exposure</div>
            </div>
          </div>

          {route.avoidedFloodedRoads > 0 && (
            <div className="text-xs font-bold text-green-400 flex items-center gap-1.5 bg-green-950/50 p-2 rounded border border-green-700/50">
              <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
              Rerouted to avoid {route.avoidedFloodedRoads} flooded road segments!
            </div>
          )}

          {/* Route stops */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Turn-By-Turn Waypoints ({route.route?.length} stops)</div>
            <div className="max-h-36 overflow-y-auto flex flex-col gap-1.5 pr-1">
              {route.route?.map((stop, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    i === 0 ? 'bg-blue-400' : i === route.route.length - 1 ? 'bg-green-400' : 'bg-slate-500'
                  }`} />
                  <span className={
                    i === 0 ? 'text-blue-300 font-bold' : i === route.route.length - 1 ? 'text-green-300 font-bold' : 'text-slate-200'
                  }>{stop}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
