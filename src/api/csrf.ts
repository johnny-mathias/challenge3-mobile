import { apiClient } from './client';

const CSRF_INPUT_PATTERN = /name="_csrf"\s+value="([^"]+)"/;

export async function fetchCsrfToken(path: string = '/guardian/home') {
  const { data } = await apiClient.get<string>(path);

  const match = typeof data === 'string' ? data.match(CSRF_INPUT_PATTERN) : null;

  if (!match) {
    throw new Error('Não foi possível obter o token de segurança (sessão expirada?)');
  }

  return match[1];
}
