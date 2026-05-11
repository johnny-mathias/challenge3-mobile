import { Text, StyleSheet, View } from "react-native";

export default function ServicesScreen() {
  return (
    <View style={styles.container}>
      <Text>Services Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});