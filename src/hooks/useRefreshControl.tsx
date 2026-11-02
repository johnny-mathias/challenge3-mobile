import { useState } from 'react';
import { RefreshControl } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

// "Puxar para atualizar": refaz as consultas recebidas e mostra o indicador
// só enquanto o próprio usuário pediu a atualização
export function useRefreshControl(...refetchers: (() => Promise<unknown>)[]) {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await Promise.all(refetchers.map((refetch) => refetch()));
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[theme.colors.primary]}
      tintColor={theme.colors.primary}
      progressBackgroundColor={theme.colors.backgroundSecondary}
    />
  );
}
