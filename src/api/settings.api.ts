import { apiClient } from './client';

import type { Setting } from '../types/settings.types';

export async function getSettings(): Promise<Setting[]> {
  const { data } = await apiClient.get<{ settings: Setting[] }>('/settings');
  return data.settings;
}
