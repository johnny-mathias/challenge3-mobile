import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useExportAnimals } from '../hooks/useExportAnimals';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

export default function ExportAnimalsButton() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { exportAnimals, isExporting } = useExportAnimals();

  async function handlePress() {
    try {
      await exportAnimals();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível exportar os animais');
    }
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
