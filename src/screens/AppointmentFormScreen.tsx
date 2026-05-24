import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { useNavigation, useRoute } from "@react-navigation/native";

import { useEffect, useLayoutEffect, useState } from "react";

import { useAppointments } from "../context/AppointmentsProvider";
import { useTheme } from "../theme/ThemeProvider";
import animals from "../data/animals.json";
import veterinarians from "../data/veterinarians.json";
import appointmentTypes from "../data/appointmentTypes.json";

export default function AppointmentFormScreen() {
  const theme = useTheme();

  const route = useRoute();
  const navigation = useNavigation();

  const appointment = route.params?.appointment ?? null;

  const { createAppointment, updateAppointment } = useAppointments();

  const [appointmentType, setAppointmentType] = useState("1");
  const [scheduledStart, setScheduledStart] = useState("");
  const [notes, setNotes] = useState("");
  const [tAnimalId, setTAnimalId] = useState("1");
  const [tUserProfileId, setTUserProfileId] = useState("eu");
  const [tUserProfileId2, setTUserProfileId2] = useState("1");

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimeMode, setDateTimeMode] = useState<"date" | "time">("date");

  const appointmentTypeOptions = appointmentTypes.map((type) => ({
    label: type.label,
    value: type.id.toString(),
  }));

  const animalOptions = animals.map((animal) => ({
    label: `${animal.name} (${animal.species})`,
    value: animal.id.toString(),
  }));

  const responsibleOptions = [
    { label: "Eu", value: "eu" },
    { label: "Outra pessoa", value: "outra_pessoa" },
  ];

  const professionalOptions = veterinarians.map((vet) => ({
    label: vet.name,
    value: vet.id.toString(),
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      title: appointment == null ? "Novo Agendamento" : "Reagendar",
    });
    if (appointment) {
      setAppointmentType(appointment.appointmentType || "");
      setScheduledStart(appointment.scheduledStart || "");
      setNotes(appointment.notes || "");
      setTAnimalId(appointment.tAnimalId?.toString() || "1");
      setTUserProfileId(appointment.tUserProfileId?.toString() || "eu");
      setTUserProfileId2(appointment.tUserProfileId2?.toString() || "1");
    }
  }, []);

  const handleDateTimePicker = (event: any, selectedDate: any) => {
    if (event.type === "dismissed") {
      setShowDateTimePicker(false);
      return;
    }

    if (dateTimeMode === "date" && selectedDate) {
      const currentDate = scheduledStart
        ? new Date(scheduledStart)
        : new Date();
      selectedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
      setScheduledStart(selectedDate.toISOString());
      setDateTimeMode("time");
    } else if (dateTimeMode === "time" && selectedDate) {
      const currentDate = new Date(scheduledStart || selectedDate);
      selectedDate.setFullYear(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      setScheduledStart(selectedDate.toISOString());
      setShowDateTimePicker(false);
      setDateTimeMode("date");
    }
  };

  const openDateTimePicker = () => {
    setDateTimeMode("date");
    setShowDateTimePicker(true);
  };

  function getAnimalLabel() {
    return (
      animalOptions.find((opt) => opt.value === tAnimalId)?.label ||
      "Selecione um animal"
    );
  }

  function getAppointmentTypeLabel() {
    return (
      appointmentTypeOptions.find((opt) => opt.value === appointmentType)
        ?.label || "Selecione um tipo"
    );
  }

  function getResponsibleLabel() {
    return (
      responsibleOptions.find((opt) => opt.value === tUserProfileId)?.label ||
      "Selecione"
    );
  }

  function getProfessionalLabel() {
    return (
      professionalOptions.find((opt) => opt.value === tUserProfileId2)?.label ||
      "Selecione um profissional"
    );
  }

  function formatDateTime(isoString: string) {
    if (!isoString) return "Selecionar data e hora";
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR");
  }

  function handleSave() {
    if (!appointmentType || appointmentType === "0") {
      Alert.alert("Atenção", "Tipo de atendimento é obrigatório");
      return;
    }

    if (!scheduledStart.trim()) {
      Alert.alert("Atenção", "Data/hora de início é obrigatória");
      return;
    }

    const appointmentTypeLabel = appointmentTypeOptions.find(
      (opt) => opt.value === appointmentType,
    )?.label;

    const payload = {
      ...(appointment || {}),
      id: appointment?.id || Date.now(),
      appointmentType: appointmentTypeLabel,
      status: "Agendado",
      scheduledStart,
      price: 100,
      notes: notes || undefined,
      tAnimalId: parseInt(tAnimalId),
      tUserProfileId: tUserProfileId === "eu" ? 1 : 2,
      tUserProfileId2: parseInt(tUserProfileId2),
    };

    try {
      if (appointment) {
        updateAppointment(payload);
      } else {
        createAppointment(payload);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o agendamento");
    }
  }

  const createStyles = () =>
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

      input: {
        backgroundColor: theme.colors.background,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        color: theme.colors.text,
      },

      textArea: {
        height: 120,
        textAlignVertical: "top",
        marginBottom: 24,
      },

      dropdownButton: {
        backgroundColor: theme.colors.background,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
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
        marginBottom: 20,
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

      buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
      },
    });

  const styles = createStyles();

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Tipo de Atendimento */}
        <Text style={styles.sectionTitle}>TIPO DE ATENDIMENTO</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setOpenDropdown("appointmentType")}
        >
          <Text style={styles.dropdownText}>{getAppointmentTypeLabel()}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Data e Hora de Início */}
        <Text style={styles.sectionTitle}>DATA E HORA DE INÍCIO</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={openDateTimePicker}
        >
          <Text style={styles.dateButtonText}>
            {formatDateTime(scheduledStart)}
          </Text>
        </TouchableOpacity>

        {/* Animal */}
        <Text style={styles.sectionTitle}>ANIMAL</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setOpenDropdown("animal")}
        >
          <Text style={styles.dropdownText}>{getAnimalLabel()}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Responsável */}
        <Text style={styles.sectionTitle}>RESPONSÁVEL</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setOpenDropdown("responsible")}
        >
          <Text style={styles.dropdownText}>{getResponsibleLabel()}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Profissional */}
        <Text style={styles.sectionTitle}>PROFISSIONAL</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setOpenDropdown("professional")}
        >
          <Text style={styles.dropdownText}>{getProfessionalLabel()}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Observações */}
        <Text style={styles.sectionTitle}>OBSERVAÇÕES (OPCIONAL)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
          placeholder="Digite qualquer observação relevante"
          placeholderTextColor={theme.colors.textPlaceholder}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {appointment ? "Salvar alterações" : "Criar agendamento"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Appointment Type Dropdown Modal */}
      <Modal
        visible={openDropdown === "appointmentType"}
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
            {appointmentTypeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setAppointmentType(option.value);
                  setOpenDropdown(null);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    appointmentType === option.value && styles.selectedItemText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Animal Dropdown Modal */}
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
                  setTAnimalId(option.value);
                  setOpenDropdown(null);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    tAnimalId === option.value && styles.selectedItemText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Responsible Profile Dropdown Modal */}
      <Modal
        visible={openDropdown === "responsible"}
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
            {responsibleOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setTUserProfileId(option.value);
                  setOpenDropdown(null);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    tUserProfileId === option.value && styles.selectedItemText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Professional Profile Dropdown Modal */}
      <Modal
        visible={openDropdown === "professional"}
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
            {professionalOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setTUserProfileId2(option.value);
                  setOpenDropdown(null);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    tUserProfileId2 === option.value && styles.selectedItemText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Time Picker */}
      {showDateTimePicker && (
        <DateTimePicker
          value={scheduledStart ? new Date(scheduledStart) : new Date()}
          mode={dateTimeMode}
          display="spinner"
          onValueChange={handleDateTimePicker}
        />
      )}
    </>
  );
}
