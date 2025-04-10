import { useToast as useNativeBaseToast } from 'native-base';
import { MyToast } from '@/components/MyToast';
import { useCallback } from 'react';

type ToastStatus = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
    title: string;
    description?: string;
    status: ToastStatus;
    duration?: number;
    placement?: 'top' | 'bottom';
}

export const useCustomToast = () => {
    const toast = useNativeBaseToast();
    const showToast = useCallback(
        ({
            title,
            description,
            status,
            duration = 2000,
            placement = 'top'
        }: ToastOptions) => {
            toast.closeAll();

            toast.show({
                render: () => MyToast({ title, description, status }),
                placement,
                duration,
            });
        },
        [toast]
    );

    return { showToast };
};