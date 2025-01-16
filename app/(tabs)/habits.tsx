import { View, Text, StyleSheet } from "react-native";

export default function habit() {
  return (
    <View style={styles.container}>
      <Text>Habit Screen</Text>
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
