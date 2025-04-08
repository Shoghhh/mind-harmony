import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, TouchableWithoutFeedback } from "react-native";
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    Box,
    Button,
    Center,
    FormControl,
    Input,
    Link,
    Text,
    VStack,
    useTheme,
    useToast
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { MyToast } from "@/components/MyToast";

GoogleSignin.configure({
    webClientId: '602928549917-09l26k2hmkgqjn096f913ad2l5kttjup.apps.googleusercontent.com',
});

export default function AuthScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const toast = useToast();
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [authAction, setAuthAction] = useState<'login' | 'signup' | 'resetpass'>('signup');

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            setUser(user);
            if (initializing) setInitializing(false);
        });
        return subscriber;
    }, []);

    useEffect(() => {
        if (!initializing && user) {
            router.replace("/(tabs)/dashboard");
        }
    }, [initializing, user, router]);

    useEffect(() => {
        setEmail('')
        setPassword('')
    }, [authAction])

    const showToast = (title: string, status: 'success' | 'error' | 'warning' | 'info', description?: string) => {
        toast.show({
            render: () => (
                <MyToast
                    title={title}
                    description={description}
                    status={status}
                />
            ),
            placement: 'top',
            duration: 2000,
        });
    };

    const handleGoogleSignIn = async () => {
        try {
            setGoogleLoading(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const signInResult = await GoogleSignin.signIn();
            const tokens = await GoogleSignin.getTokens();
            const idToken = tokens.idToken;

            if (!idToken) throw new Error('No ID token received');

            const credential = auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(credential);
            showToast('Success', 'success', 'Signed in with Google successfully');
        } catch (error) {
            console.error(error);
            showToast('Error', 'error', 'Google sign-in failed. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleEmailAuth = async () => {
        try {
            if (!email || !password) {
                showToast('Error', 'error', 'Please enter both email and password');
                return;
            }

            if (authAction === 'signup' && password.length < 6) {
                showToast('Error', 'error', 'Password should be at least 6 characters');
                return;
            }

            setLoading(true);

            if (authAction === 'login') {
                await auth().signInWithEmailAndPassword(email, password);
                showToast('Success', 'success', 'Signed in successfully');
            } else {
                const userCredential = await auth().createUserWithEmailAndPassword(email, password);
                await userCredential.user.sendEmailVerification();
                showToast(
                    'Success',
                    'success',
                    'Account created! Please verify your email.'
                );
            }
        } catch (error: any) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthError = (error: any) => {
        console.error(error);
        let message = "Authentication failed. Please try again.";

        switch (error.code) {
            case 'auth/user-not-found':
                message = "No account found with this email.";
                break;
            case 'auth/wrong-password':
                message = "Incorrect password.";
                break;
            case 'auth/email-already-in-use':
                message = "This email is already registered.";
                break;
            case 'auth/invalid-email':
                message = "Please enter a valid email address.";
                break;
            case 'auth/weak-password':
                message = "Password should be at least 6 characters.";
                break;
            case 'auth/operation-not-allowed':
                message = "Email/password accounts are not enabled.";
                break;
        }

        showToast('Error', 'error', message);
    };

    const handlePasswordReset = async () => {
        if (!email) {
            showToast('Error', 'error', 'Please enter your email first');
            return;
        }
        setLoading(true)
        try {
            // await auth().sendPasswordResetEmail(email);
            showToast('Success', 'success', 'Password reset email sent. Check your inbox.');
            setEmail('')
            setAuthAction('login')
        } catch (error) {
            showToast('Error', 'error', 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false)
        }
    };

    if (initializing) {
        return (
            <Center flex={1}>
                <ActivityIndicator size="large" />
            </Center>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Center flex={1} p="6" justifyContent={'center'}>
                <Box flex={2} justifyContent={'flex-end'} >
                    {authAction === 'signup' && <Text
                        fontSize="5xl"
                        textAlign="center"
                        lineHeight="2xl"
                        style={{ fontFamily: "Borel_400Regular" }}
                        color="primary.600"

                    >
                        Welcome
                    </Text>}
                </Box>
                <VStack space={4} w="100%" flex={6}>
                    <Text
                        fontSize="3xl"
                        textAlign="center"
                        lineHeight="2xl"
                        style={{ fontFamily: "Borel_400Regular" }}
                        color="primary.600"
                    >
                        {authAction === 'login' ? 'Sign in' : authAction === 'signup' ? 'Sign up' : 'Reset Password'}
                    </Text>
                    <Box w="100%" >
                        <FormControl>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input
                                height={50}
                                borderRadius={"lg"}
                                backgroundColor={"neutral.white"}
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                isDisabled={loading}
                            />
                        </FormControl>

                        {authAction !== 'resetpass' && (
                            <FormControl mt="4">
                                <FormControl.Label>Password</FormControl.Label>
                                <Input
                                    height={50}
                                    borderRadius={"lg"}
                                    backgroundColor={"neutral.white"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    type="password"
                                    isDisabled={loading}
                                />
                            </FormControl>
                        )}

                        {authAction === 'login' && (
                            <Link
                                color={'primary.200'}
                                alignSelf="flex-end"
                                mt="2"
                                onPress={() => setAuthAction('resetpass')}
                            >
                                Forgot password?
                            </Link>
                        )}
                    </Box>

                    {authAction === 'resetpass' ?
                        <Button
                            onPress={handlePasswordReset}
                            isLoading={loading}
                            bg={'primary.600'}
                            _pressed={{ opacity: 0.8, bg: 'primary.550' }}
                            _text={{ fontWeight: 'bold' }}
                            py={4}
                            rounded="xl"
                            shadow={3}
                        >
                            Reset Password
                        </Button> : <>
                            <Button
                                onPress={handleEmailAuth}
                                isLoading={loading}
                                bg={'primary.600'}
                                _pressed={{ opacity: 0.8, bg: 'primary.550' }}
                                _text={{ fontWeight: 'bold' }}
                                py={4}
                                rounded="xl"
                                shadow={3}
                            >
                                {authAction === 'login' ? 'Sign In' : 'Create Account'}
                            </Button>

                            <Button
                                onPress={handleGoogleSignIn}
                                isLoading={googleLoading}
                                bg={'neutral.white'}
                                leftIcon={<Ionicons name="logo-google" size={20} color={colors.primary[600]} />}
                                _pressed={{ opacity: 0.8, bg: 'neutral.white' }}
                                _text={{ fontWeight: 'bold', color: 'primary.600' }}
                                py={4}
                                rounded="xl"
                                shadow={3}
                            >
                                Continue with Google
                            </Button>
                        </>}

                    <Link
                        onPress={() => setAuthAction(authAction === 'login' ? 'signup' : 'login')}
                        alignSelf={'center'}
                        mt="2"
                    >
                        {authAction === 'login'
                            ? "Don't have an account? Sign up"
                            : "Already have an account? Sign in"}
                    </Link>
                </VStack>
            </Center>
        </TouchableWithoutFeedback>
    );
}