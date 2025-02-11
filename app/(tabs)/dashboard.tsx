import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { View, StyleSheet, Button } from "react-native";
// import auth from '@react-native-firebase/auth'

export default function Dashboard() {
  // const user = auth().currentUser

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:');
    }
  }
  return (
    <View style={styles.container}>
      {/* <Text>{user?.email}</Text> */}
      <Button onPress={handleSignOut} title="Logout"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f8f8f8',
  },
});
