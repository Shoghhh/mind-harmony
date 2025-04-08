import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Box, Button, Image, VStack } from "native-base";
import { useFonts, Borel_400Regular } from '@expo-google-fonts/borel';
import { LinearGradient } from 'expo-linear-gradient';

GoogleSignin.configure({
  webClientId: '602928549917-09l26k2hmkgqjn096f913ad2l5kttjup.apps.googleusercontent.com',
});

export default function HomeScreen() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [fontsLoaded] = useFonts({
    Borel_400Regular
  });

  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (initializing) return;
    if (user) {
      router.replace("/(tabs)/dashboard");
    }
  }, [initializing, user, router]);

  if (initializing || !fontsLoaded) return null;

  return (
    <Box flex={1} justifyContent={'space-between'}>
      <LinearGradient
        colors={['#e3e9ff', '#eae5ff']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      />

      <Image
        source={require('../assets/images/welcome.png')}
        alt="Alternate Text"
        width="full"
        resizeMode="stretch"
        flex={5}
      />
      <LinearGradient
        colors={['#e3e9ff', 'white']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
      >
        <Button
          bg={'primary.600'}
          _pressed={{ opacity: 0.8, bg: 'primary.550' }}
          _text={{ fontWeight: 'bold' }}
          py={4}
          rounded="xl"
          shadow={3}
          mx={6}
          mb={10}
          onPress={() => router.push('/auth')}
        >
          Get Started
        </Button>
      </LinearGradient>
    </Box>
  );
}