import { Platform } from 'react-native';

function resolveDefaultBaseUrl() {
  // Emulador Android não enxerga "localhost" da máquina host.
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:8080/api`;
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || resolveDefaultBaseUrl();
