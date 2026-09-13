import { apiClient } from './client';

import type { GuardianDTO, Page } from '../types/api.types';

export async function getMyGuardian(email: string): Promise<GuardianDTO> {
  const { data } = await apiClient.get<Page<GuardianDTO>>('/guardians', {
    params: { size: 200 },
  });

  const found = data.content.find((guardian) => guardian.email === email);

  if (!found) {
    throw new Error('Cadastro de tutor não encontrado na API');
  }

  return found;
}
