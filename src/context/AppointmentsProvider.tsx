import { createContext, useContext } from 'react';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import type { Appointment } from '../types/appointment.types';

import {
  createAppointment as createAppointmentRequest,
  deleteAppointment as deleteAppointmentRequest,
  getAppointments,
  updateAppointment as updateAppointmentRequest,
} from '../api/appointments.api';

const APPOINTMENTS_KEY = ['appointments'];

interface AppointmentsContextData {
  appointments: Appointment[];
  isLoading: boolean;
  isError: boolean;

  createAppointment: (data: Appointment) => void;

  updateAppointment: (data: Appointment) => void;

  deleteAppointment: (id: number) => void;
}

const AppointmentsContext =
  createContext<AppointmentsContextData>(
    {} as AppointmentsContextData
  );

export function AppointmentsProvider({ children }: any) {
  const queryClient = useQueryClient();

  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: APPOINTMENTS_KEY,
    queryFn: getAppointments,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
  }

  const createMutation = useMutation({
    mutationFn: createAppointmentRequest,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: updateAppointmentRequest,
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
        updateAppointment: (data) => updateMutation.mutate(data),
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
