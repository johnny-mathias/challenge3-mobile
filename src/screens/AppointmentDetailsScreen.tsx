import {
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
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

import type { AppointmentDTO } from '../types/api.types';

export default function AppointmentDetailsScreen() {
    const theme = useTheme();
    const styles = createStyles(theme);
  const route = useRoute<any>();

  const navigation = useNavigation<any>();

  const { cancelAppointment } =
    useAppointments();

  const { appointment } = route.params as { appointment: AppointmentDTO };

  return (
      <View style={styles.container}>
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
      </View>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
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
