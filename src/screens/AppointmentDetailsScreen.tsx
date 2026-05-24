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

import animals from '../data/animals.json';
import veterinarians from '../data/veterinarians.json';

import { useAppointments } from '../context/AppointmentsProvider';

export default function AppointmentDetailsScreen() {
  const route = useRoute<any>();

  const navigation = useNavigation<any>();

  const { deleteAppointment } =
    useAppointments();

  const { appointment } = route.params;

  const animal = animals.find(
    (item) => item.id === appointment.tAnimalId
  );

  const veterinarian = veterinarians.find(
    (item) =>
      item.id === appointment.tUserProfileId2
  );

  return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {appointment.appointmentType}
          </Text>

          <Text style={styles.label}>
            Pet
          </Text>

          <Text>{animal?.name}</Text>

          <Text style={styles.label}>
            Veterinário
          </Text>

          <Text>{veterinarian?.name}</Text>

          <Text style={styles.label}>
            Observações
          </Text>

          <Text>
            {appointment.notes || 'Sem observações'}
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
            Editar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            deleteAppointment(appointment.id);

            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },

  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },

  editButton: {
    backgroundColor: '#2d7df6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },

  deleteButton: {
    backgroundColor: '#ff4d4d',
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