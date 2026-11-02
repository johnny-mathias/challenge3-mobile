import { createContext, useContext, useEffect } from 'react';
import { Alert } from 'react-native';

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
import {
  cancelAppointmentReminder,
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
}

const AppointmentsContext =
  createContext<AppointmentsContextData>(
    {} as AppointmentsContextData
  );

export function AppointmentsProvider({ children }: any) {
  const queryClient = useQueryClient();
  const { guardian } = useAuth();

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
    setupAppointmentReminders().catch((error) =>
      console.warn('Lembretes de consulta indisponíveis:', error),
    );
  }, []);

  // Lembretes locais acompanham a lista da API (ver services/appointmentReminders)
  useEffect(() => {
    if (!isLoading && !isError) {
      syncAppointmentReminders(appointments).catch(() => {});
    }
  }, [allAppointments, isLoading, isError]);

  function alertError(title: string) {
    return (error: Error) => Alert.alert(title, error.message);
  }

  function remind(appointment: AppointmentDTO) {
    // Se o tutor ainda não respondeu à permissão, pergunta na hora de agendar
    setupAppointmentReminders()
      .then(() => scheduleAppointmentReminder(appointment, { notifyIfSoon: true }))
      .catch(() => {});
  }

  const createMutation = useMutation({
    mutationFn: createAppointmentRequest,
    onSuccess: (appointment) => {
      remind(appointment);
      invalidate();
    },
    onError: alertError('Não foi possível criar o agendamento'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AppointmentInput }) =>
      updateAppointmentRequest(id, data),
    onSuccess: (appointment) => {
      remind(appointment);
      invalidate();
    },
    onError: alertError('Não foi possível reagendar'),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelAppointmentRequest(id, GUARDIAN_CANCEL_REASON),
    onSuccess: (_appointment, id) => {
      cancelAppointmentReminder(id).catch(() => {});
      invalidate();
    },
    onError: alertError('Não foi possível cancelar o agendamento'),
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
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentsContext);
}
