import { apiClient } from './client';

const CSRF_INPUT_PATTERN = /name="_csrf"\s+value="([^"]+)"/;

export async function fetchCsrfToken(path: string = '/guardian/home') {
  const { data } = await apiClient.get<string>(path);

  const match = typeof data === 'string' ? data.match(CSRF_INPUT_PATTERN) : null;

  if (!match) {
    throw new Error('Sua sessão expirou. Saia e entre novamente na sua conta');
  }

  return match[1];
}
