import { apiClient } from './client';
import { fetchCsrfToken } from './csrf';

import type { AppointmentDTO, AppointmentInput, Page } from '../types/api.types';

export async function getAppointmentsByGuardian(guardianName: string): Promise<AppointmentDTO[]> {
  const { data } = await apiClient.get<Page<AppointmentDTO>>('/appointments', {
    params: { size: 200 },
  });
  return data.content.filter((appointment) => appointment.guardianName === guardianName);
}

export async function createAppointment(input: AppointmentInput): Promise<AppointmentDTO> {
  const csrf = await fetchCsrfToken();
  const { data } = await apiClient.post<AppointmentDTO>('/appointments', input, {
    headers: { 'X-CSRF-TOKEN': csrf },
  });
  return data;
}

export async function updateAppointment(id: number, input: AppointmentInput): Promise<AppointmentDTO> {
  const csrf = await fetchCsrfToken();
  const { data } = await apiClient.put<AppointmentDTO>(`/appointments/${id}`, input, {
    headers: { 'X-CSRF-TOKEN': csrf },
  });
  return data;
}

export async function deleteAppointment(id: number): Promise<void> {
  const csrf = await fetchCsrfToken();
  await apiClient.delete(`/appointments/${id}`, {
    headers: { 'X-CSRF-TOKEN': csrf },
  });
}
