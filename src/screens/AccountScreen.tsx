import { FlatList, StyleSheet, View } from "react-native";

import SettingsRow from "../components/SettingsRow";

import { useSettings } from "../hooks/queries";

import { useTheme, useThemeController } from "../theme/ThemeProvider";
import { themes } from "../theme/theme";

export default function AccountScreen() {
  const theme = useTheme();

  const styles = createStyles(theme);

  const { data: settings = [] } = useSettings();

  const { toggleTheme } =
  useThemeController();

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
