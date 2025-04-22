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
    updateEmail,
    updateProfile,
} from 'firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { setUser, setLoading, setGoogleLoading, setToastMessage, updateProfileSuccess, setPhotoUri, signOutUser } from './authSlice';
import { FirebaseError } from 'firebase/app';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const showError = (error: FirebaseError): string => {
    switch (error.code) {
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/invalid-credentials':
            return 'The email or password is incorrect.';
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
            name: user.name,
            createdAt: new Date(),
            lastLogin: new Date(),
        });
    } else {
        await setDoc(userRef, {
            lastLogin: new Date(),
            ...(name && { displayName: name }),
        }, { merge: true });
    }
};

export const getBase64FromUri = async (uri: string): Promise<string> => {
    try {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (!permission.granted) {
            throw new Error('Permission to access media library is required');
        }
        if (uri.startsWith('file://')) {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error(`File does not exist at ${uri}`);
            }

            return await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
        }
        const localUri = `${FileSystem.documentDirectory}temp_image_${Date.now()}.jpg`;
        const downloadResumable = FileSystem.createDownloadResumable(uri, localUri);

        const downloadResult = await downloadResumable.downloadAsync();
        if (!downloadResult?.uri) {
            throw new Error('Download failed, URI not found');
        }

        return await FileSystem.readAsStringAsync(downloadResult.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

    } catch (error) {
        console.error('Error downloading and converting image to base64:', error);
        throw error;
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

export const signUpWithEmail = (email: string, password: string, name: string, imageUri: string | null): AppThunk => async dispatch => {
    try {
        dispatch(setLoading(true));

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: name
        });
        let base64 = null;
        if (imageUri) {
            base64 = await getBase64FromUri(imageUri);
            await saveBase64ToFirestore(base64, user.uid);
        }


        await createUserInFirestoreIfNotExists({ ...user, name });

        await sendEmailVerification(user);
        console.log(name, 'name')
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
        console.log('serCredential.user.emailVerified', userCredential.user.emailVerified)
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
        await createUserInFirestoreIfNotExists({ ...userCredential.user, name: userCredential.user.displayName });
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

        await createUserInFirestoreIfNotExists({ ...user, name: user.displayName });

        const fileDocRef = doc(db, 'files', user.uid);
        const fileDoc = await getDoc(fileDocRef);
        const hasExistingPhoto = fileDoc.exists() && fileDoc.data()?.fileData;
        if (user.photoURL && !hasExistingPhoto) {
            try {
                const base64 = await getBase64FromUri(user.photoURL);
                await saveBase64ToFirestore(base64, user.uid);
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

export const signOutUserAsync = (): AppThunk => async dispatch => {
    dispatch(setLoading(true))
    try {
        await signOut(auth);
        dispatch(signOutUser());
    } catch (error: any) {
        dispatch(setToastMessage({
            title: 'Error',
            status: 'error',
            description: 'Failed to sign out. Please try again.'
        }));
    } finally { dispatch(setLoading(false)) }
};

export const updateUserProfile = (updates: { displayName?: string; photoURL?: string }, router: any): AppThunk => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
        const authUser = auth.currentUser;

        if (!authUser) {
            throw new Error('No authenticated user');
        }

        if (updates.displayName !== undefined) {
            const trimmedName = updates.displayName.trim();
            if (!trimmedName) {
                throw new Error('Name cannot be empty');
            }
        }

        const profileUpdates: {
            displayName?: string;
            photoURL?: string;
        } = {};

        if (updates.displayName !== undefined) {
            profileUpdates.displayName = updates.displayName.trim();
        }

        if (updates.photoURL !== undefined) {
            profileUpdates.photoURL = updates.photoURL;
        }

        if (Object.keys(profileUpdates).length > 0) {
            await updateProfile(authUser, profileUpdates);

            if (updates.displayName !== undefined) {
                await createUserInFirestoreIfNotExists(authUser, profileUpdates.displayName!);
            }

            if (updates.photoURL) {
                try {
                    const base64 = await getBase64FromUri(updates.photoURL);
                    await saveBase64ToFirestore(base64, authUser.uid);
                    dispatch(setPhotoUri(updates.photoURL));
                } catch (photoError) {
                    console.error('Error processing photo:', photoError);
                }
            }
            router.back()
            dispatch(updateProfileSuccess(profileUpdates));

            dispatch(setToastMessage({
                title: 'Success',
                status: 'success',
                description: 'Profile updated successfully'
            }));
        }

    } catch (error: any) {
        console.error('Profile update error:', error);
        dispatch(setToastMessage({
            title: 'Error',
            status: 'error',
            description: error.code ? showError(error) : error.message
        }));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};