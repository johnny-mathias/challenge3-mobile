import AppointmentDetailsScreen from "./src/screens/AppointmentDetailsScreen";
import AppointmentFormScreen from "./src/screens/AppointmentFormScreen";

import "react-native-gesture-handler";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainTabs from "./src/components/MainTabs";

import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";

import { themes } from "./src/theme/theme";

import logo from "./assets/sb-logo-png.png";

import ArticleDetailsScreen from "./src/screens/ArticleDetailsScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppointmentsProvider } from "./src/context/AppointmentsProvider";

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient();

function AppContent() {
  const theme = useTheme();

  const styles = createStyles(theme);

  return (
    <QueryClientProvider client={queryClient}>
      <AppointmentsProvider>  
        <NavigationContainer>
          <SafeAreaProvider>
            <Stack.Navigator initialRouteName="MainTabs">
              <Stack.Screen
                name="MainTabs"
                component={MainTabs}
                options={{
                  headerStyle: {
                    backgroundColor: theme.colors.primary,
                  },

                  headerShadowVisible: false,

                  headerTitleAlign: "left",

                  headerTitle: () => (
                    <View style={styles.headerContainer}>
                      <Image
                        source={logo}
                        style={{
                          width: 55,
                          height: 55,
                        }}
                      />

                      <Text style={styles.headerListTitle}>AdotePet</Text>
                    </View>
                  ),
                }}
              />

              <Stack.Screen
                name="ArticleDetailsScreen"
                component={ArticleDetailsScreen}
                options={({ navigation }) => ({
                  headerBackButtonDisplayMode: "minimal",

                  title: "",

                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.popToTop()}>
                      <Text style={styles.navButton}>Início</Text>
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="AppointmentDetailsScreen"
                component={AppointmentDetailsScreen}
              />

              <Stack.Screen
                name="AppointmentFormScreen"
                component={AppointmentFormScreen}
              />
            </Stack.Navigator>
          </SafeAreaProvider>
        </NavigationContainer>
      </AppointmentsProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    navButton: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },

    headerContainer: {
      flexDirection: "row",

      alignItems: "center",

      gap: 8,
    },

    headerListTitle: {
      fontSize: 28,

      fontWeight: "bold",

      color: "#fff",
    },

    headerDetailTitle: {
      fontSize: 20,

      fontWeight: "bold",

      color: "#fff",
    },
  });
