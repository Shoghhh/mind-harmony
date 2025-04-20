import React, { useState } from 'react';
import { Box, Button, VStack, ScrollView, useToast } from 'native-base';
import { Keyboard, TextInput, Alert } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { setToastMessage } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

const ChangePasswordScreen = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const dispatch = useDispatch<AppDispatch>()

    const handleChangePassword = async () => {
        console.log(1111)
        try {
            if (!currentPassword || !newPassword || !confirmPassword) {
                dispatch(setToastMessage({ title: 'Error', status: 'error', description: 'All fields are required' }));
                return;//
            }

            if (newPassword !== confirmPassword) {
                dispatch(setToastMessage({ title: 'Error', status: 'error', description: 'New passwords do not match' }));
                return;
            }

            if (newPassword.length < 6) {
                dispatch(setToastMessage({ title: 'Error', status: 'error', description: 'Password must be at least 6 characters' }));
                return;
            }

            setLoading(true);

            const user = auth.currentUser;
            if (!user || !user.email) {
                throw new Error('No authenticated user found');
            }

            // Reauthenticate user
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            dispatch(setToastMessage({
                title: 'Success',
                status: 'success',
                description: 'Password changed successfully'
            }));

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error: any) {
            console.error('Password change error:', error);

            let errorMessage = 'Failed to change password';
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Current password is incorrect';
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Session expired. Please login again.';
            } else if (error.code) {
                errorMessage = error.message;
            }

            dispatch(setToastMessage({ title: 'Error', status: 'error', description: errorMessage }));

        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView>
            <Box flex={1} safeArea p={4}>
                <VStack space={4}>
                    <TextInput
                        className="h-[50px] rounded-lg bg-white px-4 text-base"
                        placeholder="Current Password"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        editable={!loading}
                    />
                    <TextInput
                        className="h-[50px] rounded-lg bg-white px-4 text-base"
                        placeholder="New Password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        editable={!loading}
                    />
                    <TextInput
                        className="h-[50px] rounded-lg bg-white px-4 text-base"
                        placeholder="Confirm New Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        editable={!loading}
                    />
                    <Button
                        onPress={handleChangePassword}
                        mt={6}
                        bg={'primary.600'}
                        _pressed={{ opacity: 0.8, bg: 'primary.550' }}
                        _text={{ fontWeight: 'bold' }}
                        py={4}
                        rounded="xl"
                        shadow={3}
                        isLoading={loading}
                    >
                        Save Changes
                    </Button>
                </VStack>
            </Box>
        </ScrollView>
    );
};

export default ChangePasswordScreen;