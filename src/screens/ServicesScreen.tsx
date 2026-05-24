import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import ServiceRow from '../components/ServiceRow';
import { useAppointments } from '../context/AppointmentsProvider';

export default function ServicesScreen() {
  const navigation = useNavigation();

  const { appointments } = useAppointments();

  return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={{
            padding: 20,
          }}
          data={appointments}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={({ item }) => (
            <ServiceRow appointment={item} />
          )}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            navigation.navigate(
              'AppointmentFormScreen'
            )
          }
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: '#2d7df6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});