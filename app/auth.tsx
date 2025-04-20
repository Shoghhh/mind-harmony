import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, Image, Platform, Alert, View, TextInput } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as ImagePicker from 'expo-image-picker';
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
    Avatar,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { loginWithEmail, loginWithGoogle, resetPassword, signUpWithEmail } from "@/features/auth/authThunk";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setToastMessage, setAuthAction } from "@/features/auth/authSlice";

GoogleSignin.configure({
    webClientId: '602928549917-09l26k2hmkgqjn096f913ad2l5kttjup.apps.googleusercontent.com',
});

export default function AuthScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { loading, user, googleLoading, authAction } = useSelector((state: RootState) => state.auth);
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
        setName('');
        setImage(null);
    }, [authAction, user]);


    const handleEmailAuth = async () => {
        try {
            if (authAction === 'signup') {
                if (!email || !password || !name) {
                    dispatch(setToastMessage({ title: 'Error', status: 'error', description: 'Please enter all required fields' }));
                    return;
                }
                await dispatch(signUpWithEmail(email, password, name, image));
            } else {
                if (!email || !password) {
                    dispatch(setToastMessage({ title: 'Error', status: 'error', description: 'Please enter both email and password' }));
                    return;
                }
                await dispatch(loginWithEmail(email, password));
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'An unexpected error occurred during authentication.';
            dispatch(setToastMessage({ title: 'Error', status: 'error', description: errorMessage }));
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need access to your photos to set a profile picture');
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled || !result.assets?.[0]?.uri) {
                return null;
            }
            let selectedImage = result.assets[0].uri;
            setImage(selectedImage);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
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
                dispatch(setAuthAction('login'));
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    padding: 24,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                    keyboardShouldPersistTaps="handled"
                >

                    <Box flex={2} justifyContent={'flex-end'} mt={10} >
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
                        <Box w="100%">
                            {authAction === 'signup' && (
                                <>
                                    <Center mb={4}>
                                        <Pressable onPress={pickImage}>
                                            <Avatar size="xl" bg={'white'} source={image ? { uri: image } : undefined}>
                                                {!image && <Ionicons name="person" size={40} color={colors.primary[600]} />}
                                            </Avatar>
                                        </Pressable>
                                        <Text mt={2} color="primary.600" fontSize="sm">
                                            Tap to add profile photo
                                        </Text>
                                    </Center>
                                    <FormControl>
                                        <FormControl.Label>Full Name</FormControl.Label>
                                        <TextInput
                                            className="h-[50px] rounded-lg bg-white px-4 text-base"
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChangeText={setName}
                                            editable={!loading && !googleLoading}
                                        />
                                    </FormControl>
                                </>
                            )}

                            <FormControl mt={authAction === 'signup' ? 4 : 0}>
                                <FormControl.Label>Email</FormControl.Label>
                                <TextInput
                                    className="h-[50px] rounded-lg bg-white px-4 text-base"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    editable={!loading && !googleLoading}
                                />

                            </FormControl>

                            {authAction !== 'resetpass' && (
                                <FormControl mt="4">
                                    <FormControl.Label>Password</FormControl.Label>
                                    <TextInput
                                        className="h-[50px] rounded-lg bg-white px-4 text-base"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={true}
                                        editable={!loading && !googleLoading}
                                    />
                                </FormControl>
                            )}

                            {authAction === 'login' && (
                                <Link
                                    color={'primary.200'}
                                    alignSelf="flex-end"
                                    mt="2"
                                    onPress={() => dispatch(setAuthAction('resetpass'))}
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
                            onPress={() => dispatch(setAuthAction(authAction === 'login' ? 'signup' : 'login'))}
                            alignSelf={'center'}
                            mt="2"
                        >
                            {authAction === 'login'
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in"}
                        </Link>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}