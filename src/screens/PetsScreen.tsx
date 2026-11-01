import { useState } from 'react';
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

import {
  useAllOracleAnimals,
  useIsAdmin,
  useMyAnimals,
  useMyOracleAnimals,
} from '../hooks/queries';
import { useAnimalMutations } from '../hooks/useAnimalMutations';
import { useOracleAnimalMutations } from '../hooks/useOracleAnimalMutations';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

import type { AnimalDTO, OracleAnimal } from '../types/api.types';

// "Meus Pets" vem da API Java (todos os usuários); "Todos os Pets" vem do backend
// Node/Oracle e só é exibido para usuários com role ADMIN
type PetItem =
  | { source: 'api'; animal: AnimalDTO }
  | { source: 'oracle'; animal: OracleAnimal };

type PetsView = 'mine' | 'all';

const VIEW_TITLES: Record<PetsView, string> = {
  mine: 'Meus Pets',
  all: 'Todos os Pets',
};

function describeOracleAnimal(animal: OracleAnimal) {
  const parts = [animal.especie, animal.raca && `${animal.raca} (${animal.porte})`];
  if (animal.peso != null) parts.push(`${animal.peso}kg`);
  return parts.filter(Boolean).join(' · ');
}

export default function PetsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const isAdmin = useIsAdmin();
  const [selectedView, setView] = useState<PetsView>('mine');
  const view: PetsView = isAdmin ? selectedView : 'mine';

  const apiAnimals = useMyAnimals();
  const oracleAnimals = useMyOracleAnimals(isAdmin);
  const allOracleAnimals = useAllOracleAnimals(view === 'all');
  const { deleteAnimal } = useAnimalMutations();
  const { deleteOracleAnimal } = useOracleAnimalMutations();

  const activeQuery = view === 'mine' ? apiAnimals : allOracleAnimals;
  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;

  // No Oracle, o admin só remove os pets vinculados a ele mesmo (T_ANIMAL_RESP)
  const myOracleIds = new Set((oracleAnimals.data ?? []).map((animal) => animal.id));

  const pets: PetItem[] =
    view === 'mine'
      ? (apiAnimals.data ?? []).map((animal) => ({ source: 'api' as const, animal }))
      : (allOracleAnimals.data ?? []).map((animal) => ({ source: 'oracle' as const, animal }));

  function canRemove(item: PetItem) {
    return item.source === 'api' || myOracleIds.has(item.animal.id);
  }

  function toggleView() {
    setView((current) => (current === 'mine' ? 'all' : 'mine'));
  }

  const viewToggle = isAdmin ? (
    <TouchableOpacity style={styles.viewToggle} onPress={toggleView}>
      <Text style={styles.viewToggleText}>
        {view === 'mine' ? `Ver ${VIEW_TITLES.all}` : `Ver ${VIEW_TITLES.mine}`}
      </Text>
    </TouchableOpacity>
  ) : null;

  // Cadastro do usuário comum vai para a API Java; na visão do admin, para o Oracle
  const createScreen = view === 'all' ? 'AnimalCreateScreen' : 'AnimalFormScreen';

  function confirmDelete(name: string, onConfirm: () => Promise<unknown>) {
    Alert.alert('Remover pet', `Remover ${name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () =>
          onConfirm().catch((error: any) =>
            Alert.alert('Erro', error?.message ?? 'Não foi possível remover o pet'),
          ),
      },
    ]);
  }

  function handleDelete(item: PetItem) {
    if (item.source === 'oracle') {
      confirmDelete(item.animal.nome, () => deleteOracleAnimal(item.animal.id));
    } else {
      confirmDelete(item.animal.name, () => deleteAnimal(item.animal.id));
    }
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
        <Text style={styles.errorText}>
          {view === 'mine'
            ? 'Não foi possível carregar seus pets'
            : 'Não foi possível carregar os pets da SuperBicho'}
        </Text>
        {viewToggle}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={pets}
        keyExtractor={(item) => `${item.source}-${item.animal.id}`}
        ListHeaderComponent={
          <Text style={styles.viewTitle}>{VIEW_TITLES[view]}</Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {view === 'mine'
              ? 'Você ainda não cadastrou nenhum pet'
              : 'Nenhum pet registrado na SuperBicho'}
          </Text>
        }
        ListFooterComponent={viewToggle}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.source === 'oracle' ? (
              <View>
                <Text style={styles.name}>
                  {item.animal.nome}
                  {item.animal.apelido ? ` "${item.animal.apelido}"` : ''}
                </Text>
                <Text style={styles.details}>{describeOracleAnimal(item.animal)}</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.name}>{item.animal.name}</Text>
                <Text style={styles.details}>
                  {item.animal.species} · {item.animal.age} anos · {item.animal.weight}kg
                </Text>
              </View>
            )}

            {canRemove(item) && (
              <View style={styles.actions}>
                {item.source === 'api' && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('AnimalFormScreen', { animal: item.animal })}
                  >
                    <Text style={styles.actionText}>Editar</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                >
                  <Text style={styles.actionText}>Remover</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(createScreen)}
      >
        <Text style={styles.fabText}>Cadastrar</Text>
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
      // espaço para o botão "Cadastrar" flutuante não cobrir o fim da lista
      paddingBottom: 110,
    },

    viewTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom: 12,
    },

    viewToggle: {
      alignSelf: 'center',
      marginTop: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },

    viewToggleText: {
      color: theme.colors.primary,
      fontWeight: 'bold',
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
      width: 130,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    fabText: {
      color: theme.colors.add,
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
