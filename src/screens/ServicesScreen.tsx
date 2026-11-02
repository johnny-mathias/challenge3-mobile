import {
  ActivityIndicator,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import ErrorState from "../components/ErrorState";
import ServiceRow from "../components/ServiceRow";
import { useAppointments } from "../context/AppointmentsProvider";
import { useRefreshControl } from "../hooks/useRefreshControl";
import { useTheme } from "../theme/ThemeProvider";
import { useTranslation } from "../i18n";
import { themes } from "../theme/theme";

export default function ServicesScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const { appointments, isLoading, isError, error, refetch } = useAppointments();
  const refreshControl = useRefreshControl(refetch);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title={t("appointments.loadError")}
        error={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          padding: 20,
        }}
        data={appointments}
        refreshControl={refreshControl}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t("appointments.empty")}</Text>
        }
        renderItem={({ item }) => <ServiceRow appointment={item} />}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AppointmentFormScreen")}
      >
        <Text style={styles.fabText}>{t("appointments.schedule")}</Text>
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
