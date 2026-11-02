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

import { themes } from "../theme/theme";
import { useTheme } from "../theme/ThemeProvider";
import { useTranslation } from "../i18n";
import ServiceRow from "../components/ServiceRow";
import { useAppointments } from "../context/AppointmentsProvider";
import { useArticles } from "../hooks/queries";
import { useRefreshControl } from "../hooks/useRefreshControl";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { appointments, isLoading, isError, refetch } = useAppointments();
  // Artigos vêm do Oracle (T_ARTICLE) pelo backend Node
  const articles = useArticles();
  const refreshControl = useRefreshControl(articles.refetch, refetch);
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} refreshControl={refreshControl}>
      <View style={{ marginBottom: 12 }}>
        {articles.isLoading && (
          <View style={styles.articlesState}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}

        {articles.isError && (
          <View style={styles.articlesState}>
            <Text style={styles.errorText}>{t("articles.loadError")}</Text>
            <TouchableOpacity onPress={() => articles.refetch()}>
              <Text style={styles.retryText}>{t("common.retry")}</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={articles.data ?? []}
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
        <Text style={styles.appointmentsTitle}>{t("appointments.title")}</Text>

        {isLoading && (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        )}

        {isError && (
          <Text style={styles.errorText}>{t("appointments.loadError")}</Text>
        )}

        {!isLoading && !isError && (
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{
            }}
            data={appointments}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>{t("appointments.empty")}</Text>
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

    articlesState: {
      minHeight: 180,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    retryText: {
      marginTop: 10,
      color: theme.colors.primary,
      fontWeight: "bold",
      fontSize: 15,
    },

    cardWrapper: {
      width,
      paddingHorizontal: 12,
    },
  });
