import { apiClient } from './client';
import { fetchCsrfToken } from './csrf';

import type { AnimalDTO, AnimalInput } from '../types/api.types';

export async function getAnimalsByGuardian(guardianId: number): Promise<AnimalDTO[]> {
  const { data } = await apiClient.get<AnimalDTO[]>(`/animals/guardian/${guardianId}`);
  return data;
}

export async function createAnimal(input: AnimalInput): Promise<AnimalDTO> {
  const csrf = await fetchCsrfToken();
  const { data } = await apiClient.post<AnimalDTO>('/animals', input, {
    headers: { 'X-CSRF-TOKEN': csrf },
  });
  return data;
}

export async function updateAnimal(id: number, input: AnimalInput): Promise<AnimalDTO> {
  const csrf = await fetchCsrfToken();
  const { data } = await apiClient.put<AnimalDTO>(`/animals/${id}`, input, {
    headers: { 'X-CSRF-TOKEN': csrf },
  });
  return data;
}

export async function deleteAnimal(id: number): Promise<void> {
  const csrf = await fetchCsrfToken();
  await apiClient.delete(`/animals/${id}`, {
    headers: { 'X-CSRF-TOKEN': csrf },
  });
}
