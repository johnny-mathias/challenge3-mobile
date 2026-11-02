import { FlatList, StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import SettingsRow from "../components/SettingsRow";

import settingsJson from "../data/settings.json";

import { Setting } from "../types/settings.types";

import { useAppointments } from "../context/AppointmentsProvider";
import { useAuth } from "../context/AuthProvider";
import { useTranslation } from "../i18n";
import type { TranslationKey } from "../i18n/translations";
import { useTheme, useThemeController } from "../theme/ThemeProvider";
import { themes } from "../theme/theme";

// Nome exibido de cada opção de settings.json, no idioma atual
const SETTING_TITLES: Record<string, TranslationKey> = {
  theme: "account.theme",
  notifications: "account.notifications",
  language: "account.language",
};

// Nome de cada idioma na própria língua, para quem não lê a outra achar o seu
const LANGUAGE_NAMES = {
  pt: "Português (Brasil)",
  en: "English",
};

export default function AccountScreen() {
  const theme = useTheme();
  const { t, language, toggleLanguage } = useTranslation();

  const styles = createStyles(theme);

  const settings = settingsJson.settings as Setting[];

  const { themeName, toggleTheme } =
  useThemeController();

  const { guardian, logout } = useAuth();
  const { remindersEnabled, setRemindersEnabled } = useAppointments();

  const navigation = useNavigation<any>();

  function renderSetting(item: Setting) {
    const title = t(SETTING_TITLES[item.id] ?? "account.theme");

    switch (item.id) {
      case "theme": {
        const isDark = themeName === "dark";
        return (
          <SettingsRow
            title={title}
            accessibilityLabel={`${title}: ${t(isDark ? "account.themeDark" : "account.themeLight")}`}
            accessory={
              <MaterialIcons
                name={isDark ? "dark-mode" : "light-mode"}
                size={24}
                color={isDark ? theme.colors.text : theme.colors.tertiary}
              />
            }
            onPress={toggleTheme}
          />
        );
      }

      case "notifications":
        return (
          <SettingsRow
            title={title}
            value={t(remindersEnabled ? "account.on" : "account.off")}
            onPress={() => setRemindersEnabled(!remindersEnabled)}
          />
        );

      case "language":
        return (
          <SettingsRow
            title={title}
            value={LANGUAGE_NAMES[language]}
            onPress={toggleLanguage}
          />
        );

      default:
        return <SettingsRow title={item.name} value={item.default} onPress={() => {}} />;
    }
  }

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
        extraData={[themeName, language, remindersEnabled]}
        renderItem={({ item }) => renderSetting(item)}
      />

      <SettingsRow
        title={t("account.about")}
        value="›"
        onPress={() => navigation.navigate("AboutScreen")}
      />

      <SettingsRow title={t("account.logout")} value="" onPress={logout} />
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
