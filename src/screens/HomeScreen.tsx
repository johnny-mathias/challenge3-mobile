import { View, Text, StyleSheet, Image } from "react-native";
import logo from '../../assets/clyvo-logo1.png';
import Article from "../components/Article";

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Article/>

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