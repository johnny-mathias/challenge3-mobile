import { apiClient } from './client';
import { oracleClient } from './oracle.api';

export type ServiceStatus = 'online' | 'degraded';

// Qualquer resposta HTTP indica que a API Java está no ar (rotas pedem sessão)
export async function checkJavaApi(): Promise<ServiceStatus> {
  await apiClient.get('/clinics', { params: { size: 1 }, validateStatus: () => true });
  return 'online';
}

// /api/teste roda "SELECT 1 FROM DUAL": separa API no ar de banco fora do ar
export async function checkOracleApi(): Promise<ServiceStatus> {
  const { status } = await oracleClient.get('/teste', { validateStatus: () => true });
  return status < 500 ? 'online' : 'degraded';
}

// Antes do login na API Java: o Render pode levar quase um minuto para acordar
// e derrubar as primeiras conexões. Espera o servidor responder (uma nova
// tentativa se a primeira falhar) para o login não morrer no meio do caminho.
export async function wakeJavaApi() {
  const request = () =>
    apiClient.get('/login', { timeout: 90000, validateStatus: () => true });
  try {
    await request();
  } catch {
    await request();
  }
}
