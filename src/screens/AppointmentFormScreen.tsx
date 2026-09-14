import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { useNavigation, useRoute } from "@react-navigation/native";

import { useEffect, useLayoutEffect, useState } from "react";

import { useAppointments } from "../context/AppointmentsProvider";
import { useTheme } from "../theme/ThemeProvider";
import { useApprovedClinics, useMyAnimals } from "../hooks/queries";

import type { AppointmentDTO } from "../types/api.types";

export default function AppointmentFormScreen() {
  const theme = useTheme();

  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const appointment: AppointmentDTO | undefined = route.params?.appointment;

  const { createAppointment, updateAppointment, deleteAppointment } = useAppointments();

  const { data: animals = [], isLoading: isLoadingAnimals } = useMyAnimals();
  const { data: clinics = [] } = useApprovedClinics();

  useEffect(() => {
    if (!isLoadingAnimals && animals.length === 0) {
      Alert.alert(
        "Nenhum pet cadastrado",
        "Você precisa cadastrar um pet antes de criar um agendamento.",
        [
          { text: "Cancelar", style: "cancel", onPress: () => navigation.goBack() },
          { text: "Cadastrar Pet", onPress: () => navigation.navigate("AnimalFormScreen") },
        ],
      );
    }
  }, [isLoadingAnimals, animals.length]);

  const [animalId, setAnimalId] = useState(
    appointment?.animalId?.toString() ?? "",
  );
  const [clinicId, setClinicId] = useState(
    appointment?.clinicId?.toString() ?? "",
  );
  const [date, setDate] = useState<Date>(
    appointment ? new Date(`${appointment.date}T${appointment.time}`) : new Date(),
  );

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const animalOptions = animals.map((animal) => ({
    label: `${animal.name} (${animal.species})`,
    value: animal.id.toString(),
  }));

  const clinicOptions = clinics.map((clinic) => ({
    label: clinic.name,
    value: clinic.id.toString(),
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      title: appointment == null ? "Novo Agendamento" : "Reagendar",
    });
  }, []);

  function getAnimalLabel() {
    return (
      animalOptions.find((opt) => opt.value === animalId)?.label ||
      "Selecione um pet"
    );
  }

  function getClinicLabel() {
    return (
      clinicOptions.find((opt) => opt.value === clinicId)?.label ||
      "Selecione uma clínica"
    );
  }

  function formatDate(value: Date) {
    return value.toLocaleDateString("pt-BR");
  }

  function formatTime(value: Date) {
    return value.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function handleSave() {
    if (!animalId) {
      Alert.alert("Atenção", "Selecione um pet");
      return;
    }

    if (!clinicId) {
      Alert.alert("Atenção", "Selecione uma clínica");
      return;
    }

    const input = {
      date: date.toISOString().slice(0, 10),
      time: date.toTimeString().slice(0, 5),
      status: appointment?.status ?? "AGENDADO",
      animalId: parseInt(animalId, 10),
      clinicId: parseInt(clinicId, 10),
    };

    if (appointment) {
      updateAppointment(appointment.id, input);
    } else {
      createAppointment(input);
    }

    navigation.goBack();
  }

  function handleDelete() {
    Alert.alert("Cancelar agendamento", "Deseja realmente cancelar este agendamento?", [
      { text: "Voltar", style: "cancel" },
      {
        text: "Cancelar agendamento",
        style: "destructive",
        onPress: () => {
          deleteAppointment(appointment!.id);
          navigation.goBack();
        },
      },
    ]);
  }

  const styles = createStyles(theme);

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>PET</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setOpenDropdown("animal")}
        >
          <Text style={styles.dropdownText}>{getAnimalLabel()}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>CLÍNICA</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setOpenDropdown("clinic")}
        >
          <Text style={styles.dropdownText}>{getClinicLabel()}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>DATA</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>HORÁRIO</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.dateButtonText}>{formatTime(date)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {appointment ? "Salvar alterações" : "Criar agendamento"}
          </Text>
        </TouchableOpacity>

        {appointment && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Excluir agendamento</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={openDropdown === "animal"}
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
            {animalOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setAnimalId(option.value);
                  setOpenDropdown(null);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    animalId === option.value && styles.selectedItemText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={openDropdown === "clinic"}
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
            {clinicOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setClinicId(option.value);
                  setOpenDropdown(null);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    clinicId === option.value && styles.selectedItemText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (event.type !== "dismissed" && selectedDate) {
              const updated = new Date(date);
              updated.setFullYear(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
              );
              setDate(updated);
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (event.type !== "dismissed" && selectedDate) {
              const updated = new Date(date);
              updated.setHours(selectedDate.getHours(), selectedDate.getMinutes());
              setDate(updated);
            }
          }}
        />
      )}
    </>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.backgroundSecondary,
    },

    sectionTitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginTop: 16,
      marginBottom: 8,
    },

    dropdownButton: {
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    dropdownText: {
      fontSize: 14,
      color: theme.colors.text,
    },

    dropdownArrow: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },

    dateButton: {
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 12,
    },

    dateButtonText: {
      fontSize: 14,
      color: theme.colors.text,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },

    dropdownMenu: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      width: "80%",
      maxHeight: "70%",
      overflow: "hidden",
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
      fontWeight: "bold",
      color: theme.colors.primary,
    },

    button: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      marginTop: 24,
      marginBottom: 40,
    },

    deleteButton: {
      backgroundColor: theme.colors.remove,
      padding: 16,
      borderRadius: 8,
      marginBottom: 40,
    },

    buttonText: {
      color: "white",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 16,
    },
  });
