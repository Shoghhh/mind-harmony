import store from "@/store/store";
// import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Linking, SafeAreaView, StatusBar, View } from "react-native";
import { Provider } from "react-redux";

export default function RootLayout() {
    const [initializing, setInitializing] = useState(true);
    // const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    // Firebase Auth State Listener
    // useEffect(() => {
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber;  // Clean up the listener
    // }, []);

    // Handle Authentication State Changes
    // function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    //     setLoading(true);
    //     if (user) {
    //         user.reload()  // Ensure that the user object is fresh
    //             .then(() => {
    //                 setUser(user);  // Update user state
    //                 setLoading(false);  // Set loading to false
    //             })
    //             .catch((e) => {
    //                 console.error(e);
    //                 alert("Error during user reload.");
    //                 setLoading(false);  // Set loading to false in case of error
    //             });
    //     } else {
    //         setUser(null);  // Set user to null if no user is signed in
    //         setLoading(false);  // Set loading to false
    //     }
    //     if (initializing) setInitializing(false);  // Set initializing to false once auth state is resolved
    // }

    // Redirect logic based on user and email verification state
    // useEffect(() => {
    //     if (initializing || loading) return;  // Wait for initial setup and loading to finish

    //     const inTabsGroup = segments[0] === "(tabs)";
    //     const userVerified = user?.emailVerified;

    //     console.log(userVerified, 'User verified status');
    //     // If user is verified and inside tabs group, navigate to dashboard
    //     if (user && userVerified && !inTabsGroup) {
    //         router.replace("/(tabs)/dashboard");  // Navigate to dashboard if verified
    //     } else if (!user && inTabsGroup) {
    //         router.replace("/(auth)/login");  // Navigate to login if no user
    //     } else if (user && !userVerified) {
    //         // Optionally, show a page explaining that they need to verify their email
    //         router.replace("/(auth)/verify");  // Navigate to verify email page
    //     }
    // }, [user, initializing, loading, segments]);  // React to changes in the user, initializing, and loading states

    // If initializing or loading, show loading spinner
    // if (initializing || loading) {
    //     return (
    //         <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //             <ActivityIndicator color="red" size="large" />
    //         </SafeAreaView>
    //     );
    // }

    useEffect(() => {
    //     const handleDeepLink = async (url: string) => {
    //       if (auth().isSignInWithEmailLink(url)) {
    //         try {
    //           const email = "user@example.com"; // Retrieve stored email
    //           await auth().signInWithEmailLink(email, url);
              router.replace("/(tabs)/todos");
    //         } catch (error) {
    //           console.error("Error signing in:", error);
    //         }
    //       }
        // };

    //     Linking.getInitialURL().then((url) => {
    //       if (url) handleDeepLink(url);
    //     });

    //     const subscription = Linking.addEventListener("url", ({ url }) =>
    //       handleDeepLink(url)
    //     );

    //     return () => subscription.remove();
      }, []);



    return (
        <Provider store={store}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="auth"/>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
        </Provider>
    );
}
