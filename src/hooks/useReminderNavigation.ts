import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import * as Notifications from '../services/notifications';
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';

// Tocar no lembrete (com o app aberto, em segundo plano ou fechado) abre o agendamento
export function useReminderNavigation(
  navigationRef: NavigationContainerRefWithCurrent<any>,
  isReady: boolean,
) {
  const response = Notifications.useLastNotificationResponse();
  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' || !isReady || !response || !navigationRef.isReady()) return;

    const key = `${response.notification.request.identifier}@${response.notification.date}`;
    if (handledRef.current === key) return;

    const appointmentId = response.notification.request.content.data?.appointmentId;
    if (typeof appointmentId !== 'number') return;

    handledRef.current = key;
    navigationRef.navigate('AppointmentDetailsScreen', { appointmentId });
    Notifications.clearLastNotificationResponse();
  }, [isReady, response]);
}
