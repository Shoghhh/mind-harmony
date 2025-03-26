import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Button, StyleSheet, Text } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/(tabs)/dashboard')
    }, 1000);
  }, [])

  return (
    <View style={styles.container}>
      <Text>Welcomeeeeee</Text>
      {/* <Button title="Login" onPress={() => router.push("/(auth)/login")} /> */}
      <Button title="Register with one time sign in link" onPress={() => router.push("/auth")} />
      <Button title="Register via Google" />

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
