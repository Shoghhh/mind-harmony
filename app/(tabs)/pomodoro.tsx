import { View, Text, StyleSheet } from "react-native";

export default function Pomodoro() {
  return (
    <View style={styles.container}>
      <Text>Pomodoro Screen</Text>
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
