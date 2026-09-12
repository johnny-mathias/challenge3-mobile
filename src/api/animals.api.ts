import { apiClient } from './client';

import type { AnimalSummary } from '../types/api.types';

export async function getAnimals(): Promise<AnimalSummary[]> {
  const { data } = await apiClient.get<AnimalSummary[]>('/animals');
  return data;
}
