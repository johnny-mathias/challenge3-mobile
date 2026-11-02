// Só as partes de notificação LOCAL do expo-notifications.
// O índice do pacote ('expo-notifications') registra o token de push ao ser
// importado, e no Expo Go para Android (SDK 53+) isso lança erro e derruba o app.
// Importando os módulos direto, o lembrete funciona no Expo Go e no APK.
export { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
export {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
export { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
export { getAllScheduledNotificationsAsync } from 'expo-notifications/build/getAllScheduledNotificationsAsync';
export { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
export { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
export { useLastNotificationResponse } from 'expo-notifications/build/useLastNotificationResponse';
export { clearLastNotificationResponse } from 'expo-notifications/build/NotificationsEmitter';
export { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
export { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
