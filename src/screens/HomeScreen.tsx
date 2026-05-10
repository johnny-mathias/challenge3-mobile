import { View, Text, StyleSheet, Image } from "react-native";
import logo from '../../assets/clyvo-logo1.png';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Text>Home Screen</Text>
      <Image source={logo} style={{ width: 200, height: 200 }} resizeMode="center" />

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