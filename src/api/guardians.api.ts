import { apiClient } from './client';
import { t } from '../i18n';

import type { GuardianDTO, Page } from '../types/api.types';

export async function getMyGuardian(email: string): Promise<GuardianDTO> {
  const size = 200;
  let page = 0;

  while (true) {
    const { data } = await apiClient.get<Page<GuardianDTO>>('/guardians', {
      params: { page, size },
    });

    const found = data.content.find((guardian) => guardian.email === email);

    if (found) {
      return found;
    }

    page += 1;

    if (page >= data.totalPages) {
      throw new Error(t('error.guardianNotFound'));
    }
  }
}
