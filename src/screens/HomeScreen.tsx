import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import Article from "../components/Article";

import articles from "../data/articles.json";

import { themes } from "../theme/theme";
import { useTheme } from "../theme/ThemeProvider";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
    const navigation = useNavigation();

    const theme = useTheme();
    const styles = createStyles(theme);

    return (
            <View style={styles.container}>
                <FlatList 
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    data={articles}
                    keyExtractor={(item) =>
                        item.id.toString()
                    }
                    contentContainerStyle={
                        styles.list
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.cardWrapper}
                            onPress={() =>
                                navigation.navigate(
                                    "ArticleDetailsScreen",
                                    { article: item }
                                )
                            }
                        >
                            <Article
                                article={item}
                            />
                        </TouchableOpacity>
                    )}
                />
            </View>
    );
}

const createStyles = (
    theme: (typeof themes)["light"]
) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                theme.colors.background,
            justifyContent: "center",
        },

        list: {
            paddingHorizontal: 12,
        },

        cardWrapper: {
            width: width - 24,
            marginHorizontal: 6,
        },
    });