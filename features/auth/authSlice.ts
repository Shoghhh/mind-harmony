import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

interface ToastMessage {
    title: string;
    status: 'success' | 'error' | 'warning' | 'info';
    description?: string;
}

interface AuthState {
    user: User | null;
    initialized: boolean;
    loading: boolean;
    googleLoading: boolean;
    toastMessage: ToastMessage | null;
}

const initialState: AuthState = {
    user: null,
    initialized: false,
    loading: false,
    googleLoading: false,
    toastMessage: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setGoogleLoading: (state, action) => {
            state.googleLoading = action.payload;
        },
        setToastMessage: (state, action: PayloadAction<ToastMessage | null>) => {
            state.toastMessage = action.payload;
        },
        clearToastMessage: (state) => {
            state.toastMessage = null;
        },
        signOutUser: (state) => {
            state.user = null;
            state.loading = false;
            state.googleLoading = false;
        },

        setAuthState: (state, action) => {
            state.user = action.payload.user
            state.initialized = action.payload.initialized
        }
    },
});

export const { setUser, setLoading, setGoogleLoading, setToastMessage, clearToastMessage, signOutUser, setAuthState } = authSlice.actions;
export default authSlice.reducer;
