import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Button, Text } from "react-native";
import { useDispatch } from 'react-redux';
import { signOutUser } from '@/features/auth/authThunk';
import { AppDispatch } from '@/store/store';

export default function Profile() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleSignOut = async () => {
    dispatch(signOutUser())
    router.replace('/auth');
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
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
