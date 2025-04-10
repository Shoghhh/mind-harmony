// components/AuthListener.tsx
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useDispatch } from 'react-redux';
import { setAuthState } from '@/features/auth/authSlice';

export default function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update Redux store with current user and set initialized to true
      dispatch(setAuthState({ 
        user, 
        initialized: true 
      }));
    });
    
    // Cleanup function - removes the listener when component unmounts
    return unsubscribe;
  }, [dispatch]);

  return null; // This component doesn't render anything
}