import { View, StyleSheet } from "react-native";
import { Text, Title } from "react-native-paper";

export default function Favorites() {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Favoritos</Title>
      <Text>Em breve...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 10 },
});
