import client from './apiClient';
import type { SimulationRequest, SimulationResult } from '../types/flood.types';

export const simulationApi = {
  run: (req: SimulationRequest) =>
    client.post<SimulationResult>('/api/simulation/run', req).then(r => r.data),
  blockage: (nodeId: string, blockagePercentage: number, rainfallIntensity: number) =>
    client.post<SimulationResult>('/api/simulation/blockage', {
      nodeId, blockagePercentage, rainfallIntensity,
    }).then(r => r.data),
  reset: () => client.post<string>('/api/simulation/reset').then(r => r.data),
};
