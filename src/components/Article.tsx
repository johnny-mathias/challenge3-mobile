import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "../theme/ThemeProvider";
import { themes } from "../theme/theme";

import type { Article as ArticleType } from "../types/article";

export default function Article({ article }: { article: ArticleType }) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{article.title}</Text>

        {article.authorName && (
          <Text style={styles.subtitle}>{article.authorName}</Text>
        )}

        <Text style={styles.date}>
          {new Date(article.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      </View>

      {article.description && (
        <Text numberOfLines={3} style={styles.description}>
          {article.description}
        </Text>
      )}
    </View>
  );
}

const createStyles = (theme: (typeof themes)["light"]) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundSecondary,
      padding: 16,
      borderRadius: 16,
    },

    header: {
      marginBottom: 10,
    },

    title: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: "bold",
    },

    subtitle: {
      color: theme.colors.textSecondary,
      marginTop: 4,
      fontSize: 14,
    },

    date: {
      color: theme.colors.textSecondary,
      marginTop: 4,
      fontSize: 12,
    },

    description: {
      color: theme.colors.text,
      lineHeight: 22,
    },
  });
