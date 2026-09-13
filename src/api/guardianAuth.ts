import { apiClient } from './client';
import { fetchCsrfToken } from './csrf';

function toFormBody(fields: Record<string, string>) {
  return Object.entries(fields)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

async function hasActiveSession() {
  try {
    const { data } = await apiClient.get('/guardians', { params: { size: 1 } });
    return typeof data === 'object' && data !== null;
  } catch {
    return false;
  }
}

export async function registerGuardian(name: string, email: string, password: string) {
  const csrf = await fetchCsrfToken('/cadastro');

  await apiClient.post('/cadastro', toFormBody({ name, email, password, _csrf: csrf }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

export async function loginGuardian(email: string, password: string) {
  const csrf = await fetchCsrfToken('/login');

  await apiClient.post('/login', toFormBody({ username: email, password, _csrf: csrf }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!(await hasActiveSession())) {
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
