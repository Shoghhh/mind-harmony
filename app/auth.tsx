import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
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
import { loginWithEmail, loginWithGoogle, resetPassword, signUpWithEmail } from "@/features/auth/authThunk";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setToastMessage } from "@/features/auth/authSlice";

GoogleSignin.configure({
    webClientId: '602928549917-09l26k2hmkgqjn096f913ad2l5kttjup.apps.googleusercontent.com',
});

export default function AuthScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authAction, setAuthAction] = useState<'login' | 'signup' | 'resetpass'>('signup');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, user, googleLoading } = useSelector((state: RootState) => state.auth);
    const [hasNavigatedToVerify, setHasNavigatedToVerify] = useState(false);

    useEffect(() => {
        if (user && !hasNavigatedToVerify) {
            if (user.emailVerified) {
                router.replace('/(tabs)/dashboard');
            } else {
                router.push('/verify');
                setHasNavigatedToVerify(true);
            }
        }
    }, [user]);

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, [authAction, user]);


    const handleEmailAuth = async () => {
        try {
            if (!email || !password) {
                dispatch(setToastMessage({ title: 'Error', status: 'error', description: 'Please enter both email and password' }));
                return;
            }

            if (authAction === 'signup') {
                await dispatch(signUpWithEmail(email, password));
            } else {
                await dispatch(loginWithEmail(email, password));
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'An unexpected error occurred during authentication.';
            dispatch(setToastMessage({ title: 'Error', status: 'error', description: errorMessage }));
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await dispatch(loginWithGoogle());
        } catch (error: any) {
            const errorMessage = error?.message || 'An unexpected error occurred during Google sign-in.';
            dispatch(setToastMessage({
                title: 'Google Sign-In Error',
                status: 'error',
                description: errorMessage
            }));
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            dispatch(setToastMessage({ title: 'Error', status: 'error', description: 'Please enter your email first' }));
            return;
        }
        try {
            const success = await dispatch(resetPassword(email));

            if (success) {
                setEmail('');
                setAuthAction('login');
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'An unexpected error occurred during password reset.';
            dispatch(setToastMessage({
                title: 'Password Reset Error',
                status: 'error',
                description: errorMessage
            }));
        }
    };

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
                                isDisabled={loading || googleLoading}
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
                                    isDisabled={loading || googleLoading}
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