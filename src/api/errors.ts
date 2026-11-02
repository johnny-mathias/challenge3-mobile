import { isAxiosError } from 'axios';

import { t } from '../i18n';
import type { TranslationKey } from '../i18n/translations';

// Erros do Firebase Authentication (login/cadastro)
const FIREBASE_MESSAGES: Record<string, TranslationKey> = {
  'auth/invalid-credential': 'error.invalidCredentials',
  'auth/invalid-email': 'error.invalidEmail',
  'auth/user-not-found': 'error.invalidCredentials',
  'auth/wrong-password': 'error.invalidCredentials',
  'auth/email-already-in-use': 'error.emailInUse',
  'auth/weak-password': 'error.weakPassword',
  'auth/too-many-requests': 'error.tooManyRequests',
  'auth/network-request-failed': 'error.offline',
};

function messageForStatus(status: number) {
  if (status === 401 || status === 403) return t('error.sessionExpired');
  if (status === 404) return t('error.notFound');
  if (status === 409) return t('error.conflict');
  if (status === 400 || status === 422) return t('error.badRequest');
  if (status >= 500) return t('error.server');
  return t('error.generic');
}

// Converte qualquer erro (axios, Firebase ou validação) numa frase para o usuário,
// no idioma escolhido no app
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    // O backend Node/Oracle já responde { mensagem } em português
    const mensagem = (error.response?.data as any)?.mensagem;
    if (typeof mensagem === 'string' && mensagem) return mensagem;

    if (error.response) return messageForStatus(error.response.status);

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return t('error.timeout');
    }
    return t('error.unreachable');
  }

  const code = (error as any)?.code;
  if (typeof code === 'string' && FIREBASE_MESSAGES[code]) return t(FIREBASE_MESSAGES[code]);

  if (error instanceof Error && error.message) return error.message;
  return t('error.generic');
}

// Interceptor dos clientes axios: as telas recebem Error com a mensagem amigável
// (status preservado para quem precisar)
export function toFriendlyError(error: unknown) {
  const friendly = new Error(getErrorMessage(error)) as Error & { status?: number };
  if (isAxiosError(error)) friendly.status = error.response?.status;
  return Promise.reject(friendly);
}
