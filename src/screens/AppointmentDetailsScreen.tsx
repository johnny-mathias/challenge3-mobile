import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { useAppointments } from '../context/AppointmentsProvider';
import { useRefreshControl } from '../hooks/useRefreshControl';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

import type { AppointmentDTO } from '../types/api.types';

export default function AppointmentDetailsScreen() {
    const theme = useTheme();
    const styles = createStyles(theme);
  const route = useRoute<any>();

  const navigation = useNavigation<any>();

  const { appointments, isLoading, refetch, cancelAppointment } =
    useAppointments();
  const refreshControl = useRefreshControl(refetch);

  // Vem da lista (appointment) ou do toque no lembrete (appointmentId);
  // a versão da lista é a mais atual, inclusive depois de reagendar
  const params = route.params as { appointment?: AppointmentDTO; appointmentId?: number };
  const appointmentId = params.appointment?.id ?? params.appointmentId;
  const appointment =
    appointments.find((item) => item.id === appointmentId) ?? params.appointment;

  if (!appointment) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.centered}
        refreshControl={refreshControl}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <Text style={styles.text}>Este agendamento não está mais ativo</Text>
        )}
      </ScrollView>
    );
  }

  return (
      <ScrollView style={styles.container} refreshControl={refreshControl}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {appointment.date} às {appointment.time}
          </Text>

          <Text style={styles.label}>
            Pet
          </Text>

          <Text style={styles.text}>
            {appointment.animalName}
          </Text>

          <Text style={styles.label}>
            Clínica
          </Text>

          <Text style={styles.text}>
            {appointment.clinicName}
          </Text>

          <Text style={styles.label}>
            Veterinário
          </Text>

          <Text style={styles.text}>
            {appointment.veterinarianName ?? 'A definir pela clínica'}
          </Text>

          <Text style={styles.label}>
            Status
          </Text>

          <Text style={styles.text}>
            {appointment.status}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate(
              'AppointmentFormScreen',
              {
                appointment,
              }
            )
          }
        >
          <Text style={styles.buttonText}>
            Reagendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            cancelAppointment(appointment.id);

            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </ScrollView>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
    },

  centered: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: 20,
    borderRadius: 12,
    marginBottom: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.text,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: theme.colors.text,
  },

  text: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },

  editButton: {
    backgroundColor: theme.colors.blue1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },

  deleteButton: {
    backgroundColor: theme.colors.remove,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
