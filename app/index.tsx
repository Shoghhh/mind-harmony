import { Redirect, useRouter } from "expo-router";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Box, Button, Image } from "native-base";
import { useFonts, Borel_400Regular } from '@expo-google-fonts/borel';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

GoogleSignin.configure({
  webClientId: '602928549917-09l26k2hmkgqjn096f913ad2l5kttjup.apps.googleusercontent.com',
});

export default function HomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Borel_400Regular });
  const {user} = useSelector((state:RootState ) => state.auth)
    
  if (!fontsLoaded) return null;
  
  if (user && user.emailVerified) {
    return <Redirect href="/(tabs)/dashboard" />;
  } 
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