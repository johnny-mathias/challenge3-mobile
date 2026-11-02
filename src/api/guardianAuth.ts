import { apiClient } from './client';
import { fetchCsrfToken } from './csrf';
import { t } from '../i18n';

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

  if (!finalUrl || !finalUrl.includes('/login')) {
    throw new Error(t('error.registerFailed'));
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
    throw new Error(t('error.invalidCredentials'));
  }
}

export async function ensureGuardianSession(name: string, email: string, password: string) {
  try {
    await loginGuardian(email, password);
  } catch {
    try {
      await registerGuardian(name, email, password);
    } catch {
      // O cadastro pode falhar porque esse e-mail já existe na API (ex: senha
      // errada numa conta já criada) — nesse caso deixamos o login abaixo
      // decidir e reportar o erro real, em vez do erro cru do cadastro.
    }

    await loginGuardian(email, password);
  }
}