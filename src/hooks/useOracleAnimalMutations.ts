import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../context/AuthProvider';
import { createOracleAnimal, deleteOracleAnimal, updateOracleAnimal } from '../api/oracle.api';

import type { OracleAnimalInput } from '../types/api.types';

type NewOracleAnimal = Omit<OracleAnimalInput, 'tutorEmail' | 'tutorNome'>;

export function useOracleAnimalMutations() {
  const queryClient = useQueryClient();
  const { guardian } = useAuth();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['oracle', 'animals'] });
  }

  // O tutor logado vira o responsável (T_ANIMAL_RESP) do animal no Oracle
  const createMutation = useMutation({
    mutationFn: (input: NewOracleAnimal) =>
      createOracleAnimal({ ...input, tutorEmail: guardian!.email, tutorNome: guardian!.name }),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: NewOracleAnimal }) =>
      updateOracleAnimal(id, { ...input, tutorEmail: guardian!.email }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOracleAnimal(id, guardian!.email),
    onSuccess: invalidate,
  });

  return {
    createOracleAnimal: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateOracleAnimal: (id: number, input: NewOracleAnimal) =>
      updateMutation.mutateAsync({ id, input }),
    isUpdating: updateMutation.isPending,
    deleteOracleAnimal: deleteMutation.mutateAsync,
  };
}
