import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useDispatch } from 'react-redux';
import { setAuthState } from '@/features/auth/authSlice';

export default function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setAuthState({
        initialized: true,
        user
      }));
    });
    
    return unsubscribe;
  }, [dispatch]);

  return null;
}