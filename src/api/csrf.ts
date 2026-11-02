import { apiClient } from './client';
import { t } from '../i18n';

const CSRF_INPUT_PATTERN = /name="_csrf"\s+value="([^"]+)"/;

export async function fetchCsrfToken(path: string = '/guardian/home') {
  const { data } = await apiClient.get<string>(path);

  const match = typeof data === 'string' ? data.match(CSRF_INPUT_PATTERN) : null;

  if (!match) {
    throw new Error(t('error.sessionExpired'));
  }

  return match[1];
}
