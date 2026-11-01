import { createContext, useContext } from 'react';

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

import type { AppointmentDTO, AppointmentInput } from '../types/api.types';

const APPOINTMENTS_KEY = ['appointments'];

const CANCELED_STATUS = 'CANCELADO';
const GUARDIAN_CANCEL_REASON = 'Cancelado pelo tutor no aplicativo';

interface AppointmentsContextData {
  appointments: AppointmentDTO[];
  isLoading: boolean;
  isError: boolean;

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

  const createMutation = useMutation({
    mutationFn: createAppointmentRequest,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AppointmentInput }) =>
      updateAppointmentRequest(id, data),
    onSuccess: invalidate,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelAppointmentRequest(id, GUARDIAN_CANCEL_REASON),
    onSuccess: invalidate,
  });

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        isLoading,
        isError,
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
