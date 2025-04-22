import React, { useState } from 'react';
import {
    Box,
    Button,
    Center,
    FormControl,
    Icon,
    Input,
    ScrollView,
    Text,
    VStack,
    Pressable,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import ProfileImage from '@/components/MyProfileImage';
import { Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '@/features/auth/authThunk';
import { setToastMessage } from '@/features/auth/authSlice';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

const EditProfileScreen = () => {
    const { t } = useTranslation();
    const { user, loading } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter()
    const [name, setName] = useState(user?.displayName || '');
    const [imageUri, setImageUri] = useState<string | null>(null);

    const handleImagePick = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(t('permissionRequired'), t('photoAccessRequired'));
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.3,
            });

            if (result.canceled || !result.assets?.[0]?.uri) {
                return null;
            }
            let selectedImage = result.assets[0].uri;
            setImageUri(selectedImage);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert(t('error'), t('imagePickError'));
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            dispatch(setToastMessage({
                title: t('error'),
                status: 'error',
                description: t('nameRequired')
            }));
            return;
        }

        const updates: { displayName?: string; photoURL?: string } = {
            displayName: name.trim()
        };

        if (imageUri) {
            updates.photoURL = imageUri;
        }

        try {
            await dispatch(updateUserProfile(updates, router)).unwrap()
        } catch (error) {
            // Error handling is done in the thunk
        }
    };

    return (
        <ScrollView flex={1}>
            <Center mt={8}>
                <Pressable onPress={handleImagePick}>
                    <Box position="relative">
                        <ProfileImage
                            size={150}
                            source={imageUri ? { uri: imageUri } : undefined}
                        />
                        <Box
                            position="absolute"
                            bottom={0}
                            right={0}
                            bg="primary.500"
                            borderRadius="full"
                            p={1}
                        >
                            <Icon as={Ionicons} name="camera" color="white" size="lg" />
                        </Box>
                    </Box>
                </Pressable>
            </Center>

            <VStack space={4} mt={10} px={4}>
                <FormControl>
                    <FormControl.Label>{t('name')}</FormControl.Label>
                    <TextInput
                        className="h-[50px] rounded-lg bg-white px-4 text-base"
                        placeholder={t('enterYourName')}
                        value={name}
                        onChangeText={setName}
                    />
                </FormControl>

                <Button
                    mt={6}
                    onPress={handleSave}
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
        </ScrollView>
    );
};

export default EditProfileScreen;