import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/AccountScreen";
import ServicesScreen from "../screens/ServicesScreen";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PetsScreen from "../screens/PetsScreen";
import ExportAnimalsButton from "./ExportAnimalsButton";

import { useTranslation } from "../i18n";
import { useTheme } from "../theme/ThemeProvider";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;
          switch (route.name) {
            case "HomeScreen":
              iconName = "home";
              break;
            case "ServicesScreen":
              iconName = "menu";
              break;
            case "PetsScreen":
              iconName = "pets";
              break;
            case "AccountScreen":
              iconName = "account-circle";
              break;
            default:
              iconName = "error";
              break;
          }
          return <MaterialIcons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: t("nav.home"),
          headerTitleStyle: {
            color: colors.text,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.backgroundSecondary,
            borderBottomColor: colors.border,
          },
        }}
      />
      <Tab.Screen
        name="ServicesScreen"
        component={ServicesScreen}
        options={{
          title: t("nav.services"),
          headerTitleStyle: {
            color: colors.text,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.backgroundSecondary,
            borderBottomColor: colors.border,
          },
        }}
      />
      <Tab.Screen
        name="PetsScreen"
        component={PetsScreen}
        options={{
          title: t("nav.pets"),
          headerTitleStyle: {
            color: colors.text,
          },
          headerRight: () => <ExportAnimalsButton />,
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.backgroundSecondary,
            borderBottomColor: colors.border,
          },
        }}
      />
      <Tab.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{
          title: t("nav.account"),
          headerTitleStyle: {
            color: colors.text,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.backgroundSecondary,
            borderBottomColor: colors.border,
          },
        }}
      />
    </Tab.Navigator>
  );
}
