import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { clearToastMessage } from '@/features/auth/authSlice';
import { useCustomToast } from '@/hooks/useCustomToast';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toastMessage } = useSelector((state: RootState) => state.auth);
  const { showToast } = useCustomToast();
  const dispatch = useDispatch();

  useEffect(() => {
    if (toastMessage) {
      showToast({
        title: toastMessage.title,
        status: toastMessage.status,
        description: toastMessage.description
      });
      dispatch(clearToastMessage());
    }
  }, [toastMessage, showToast, dispatch]);

  return <>{children}</>;
};