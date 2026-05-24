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
  onPress: () => void;
}

export default function SettingsRow({
  title,
  value,
  onPress,
}: SettingsRowProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.value}>
        {String(value)}
      </Text>
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