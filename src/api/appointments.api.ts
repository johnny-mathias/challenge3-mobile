import { apiClient } from './client';

import type { Appointment } from '../types/appointment.types';

export async function getAppointments(): Promise<Appointment[]> {
  const { data } = await apiClient.get<Appointment[]>('/appointments');
  return data;
}

export async function createAppointment(
  payload: Appointment
): Promise<Appointment> {
  const { data } = await apiClient.post<Appointment>('/appointments', payload);
  return data;
}

export async function updateAppointment(
  payload: Appointment
): Promise<Appointment> {
  const { data } = await apiClient.put<Appointment>(
    `/appointments/${payload.id}`,
    payload
  );
  return data;
}

export async function deleteAppointment(id: number): Promise<void> {
  await apiClient.delete(`/appointments/${id}`);
}
