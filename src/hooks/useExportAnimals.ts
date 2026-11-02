import { useMutation } from '@tanstack/react-query';

import { getAllOracleAnimals } from '../api/oracle.api';
import { t } from '../i18n';
import { exportAnimalsJson } from '../services/animalExport';

export function useExportAnimals() {
  const mutation = useMutation({
    mutationFn: async () => {
      const animals = await getAllOracleAnimals();
      if (animals.length === 0) {
        throw new Error(t('export.empty'));
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
