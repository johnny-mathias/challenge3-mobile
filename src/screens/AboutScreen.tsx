import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Application from 'expo-application';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { UseQueryResult } from '@tanstack/react-query';

import { useRemindersEnabled, useServiceStatus } from '../hooks/queries';
import { requestRemindersPermission } from '../services/appointmentReminders';
import { useRefreshControl } from '../hooks/useRefreshControl';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

import type { ServiceStatus } from '../api/health.api';

import logo from '../../assets/sb-logo-png.png';

const TEAM = [
  { name: 'Ana Carolina Pereira Fontes', rm: '562145' },
  { name: 'João Victor Nascimento Adão', rm: '563409' },
  { name: 'Johnny Dias Mathias Junior', rm: '566516' },
  { name: 'Luisa Ganasevici de Abreu', rm: '563403' },
  { name: 'Matheus Moya de Oliveira', rm: '562822' },
];

// Preenchidos no build por app.config.js
const extra = Constants.expoConfig?.extra ?? {};
const COMMIT_HASH: string | null = extra.commitHash ?? null;
const REPOSITORY_URL: string = extra.repositoryUrl;

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

function describeEnvironment() {
  if (Platform.OS === 'web') return 'Navegador (web)';
  if (isExpoGo) return 'Expo Go (desenvolvimento)';
  return `App instalado (build ${Application.nativeBuildVersion ?? '-'})`;
}

function describePlatform() {
  if (Platform.OS === 'android') return `Android (API ${Platform.Version})`;
  if (Platform.OS === 'ios') return `iOS ${Platform.Version}`;
  return 'Web';
}

type StatusTone = 'ok' | 'warning' | 'error' | 'pending';

function describeService(
  query: UseQueryResult<ServiceStatus>,
  degradedLabel: string,
): { label: string; tone: StatusTone } {
  if (query.isFetching) {
    return { label: query.failureCount > 0 ? 'Acordando servidor...' : 'Verificando...', tone: 'pending' };
  }
  if (query.isError) return { label: 'Fora do ar', tone: 'error' };
  if (query.data === 'degraded') return { label: degradedLabel, tone: 'warning' };
  return { label: 'Online', tone: 'ok' };
}

export default function AboutScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { javaApi, oracleApi } = useServiceStatus();
  const reminders = useRemindersEnabled();
  const refreshControl = useRefreshControl(javaApi.refetch, oracleApi.refetch, reminders.refetch);

  const toneColors: Record<StatusTone, string> = {
    ok: theme.colors.primary,
    warning: theme.colors.tertiary,
    error: theme.colors.remove,
    pending: theme.colors.inactive,
  };

  const services = [
    { name: 'API Java (pets e agendamentos)', ...describeService(javaApi, 'Instável') },
    { name: 'Backend Node + Oracle', ...describeService(oracleApi, 'Sem conexão com o Oracle') },
  ];

  const versionRows = [
    { label: 'Versão', value: Constants.expoConfig?.version ?? '-' },
    { label: 'Ambiente', value: describeEnvironment() },
    { label: 'Plataforma', value: describePlatform() },
    { label: 'Expo SDK', value: Constants.expoConfig?.sdkVersion ?? '-' },
  ];

  async function enableReminders() {
    const result = await requestRemindersPermission();
    if (result === 'settings') Linking.openSettings();
    reminders.refetch();
  }

  function openCommit() {
    if (COMMIT_HASH) Linking.openURL(`${REPOSITORY_URL}/commit/${COMMIT_HASH}`);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={refreshControl}
    >
      <View style={styles.hero}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.appName}>SuperBicho</Text>
        <Text style={styles.tagline}>
          Cadastre seus pets e agende consultas em clínicas veterinárias parceiras
        </Text>
      </View>

      <Text style={styles.sectionTitle}>VERSÃO</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={openCommit} disabled={!COMMIT_HASH}>
          <Text style={styles.rowLabel}>Commit</Text>
          <View style={styles.rowValueGroup}>
            <Text style={[styles.rowValue, styles.mono]}>
              {COMMIT_HASH ? COMMIT_HASH.slice(0, 7) : 'indisponível'}
            </Text>
            {COMMIT_HASH && (
              <MaterialIcons name="open-in-new" size={16} color={theme.colors.blue1} />
            )}
          </View>
        </TouchableOpacity>

        {versionRows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>SERVIÇOS</Text>
      <View style={styles.card}>
        {services.map((service) => (
          <View key={service.name} style={styles.row}>
            <Text style={[styles.rowLabel, styles.flexLabel]}>{service.name}</Text>
            <View style={styles.rowValueGroup}>
              <View style={[styles.dot, { backgroundColor: toneColors[service.tone] }]} />
              <Text style={styles.rowValue}>{service.label}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.row}
          onPress={enableReminders}
          disabled={reminders.data !== false}
        >
          <Text style={[styles.rowLabel, styles.flexLabel]}>Lembretes de consulta</Text>
          <View style={styles.rowValueGroup}>
            <View
              style={[
                styles.dot,
                { backgroundColor: toneColors[reminders.data ? 'ok' : 'warning'] },
              ]}
            />
            <Text style={styles.rowValue}>
              {reminders.data ? 'Ativados' : 'Desativados (toque para permitir)'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>
        As APIs ficam no plano gratuito do Render e dormem quando não são usadas. Puxe a tela
        para baixo para verificar de novo.
      </Text>

      <Text style={styles.sectionTitle}>PROJETO</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>FIAP · 2TDS</Text>
          <Text style={styles.rowValue}>Challenge 2026</Text>
        </View>
        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(REPOSITORY_URL)}>
          <Text style={styles.rowLabel}>Código-fonte</Text>
          <View style={styles.rowValueGroup}>
            <Text style={[styles.rowValue, styles.link]}>GitHub</Text>
            <MaterialIcons name="open-in-new" size={16} color={theme.colors.blue1} />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>EQUIPE SUPERBICHO</Text>
      <View style={styles.card}>
        {TEAM.map((member) => (
          <View key={member.rm} style={styles.row}>
            <Text style={[styles.rowLabel, styles.flexLabel]}>{member.name}</Text>
            <Text style={styles.rowValue}>RM {member.rm}</Text>
          </View>
        ))}
      </View>
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
      padding: 20,
      paddingBottom: 40,
    },

    hero: {
      alignItems: 'center',
      marginBottom: 8,
    },

    logo: {
      width: 90,
      height: 90,
    },

    appName: {
      fontSize: 26,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginTop: 4,
    },

    tagline: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 6,
    },

    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginTop: 24,
      marginBottom: 8,
    },

    card: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 13,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },

    rowLabel: {
      fontSize: 15,
      color: theme.colors.text,
    },

    flexLabel: {
      flex: 1,
    },

    rowValueGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexShrink: 1,
    },

    rowValue: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'right',
      flexShrink: 1,
    },

    mono: {
      fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
      color: theme.colors.blue1,
    },

    link: {
      color: theme.colors.blue1,
    },

    dot: {
      width: 9,
      height: 9,
      borderRadius: 5,
    },

    hint: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 8,
    },
  });
