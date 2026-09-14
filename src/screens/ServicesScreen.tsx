import {
  ActivityIndicator,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import ServiceRow from "../components/ServiceRow";
import { useAppointments } from "../context/AppointmentsProvider";
import { useTheme } from "../theme/ThemeProvider";
import { themes } from "../theme/theme";

export default function ServicesScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  const { appointments, isLoading, isError } = useAppointments();

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
        <Text style={styles.errorText}>Não foi possível carregar seus agendamentos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          padding: 20,
        }}
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Quando você possuir algum agendamento, ele deverá aparecer aqui
          </Text>
        }
        renderItem={({ item }) => <ServiceRow appointment={item} />}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AppointmentFormScreen")}
      >
        <Text style={styles.fabText}>Agendar</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
    },

    errorText: {
      color: theme.colors.textSecondary,
      fontSize: 15,
    },

    emptyText: {
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: 40,
    },

    fab: {
      position: "absolute",
      right: 15,
      bottom: 25,
      width: 130,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.tertiary,
      alignItems: "center",
      justifyContent: "center",
    },

    fabText: {
      color: theme.colors.add,
      fontSize: 20,
      fontWeight: "bold",
    },
  });
