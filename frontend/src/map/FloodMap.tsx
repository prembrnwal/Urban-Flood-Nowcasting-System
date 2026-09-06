import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FloodZone, DrainageNode, CriticalInfrastructure, RouteResponse } from '../types/flood.types';
import { getRiskColor, getRiskFill, getNodeStatusColor } from '../utils/helpers';

interface FloodMapProps {
  floodZones: FloodZone[];
  drainageNodes: DrainageNode[];
  infrastructure: CriticalInfrastructure[];
  safeRoute: RouteResponse | null;
  onStreetClick: (zone: FloodZone) => void;
  onNodeClick: (node: DrainageNode) => void;
  layers: {
    floodRisk: boolean;
    drainageNetwork: boolean;
    infrastructure: boolean;
    floodedRoads: boolean;
    safeRoute: boolean;
    elevation: boolean;
  };
  forecastMinute: number;
}

const INFRA_ICONS: Record<string, string> = {
  HOSPITAL:        '🏥',
  FIRE_STATION:    '🚒',
  POLICE_STATION:  '👮',
  RAILWAY_STATION: '🚉',
  METRO_STATION:   '🚇',
  SCHOOL:          '🏫',
  SHELTER:         '⛺',
  SAFE_POINT:      '🛡️',
  RELIEF_CAMP:     '⛺',
  HIGH_GROUND:     '⛰️',
};

