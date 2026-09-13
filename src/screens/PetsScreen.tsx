import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useMyAnimals } from '../hooks/queries';
import { useAnimalMutations } from '../hooks/useAnimalMutations';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

import type { AnimalDTO } from '../types/api.types';

export default function PetsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const { data: animals = [], isLoading, isError } = useMyAnimals();
  const { deleteAnimal } = useAnimalMutations();

  function handleDelete(animal: AnimalDTO) {
    Alert.alert('Remover pet', `Remover ${animal.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => deleteAnimal(animal.id),
      },
    ]);
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Não foi possível carregar seus pets</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={animals}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Você ainda não cadastrou nenhum pet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>
                {item.species} · {item.age} anos · {item.weight}kg
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('AnimalFormScreen', { animal: item })}
              >
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.actionText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AnimalFormScreen')}
      >
        <Text style={styles.fabText}>Novo Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: (typeof themes)['light']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },

    errorText: {
      color: theme.colors.textSecondary,
      fontSize: 15,
    },

    listContent: {
      padding: 20,
    },

    emptyText: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 40,
    },

    card: {
      backgroundColor: theme.colors.backgroundSecondary,
      padding: 18,
      borderRadius: 12,
      marginBottom: 14,
    },

    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },

    details: {
      marginTop: 6,
      color: theme.colors.textSecondary,
    },

    actions: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 14,
    },

    editButton: {
      backgroundColor: theme.colors.blue1,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
    },

    deleteButton: {
      backgroundColor: theme.colors.remove,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
    },

    actionText: {
      color: '#fff',
      fontWeight: 'bold',
    },

    fab: {
      position: 'absolute',
      right: 15,
      bottom: 25,
      paddingHorizontal: 20,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    fabText: {
      color: theme.colors.add,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
