import AppointmentDetailsScreen from "./src/screens/AppointmentDetailsScreen";
import AppointmentFormScreen from "./src/screens/AppointmentFormScreen";

import "react-native-gesture-handler";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainTabs from "./src/components/MainTabs";

import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";

import { themes } from "./src/theme/theme";

import logo from "./assets/sb-logo-png.png";

import ArticleDetailsScreen from "./src/screens/ArticleDetailsScreen";
import AnimalFormScreen from "./src/screens/AnimalFormScreen";
import AnimalCreateScreen from "./src/screens/AnimalCreateScreen";
import AboutScreen from "./src/screens/AboutScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppointmentsProvider } from "./src/context/AppointmentsProvider";
import { AuthProvider, useAuth } from "./src/context/AuthProvider";
import { useReminderNavigation } from "./src/hooks/useReminderNavigation";
import { LanguageProvider, useTranslation } from "./src/i18n";

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const queryClient = new QueryClient();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Cadastro" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppContent() {
  const theme = useTheme();

  const styles = createStyles(theme);

  const { user, guardian, isLoading, sessionExpired } = useAuth();
  const { t } = useTranslation();

  const navigationRef = useNavigationContainerRef();
  const [isNavigationReady, setNavigationReady] = useState(false);
  const isLoggedIn = !!user && !!guardian && !sessionExpired;

  useReminderNavigation(navigationRef, isLoggedIn && isNavigationReady);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppointmentsProvider>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => setNavigationReady(true)}
        >
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

                      <Text style={styles.headerListTitle}>SuperBicho</Text>
                    </View>
                  ),
                }}
              />

              <Stack.Screen
                name="ArticleDetailsScreen"
                component={ArticleDetailsScreen}
                options={({ navigation }) => ({
                  headerBackButtonDisplayMode: "minimal",
                  headerTintColor: theme.colors.text,


                  title: "",
                  headerTitleStyle: {
                    color: theme.colors.text,
                  },
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderBottomColor: theme.colors.border,
                  },

                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.popToTop()}>
                      <Text style={styles.navButton}>{t("nav.start")}</Text>
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="AppointmentDetailsScreen"
                component={AppointmentDetailsScreen}
                options={({ navigation }) => ({
                  headerBackButtonDisplayMode: "minimal",
                  headerTintColor: theme.colors.text,
                  title: t("nav.moreInfo"),
                  headerTitleStyle: {
                    color: theme.colors.text,
                  },
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderBottomColor: theme.colors.border,
                  },
                })}
              />

              <Stack.Screen
                name="AppointmentFormScreen"
                component={AppointmentFormScreen}
                options={({ navigation }) => ({
                  headerBackButtonDisplayMode: "minimal",
                  headerTintColor: theme.colors.text,
                  title: t("nav.moreInfo"),
                  headerTitleStyle: {
                    color: theme.colors.text,
                  },
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderBottomColor: theme.colors.border,
                  },
                })}
              />

              <Stack.Screen
                name="AnimalFormScreen"
                component={AnimalFormScreen}
                options={() => ({
                  headerBackButtonDisplayMode: "minimal",
                  headerTintColor: theme.colors.text,
                  headerTitleStyle: {
                    color: theme.colors.text,
                  },
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderBottomColor: theme.colors.border,
                  },
                })}
              />

              <Stack.Screen
                name="AnimalCreateScreen"
                component={AnimalCreateScreen}
                options={() => ({
                  headerBackButtonDisplayMode: "minimal",
                  headerTintColor: theme.colors.text,
                  title: t("nav.newPet"),
                  headerTitleStyle: {
                    color: theme.colors.text,
                  },
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderBottomColor: theme.colors.border,
                  },
                })}
              />
              <Stack.Screen
                name="AboutScreen"
                component={AboutScreen}
                options={() => ({
                  headerBackButtonDisplayMode: "minimal",
                  headerTintColor: theme.colors.text,
                  title: t("nav.about"),
                  headerTitleStyle: {
                    color: theme.colors.text,
                  },
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderBottomColor: theme.colors.border,
                  },
                })}
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
        <LanguageProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

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
