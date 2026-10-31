import { useMutation } from '@tanstack/react-query';

import { getAllOracleAnimals } from '../api/oracle.api';
import { exportAnimalsJson } from '../services/animalExport';

export function useExportAnimals() {
  const mutation = useMutation({
    mutationFn: async () => {
      const animals = await getAllOracleAnimals();
      if (animals.length === 0) {
        throw new Error('Nenhum animal encontrado no Oracle para exportar');
      }
      await exportAnimalsJson(animals);
      return animals.length;
    },
  });

  return {
    exportAnimals: mutation.mutateAsync,
    isExporting: mutation.isPending,
  };
}
