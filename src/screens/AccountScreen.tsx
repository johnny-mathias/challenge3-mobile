import { FlatList, StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import SettingsRow from "../components/SettingsRow";

import settingsJson from "../data/settings.json";

import { Setting } from "../types/settings.types";

import { useAuth } from "../context/AuthProvider";
import { useTheme, useThemeController } from "../theme/ThemeProvider";
import { themes } from "../theme/theme";

export default function AccountScreen() {
  const theme = useTheme();

  const styles = createStyles(theme);

  const settings = settingsJson.settings as Setting[];

  const { toggleTheme } =
  useThemeController();

  const { guardian, logout } = useAuth();

  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {guardian && (
        <View style={styles.profile}>
          <Text style={styles.profileName}>{guardian.name}</Text>
          <Text style={styles.profileEmail}>{guardian.email}</Text>
        </View>
      )}

      <FlatList
        data={settings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SettingsRow
            title={item.name}
            value={item.default}
            onPress={() => {
              if (item.id === "theme") {
                toggleTheme();
              }
            }}
          />
        )}
      />

      <SettingsRow
        title="Sobre o app"
        value="›"
        onPress={() => navigation.navigate("AboutScreen")}
      />

      <SettingsRow title="Sair" value="" onPress={logout} />
    </View>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    profile: {
      padding: 20,
    },

    profileName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },

    profileEmail: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  });
