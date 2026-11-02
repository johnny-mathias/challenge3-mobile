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

import RemovePetButton from '../components/RemovePetButton';
import { useAuth } from '../context/AuthProvider';
import { useAnimalMutations } from '../hooks/useAnimalMutations';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from '../i18n';
import { themes } from '../theme/theme';

import type { AnimalDTO } from '../types/api.types';

export default function AnimalFormScreen() {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const styles = createStyles(theme);

  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { guardian } = useAuth();
  const { createAnimal, updateAnimal, deleteAnimal } = useAnimalMutations();

  const animal: AnimalDTO | undefined = route.params?.animal;

  const [name, setName] = useState(animal?.name ?? '');
  const [species, setSpecies] = useState(animal?.species ?? '');
  const [age, setAge] = useState(animal ? String(animal.age) : '');
  const [weight, setWeight] = useState(animal ? String(animal.weight) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: animal ? t('nav.editPet') : t('nav.newPet') });
  }, [language]);

  async function handleSave() {
    if (!name.trim() || !species.trim() || !age.trim() || !weight.trim()) {
      Alert.alert(t('common.attention'), t('petForm.missing'));
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
      Alert.alert(t('common.attention'), t('petForm.invalidNumbers'));
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
      Alert.alert(t('petForm.saveError'), error?.message ?? t('error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>{t('petForm.name')}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t('petForm.namePlaceholder')}
        placeholderTextColor={theme.colors.textPlaceholder}
      />

      <Text style={styles.label}>{t('petForm.species')}</Text>
      <TextInput
        style={styles.input}
        value={species}
        onChangeText={setSpecies}
        placeholder={t('petForm.speciesPlaceholder')}
        placeholderTextColor={theme.colors.textPlaceholder}
      />

      <Text style={styles.label}>{t('petForm.age')}</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Ex: 3"
        placeholderTextColor={theme.colors.textPlaceholder}
      />

      <Text style={styles.label}>{t('petForm.weight')}</Text>
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
          {isSubmitting ? t('common.saving') : animal ? t('common.saveChanges') : t('petForm.create')}
        </Text>
      </TouchableOpacity>

      {animal && (
        <RemovePetButton name={animal.name} onRemove={() => deleteAnimal(animal.id)} />
      )}
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
      marginBottom: 16,
    },

    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
