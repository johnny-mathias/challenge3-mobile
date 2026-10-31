import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { useNavigation } from '@react-navigation/native';

import { useBreeds, useSpecies } from '../hooks/queries';
import { useOracleAnimalMutations } from '../hooks/useOracleAnimalMutations';
import { useTheme } from '../theme/ThemeProvider';
import { themes } from '../theme/theme';

import type { OracleAnimalInput } from '../types/api.types';

type Dropdown = 'species' | 'breed' | null;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function parseDecimal(value: string) {
  if (!value.trim()) return undefined;
  return parseFloat(value.replace(',', '.'));
}

export default function AnimalCreateScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [genero, setGenero] = useState<'M' | 'F' | null>(null);
  const [especieId, setEspecieId] = useState<number | null>(null);
  const [racaId, setRacaId] = useState<number | null>(null);
  const [dataNascimento, setDataNascimento] = useState('');
  const [castrado, setCastrado] = useState(false);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [cor, setCor] = useState('');
  const [rga, setRga] = useState('');
  const [microchip, setMicrochip] = useState('');

  const [openDropdown, setOpenDropdown] = useState<Dropdown>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const species = useSpecies();
  const breeds = useBreeds(especieId);

  const { createOracleAnimal, isCreating } = useOracleAnimalMutations();

  const selectedSpecies = species.data?.find((s) => s.id === especieId);
  const selectedBreed = breeds.data?.find((b) => b.id === racaId);

  function getSpeciesLabel() {
    if (species.isLoading) return 'Carregando espécies...';
    if (species.isError) return 'Erro ao carregar espécies (toque para tentar de novo)';
    return selectedSpecies?.nome ?? 'Selecione a espécie';
  }

  function getBreedLabel() {
    if (especieId == null) return 'Selecione a espécie primeiro';
    if (breeds.isLoading) return 'Carregando raças...';
    if (breeds.data?.length === 0) return 'Nenhuma raça cadastrada para esta espécie';
    return selectedBreed ? `${selectedBreed.nome} · ${selectedBreed.porte}` : 'Selecione a raça';
  }

  function handleOpenSpecies() {
    if (species.isError) {
      species.refetch();
      return;
    }
    if (species.data?.length) setOpenDropdown('species');
  }

  function handleOpenBreed() {
    if (breeds.data?.length) setOpenDropdown('breed');
  }

  async function handleSave() {
    setError(null);

    if (!nome.trim() || !genero || especieId == null || racaId == null) {
      setError('Nome, gênero, espécie e raça são obrigatórios');
      return;
    }

    if (dataNascimento && !DATE_PATTERN.test(dataNascimento)) {
      setError('Data de nascimento deve estar no formato AAAA-MM-DD');
      return;
    }

    const input: Omit<OracleAnimalInput, 'tutorEmail' | 'tutorNome'> = {
      nome: nome.trim(),
      apelido: apelido.trim() || undefined,
      genero,
      dataNascimento: dataNascimento || undefined,
      rga: rga.trim() || undefined,
      microchip: microchip.trim() || undefined,
      castrado,
      peso: parseDecimal(peso),
      altura: parseDecimal(altura),
      cor: cor.trim() || undefined,
      especieId,
      racaId,
    };

    if (Number.isNaN(input.peso) || Number.isNaN(input.altura)) {
      setError('Peso e altura precisam ser números válidos');
      return;
    }

    try {
      const id = await createOracleAnimal(input);
      Alert.alert('Pet cadastrado', `${input.nome} foi salvo no Oracle (ID ${id}).`);
      navigation.goBack();
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível cadastrar o pet');
    }
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>NOME *</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do pet"
          placeholderTextColor={theme.colors.textPlaceholder}
        />

        <Text style={styles.label}>APELIDO</Text>
        <TextInput
          style={styles.input}
          value={apelido}
          onChangeText={setApelido}
          placeholder="Ex: Totó"
          placeholderTextColor={theme.colors.textPlaceholder}
        />

        <Text style={styles.label}>GÊNERO *</Text>
        <View style={styles.segment}>
          {(['M', 'F'] as const).map((value) => (
            <TouchableOpacity
              key={value}
              style={[styles.segmentItem, genero === value && styles.segmentItemSelected]}
              onPress={() => setGenero(value)}
            >
              <Text style={[styles.segmentText, genero === value && styles.segmentTextSelected]}>
                {value === 'M' ? 'Macho' : 'Fêmea'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>ESPÉCIE *</Text>
        <TouchableOpacity style={styles.dropdownButton} onPress={handleOpenSpecies}>
          <Text style={styles.dropdownText}>{getSpeciesLabel()}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.label}>RAÇA *</Text>
        <TouchableOpacity
          style={[styles.dropdownButton, especieId == null && styles.disabled]}
          onPress={handleOpenBreed}
          disabled={especieId == null}
        >
          <Text style={styles.dropdownText}>{getBreedLabel()}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.label}>DATA DE NASCIMENTO</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            style={styles.input}
            value={dataNascimento}
            onChangeText={setDataNascimento}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={theme.colors.textPlaceholder}
          />
        ) : (
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={dataNascimento ? styles.dropdownText : styles.placeholderText}>
              {dataNascimento ? formatDate(dataNascimento) : 'Selecione a data'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>PESO (KG)</Text>
            <TextInput
              style={styles.input}
              value={peso}
              onChangeText={setPeso}
              keyboardType="decimal-pad"
              placeholder="Ex: 12.5"
              placeholderTextColor={theme.colors.textPlaceholder}
            />
          </View>

          <View style={styles.rowItem}>
            <Text style={styles.label}>ALTURA (CM)</Text>
            <TextInput
              style={styles.input}
              value={altura}
              onChangeText={setAltura}
              keyboardType="decimal-pad"
              placeholder="Ex: 45"
              placeholderTextColor={theme.colors.textPlaceholder}
            />
          </View>
        </View>

        <Text style={styles.label}>COR</Text>
        <TextInput
          style={styles.input}
          value={cor}
          onChangeText={setCor}
          placeholder="Ex: Caramelo"
          placeholderTextColor={theme.colors.textPlaceholder}
        />

        <Text style={styles.label}>RGA</Text>
        <TextInput
          style={styles.input}
          value={rga}
          onChangeText={setRga}
          placeholder="Registro Geral do Animal"
          placeholderTextColor={theme.colors.textPlaceholder}
        />

        <Text style={styles.label}>MICROCHIP</Text>
        <TextInput
          style={styles.input}
          value={microchip}
          onChangeText={setMicrochip}
          placeholder="Código do microchip"
          placeholderTextColor={theme.colors.textPlaceholder}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Castrado</Text>
          <Switch
            value={castrado}
            onValueChange={setCastrado}
            trackColor={{ true: theme.colors.primary }}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, isCreating && styles.disabled]}
          onPress={handleSave}
          disabled={isCreating}
        >
          <Text style={styles.buttonText}>
            {isCreating ? 'Salvando...' : 'Cadastrar pet'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={openDropdown !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenDropdown(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpenDropdown(null)}
        >
          <View style={styles.dropdownMenu}>
            <ScrollView>
              {openDropdown === 'species' &&
                species.data?.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      if (option.id !== especieId) setRacaId(null);
                      setEspecieId(option.id);
                      setOpenDropdown(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        especieId === option.id && styles.selectedItemText,
                      ]}
                    >
                      {option.nome}
                    </Text>
                  </TouchableOpacity>
                ))}

              {openDropdown === 'breed' &&
                breeds.data?.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setRacaId(option.id);
                      setOpenDropdown(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        racaId === option.id && styles.selectedItemText,
                      ]}
                    >
                      {option.nome} · {option.porte}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={dataNascimento ? new Date(`${dataNascimento}T12:00:00`) : new Date()}
          mode="date"
          display="spinner"
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (event.type !== 'dismissed' && selectedDate) {
              setDataNascimento(toIsoDate(selectedDate));
            }
          }}
        />
      )}
    </>
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

    placeholderText: {
      fontSize: 14,
      color: theme.colors.textPlaceholder,
    },

    row: {
      flexDirection: 'row',
      gap: 12,
    },

    rowItem: {
      flex: 1,
    },

    segment: {
      flexDirection: 'row',
      gap: 10,
    },

    segmentItem: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    segmentItemSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },

    segmentText: {
      color: theme.colors.text,
      fontWeight: '600',
    },

    segmentTextSelected: {
      color: '#fff',
    },

    dropdownButton: {
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    dropdownText: {
      fontSize: 14,
      color: theme.colors.text,
    },

    dropdownArrow: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },

    disabled: {
      opacity: 0.5,
    },

    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },

    switchLabel: {
      fontSize: 15,
      color: theme.colors.text,
      fontWeight: '600',
    },

    errorText: {
      color: theme.colors.remove,
      marginTop: 20,
      textAlign: 'center',
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    dropdownMenu: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      width: '80%',
      maxHeight: '70%',
      overflow: 'hidden',
    },

    dropdownItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.backgroundSecondary,
    },

    dropdownItemText: {
      fontSize: 14,
      color: theme.colors.text,
    },

    selectedItemText: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },

    button: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      marginTop: 24,
      marginBottom: 40,
    },

    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
