import { ActivityIndicator, Alert, Platform, StyleSheet, TouchableOpacity } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useExportAnimals } from '../hooks/useExportAnimals';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

const EXPORT_WARNING_TITLE = 'Download dos animais';
const EXPORT_WARNING_MESSAGE =
  'Ao fazer download, você baixará todos os animais registrados na SuperBicho';

export default function ExportAnimalsButton() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { exportAnimals, isExporting } = useExportAnimals();

  async function startExport() {
    try {
      await exportAnimals();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível exportar os animais');
    }
  }

  // O download sempre traz todos os animais, independente da visão "Meus Pets"/"Todos os Pets"
  function handlePress() {
    if (Platform.OS === 'web') {
      // Alert.alert não exibe diálogos no react-native-web
      if (window.confirm(`${EXPORT_WARNING_TITLE}\n\n${EXPORT_WARNING_MESSAGE}`)) startExport();
      return;
    }

    Alert.alert(EXPORT_WARNING_TITLE, EXPORT_WARNING_MESSAGE, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Baixar', onPress: startExport },
    ]);
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      disabled={isExporting}
      accessibilityRole="button"
      accessibilityLabel="Baixar JSON dos animais"
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
