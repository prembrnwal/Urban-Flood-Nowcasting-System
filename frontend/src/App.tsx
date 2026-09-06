import React, { useState, useEffect, useCallback, useRef } from 'react';
import FloodMap from './map/FloodMap';
import CommandHeader from './components/CommandHeader';
import KpiPanel from './components/KpiPanel';
import AlertPanel from './components/AlertPanel';
import AnalyticsCharts from './charts/AnalyticsCharts';
import RoutingPanel from './components/RoutingPanel';
import ScenarioSimulator from './components/ScenarioSimulator';
import DrainagePanel from './components/DrainagePanel';
import ForecastSlider from './components/ForecastSlider';
import LayerToggle from './components/LayerToggle';
import DemoController, { DEMO_STAGES } from './components/DemoController';

import { floodApi } from './services/floodApi';
import { rainfallApi } from './services/rainfallApi';
import { drainageApi } from './services/drainageApi';
import { alertApi, infraApi } from './services/alertApi';
import { simulationApi } from './services/simulationApi';
import { routingApi } from './services/routingApi';

import type {
  FloodZone, RainfallData, DrainageNode, FloodAlert,
  CriticalInfrastructure, RouteResponse, SimulationRequest,
  SimulationResult, RouteRequest,
} from './types/flood.types';

import { BarChart2, Navigation, Layers, Activity, Play } from 'lucide-react';

// ── Left sidebar tab options
type LeftTab = 'kpi' | 'drainage' | 'demo';
// ── Right sidebar tab options
type RightTab = 'alerts' | 'analytics' | 'routing' | 'simulation';

