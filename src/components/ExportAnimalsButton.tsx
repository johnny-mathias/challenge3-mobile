import { ActivityIndicator, Alert, Platform, StyleSheet, TouchableOpacity } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useIsAdmin } from '../hooks/queries';
import { useExportAnimals } from '../hooks/useExportAnimals';
import { useTranslation } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

export default function ExportAnimalsButton() {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);
  const isAdmin = useIsAdmin();
  const { exportAnimals, isExporting } = useExportAnimals();

  async function startExport() {
    try {
      await exportAnimals();
    } catch (error: any) {
      Alert.alert(t('export.error'), error?.message ?? t('error.generic'));
    }
  }

  // O download sempre traz todos os animais, independente da visão "Meus Pets"/"Todos os Pets"
  function handlePress() {
    if (Platform.OS === 'web') {
      // Alert.alert não exibe diálogos no react-native-web
      if (window.confirm(`${t('export.title')}\n\n${t('export.message')}`)) startExport();
      return;
    }

    Alert.alert(t('export.title'), t('export.message'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('export.confirm'), onPress: startExport },
    ]);
  }

  // Exportação do dataset Oracle → MongoDB é uma ação de admin
  if (!isAdmin) return null;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      disabled={isExporting}
      accessibilityRole="button"
      accessibilityLabel={t('export.label')}
    >
      {isExporting ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <MaterialIcons name="file-download" size={22} color="#fff" />
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: (typeof themes)['light']) =>
  StyleSheet.create({
    button: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.colors.blue1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
  });
