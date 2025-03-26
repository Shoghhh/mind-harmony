import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";
import { View, Text, StyleSheet } from "react-native";

export default function Pomodoro() {
  return (
    <View style={styles.container}>
      {/* <Text>Pomodoro Screen</Text> */}


      <PomodoroTimer />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red'
    // justifyContent: "center",
    // alignItems: "center",
  },
});
