import { apiClient } from './client';
import { fetchCsrfToken } from './csrf';

function toFormBody(fields: Record<string, string>) {
  return Object.entries(fields)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

function finalUrlOf(response: any): string | undefined {
  return response.request?.responseURL;
}

export async function registerGuardian(name: string, email: string, password: string) {
  const csrf = await fetchCsrfToken('/cadastro');

  const response = await apiClient.post(
    '/cadastro',
    toFormBody({ name, email, password, _csrf: csrf }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  );

  const finalUrl = finalUrlOf(response);
  console.log('[guardianAuth] registerGuardian finalURL', finalUrl);

  if (!finalUrl || !finalUrl.includes('/login')) {
    throw new Error('Não foi possível concluir o cadastro (e-mail já cadastrado ou dados inválidos)');
  }
}

export async function loginGuardian(email: string, password: string) {
  const csrf = await fetchCsrfToken('/login');

  const response = await apiClient.post(
    '/login',
    toFormBody({ username: email, password, _csrf: csrf }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  );

  const finalUrl = finalUrlOf(response);

  if (!finalUrl || !finalUrl.includes('/guardian/home')) {
    throw new Error('E-mail ou senha inválidos');
  }
}

export async function ensureGuardianSession(name: string, email: string, password: string) {
  try {
    await loginGuardian(email, password);
  } catch {
    await registerGuardian(name, email, password);
    await loginGuardian(email, password);
  }
}