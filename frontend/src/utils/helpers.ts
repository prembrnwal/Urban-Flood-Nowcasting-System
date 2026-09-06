import type { RiskLevel, NodeStatus } from '../types/flood.types';

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'SAFE':     return '#22c55e';
    case 'LOW':      return '#eab308';
    case 'MODERATE': return '#f97316';
    case 'HIGH':     return '#ef4444';
    case 'CRITICAL': return '#7c3aed';
    default:         return '#64748b';
  }
}

export function getRiskFill(risk: RiskLevel): string {
  switch (risk) {
    case 'SAFE':     return 'rgba(34, 197, 94, 0.35)';
    case 'LOW':      return 'rgba(234, 179, 8, 0.40)';
    case 'MODERATE': return 'rgba(249, 115, 22, 0.45)';
    case 'HIGH':     return 'rgba(239, 68, 68, 0.55)';
    case 'CRITICAL': return 'rgba(124, 58, 237, 0.65)';
    default:         return 'rgba(100, 116, 139, 0.30)';
  }
}

export function getRiskClass(risk: RiskLevel): string {
  switch (risk) {
    case 'SAFE':     return 'risk-safe';
    case 'LOW':      return 'risk-low';
    case 'MODERATE': return 'risk-moderate';
    case 'HIGH':     return 'risk-high';
    case 'CRITICAL': return 'risk-critical';
    default:         return 'risk-safe';
  }
}

export function getNodeStatusColor(status: NodeStatus): string {
  switch (status) {
    case 'NORMAL':    return '#22c55e';
    case 'WARNING':   return '#eab308';
    case 'OVERLOADED': return '#ef4444';
    case 'BLOCKED':   return '#7c3aed';
    default:          return '#64748b';
  }
}

export function formatMinutes(minute: number): string {
  if (minute === 0) return 'NOW';
  return `+${minute}m`;
}

export function formatDepth(cm: number): string {
  if (cm < 0.1) return '< 1 cm';
  return `${cm.toFixed(1)} cm`;
}

export function formatPopulation(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const FORECAST_MINUTES = [0, 30, 60, 90, 120, 150, 180] as const;

export const KNOWN_LOCATIONS = [
  'Sector 17 Main',
  'City General Hospital',
  'MG Road',
  'Station Road',
  'Ring Road North',
  'University Road',
  'Market Street',
  'Hospital Road',
  'Nehru Nagar Road',
  'Gandhi Chowk',
  'Metro Link Road',
  'Civic Center Rd',
];
