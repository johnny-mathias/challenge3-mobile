import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Swipeable } from "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../theme/ThemeProvider";
import { formatIsoDate, useTranslation } from "../i18n";
import { themes } from "../theme/theme";

import type { AppointmentDTO } from "../types/api.types";

export default function ServiceRow({ appointment }: { appointment: AppointmentDTO }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  function handleEdit() {
    navigation.navigate("AppointmentFormScreen", {
      appointment,
    });
  }

  return (
    <Swipeable onSwipeableOpen={handleEdit} renderLeftActions={() => null}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.container}
        onPress={() =>
          navigation.navigate("AppointmentDetailsScreen", {
            appointment,
          })
        }
      >
        <View>
          <Text style={styles.title}>{appointment.animalName}</Text>

          <Text style={styles.subtitle}>{appointment.clinicName}</Text>
        </View>

        <View style={styles.rightArea}>
          <Text style={styles.date}>{formatIsoDate(appointment.date)}</Text>

          <Text style={styles.time}>{appointment.time.slice(0, 5)}</Text>

          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>{t("appointments.reschedule")}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundSecondary,
      padding: 18,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },

    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },

    subtitle: {
      marginTop: 6,
      color: theme.colors.textSecondary,
    },

    rightArea: {
      alignItems: "flex-end",
    },

    date: {
      fontSize: 13,
      color: theme.colors.text,
    },

    time: {
      fontSize: 13,
      marginBottom: 10,
      color: theme.colors.text,
    },

    button: {
      backgroundColor: theme.colors.blue1,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },

    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
  });
