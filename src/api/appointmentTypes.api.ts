import { apiClient } from './client';

import type { AppointmentTypeSummary } from '../types/api.types';

export async function getAppointmentTypes(): Promise<AppointmentTypeSummary[]> {
  const { data } = await apiClient.get<AppointmentTypeSummary[]>('/appointment-types');
  return data;
}
