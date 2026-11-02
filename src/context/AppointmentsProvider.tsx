import { createContext, useContext, useEffect, useState } from 'react';
import { Alert, AppState, Linking } from 'react-native';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useAuth } from './AuthProvider';

import {
  cancelAppointment as cancelAppointmentRequest,
  createAppointment as createAppointmentRequest,
  getMyAppointments,
  updateAppointment as updateAppointmentRequest,
} from '../api/appointments.api';
import { useTranslation } from '../i18n';
import type { TranslationKey } from '../i18n/translations';
import {
  areRemindersEnabled,
  cancelAllAppointmentReminders,
  cancelAppointmentReminder,
  loadRemindersPreference,
  requestRemindersPermission,
  saveRemindersPreference,
  scheduleAppointmentReminder,
  setupAppointmentReminders,
  syncAppointmentReminders,
} from '../services/appointmentReminders';

import type { AppointmentDTO, AppointmentInput } from '../types/api.types';

const APPOINTMENTS_KEY = ['appointments'];

const CANCELED_STATUS = 'CANCELADO';
const GUARDIAN_CANCEL_REASON = 'Cancelado pelo tutor no aplicativo';

interface AppointmentsContextData {
  appointments: AppointmentDTO[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;

  createAppointment: (data: AppointmentInput) => void;

  updateAppointment: (id: number, data: AppointmentInput) => void;

  cancelAppointment: (id: number) => void;

  // Conta → Notificações: preferência do tutor + permissão do Android
  remindersEnabled: boolean;
  setRemindersEnabled: (on: boolean) => Promise<void>;
}

const AppointmentsContext =
  createContext<AppointmentsContextData>(
    {} as AppointmentsContextData
  );

export function AppointmentsProvider({ children }: any) {
  const queryClient = useQueryClient();
  const { guardian } = useAuth();
  const { t, language } = useTranslation();

  const [remindersOn, setRemindersOn] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const remindersEnabled = remindersOn && permissionGranted;

  const {
    data: allAppointments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [...APPOINTMENTS_KEY, guardian?.email],
    queryFn: getMyAppointments,
    enabled: !!guardian,
  });

  // Cancelados continuam na API (com o motivo), mas saem da lista do tutor
  const appointments = allAppointments.filter(
    (appointment) => appointment.status !== CANCELED_STATUS,
  );

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
  }

  useEffect(() => {
    // Só pede a permissão se o tutor não desligou os lembretes no app
    loadRemindersPreference()
      .then(async (on) => {
        setRemindersOn(on);
        setPermissionGranted(on ? await setupAppointmentReminders() : await areRemindersEnabled());
      })
      .catch((error) => console.warn('Lembretes de consulta indisponíveis:', error));

    // Volta dos ajustes do Android: a permissão pode ter mudado
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') areRemindersEnabled().then(setPermissionGranted).catch(() => {});
    });
    return () => subscription.remove();
  }, []);

  // Lembretes locais acompanham a lista da API, a preferência e o idioma
  // (ver services/appointmentReminders)
  useEffect(() => {
    if (!isLoading && !isError) {
      syncAppointmentReminders(appointments).catch(() => {});
    }
  }, [allAppointments, isLoading, isError, remindersEnabled, language]);

  async function setRemindersEnabled(on: boolean) {
    await saveRemindersPreference(on);
    setRemindersOn(on);

    if (!on) {
      await cancelAllAppointmentReminders();
      return;
    }

    const permission = await requestRemindersPermission();
    setPermissionGranted(permission === 'granted');

    if (permission !== 'granted') {
      Alert.alert(t('account.permissionTitle'), t('account.permissionMessage'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('account.openSettings'), onPress: () => Linking.openSettings() },
      ]);
    }
  }

  function alertError(titleKey: TranslationKey) {
    return (error: Error) => Alert.alert(t(titleKey), error.message);
  }

  function remind(appointment: AppointmentDTO) {
    if (!remindersOn) return;
    // Se o tutor ainda não respondeu à permissão, pergunta na hora de agendar
    setupAppointmentReminders()
      .then((granted) => {
        setPermissionGranted(granted);
        return scheduleAppointmentReminder(appointment, { notifyIfSoon: true });
      })
      .catch(() => {});
  }

  const createMutation = useMutation({
    mutationFn: createAppointmentRequest,
    onSuccess: (appointment) => {
      remind(appointment);
      invalidate();
    },
    onError: alertError('appointments.createError'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AppointmentInput }) =>
      updateAppointmentRequest(id, data),
    onSuccess: (appointment) => {
      remind(appointment);
      invalidate();
    },
    onError: alertError('appointments.rescheduleError'),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelAppointmentRequest(id, GUARDIAN_CANCEL_REASON),
    onSuccess: (_appointment, id) => {
      cancelAppointmentReminder(id).catch(() => {});
      invalidate();
    },
    onError: alertError('appointments.cancelError'),
  });

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        isLoading,
        isError,
        error,
        refetch,
        createAppointment: (data) => createMutation.mutate(data),
        updateAppointment: (id, data) => updateMutation.mutate({ id, data }),
        cancelAppointment: (id) => cancelMutation.mutate(id),
        remindersEnabled,
        setRemindersEnabled,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentsContext);
}
