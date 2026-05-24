import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Swipeable } from "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";

import animals from "../data/animals.json";

import { useTheme } from "../theme/ThemeProvider";
import { themes } from "../theme/theme";

export default function ServiceRow({ appointment }: any) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const animal = animals.find((item) => item.id === appointment.tAnimalId);

  const date = new Date(appointment.scheduledStart);

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
          <Text style={styles.title}>{appointment.appointmentType}</Text>

          <Text style={styles.subtitle}>{animal?.name}</Text>
        </View>

        <View style={styles.rightArea}>
          <Text style={styles.date}>{date.toLocaleDateString("pt-BR")}</Text>

          <Text style={styles.time}>
            {date.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>Reagendar</Text>
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
