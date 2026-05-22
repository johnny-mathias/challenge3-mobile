import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainTabs from "./src/components/MainTabs";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";
import { themes } from "./src/theme/theme";
import HistoryScreen from "./src/screens/HistoryScreen";
import ServicesScreen from "./src/screens/ServicesScreen";
import logo from "./assets/sb-logo-png.png";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function AppContent() {
  const theme = useTheme();

  const styles = createStyles(theme);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{
              headerShown: true,
              statusBarStyle: "light",
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerShadowVisible: false,
              headerTitleAlign: "left",
              headerTitle: () => (
                <View style={styles.headerContainer}>
                  <Image source={logo} style={{ width: 100, height: 100 }} />

                  <Text style={styles.headerListTitle}>
                    {" "}AdotePet
                  </Text>
                </View>
              ),
            }}
          />

          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />

          <Stack.Screen
            name="History"
            component={HistoryScreen}
          />

          <Stack.Screen
            name="Services"
            component={ServicesScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },

    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 20,
      marginLeft: 10,
    },

    headerListTitle: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#fff",
    },

    headerDetailTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
    },
  });