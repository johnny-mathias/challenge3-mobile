import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../context/AuthProvider';

import { getMyAnimals } from '../api/animals.api';
import { getApprovedClinics } from '../api/clinics.api';
import { checkJavaApi, checkOracleApi } from '../api/health.api';
import {
  getAllOracleAnimals,
  getArticles,
  getOracleAnimal,
  getBreedsBySpecies,
  getOracleAnimalsByTutor,
  getSpecies,
  getUserRole,
} from '../api/oracle.api';

export function useMyAnimals() {
  const { guardian } = useAuth();

  return useQuery({
    queryKey: ['animals', guardian?.id],
    queryFn: getMyAnimals,
    enabled: !!guardian,
  });
}

export function useMyOracleAnimals(enabled = true) {
  const { guardian } = useAuth();

  return useQuery({
    queryKey: ['oracle', 'animals', guardian?.email],
    queryFn: () => getOracleAnimalsByTutor(guardian!.email),
    enabled: enabled && !!guardian,
  });
}

// Role do usuário logado no Oracle; enquanto carrega (ou se falhar) vale como usuário comum
export function useIsAdmin() {
  const { guardian } = useAuth();

  const query = useQuery({
    queryKey: ['oracle', 'role', guardian?.email],
    queryFn: () => getUserRole(guardian!.email),
    enabled: !!guardian,
    staleTime: 5 * 60 * 1000,
  });

  return query.data === 'ADMIN';
}

// Todos os animais registrados no Oracle (visão "Todos os Pets")
export function useAllOracleAnimals(enabled: boolean) {
  return useQuery({
    queryKey: ['oracle', 'animals', 'all'],
    queryFn: getAllOracleAnimals,
    enabled,
  });
}

// Animal do Oracle aberto para edição (só os do próprio tutor)
export function useOracleAnimal(id: number | null) {
  const { guardian } = useAuth();

  return useQuery({
    queryKey: ['oracle', 'animals', 'detail', id],
    queryFn: () => getOracleAnimal(id!, guardian!.email),
    enabled: id != null && !!guardian,
  });
}

export function useArticles() {
  return useQuery({ queryKey: ['articles'], queryFn: getArticles });
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

// Tela "Sobre o app": situação das duas APIs (uma tentativa extra cobre o
// servidor do Render acordando)
export function useServiceStatus() {
  const options = { retry: 1, staleTime: 0 };
  return {
    javaApi: useQuery({ queryKey: ['health', 'java'], queryFn: checkJavaApi, ...options }),
    oracleApi: useQuery({ queryKey: ['health', 'oracle'], queryFn: checkOracleApi, ...options }),
  };
}
