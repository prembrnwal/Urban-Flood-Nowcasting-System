import client from './apiClient';
import type { FloodAlert, CriticalInfrastructure } from '../types/flood.types';

export const alertApi = {
  getAlerts: () => client.get<FloodAlert[]>('/api/alerts').then(r => r.data),
};

export const infraApi = {
  getAll: () => client.get<CriticalInfrastructure[]>('/api/infrastructure').then(r => r.data),
};
