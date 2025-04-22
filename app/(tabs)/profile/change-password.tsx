import React, { useState } from 'react';
import { Box, Button, VStack, ScrollView } from 'native-base';
import { Keyboard, TextInput, Alert } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { setToastMessage } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { useTranslation } from 'react-i18next';

const ChangePasswordScreen = () => {
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleChangePassword = async () => {
        try {
            if (!currentPassword || !newPassword || !confirmPassword) {
                dispatch(setToastMessage({ 
                    title: t('error'), 
                    status: 'error', 
                    description: t('allFieldsRequired') 
                }));
                return;
            }

            if (newPassword !== confirmPassword) {
                dispatch(setToastMessage({ 
                    title: t('error'), 
                    status: 'error', 
                    description: t('passwordsDontMatch') 
                }));
                return;
            }

            if (newPassword.length < 6) {
                dispatch(setToastMessage({ 
                    title: t('error'), 
                    status: 'error', 
                    description: t('passwordMinLength') 
                }));
                return;
            }

            setLoading(true);

            const user = auth.currentUser;
            if (!user || !user.email) {
                throw new Error(t('noAuthUser'));
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
                title: t('success'),
                status: 'success',
                description: t('passwordChangeSuccess')
            }));

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error: any) {
            console.error('Password change error:', error);

            let errorMessage = t('passwordChangeFailed');
            if (error.code === 'auth/wrong-password') {
                errorMessage = t('incorrectCurrentPassword');
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = t('sessionExpired');
            } else if (error.code) {
                errorMessage = error.message;
            }

            dispatch(setToastMessage({ 
                title: t('error'), 
                status: 'error', 
                description: errorMessage 
            }));

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
                        placeholder={t('currentPassword')}
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        editable={!loading}
                    />
                    <TextInput
                        className="h-[50px] rounded-lg bg-white px-4 text-base"
                        placeholder={t('newPassword')}
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        editable={!loading}
                    />
                    <TextInput
                        className="h-[50px] rounded-lg bg-white px-4 text-base"
                        placeholder={t('confirmNewPassword')}
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
                        {t('saveChanges')}
                    </Button>
                </VStack>
            </Box>
        </ScrollView>
    );
};

export default ChangePasswordScreen;