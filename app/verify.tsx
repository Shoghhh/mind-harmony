import { useRouter } from 'expo-router';
import { Box, Button, Text, Center, Icon } from 'native-base';
import { useDispatch } from 'react-redux';
import { auth } from '@/firebase/firebase';
import { setUser } from '@/features/auth/authSlice';
import { sendEmailVerification } from 'firebase/auth';
import { useCustomToast } from '@/hooks/useCustomToast';
import { MaterialIcons } from '@expo/vector-icons';

export default function VerifyEmailScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { showToast } = useCustomToast();

    const checkVerification = async () => {
        try {
            await auth.currentUser?.reload();
            const updatedUser = auth.currentUser;

            if (updatedUser?.emailVerified) {
                dispatch(setUser(updatedUser));
                showToast({ title: 'Success', status: 'success', description: 'Email verified successfully!' });
                router.replace('/(tabs)/dashboard');
            } else {
                showToast({ title: 'Not Verified', status: 'error', description: 'Email not verified yet.' });
            }
        } catch (error) {
            showToast({ title: 'Error', status: 'error', description: 'Failed to check verification status.' });
        }
    };

    const resendVerification = async () => {
        try {
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
                showToast({ title: 'Email Sent', status: 'success', description: 'Verification email resent.' });
            }
        } catch (error) {
            showToast({ title: 'Error', status: 'error', description: 'Failed to resend verification email.' });
        }
    };


    const handleGoBack = () => {
        dispatch(setUser(null));
        router.back();
    };

    return (
        <Center flex={1} p="4">
            <Button leftIcon={<Icon as={MaterialIcons} name={"keyboard-arrow-left"} size={'md'} />} onPress={handleGoBack} mb={10} padding={1.5} alignSelf={'flex-start'} flexDirection={'row'} pr={4} _pressed={{ opacity: 0.8, bg: "primary.600" }}>
                Back
            </Button>
            <Box>
                <Text fontSize="xl" mb="4">
                    Please verify your email address
                </Text>
                <Text mb="8">
                    We've sent a verification link to your email. Please click the link to verify your account.
                </Text>
                <Button onPress={checkVerification} mb="4" _pressed={{ opacity: 0.8, bg: "primary.600" }}>
                    I've verified my email
                </Button>
                <Button variant="outline" onPress={resendVerification} borderColor={'primary.600'} >
                    Resend verification email
                </Button>
            </Box>
        </Center>
    );
}