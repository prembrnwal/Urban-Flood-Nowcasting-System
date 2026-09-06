// ─── Flood Types ─────────────────────────────────────────────────────────────

export type RiskLevel = 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface FloodZone {
  streetId: number;
  streetName: string;
  forecastMinute: number;
  waterDepthCm: number;
  riskLevel: RiskLevel;
  floodProbability: number;
  drainUtilization: number;
  elevation: number;
  imperviousness: number;
  latitude: number;
  longitude: number;
  geometry?: string;
}

export interface StreetForecast {
  streetId: number;
  streetName: string;
  elevation: number;
  imperviousness: number;
  slope: number;
  currentDepthCm: number;
  currentRisk: RiskLevel;
  floodProbability: number;
  drainUtilization: number;
  forecast: ForecastPoint[];
}

export interface ForecastPoint {
  minute: number;
  waterDepthCm: number;
  riskLevel: RiskLevel;
  floodProbability: number;
  drainUtilization: number;
  rainfall: number;
}

// ─── Rainfall Types ───────────────────────────────────────────────────────────

export interface RainfallData {
  current: number;
  unit: string;
  forecast: RainfallForecastPoint[];
}

export interface RainfallForecastPoint {
  minute: number;
  rainfall: number;
  uncertainty?: number;
}

// ─── Drainage Types ───────────────────────────────────────────────────────────

export type NodeStatus = 'NORMAL' | 'WARNING' | 'OVERLOADED' | 'BLOCKED';

export interface DrainageNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  flow: number;
  capacity: number;
  utilization: number;
  blockage: number;
  overflow: number;
  status: NodeStatus;
  backflowRisk: string;
  surcharging: boolean;
}

export interface DrainageEdge {
  id: number;
  sourceNodeId: string;
  destinationNodeId: string;
  length: number;
  diameter: number;
  capacity: number;
  pipeType: string;
}

// ─── Alert Types ──────────────────────────────────────────────────────────────

export type AlertSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export interface FloodAlert {
  id: number;
  severity: AlertSeverity;
  title: string;
  location: string;
  message: string;
  expectedTime: string;
  timestamp: string;
  active: boolean;
  streetId?: number;
  nodeId?: string;
}

// ─── Infrastructure Types ─────────────────────────────────────────────────────

export type InfraType = 'HOSPITAL' | 'FIRE_STATION' | 'POLICE_STATION' | 'RAILWAY_STATION' | 'METRO_STATION' | 'SCHOOL' | 'SHELTER';

export interface CriticalInfrastructure {
  id: number;
  name: string;
  type: InfraType;
  latitude: number;
  longitude: number;
  address: string;
  capacity?: number;
  currentRiskLevel: RiskLevel;
}

// ─── Routing Types ────────────────────────────────────────────────────────────

export interface RouteRequest {
  source: string;
  destination: string;
  vehicleType: 'NORMAL' | 'EMERGENCY';
  forecastMinute: number;
}

export interface RouteResponse {
  route: string[];
  distanceKm: number;
  estimatedTimeMinutes: number;
  floodExposure: string;
  avoidedFloodedRoads: number;
  segments: RouteSegment[];
}

export interface RouteSegment {
  from: string;
  to: string;
  distanceKm: number;
  riskLevel: RiskLevel;
}

// ─── Simulation Types ─────────────────────────────────────────────────────────

export interface SimulationRequest {
  rainfallIntensity: number;
  rainfallDuration: number;
  drainageBlockage: number;
  imperviousness: number;
}

export interface SimulationResult {
  maximumDepth: number;
  affectedRoads: number;
  criticalZones: number;
  drainOverflows: number;
  populationAtRisk: number;
  warningLeadTime: number;
  totalRunoffM3?: number;
}

// ─── Demo Mode Types ──────────────────────────────────────────────────────────

export type DemoStage =
  | 'idle'
  | 'normal'
  | 'heavy_rain'
  | 'runoff_rising'
  | 'drain_filling'
  | 'drain_overloaded'
  | 'street_flooding'
  | 'alerts_generated'
  | 'routes_recalculated';

export interface DemoState {
  stage: DemoStage;
  stageIndex: number;
  playing: boolean;
  forecastMinute: number;
  rainfall: number;
  blockage: number;
}
