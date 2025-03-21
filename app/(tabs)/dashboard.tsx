import { auth } from "@/firebase";
import { useBottomSheet } from "@/providers/BottomSheetProvider";
import { signOut } from "firebase/auth";
import { View, StyleSheet, Button, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput } from "react-native-gesture-handler";
// import auth from '@react-native-firebase/auth'

export default function Dashboard() {
  // const user = auth().currentUser
  // const { openSheet } = useBottomSheet();


  const handleSignOut = async () => {
    try {
      // await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:');
    }
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
