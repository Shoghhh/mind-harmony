import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Button } from "react-native";

export default function Dashboard() {
  const router = useRouter()

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));

      router.replace("/auth");
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleSignOut} title="Logout" />
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
