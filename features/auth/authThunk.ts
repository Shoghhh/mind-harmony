import { AppThunk } from '@/store/store'; // your Redux store type
import { auth, db } from '@/firebase/firebase';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithCredential,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { setUser, setLoading, setGoogleLoading, setToastMessage } from './authSlice';
import { FirebaseError } from 'firebase/app';

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

const createUserInFirestoreIfNotExists = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        await setDoc(userRef, {
            email: user.email,
            name: user.displayName || '',
            createdAt: new Date(),
        });
    }
};

export const signUpWithEmail = (email: string, password: string): AppThunk => async dispatch => {
    try {
        dispatch(setLoading(true));
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        await createUserInFirestoreIfNotExists(userCredential.user);
        dispatch(setUser(userCredential.user));
        dispatch(setToastMessage({
            title: 'Success',
            status: 'success',
            description: 'Account created successfully. Please check your email for verification.'
        }));
    } catch (error: any) {
        const message = showError(error);
        dispatch(setToastMessage({ title: 'Error', status: 'error', description: message }));
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
        await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        const idToken = tokens.idToken;

        if (!idToken) throw new Error('No ID token received from Google');

        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);
        await createUserInFirestoreIfNotExists(userCredential.user);

        dispatch(setUser(userCredential.user));
    } catch (error: any) {
        let message = 'Google sign-in failed. Please try again.';

        // Handle Google Sign-In specific errors
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            message = 'Sign in cancelled by user';
        } else if (error.code === statusCodes.IN_PROGRESS) {
            message = 'Sign in already in progress';
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            message = 'Google Play Services not available';
        }
        // Handle Firebase errors
        else if (error.code && error.code.startsWith('auth/')) {
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