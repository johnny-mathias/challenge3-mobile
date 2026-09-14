import { apiClient } from './client';

import type { GuardianDTO, Page } from '../types/api.types';

export async function getMyGuardian(email: string): Promise<GuardianDTO> {
  const size = 200;
  let page = 0;

  while (true) {
    const { data } = await apiClient.get<Page<GuardianDTO>>('/guardians', {
      params: { page, size },
    });

    console.log(
      '[guardians.api] getMyGuardian looking for',
      email,
      'page',
      page,
      'totalElements',
      data.totalElements,
      'totalPages',
      data.totalPages,
      'emails on this page',
      data.content.map((g) => g.email),
    );

    const found = data.content.find((guardian) => guardian.email === email);

    if (found) {
      return found;
    }

    page += 1;

    if (page >= data.totalPages) {
      throw new Error('Cadastro de tutor não encontrado na API');
    }
  }
}
