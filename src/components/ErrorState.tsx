import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useRefreshControl } from '../hooks/useRefreshControl';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

interface ErrorStateProps {
  title: string;
  error?: Error | null;
  onRetry: () => Promise<unknown>;
  children?: ReactNode;
}

// Tela de erro com "Tentar novamente" (e puxar para atualizar): as APIs no
// plano gratuito do Render podem falhar na primeira chamada enquanto acordam
export default function ErrorState({ title, error, onRetry, children }: ErrorStateProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const refreshControl = useRefreshControl(onRetry);
  const [retrying, setRetrying] = useState(false);

  async function handleRetry() {
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={refreshControl}
    >
      <MaterialIcons name="cloud-off" size={56} color={theme.colors.inactive} />

      <Text style={styles.title}>{title}</Text>

      {error?.message ? <Text style={styles.message}>{error.message}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRetry} disabled={retrying}>
        {retrying ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Tentar novamente</Text>
        )}
      </TouchableOpacity>

      {children}
    </ScrollView>
  );
}

const createStyles = (theme: (typeof themes)['light']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
    },

    title: {
      marginTop: 12,
      fontSize: 17,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
    },

    message: {
      marginTop: 8,
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },

    button: {
      marginTop: 20,
      minWidth: 180,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },

    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
    },
  });
