import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import appointmentsJson from '../data/appointments.json';

import type { Appointment } from '../types/appointment.types';

import {
  loadAppointments,
  saveAppointments,
} from '../storage/appointments.storage';

interface AppointmentsContextData {
  appointments: Appointment[];

  createAppointment: (data: Appointment) => void;

  updateAppointment: (data: Appointment) => void;

  deleteAppointment: (id: number) => void;
}

const AppointmentsContext =
  createContext<AppointmentsContextData>(
    {} as AppointmentsContextData
  );

export function AppointmentsProvider({ children }: any) {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  async function initialize() {
    const storageData = await loadAppointments();

    if (storageData) {
      setAppointments(storageData);
    } else {
      setAppointments(appointmentsJson);
      saveAppointments(appointmentsJson);
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  async function createAppointment(
    data: Appointment
  ) {
    const updated = [...appointments, data];

    setAppointments(updated);

    await saveAppointments(updated);
  }

  async function updateAppointment(
    data: Appointment
  ) {
    const updated = appointments.map((item) =>
      item.id === data.id ? data : item
    );

    setAppointments(updated);

    await saveAppointments(updated);
  }

  async function deleteAppointment(id: number) {
    const updated = appointments.filter((item) => item.id !== id
    );

    setAppointments(updated);

    await saveAppointments(updated);
  }

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        createAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentsContext);
}   
