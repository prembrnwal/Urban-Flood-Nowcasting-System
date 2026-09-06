import client from './apiClient';
import type { DrainageNode, DrainageEdge } from '../types/flood.types';

export const drainageApi = {
  getNodes: () => client.get<DrainageNode[]>('/api/drainage/nodes').then(r => r.data),
  getEdges: () => client.get<DrainageEdge[]>('/api/drainage/edges').then(r => r.data),
  getNode: (id: string) => client.get<DrainageNode>(`/api/drainage/nodes/${id}`).then(r => r.data),
};
