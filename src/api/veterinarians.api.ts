import { apiClient } from './client';

import type { VeterinarianSummary } from '../types/api.types';

export async function getVeterinarians(): Promise<VeterinarianSummary[]> {
  const { data } = await apiClient.get<VeterinarianSummary[]>('/veterinarians');
  return data;
}
