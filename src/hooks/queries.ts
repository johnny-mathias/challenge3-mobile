import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../context/AuthProvider';

import { getAnimalsByGuardian } from '../api/animals.api';
import { getApprovedClinics } from '../api/clinics.api';

export function useMyAnimals() {
  const { guardian } = useAuth();

  return useQuery({
    queryKey: ['animals', guardian?.id],
    queryFn: () => getAnimalsByGuardian(guardian!.id),
    enabled: !!guardian,
  });
}

export function useApprovedClinics() {
  return useQuery({ queryKey: ['clinics'], queryFn: getApprovedClinics });
}
