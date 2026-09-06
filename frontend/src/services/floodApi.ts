import client from './apiClient';
import type { FloodZone, StreetForecast } from '../types/flood.types';

export const floodApi = {
  getZones: (minute: number) =>
    client.get<FloodZone[]>(`/api/flood/zones?minute=${minute}`).then(r => r.data),
  getForecast: (minute: number) =>
    client.get<Record<string, unknown>>(`/api/flood/forecast?minute=${minute}`).then(r => r.data),
  getStreetForecast: (streetId: number) =>
    client.get<StreetForecast>(`/api/flood/streets/${streetId}`).then(r => r.data),
  updateParams: (blockage?: number, imperviousness?: number) => {
    const params = new URLSearchParams();
    if (blockage !== undefined) params.append('blockage', String(blockage));
    if (imperviousness !== undefined) params.append('imperviousness', String(imperviousness));
    return client.post<string>(`/api/flood/update-params?${params}`).then(r => r.data);
  },
};
