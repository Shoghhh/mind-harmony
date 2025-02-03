import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, KeyboardAvoidingView, Linking, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import globalTextStyles from "@/styles/globalTextStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
import { auth } from "@/firebase";

export default function AuthScreen() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const isSubscribed = useRef(true);

    const sendSignInLink = async () => {
        const actionCodeSettings = {
            url: 'https://mind--harmony.web.app/auth',
            handleCodeInApp: true,
        };

        try {
            setLoading(true);
            // await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            // console.log('Email link sent to:', email);
            // setMessage('Sign-in link sent! Check your email to complete sign-in.');

            // await AsyncStorage.setItem('emailForSignIn', email);
            AsyncStorage.removeItem('emailForSignIn')
            router.push('/todos');
        } catch (error: any) {
            console.error('Error signing up: ', error);
            setMessage('Error sending sign-in link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignInWithLink = async (url: string) => {
        const emailForSignIn = await AsyncStorage.getItem('emailForSignIn');
        if (emailForSignIn && isSignInWithEmailLink(auth, url)) {
            try {
                // await signInWithEmailLink(auth, emailForSignIn, url);
                setMessage('Sign-in successful!');
                AsyncStorage.removeItem('emailForSignIn')
                router.push('/dashboard');
            } catch (error) {
                setMessage('Error completing sign-in. Please try again.');
                console.error('Sign-in error:', error);
            }
        } else {
            setMessage('Invalid sign-in link. Please check your email and try again.');
        }
    };

    useEffect(() => {
        const handleDeepLink = async ({ url }: { url: string }) => {
            if (url && isSubscribed.current) {
                if (url.startsWith("mindharmony://auth")) {
                    await handleSignInWithLink(url);
                }
            }
        };
        Linking.addEventListener('url', handleDeepLink);
        return () => {
            isSubscribed.current = false;
        };
    }, []);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <Text style={[globalTextStyles.bold22PrimaryDark, { textAlign: 'center' }]}>Sign in</Text>
                <Text>Email</Text>
                <TextInput
                    value={email}
                    style={styles.input}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Email"
                />

                {loading ?
                    <ActivityIndicator size={'small'} style={{ margin: 25 }} />
                    : <Button onPress={sendSignInLink} title="Sign in" />}

                <Text>{message}</Text>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
    }
});