export default function App() {
  // ── Data state
  const [floodZones, setFloodZones] = useState<FloodZone[]>([]);
  const [rainfallData, setRainfallData] = useState<RainfallData | null>(null);
  const [drainageNodes, setDrainageNodes] = useState<DrainageNode[]>([]);
  const [alerts, setAlerts] = useState<FloodAlert[]>([]);
  const [infrastructure, setInfrastructure] = useState<CriticalInfrastructure[]>([]);
  const [safeRoute, setSafeRoute] = useState<RouteResponse | null>(null);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  // ── UI state
  const [forecastMinute, setForecastMinute] = useState(0);
  const [leftTab, setLeftTab] = useState<LeftTab>('kpi');
  const [rightTab, setRightTab] = useState<RightTab>('alerts');
  const [loading, setLoading] = useState(true);
  const [currentRainfall, setCurrentRainfall] = useState(0);
  const [selectedStreet, setSelectedStreet] = useState<FloodZone | null>(null);

  // ── Sidebar width & drag states
  const [leftWidth, setLeftWidth] = useState(288);
  const [rightWidth, setRightWidth] = useState(350);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  // ── Drag handlers for left sidebar
  const handleLeftMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingLeft(true);
  };

  // ── Drag handlers for right sidebar
  const handleRightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingRight(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft) {
        const newW = Math.max(180, Math.min(650, e.clientX));
        setLeftWidth(newW);
      }
      if (isDraggingRight) {
        const newW = Math.max(220, Math.min(750, window.innerWidth - e.clientX));
        setRightWidth(newW);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    };

    if (isDraggingLeft || isDraggingRight) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight]);

  // ── Map layers
  const [layers, setLayers] = useState({
    floodRisk: true, drainageNetwork: true, infrastructure: true,
    floodedRoads: true, safeRoute: true, elevation: false,
  });

  // ── Demo state
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [demoStageIndex, setDemoStageIndex] = useState(0);
  const demoTimerRef = useRef<number | null>(null);

  // ── System status
  const systemStatus = alerts.some(a => a.severity === 'CRITICAL') ? 'CRITICAL'
                     : alerts.some(a => a.severity === 'HIGH')     ? 'WARNING'
                     : 'OPERATIONAL';

  // ── Fetch all data
  const fetchData = useCallback(async (minute: number) => {
    try {
      const [zones, rainfall, nodes, alertList, infra] = await Promise.allSettled([
        floodApi.getZones(minute),
        rainfallApi.getForecast(),
        drainageApi.getNodes(),
        alertApi.getAlerts(),
        infraApi.getAll(),
      ]);

      if (zones.status === 'fulfilled') setFloodZones(zones.value);
      if (rainfall.status === 'fulfilled') {
        setRainfallData(rainfall.value);
        setCurrentRainfall(rainfall.value.current);
      }
      if (nodes.status === 'fulfilled') setDrainageNodes(nodes.value);
      if (alertList.status === 'fulfilled') setAlerts(alertList.value);
      if (infra.status === 'fulfilled') setInfrastructure(infra.value);
    } catch (e) {
      console.error('Data fetch failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Initial load + poll every 30s
  useEffect(() => {
    fetchData(forecastMinute);
    const interval = setInterval(() => fetchData(forecastMinute), 30000);
    return () => clearInterval(interval);
  }, [fetchData, forecastMinute]);

  // ── Forecast minute change
  const handleForecastChange = useCallback((minute: number) => {
    setForecastMinute(minute);
    fetchData(minute);
  }, [fetchData]);

  // ── Demo auto-play
  useEffect(() => {
    if (!demoPlaying) { if (demoTimerRef.current) clearInterval(demoTimerRef.current); return; }
    demoTimerRef.current = window.setInterval(() => {
      setDemoStageIndex(prev => {
        const next = prev + 1;
        if (next >= DEMO_STAGES.length) { setDemoPlaying(false); return prev; }
        const stage = DEMO_STAGES[next];
        applyDemoStage(stage.rainfall, stage.blockage, stage.minute);
        return next;
      });
    }, 3000);
    return () => { if (demoTimerRef.current) clearInterval(demoTimerRef.current); };
  }, [demoPlaying]);

  const applyDemoStage = useCallback(async (rainfall: number, blockage: number, minute: number) => {
    setCurrentRainfall(rainfall);
    setForecastMinute(minute);
    // Ensure flood risk, flooded roads, and safe route layers are enabled so circles & polylines display
    setLayers(prev => ({
      ...prev,
      floodRisk: true,
      floodedRoads: true,
      safeRoute: true,
    }));
    try {
      await rainfallApi.setIntensity(rainfall);
      await floodApi.updateParams(blockage, 85);
      if (minute >= 120) {
        const route = await routingApi.findSafeRoute({
          source: 'Slum Area Road',
          destination: 'Hilltop Road',
          vehicleType: 'NORMAL',
          forecastMinute: minute,
        });
        setSafeRoute(route);
      }
    } catch { /* backend offline — demo still shows in UI */ }
    fetchData(minute);
  }, [fetchData]);

  const handleDemoStageChange = useCallback((index: number, rainfall: number, blockage: number, minute: number) => {
    setDemoStageIndex(index);
    applyDemoStage(rainfall, blockage, minute);
  }, [applyDemoStage]);

  const handleDemoButton = () => {
    if (demoPlaying) {
      setDemoPlaying(false);
    } else {
      setDemoStageIndex(0);
      setDemoPlaying(true);
      const stage = DEMO_STAGES[0];
      applyDemoStage(stage.rainfall, stage.blockage, stage.minute);
    }
  };

  // ── Handlers
  const handleRoute = useCallback(async (req: RouteRequest): Promise<RouteResponse> => {
    const route = await routingApi.findSafeRoute(req);
    setSafeRoute(route);
    return route;
  }, []);

  const handleSimulation = useCallback(async (req: SimulationRequest): Promise<SimulationResult> => {
    const result = await simulationApi.run(req);
    setSimResult(result);
    setCurrentRainfall(req.rainfallIntensity);
    fetchData(forecastMinute);
    return result;
  }, [fetchData, forecastMinute]);

  const handleReset = useCallback(async () => {
    await simulationApi.reset();
    setSimResult(null);
    setSafeRoute(null);
    setDemoPlaying(false);
    setDemoStageIndex(0);
    setForecastMinute(0);
    fetchData(0);
  }, [fetchData]);

  const handleLayerChange = (layer: string, val: boolean) => {
    setLayers(prev => ({ ...prev, [layer]: val }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#060d1a]">
      {/* ── Top Header ── */}
      <CommandHeader
        systemStatus={systemStatus}
        currentRainfall={currentRainfall}
        activeAlerts={alerts.length}
        forecastMinute={forecastMinute}
        onDemoClick={handleDemoButton}
        demoPlaying={demoPlaying}
      />

      {/* ── Main 3-column layout ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ══ LEFT SIDEBAR ══ */}
        <div
          style={{ width: leftCollapsed ? 0 : `${leftWidth}px` }}
          className={`bg-[#060d1a] flex flex-col overflow-hidden flex-shrink-0 ${
            leftCollapsed ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          {/* Header with Tabs + Collapse control */}
          <div className="flex items-center justify-between px-2 py-2 bg-[#0d2137] border-b border-[#1e3a5f]">
            <div className="flex items-center gap-1">
              {([
                { id: 'kpi', label: 'KPIs', icon: <BarChart2 className="w-3.5 h-3.5" /> },
                { id: 'drainage', label: 'Drain', icon: <Activity className="w-3.5 h-3.5" /> },
                { id: 'demo', label: 'Demo', icon: <Play className="w-3.5 h-3.5" /> },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setLeftTab(tab.id)}
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all flex items-center gap-1 ${
                    leftTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Collapse button */}
            <button
              onClick={() => setLeftCollapsed(true)}
              title="Hide Left Panel"
              className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors text-xs font-bold"
            >
              ◀
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {leftTab === 'kpi'      && <KpiPanel floodZones={floodZones} currentRainfall={currentRainfall} />}
            {leftTab === 'drainage' && <DrainagePanel nodes={drainageNodes} />}
            {leftTab === 'demo'     && (
              <DemoController
                stageIndex={demoStageIndex}
                playing={demoPlaying}
                onStageChange={handleDemoStageChange}
                onTogglePlay={() => setDemoPlaying(p => !p)}
                onReset={handleReset}
              />
            )}
          </div>
        </div>

        {/* ══ LEFT RESIZER HANDLE (Draggable border line) ══ */}
        {!leftCollapsed && (
          <div
            onMouseDown={handleLeftMouseDown}
            title="Drag left/right to resize sidebar width"
            className={`w-1.5 hover:w-2 cursor-col-resize group relative flex items-center justify-center flex-shrink-0 transition-all z-20 ${
              isDraggingLeft ? 'bg-blue-500 shadow-[0_0_12px_#3b82f6]' : 'bg-[#1e3a5f] hover:bg-blue-500/80'
            }`}
          >
            <div className="w-[2px] h-full bg-blue-500/50 group-hover:bg-blue-400 group-hover:shadow-[0_0_8px_#3b82f6]" />
            <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-[#0d2137] border border-blue-400 text-blue-300 rounded px-1 text-[10px] font-mono shadow-lg transition-opacity pointer-events-none select-none">
              ↔
            </div>
          </div>
        )}

        {/* ══ FLOATING EXPAND HANDLE (Left) ══ */}
        {leftCollapsed && (
          <button
            onClick={() => setLeftCollapsed(false)}
            title="Open Left Panel"
            className="absolute top-4 left-3 z-[600] bg-[#0d2137] text-blue-400 hover:text-white border border-[#2563eb] rounded-r-lg px-3 py-2.5 shadow-2xl flex items-center gap-1.5 text-xs font-bold transition-all hover:bg-blue-900"
          >
            ▶ <span className="uppercase tracking-wider text-[11px]">Left Panel</span>
          </button>
        )}

        {/* ══ CENTER — MAP ══ */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Layer toggles overlay */}
          <div className="absolute top-3 right-3 z-[500]">
            <LayerToggle layers={layers} onChange={handleLayerChange} />
          </div>

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-[600] flex items-center justify-center bg-[#06101e]/80">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-mono">Loading flood data…</span>
              </div>
            </div>
          )}

          {/* Map */}
          <div className="flex-1">
            <FloodMap
              floodZones={floodZones}
              drainageNodes={drainageNodes}
              infrastructure={infrastructure}
              safeRoute={safeRoute}
              onStreetClick={zone => { setSelectedStreet(zone); setRightTab('analytics'); setRightCollapsed(false); }}
              onNodeClick={node => { setLeftTab('drainage'); setLeftCollapsed(false); }}
              layers={layers}
              forecastMinute={forecastMinute}
            />
          </div>

          {/* Forecast slider */}
          <ForecastSlider value={forecastMinute} onChange={handleForecastChange} />

          {/* Legend */}
          <div className="absolute bottom-14 left-3 z-[500] bg-[#0a1628]/90 border border-[#1e3a5f] rounded-lg p-2.5 shadow-xl">
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">Flood Risk</div>
            {[
              { label: 'Safe',     color: '#22c55e' },
              { label: 'Low',      color: '#eab308' },
              { label: 'Moderate', color: '#f97316' },
              { label: 'High',     color: '#ef4444' },
              { label: 'Critical', color: '#7c3aed' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 mb-1">
                <div className="w-3.5 h-2.5 rounded-sm shadow" style={{ background: item.color + '90', border: `1px solid ${item.color}` }} />
                <span className="text-xs font-semibold text-slate-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ FLOATING EXPAND HANDLE (Right) ══ */}
        {rightCollapsed && (
          <button
            onClick={() => setRightCollapsed(false)}
            title="Open Right Panel"
            className="absolute top-4 right-3 z-[600] bg-[#0d2137] text-blue-400 hover:text-white border border-[#2563eb] rounded-l-lg px-3 py-2.5 shadow-2xl flex items-center gap-1.5 text-xs font-bold transition-all hover:bg-blue-900"
          >
            <span className="uppercase tracking-wider text-[11px]">Analytics</span> ◀
          </button>
        )}

        {/* ══ RIGHT RESIZER HANDLE (Draggable border line) ══ */}
        {!rightCollapsed && (
          <div
            onMouseDown={handleRightMouseDown}
            title="Drag left/right to resize sidebar width"
            className={`w-1.5 hover:w-2 cursor-col-resize group relative flex items-center justify-center flex-shrink-0 transition-all z-20 ${
              isDraggingRight ? 'bg-blue-500 shadow-[0_0_12px_#3b82f6]' : 'bg-[#1e3a5f] hover:bg-blue-500/80'
            }`}
          >
            <div className="w-[2px] h-full bg-blue-500/50 group-hover:bg-blue-400 group-hover:shadow-[0_0_8px_#3b82f6]" />
            <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-[#0d2137] border border-blue-400 text-blue-300 rounded px-1 text-[10px] font-mono shadow-lg transition-opacity pointer-events-none select-none">
              ↔
            </div>
          </div>
        )}

        {/* ══ RIGHT SIDEBAR ══ */}
        <div
          style={{ width: rightCollapsed ? 0 : `${rightWidth}px` }}
          className={`bg-[#060d1a] flex flex-col overflow-hidden flex-shrink-0 ${
            rightCollapsed ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          {/* Header with Tabs + Collapse control */}
          <div className="flex items-center justify-between px-2 py-2 bg-[#0d2137] border-b border-[#1e3a5f]">
            <div className="flex items-center gap-1 overflow-x-auto">
              {([
                { id: 'alerts',     label: '🔔 Alerts'    },
                { id: 'analytics',  label: '📈 Charts'    },
                { id: 'routing',    label: '🗺️ Routes'    },
                { id: 'simulation', label: '⚗️ Sim'       },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setRightTab(tab.id)}
                  title={tab.label}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all whitespace-nowrap ${
                    rightTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Collapse button */}
            <button
              onClick={() => setRightCollapsed(true)}
              title="Hide Right Panel"
              className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors text-xs font-bold"
            >
              ▶
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {rightTab === 'alerts'    && <AlertPanel alerts={alerts} loading={loading} />}
            {rightTab === 'analytics' && <AnalyticsCharts floodZones={floodZones} rainfallData={rainfallData} />}
            {rightTab === 'routing'   && (
              <RoutingPanel
                onRoute={handleRoute}
                route={safeRoute}
                forecastMinute={forecastMinute}
              />
            )}
            {rightTab === 'simulation' && (
              <ScenarioSimulator
                onRun={handleSimulation}
                onReset={handleReset}
                result={simResult}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
