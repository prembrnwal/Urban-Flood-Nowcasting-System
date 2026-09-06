import client from './apiClient';
import type { RouteRequest, RouteResponse } from '../types/flood.types';

export const routingApi = {
  findSafeRoute: (req: RouteRequest) =>
    client.post<RouteResponse>('/api/routes/safe', req).then(r => r.data),
};
