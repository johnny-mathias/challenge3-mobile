import { Platform } from 'react-native';

import * as Notifications from './notifications';

import type { AppointmentDTO } from '../types/api.types';

// Lembrete local (sem servidor de push): dispara 4h antes da consulta ou,
// se ela for em menos de 4h, alguns segundos depois de agendar/reagendar
const REMINDER_ADVANCE_MS = 4 * 60 * 60 * 1000;
const SOON_DELAY_MS = 5 * 1000;

const CHANNEL_ID = 'consultas';
const IDENTIFIER_PREFIX = 'consulta-';

const isSupported = Platform.OS !== 'web';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Canal próprio no APK; o Expo Go não deixa criar canais e usa o canal padrão dele
let channelId: string | undefined;

async function ensureChannel() {
  if (Platform.OS !== 'android' || channelId) return;
  try {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Lembretes de consulta',
      importance: Notifications.AndroidImportance.HIGH,
    });
    channelId = CHANNEL_ID;
  } catch {
    channelId = undefined;
  }
}

export async function setupAppointmentReminders(): Promise<boolean> {
  if (!isSupported) return false;

  await ensureChannel();

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

// Pede a permissão de novo; se o Android não deixar mais perguntar, abre os ajustes
export async function requestRemindersPermission(): Promise<'granted' | 'denied' | 'settings'> {
  if (!isSupported) return 'denied';
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  if (!current.canAskAgain) return 'settings';
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted ? 'granted' : 'denied';
}

export async function areRemindersEnabled(): Promise<boolean> {
  if (!isSupported) return false;
  const { granted } = await Notifications.getPermissionsAsync();
  return granted;
}

export function getAppointmentDate(appointment: Pick<AppointmentDTO, 'date' | 'time'>) {
  return new Date(`${appointment.date}T${appointment.time.slice(0, 5)}:00`);
}

function reminderIdentifier(appointment: AppointmentDTO) {
  // Data/hora no identificador: reagendar gera um lembrete novo
  return `${IDENTIFIER_PREFIX}${appointment.id}-${appointment.date}-${appointment.time.slice(0, 5)}`;
}

// "4 horas", "45 minutos", "3h20min"
export function formatTimeUntil(ms: number) {
  const totalMinutes = Math.max(1, Math.round(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  if (minutes === 0) return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  return `${hours}h${String(minutes).padStart(2, '0')}min`;
}

async function cancelReminders(predicate: (identifier: string) => boolean) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((request) => predicate(request.identifier))
      .map((request) => Notifications.cancelScheduledNotificationAsync(request.identifier)),
  );
}

export async function cancelAppointmentReminder(appointmentId: number) {
  if (!isSupported) return;
  await cancelReminders((identifier) =>
    identifier.startsWith(`${IDENTIFIER_PREFIX}${appointmentId}-`),
  );
}

export async function cancelAllAppointmentReminders() {
  if (!isSupported) return;
  await cancelReminders((identifier) => identifier.startsWith(IDENTIFIER_PREFIX));
}

// notifyIfSoon: ao criar/reagendar uma consulta para daqui a menos de 4h,
// o lembrete sai logo em seguida; na sincronização da lista ele não é repetido
export async function scheduleAppointmentReminder(
  appointment: AppointmentDTO,
  { notifyIfSoon }: { notifyIfSoon: boolean },
) {
  if (!isSupported) return;

  const appointmentAt = getAppointmentDate(appointment).getTime();
  const now = Date.now();
  if (Number.isNaN(appointmentAt) || appointmentAt <= now) return;

  let fireAt = appointmentAt - REMINDER_ADVANCE_MS;
  if (fireAt <= now) {
    if (!notifyIfSoon) return;
    fireAt = now + SOON_DELAY_MS;
  }

  await cancelAppointmentReminder(appointment.id);
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    identifier: reminderIdentifier(appointment),
    content: {
      title: `Consulta de ${appointment.animalName}`,
      body: `Sua consulta das ${appointment.time.slice(0, 5)} começa em ${formatTimeUntil(appointmentAt - fireAt)}`,
      data: { appointmentId: appointment.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(fireAt),
      channelId,
    },
  });
}

// Mantém os lembretes iguais à lista da API: remove os de consultas canceladas
// (inclusive pela clínica) e agenda os que faltam
export async function syncAppointmentReminders(appointments: AppointmentDTO[]) {
  if (!isSupported) return;

  const expected = new Map(
    appointments.map((appointment) => [reminderIdentifier(appointment), appointment]),
  );

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const scheduledIds = new Set(scheduled.map((request) => request.identifier));

  await cancelReminders(
    (identifier) => identifier.startsWith(IDENTIFIER_PREFIX) && !expected.has(identifier),
  );

  for (const [identifier, appointment] of expected) {
    if (!scheduledIds.has(identifier)) {
      await scheduleAppointmentReminder(appointment, { notifyIfSoon: false });
    }
  }
}
