import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../context/AuthProvider';

import { getAnimalsByGuardian } from '../api/animals.api';
import { getApprovedClinics } from '../api/clinics.api';
import {
  getAllOracleAnimals,
  getBreedsBySpecies,
  getOracleAnimalsByTutor,
  getSpecies,
} from '../api/oracle.api';

export function useMyAnimals() {
  const { guardian } = useAuth();

  return useQuery({
    queryKey: ['animals', guardian?.id],
    queryFn: () => getAnimalsByGuardian(guardian!.id),
    enabled: !!guardian,
  });
}

export function useMyOracleAnimals() {
  const { guardian } = useAuth();

  return useQuery({
    queryKey: ['oracle', 'animals', guardian?.email],
    queryFn: () => getOracleAnimalsByTutor(guardian!.email),
    enabled: !!guardian,
  });
}

// Todos os animais registrados no Oracle (visão "Todos os Pets")
export function useAllOracleAnimals(enabled: boolean) {
  return useQuery({
    queryKey: ['oracle', 'animals', 'all'],
    queryFn: getAllOracleAnimals,
    enabled,
  });
}

export function useApprovedClinics() {
  return useQuery({ queryKey: ['clinics'], queryFn: getApprovedClinics });
}

export function useSpecies() {
  return useQuery({ queryKey: ['oracle', 'species'], queryFn: getSpecies });
}

export function useBreeds(especieId: number | null) {
  return useQuery({
    queryKey: ['oracle', 'breeds', especieId],
    queryFn: () => getBreedsBySpecies(especieId!),
    enabled: especieId != null,
  });
}
