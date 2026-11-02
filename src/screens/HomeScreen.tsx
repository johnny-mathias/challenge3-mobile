import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import Article from "../components/Article";

import articles from "../data/articles.json";

import { themes } from "../theme/theme";
import { useTheme } from "../theme/ThemeProvider";
import ServiceRow from "../components/ServiceRow";
import { useAppointments } from "../context/AppointmentsProvider";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { appointments, isLoading, isError } = useAppointments();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: 12 }}>
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.cardWrapper}
              onPress={() =>
                navigation.navigate("ArticleDetailsScreen", {
                  article: item,
                })
              }
            >
              <Article article={item} />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.appointmentsContainer}>
        <Text style={styles.appointmentsTitle}>Agendamentos</Text>

        {isLoading && (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        )}

        {isError && (
          <Text style={styles.errorText}>Não foi possível carregar seus agendamentos</Text>
        )}

        {!isLoading && !isError && (
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{
            }}
            data={appointments}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Quando você possuir algum agendamento, ele deverá aparecer aqui
              </Text>
            }
            renderItem={({ item }) => <ServiceRow appointment={item} />}
          />
        )}
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    appointmentsContainer: {
      marginTop: 12,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    appointmentsTitle: {
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 12,
      textAlign: "center",
      color: theme.colors.primary,
    },
    errorText: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      textAlign: "center",
    },
    emptyText: {
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: 12,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    cardWrapper: {
      width,
      paddingHorizontal: 12,
    },
  });
