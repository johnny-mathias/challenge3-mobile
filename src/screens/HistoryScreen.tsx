import { Text, StyleSheet, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { themes } from "../theme/theme";


export default function HistoryScreen() {
  const theme = useTheme()
  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      <Text>History Screen</Text>
    </View>
  )
}

const createStyles = (theme: (typeof themes)['light'] ) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});