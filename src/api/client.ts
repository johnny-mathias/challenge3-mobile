import axios from 'axios';

import { API_BASE_URL } from '../config/env';
import { toFriendlyError } from './errors';
import { t } from '../i18n';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 45000,
});

// A API Java guarda a sessão em memória: quando o Render reinicia o servidor
// (deploy ou volta do modo "dormindo"), a sessão some e toda rota redireciona
// para a página HTML de /login com status 200. Sem tratar isso, as telas
// recebiam HTML no lugar dos dados.
type SessionExpiredListener = () => void;
const sessionExpiredListeners = new Set<SessionExpiredListener>();

export function onSessionExpired(listener: SessionExpiredListener) {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
}

// Login e cadastro respondem com a página de /login de propósito (ver guardianAuth)
const AUTH_PATHS = ['/login', '/cadastro'];

apiClient.interceptors.response.use((response) => {
  const requestPath = response.config.url ?? '';
  const finalUrl: string | undefined = response.request?.responseURL;

  const isAuthRequest = AUTH_PATHS.some((path) => requestPath.startsWith(path));
  if (!isAuthRequest && finalUrl?.includes('/login')) {
    sessionExpiredListeners.forEach((listener) => listener());
    const error = new Error(t('error.sessionExpired')) as Error & { status?: number };
    error.status = 401;
    return Promise.reject(error);
  }

  return response;
}, toFriendlyError);
