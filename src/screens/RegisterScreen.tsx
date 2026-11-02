import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { getErrorMessage } from '../api/errors';
import { useAuth } from '../context/AuthProvider';
import { useTranslation } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

export default function RegisterScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t('common.attention'), t('auth.registerMissing'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('common.attention'), t('auth.passwordTooShort'));
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name.trim(), email.trim(), password);
    } catch (error: any) {
      Alert.alert(t('auth.registerError'), getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('auth.registerTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth.registerSubtitle')}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>{t('auth.name')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('auth.namePlaceholder')}
            placeholderTextColor={theme.colors.textPlaceholder}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>{t('auth.email')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('auth.emailPlaceholder')}
            placeholderTextColor={theme.colors.textPlaceholder}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>{t('auth.password')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('auth.passwordPlaceholder')}
            placeholderTextColor={theme.colors.textPlaceholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('auth.register')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>{t('auth.goToLogin')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: (typeof themes)['light']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      padding: 24,
    },

    card: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 24,
      padding: 26,
    },

    title: {
      color: theme.colors.primary,
      fontSize: 28,
      fontWeight: '800',
      textAlign: 'center',
    },

    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 24,
    },

    form: {
      gap: 4,
    },

    label: {
      color: theme.colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 8,
      marginBottom: 6,
    },

    input: {
      height: 52,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      color: theme.colors.text,
      fontSize: 16,
    },

    button: {
      marginTop: 24,
      height: 52,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },

    linkButton: {
      marginTop: 18,
      alignItems: 'center',
    },

    linkText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
  });
