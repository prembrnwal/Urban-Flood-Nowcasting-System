import client from './apiClient';
import type { RainfallData } from '../types/flood.types';

export const rainfallApi = {
  getCurrent: () => client.get<RainfallData>('/api/rainfall/current').then(r => r.data),
  getForecast: () => client.get<RainfallData>('/api/rainfall/forecast').then(r => r.data),
  setIntensity: (intensity: number) =>
    client.post<string>(`/api/rainfall/set?intensity=${intensity}`).then(r => r.data),
};
