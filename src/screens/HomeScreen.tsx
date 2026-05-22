import { View, Text, StyleSheet, Image } from "react-native";
import logo from '../../assets/sb-logo.png';
import Article from "../components/Article";
import { themes } from "../theme/theme";
import { useTheme } from "../theme/ThemeProvider";

export default function HomeScreen() {
    const theme = useTheme()
    const styles = createStyles(theme)

  return (
    <View style={styles.container}>

      <Article/>

    </View>
  );
}

const createStyles = (theme: (typeof themes)['light'] ) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});