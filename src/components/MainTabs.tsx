import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/AccountScreen";
import ServicesScreen from "../screens/ServicesScreen";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PetsScreen from "../screens/PetsScreen";
import ExportAnimalsButton from "./ExportAnimalsButton";

import { useTheme } from "../theme/ThemeProvider";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { colors } = useTheme();

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
          let iconName: string;
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
          title: "Home",
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
          title: "Serviços",
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
          title: "Pets",
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
          title: "Conta",
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
