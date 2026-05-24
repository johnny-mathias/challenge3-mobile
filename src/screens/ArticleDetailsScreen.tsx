import { View, Text, StyleSheet, ScrollView } from "react-native";

import { useRoute } from "@react-navigation/native";

import { themes } from "../theme/theme";
import { useTheme } from "../theme/ThemeProvider";

import type { Article } from "../types/article";

export default function ArticleDetailsScreen() {
  const route = useRoute();

  const { article } = route.params as { article: Article };

  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>

        {article.authorName && (
          <Text style={styles.author}>{article.authorName}</Text>
        )}

        <Text style={styles.date}>
          {new Date(article.createdAt).toLocaleDateString()}
        </Text>

        {article.tags && (
          <View style={styles.tags}>
            {article.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>
        )}

        <ScrollView
          style={styles.articleContainer}
          contentContainerStyle={styles.articleContent}
        >
          {article.description && (
            <Text style={styles.description}>{article.description}</Text>
          )}

          <Text style={styles.text}>{article.content}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 12,
    },

    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },

    author: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },

    date: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
      marginBottom: 12,
    },

    tags: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 16,
    },

    tag: {
      backgroundColor: theme.colors.backgroundSecondary,
      color: theme.colors.text,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      marginRight: 8,
      marginBottom: 8,
    },

    articleContainer: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSecondary,
      padding: 14,
      borderRadius: 12,
      marginBottom: 12,
    },

    articleContent: {
      flexGrow: 1,
    },

    description: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 20,
      lineHeight: 28,
    },

    text: {
      fontSize: 17,
      color: theme.colors.text,
      lineHeight: 30,
    },
  });
