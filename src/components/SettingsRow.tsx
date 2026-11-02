import type { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

interface SettingsRowProps {
  title: string;
  value?: string | boolean;
  // Conteúdo à direita no lugar do texto (ex: ícone do tema)
  accessory?: ReactNode;
  accessibilityLabel?: string;
  onPress: () => void;
}

export default function SettingsRow({
  title,
  value,
  accessory,
  accessibilityLabel,
  onPress,
}: SettingsRowProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.title}>
        {title}
      </Text>

      {accessory ? (
        <View>{accessory}</View>
      ) : (
        <Text style={styles.value}>
          {value == null ? '' : String(value)}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (
  theme: (typeof themes)['light']
) =>
  StyleSheet.create({
    container: {
      width: '100%',
      paddingVertical: 18,
      paddingHorizontal: 20,

      borderBottomWidth: 1,
      borderBottomColor: theme.colors.primary,

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    title: {
      fontSize: 16,
      color: theme.colors.text,
    },

    value: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  });
