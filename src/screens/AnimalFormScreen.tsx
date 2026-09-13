import { useLayoutEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useAuth } from '../context/AuthProvider';
import { useAnimalMutations } from '../hooks/useAnimalMutations';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

import type { AnimalDTO } from '../types/api.types';

export default function AnimalFormScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { guardian } = useAuth();
  const { createAnimal, updateAnimal } = useAnimalMutations();

  const animal: AnimalDTO | undefined = route.params?.animal;

  const [name, setName] = useState(animal?.name ?? '');
  const [species, setSpecies] = useState(animal?.species ?? '');
  const [age, setAge] = useState(animal ? String(animal.age) : '');
  const [weight, setWeight] = useState(animal ? String(animal.weight) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: animal ? 'Editar Pet' : 'Novo Pet' });
  }, []);

  async function handleSave() {
    if (!name.trim() || !species.trim() || !age.trim() || !weight.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    const input = {
      name: name.trim(),
      species: species.trim(),
      age: parseInt(age, 10),
      weight: parseFloat(weight.replace(',', '.')),
      guardianId: guardian!.id,
    };

    if (Number.isNaN(input.age) || Number.isNaN(input.weight)) {
      Alert.alert('Atenção', 'Idade e peso precisam ser números válidos');
      return;
    }

    setIsSubmitting(true);

    try {
      if (animal) {
        await updateAnimal(animal.id, input);
      } else {
        await createAnimal(input);
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível salvar o pet');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome do pet"
        placeholderTextColor={theme.colors.textPlaceholder}
      />

      <Text style={styles.label}>Espécie</Text>
      <TextInput
        style={styles.input}
        value={species}
        onChangeText={setSpecies}
        placeholder="Ex: Cachorro, Gato"
        placeholderTextColor={theme.colors.textPlaceholder}
      />

      <Text style={styles.label}>Idade (anos)</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Ex: 3"
        placeholderTextColor={theme.colors.textPlaceholder}
      />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholder="Ex: 12.5"
        placeholderTextColor={theme.colors.textPlaceholder}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isSubmitting}>
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Salvando...' : animal ? 'Salvar alterações' : 'Cadastrar pet'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme: (typeof themes)['light']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.backgroundSecondary,
    },

    label: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '600',
      marginTop: 16,
      marginBottom: 8,
    },

    input: {
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
      color: theme.colors.text,
    },

    button: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      marginTop: 32,
      marginBottom: 40,
    },

    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
