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

import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

export default function RegisterScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter no mínimo 6 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name.trim(), email.trim(), password);
    } catch (error: any) {
      Alert.alert('Erro ao cadastrar', error?.message ?? 'Não foi possível criar sua conta');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Cadastre-se para usar o SuperBicho</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor={theme.colors.textPlaceholder}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor={theme.colors.textPlaceholder}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
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
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Já tem conta? Entrar</Text>
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