export default function FloodMap({
  floodZones, drainageNodes, infrastructure, safeRoute,
  onStreetClick, onNodeClick, layers, forecastMinute,
}: FloodMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const floodLayerRef = useRef<L.LayerGroup | null>(null);
  const drainLayerRef = useRef<L.LayerGroup | null>(null);
  const infraLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [19.076, 72.877],
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });

    // OpenStreetMap standard tile layer (100% free, no API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.control.attribution({ position: 'bottomright', prefix: '⚠️ SIMULATED DATA' }).addTo(map);

    floodLayerRef.current  = L.layerGroup().addTo(map);
    drainLayerRef.current  = L.layerGroup().addTo(map);
    infraLayerRef.current  = L.layerGroup().addTo(map);
    routeLayerRef.current  = L.layerGroup().addTo(map);

    mapRef.current = map;

    // ResizeObserver to dynamically update leaflet map size when sidebars expand/collapse
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Flood zones layer
  useEffect(() => {
    if (!floodLayerRef.current) return;
    floodLayerRef.current.clearLayers();
    if (!layers.floodRisk && !layers.floodedRoads) return;

    floodZones.forEach(zone => {
      if (!zone.latitude || !zone.longitude) return;
      const color = getRiskColor(zone.riskLevel);
      const fill = getRiskFill(zone.riskLevel);

      // 1. Draw Street Polyline if geometry available
      if (zone.geometry) {
        try {
          const geo = JSON.parse(zone.geometry);
          if (geo.type === 'LineString' && Array.isArray(geo.coordinates)) {
            // Leaflet requires [lat, lng] format
            const latLngs = geo.coordinates.map((c: [number, number]) => [c[1], c[0]]);
            const polyline = L.polyline(latLngs, {
              color,
              weight: zone.riskLevel === 'CRITICAL' ? 6 : zone.riskLevel === 'HIGH' ? 5 : 3.5,
              opacity: 0.85,
              dashArray: zone.riskLevel === 'CRITICAL' ? '8,4' : undefined,
            });
            polyline.bindPopup(`<b>🛣️ ${zone.streetName}</b><br/>Depth: <b style="color:${color}">${zone.waterDepthCm?.toFixed(1)} cm</b> (${zone.riskLevel})`);
            polyline.on('click', () => onStreetClick(zone));
            floodLayerRef.current!.addLayer(polyline);
          }
        } catch {
          // Ignore JSON parse errors for fallback
        }
      }

      // 2. Draw Circles: Red/Orange/Purple for Flooded Zones AND Vibrant Green for High-Ground Safe Zones (shown during/after demo run)
      const isFlooded = (zone.waterDepthCm && zone.waterDepthCm >= 3.0) || 
                        zone.riskLevel === 'LOW' || 
                        zone.riskLevel === 'MODERATE' || 
                        zone.riskLevel === 'HIGH' || 
                        zone.riskLevel === 'CRITICAL';

      const isSafeZone = forecastMinute > 0 && !isFlooded && (zone.riskLevel === 'SAFE' || zone.elevation >= 14.0);

      if (isFlooded || isSafeZone) {
        const circleColor = isFlooded ? color : '#22c55e';
        const circleFill = isFlooded ? fill : '#4ade80';
        const radius = isFlooded 
          ? Math.max(70, Math.min(380, (zone.waterDepthCm || 5) * 5.5 + 40))
          : Math.max(110, Math.min(240, (zone.elevation || 18) * 6));

        const circle = L.circle([zone.latitude, zone.longitude], {
          radius,
          color: circleColor,
          fillColor: circleFill,
          fillOpacity: isFlooded ? 0.65 : 0.40,
          weight: isFlooded ? ((zone.riskLevel === 'HIGH' || zone.riskLevel === 'CRITICAL') ? 3 : 2) : 2.5,
          dashArray: isSafeZone ? '6, 6' : undefined,
        });

        const popupContent = `
          <div style="min-width:210px;font-family:Inter,sans-serif;padding:2px">
            <div style="font-weight:800;font-size:14px;border-bottom:1px solid #1e3a5f;padding-bottom:6px;margin-bottom:8px;color:#f8fafc">
              ${isSafeZone ? '🛡️ SAFE HIGH-GROUND HAVEN' : '🛣️ ' + zone.streetName}
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;font-weight:600">
              <div style="color:#94a3b8">Water Depth:</div>
              <div style="color:${circleColor};font-weight:800;font-size:13px">${zone.waterDepthCm?.toFixed(1) ?? '0.0'} cm</div>
              <div style="color:#94a3b8">Risk Status:</div>
              <div style="color:${circleColor};font-weight:800">${isSafeZone ? '🟢 SAFE (FLOOD FREE)' : zone.riskLevel}</div>
              <div style="color:#94a3b8">Elevation:</div>
              <div style="color:#38bdf8;font-weight:800">${zone.elevation?.toFixed(1) ?? '—'} m</div>
            </div>
          </div>
        `;

        circle.bindPopup(popupContent);
        circle.on('click', () => onStreetClick(zone));
        floodLayerRef.current!.addLayer(circle);
      }

      // Add pulsing effect for critical/high
      if (zone.riskLevel === 'CRITICAL' || zone.riskLevel === 'HIGH') {
        const pulseIcon = L.divIcon({
          className: '',
          html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};
            box-shadow:0 0 10px ${color};animation:pulse-map 1.5s infinite;position:relative"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker([zone.latitude, zone.longitude], { icon: pulseIcon, interactive: false })
          .addTo(floodLayerRef.current!);
      }
    });
  }, [floodZones, layers.floodRisk, layers.floodedRoads, forecastMinute]);

  // Drainage network layer
  useEffect(() => {
    if (!drainLayerRef.current) return;
    drainLayerRef.current.clearLayers();
    if (!layers.drainageNetwork) return;

    drainageNodes.forEach(node => {
      if (!node.latitude || !node.longitude) return;
      const color = getNodeStatusColor(node.status);

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:18px;height:18px;border-radius:3px;
          background:${color}22;border:2px solid ${color};
          display:flex;align-items:center;justify-content:center;
          font-size:9px;color:${color};font-weight:700">D</div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([node.latitude, node.longitude], { icon });
      marker.bindPopup(`
        <div style="min-width:180px;font-family:Inter,sans-serif">
          <div style="font-weight:700;font-size:13px;border-bottom:1px solid #1e3a5f;
            padding-bottom:6px;margin-bottom:8px;color:#e2e8f0">${node.id}</div>
          <div style="font-size:11px;color:#94a3b8;margin-bottom:8px">${node.name}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:12px">
            <div style="color:#94a3b8">Flow</div>
            <div style="color:#e2e8f0">${node.flow?.toFixed(1)} m³/s</div>
            <div style="color:#94a3b8">Capacity</div>
            <div style="color:#e2e8f0">${node.capacity?.toFixed(1)} m³/s</div>
            <div style="color:#94a3b8">Utilization</div>
            <div style="color:${(node.utilization||0)>100?'#ef4444':'#22c55e'}">${node.utilization?.toFixed(0)}%</div>
            <div style="color:#94a3b8">Blockage</div>
            <div style="color:#e2e8f0">${node.blockage?.toFixed(0)}%</div>
            <div style="color:#94a3b8">Status</div>
            <div style="color:${color};font-weight:700">${node.status}</div>
          </div>
        </div>
      `);
      marker.on('click', () => onNodeClick(node));
      drainLayerRef.current!.addLayer(marker);
    });
  }, [drainageNodes, layers.drainageNetwork]);

  // Infrastructure & Safe Assembly Points layer
  useEffect(() => {
    if (!infraLayerRef.current) return;
    infraLayerRef.current.clearLayers();
    if (!layers.infrastructure) return;

    infrastructure.forEach(infra => {
      if (!infra.latitude || !infra.longitude) return;
      const emoji = INFRA_ICONS[infra.type] || '🛡️';
      const isSafePoint = infra.type === 'SAFE_POINT' || infra.type === 'RELIEF_CAMP' || infra.type === 'SHELTER';
      const riskColor = isSafePoint ? '#22c55e' : getRiskColor(infra.currentRiskLevel || 'SAFE');

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          font-size:22px;background:#0d2137;
          border:2.5px solid ${riskColor};border-radius:8px;
          padding:3px 6px;line-height:1;cursor:pointer;
          box-shadow: ${isSafePoint ? '0 0 14px rgba(34,197,94,0.9), 0 0 4px #22c55e' : '0 4px 10px rgba(0,0,0,0.6)'}">
          ${emoji}
        </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([infra.latitude, infra.longitude], { icon });

      // Draw Green Safe Zone Circle around Evacuation Assembly Points (only during/after demo run)
      if (isSafePoint && forecastMinute > 0) {
        const safeCircle = L.circle([infra.latitude, infra.longitude], {
          radius: 160,
          color: '#22c55e',
          fillColor: '#10b981',
          fillOpacity: 0.35,
          weight: 2,
          dashArray: '6, 6',
        });
        infraLayerRef.current!.addLayer(safeCircle);
      }

      const popupContent = `
        <div style="min-width:220px;font-family:Inter,sans-serif;padding:2px">
          <div style="font-weight:800;font-size:14px;border-bottom:1px solid #1e3a5f;padding-bottom:6px;margin-bottom:8px;color:#f8fafc">
            ${emoji} ${infra.name}
          </div>
          <div style="display:flex;flex-col;gap:4px;font-size:12px;font-weight:600">
            <div style="color:#22c55e;font-weight:800">
              🟢 ${isSafePoint ? 'SAFE EVACUATION HAVEN (100% FLOOD-FREE)' : 'OPERATIONAL'}
            </div>
            <div style="color:#94a3b8;margin-top:4px">Location / Address:</div>
            <div style="color:#f8fafc;font-weight:700">${infra.address || 'High Ground Elevation'}</div>
            ${infra.capacity ? `<div style="color:#94a3b8;margin-top:4px">Capacity: <b style="color:#38bdf8">${infra.capacity} evacuees</b></div>` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      infraLayerRef.current!.addLayer(marker);
    });
  }, [infrastructure, layers.infrastructure, forecastMinute]);

  // Safe route layer
  useEffect(() => {
    if (!routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();
    if (!layers.safeRoute || !safeRoute?.route?.length) return;

    // Resolve lat/lng coordinates for each street in the route
    const pathCoords: [number, number][] = [];
    safeRoute.route.forEach(name => {
      const zone = floodZones.find(z => z.streetName.toLowerCase() === name.toLowerCase());
      if (zone && zone.latitude && zone.longitude) {
        pathCoords.push([zone.latitude, zone.longitude]);
      }
    });

    if (pathCoords.length < 2) return;

    // 1. Draw glowing background shadow line
    const shadowLine = L.polyline(pathCoords, {
      color: '#0284c7',
      weight: 12,
      opacity: 0.5,
      lineCap: 'round',
    });
    routeLayerRef.current.addLayer(shadowLine);

    // 2. Draw active cyan safe polyline
    const polyline = L.polyline(pathCoords, {
      color: '#00f2fe',
      weight: 6,
      opacity: 0.95,
      dashArray: '10, 8',
      lineCap: 'round',
    });
    routeLayerRef.current.addLayer(polyline);

    // 3. Start Marker (Origin)
    const startCoord = pathCoords[0];
    const startIcon = L.divIcon({
      className: '',
      html: `<div style="
        background:#0f172a;color:#38bdf8;font-size:11px;font-weight:800;
        border:2px solid #00f2fe;border-radius:20px;padding:3px 8px;
        white-space:nowrap;box-shadow:0 0 12px #00f2fe">
        🚩 ORIGIN: ${safeRoute.route[0]}
      </div>`,
      iconSize: [140, 26],
      iconAnchor: [70, 13],
    });
    L.marker(startCoord, { icon: startIcon }).addTo(routeLayerRef.current);

    // 4. End Marker (Destination)
    const endCoord = pathCoords[pathCoords.length - 1];
    const endIcon = L.divIcon({
      className: '',
      html: `<div style="
        background:#092e20;color:#4ade80;font-size:11px;font-weight:800;
        border:2px solid #22c55e;border-radius:20px;padding:3px 8px;
        white-space:nowrap;box-shadow:0 0 14px #22c55e">
        🛡️ SAFE HAVEN: ${safeRoute.route[safeRoute.route.length - 1]}
      </div>`,
      iconSize: [160, 26],
      iconAnchor: [80, 13],
    });
    L.marker(endCoord, { icon: endIcon }).addTo(routeLayerRef.current);

    // 5. Fit map bounds to show full route
    if (mapRef.current) {
      mapRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }
  }, [safeRoute, layers.safeRoute, floodZones]);

  return (
    <>
      <style>{`
        @keyframes pulse-map {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
          70%  { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full" />
    </>
  );
}
