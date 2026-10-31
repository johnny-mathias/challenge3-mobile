export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://superbicho.onrender.com';

// Backend Node/Express ligado ao Oracle (pasta backend/).
// No celular físico, "localhost" é o próprio celular: use o IP da máquina na rede,
// ex: EXPO_PUBLIC_ORACLE_API_URL=http://192.168.0.10:3000
export const ORACLE_API_URL =
  process.env.EXPO_PUBLIC_ORACLE_API_URL || 'http://localhost:3000';
