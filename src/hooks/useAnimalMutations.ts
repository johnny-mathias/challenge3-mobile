import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createAnimal,
  deleteAnimal,
  updateAnimal,
} from '../api/animals.api';

import type { AnimalInput } from '../types/api.types';

export function useAnimalMutations() {
  const queryClient = useQueryClient();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['animals'] });
  }

  const createMutation = useMutation({
    mutationFn: createAnimal,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AnimalInput }) => updateAnimal(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnimal,
    onSuccess: invalidate,
  });

  return {
    createAnimal: createMutation.mutateAsync,
    updateAnimal: (id: number, data: AnimalInput) => updateMutation.mutateAsync({ id, data }),
    deleteAnimal: deleteMutation.mutateAsync,
  };
}
