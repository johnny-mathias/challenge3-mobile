import { createContext, useContext } from 'react';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useAuth } from './AuthProvider';

import {
  createAppointment as createAppointmentRequest,
  deleteAppointment as deleteAppointmentRequest,
  getAppointmentsByGuardian,
  updateAppointment as updateAppointmentRequest,
} from '../api/appointments.api';

import type { AppointmentDTO, AppointmentInput } from '../types/api.types';

const APPOINTMENTS_KEY = ['appointments'];

interface AppointmentsContextData {
  appointments: AppointmentDTO[];
  isLoading: boolean;
  isError: boolean;

  createAppointment: (data: AppointmentInput) => void;

  updateAppointment: (id: number, data: AppointmentInput) => void;

  deleteAppointment: (id: number) => void;
}

const AppointmentsContext =
  createContext<AppointmentsContextData>(
    {} as AppointmentsContextData
  );

export function AppointmentsProvider({ children }: any) {
  const queryClient = useQueryClient();
  const { guardian } = useAuth();

  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [...APPOINTMENTS_KEY, guardian?.name],
    queryFn: () => getAppointmentsByGuardian(guardian!.name),
    enabled: !!guardian,
  });

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

  const deleteMutation = useMutation({
    mutationFn: deleteAppointmentRequest,
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
        deleteAppointment: (id) => deleteMutation.mutate(id),
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentsContext);
}
