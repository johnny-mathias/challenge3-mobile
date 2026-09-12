import { useQuery } from '@tanstack/react-query';

import { getAnimals } from '../api/animals.api';
import { getVeterinarians } from '../api/veterinarians.api';
import { getAppointmentTypes } from '../api/appointmentTypes.api';
import { getArticles } from '../api/articles.api';
import { getSettings } from '../api/settings.api';

export function useAnimals() {
  return useQuery({ queryKey: ['animals'], queryFn: getAnimals });
}

export function useVeterinarians() {
  return useQuery({ queryKey: ['veterinarians'], queryFn: getVeterinarians });
}

export function useAppointmentTypes() {
  return useQuery({ queryKey: ['appointmentTypes'], queryFn: getAppointmentTypes });
}

export function useArticles() {
  return useQuery({ queryKey: ['articles'], queryFn: getArticles });
}

export function useSettings() {
  return useQuery({ queryKey: ['settings'], queryFn: getSettings });
}
