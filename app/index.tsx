import { useRouter } from "expo-router";
import { View, Button, StyleSheet } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="Login" onPress={() => router.push("/(auth)/login")} />
      <Button title="Register" onPress={() => router.push("/(auth)/register")} />
      <Button title="Go to Tabs" onPress={() => router.push("/(tabs)/dashboard")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
