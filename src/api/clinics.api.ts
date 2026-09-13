import { apiClient } from './client';

import type { ClinicDTO, Page } from '../types/api.types';

export async function getApprovedClinics(): Promise<ClinicDTO[]> {
  const { data } = await apiClient.get<Page<ClinicDTO>>('/clinics', {
    params: { size: 200 },
  });
  return data.content.filter((clinic) => clinic.clinicStatus === 'APPROVED');
}
