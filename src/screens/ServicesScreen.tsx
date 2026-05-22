import { Text, StyleSheet, View } from "react-native";
import { themes } from "../theme/theme";
import { useTheme } from "../theme/ThemeProvider";

export default function ServicesScreen() {
  const theme = useTheme()
  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      <Text>Services Screen</Text>
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