import { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

type AuthContextType = {
    user: FirebaseAuthTypes.User | null;
    initialized: boolean;
};


const AuthContext = createContext<AuthContextType>({
    user: null,
    initialized: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthContextType>({
        user: null,
        initialized: false,
    });

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            setState({ user, initialized: true });
        });
        return unsubscribe;
    }, []);

    return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);