export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://superbicho.onrender.com';

// Backend Node/Express ligado ao Oracle (pasta backend/), publicado no Render.
// Para usar um backend local: EXPO_PUBLIC_ORACLE_API_URL=http://<ip-da-maquina>:3000
export const ORACLE_API_URL =
  process.env.EXPO_PUBLIC_ORACLE_API_URL || 'https://superbicho-oracle-api.onrender.com';
