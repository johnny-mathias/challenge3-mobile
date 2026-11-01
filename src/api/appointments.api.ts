import { apiClient } from './client';
import { fetchCsrfToken } from './csrf';

import type { AppointmentDTO, AppointmentInput } from '../types/api.types';

// A API identifica o tutor pela sessão: devolve só os agendamentos do tutor logado
export async function getMyAppointments(): Promise<AppointmentDTO[]> {
  const { data } = await apiClient.get<AppointmentDTO[]>('/appointments');
  return data;
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

// A API não exclui agendamentos: o tutor cancela informando o motivo
export async function cancelAppointment(id: number, reason: string): Promise<AppointmentDTO> {
  const csrf = await fetchCsrfToken();
  const { data } = await apiClient.patch<AppointmentDTO>(
    `/appointments/${id}/cancel`,
    { reason },
    { headers: { 'X-CSRF-TOKEN': csrf } },
  );
  return data;
}
