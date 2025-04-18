import { AppThunk } from '@/store/store'; // your Redux store type
import { auth, db, storage } from '@/firebase/firebase';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { setUser, setLoading, setGoogleLoading, setToastMessage } from './authSlice';
import { FirebaseError } from 'firebase/app';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const showError = (error: FirebaseError): string => {
    switch (error.code) {
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/email-already-in-use':
            return 'This email is already registered.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled.';
        case 'auth/too-many-requests':
            return 'Too many requests. Please try again later.';
        default:
            return error.code;
    }
};


const createUserInFirestoreIfNotExists = async (user: any, name?: string,) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        await setDoc(userRef, {
            email: user.email,
            name: name || user.displayName || '',
            createdAt: new Date(),
            lastLogin: new Date(),
        });
    } else {
        await setDoc(userRef, {
            lastLogin: new Date(),
            ...(name && { name }),
        }, { merge: true });
    }
};


// async function getBase64FromUri(uri: string) {
//     const base64 = await FileSystem.readAsStringAsync(uri, {
//         encoding: FileSystem.EncodingType.Base64,
//     });
//     return base64;
// }

export const getBase64FromUri = async (uri: string): Promise<string> => {
    try {
        // Request permissions to save media to the device (if not granted)
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (!permission.granted) {
            throw new Error('Permission to access media library is required');
        }

        // Download the image to a local file
        const localUri = FileSystem.documentDirectory + 'temp_image.jpg';
        const downloadResumable = FileSystem.createDownloadResumable(uri, localUri);

        // Await download and check if the result contains the URI
        const downloadResult = await downloadResumable.downloadAsync();
        if (!downloadResult?.uri) {
            throw new Error('Download failed, URI not found');
        }

        // Convert the downloaded image to base64
        const base64 = await FileSystem.readAsStringAsync(downloadResult.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        return base64;
    } catch (error) {
        console.error('Error downloading and converting image to base64:', error);
        throw error; // Re-throw to handle it in your calling function
    }
};

const saveBase64ToFirestore = async (base64: string, uid: string) => {
    try {
        const docRef = doc(db, 'files', uid);
        console.log(docRef)
        await setDoc(docRef, {
            fileData: base64,
            createdAt: new Date().toISOString(),
        });

        console.log('Base64 stored successfully in Firestore!');
    } catch (error) {
        console.error('Error storing base64:', error);
    }
};

export const fetchUserProfileImage = async (uid: string): Promise<string | null> => {
    try {
        const docRef = doc(db, 'files', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.fileData || null;
        } else {
            console.log('No image found for user');
            return null;
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
};

export const signUpWithEmail = (
    email: string,
    password: string,
    name: string,
    imageUri: string | null
): AppThunk => async dispatch => {
    try {
        dispatch(setLoading(true));

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let base64 = null;
        if (imageUri) {
            base64 = await getBase64FromUri(imageUri);
            await saveBase64ToFirestore(base64, user.uid);
        }


        await createUserInFirestoreIfNotExists(user, name);

        await sendEmailVerification(user);
        dispatch(setUser({
            ...user,
            displayName: name,
        }));

        dispatch(setToastMessage({
            title: 'Success',
            status: 'success',
            description: 'Account created successfully. Please check your email for verification.'
        }));

    } catch (error: any) {
        const message = showError(error);
        dispatch(setToastMessage({
            title: 'Error',
            status: 'error',
            description: message
        }));
    } finally {
        dispatch(setLoading(false));
    }
};

export const loginWithEmail = (email: string, password: string): AppThunk => async dispatch => {
    try {
        dispatch(setLoading(true));
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        if (!userCredential.user.emailVerified) {
            await sendEmailVerification(userCredential.user);
            dispatch(setUser(userCredential.user));
            dispatch(setToastMessage({
                title: 'Success',
                status: 'success',
                description: 'Please verify your email first. A new verification link was sent.'
            }));
            return
        }
        await createUserInFirestoreIfNotExists(userCredential.user);
        dispatch(setUser(userCredential.user));
    } catch (error: any) {
        const message = showError(error);
        dispatch(setToastMessage({ title: 'Error', status: 'error', description: message }));
    } finally {
        dispatch(setLoading(false));
    }
};

export const resetPassword = (email: string): AppThunk => async dispatch => {
    try {
        dispatch(setLoading(true));
        await sendPasswordResetEmail(auth, email);

        dispatch(setToastMessage({
            title: 'Success',
            status: 'success',
            description: 'Password reset email sent successfully. Please check your inbox.'
        }));
        return true;
    } catch (error: any) {
        const message = showError(error);
        dispatch(setToastMessage({ title: 'Error', status: 'error', description: message }));
        return false;
    } finally {
        dispatch(setLoading(false));
    }
};

export const loginWithGoogle = (): AppThunk => async dispatch => {
    try {
        dispatch(setGoogleLoading(true));
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        const idToken = tokens.idToken;

        if (!idToken) throw new Error('No ID token received from Google');

        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        await createUserInFirestoreIfNotExists(
            user,
            user.displayName || undefined,
        );

        if (user.photoURL) {
            try {
                const base64 = await getBase64FromUri(user.photoURL); // This should now work!
                await saveBase64ToFirestore(base64, user.uid); // Save base64 to Firestore
            } catch (imgErr) {
                console.warn('Error converting Google photoURL to base64:', imgErr);
            }
        }

        dispatch(setUser(user));
    } catch (error: any) {
        let message = 'Google sign-in failed. Please try again.';

        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            message = 'Sign in cancelled by user';
        } else if (error.code === statusCodes.IN_PROGRESS) {
            message = 'Sign in already in progress';
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            message = 'Google Play Services not available';
        } else if (error.code && error.code.startsWith('auth/')) {
            message = showError(error);
        }

        dispatch(setToastMessage({
            title: 'Error',
            status: 'error',
            description: message
        }));
    } finally {
        dispatch(setGoogleLoading(false));
    }
};

export const signOutUser = (): AppThunk => async dispatch => {
    try {
        await signOut(auth);
        dispatch(signOutUser());
    } catch (error: any) {
        dispatch(setToastMessage({
            title: 'Error',
            status: 'error',
            description: 'Failed to sign out. Please try again.'
        }));
    }
};