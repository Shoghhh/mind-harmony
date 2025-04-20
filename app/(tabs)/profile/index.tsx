import React, { useState } from 'react';
import {
    Box,
    Center,
    HStack,
    Icon,
    Pressable,
    Text,
    VStack,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { signOutUserAsync } from '@/features/auth/authThunk';
import { useRouter } from 'expo-router';
import ProfileImage from '@/components/MyProfileImage';
import ConfirmationDialog from '@/components/MyDialog';

const ProfileScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);


    const handleSignOut = async () => {
        await dispatch(signOutUserAsync());
        router.replace('/auth');
    };

    const menuItems = [
        {
            label: 'Edit Profile',
            icon: 'create-outline',
            onPress: () => router.push('/(tabs)/profile/edit'),
        },
        {
            label: 'Change Password',
            icon: 'key-outline',
            onPress: () => router.push('/(tabs)/profile/change-password'), // You can create this screen
        },
        {
            label: 'Delete Account',
            icon: 'trash-outline',
            onPress: () => setShowDeleteDialog(true),
        },
        {
            label: 'Language',
            icon: 'language-outline',
            onPress: () => router.push('/(tabs)/profile/language'), // Add a picker screen
        },
        {
            label: 'Logout',
            icon: 'log-out-outline',
            color: 'red.500',
            onPress: () => setShowLogoutDialog(true),
        },
    ];

    return (
        <Box flex={1} safeArea>
            <Center mt={5}>
                <Pressable p="2" borderRadius="full" bg="white" shadow={2}>
                    <ProfileImage size={140} />
                </Pressable>
                <Text fontSize="xl" fontWeight="bold" mt={4}>
                    {user?.displayName}
                </Text>
                <Text fontSize="sm" color="gray.500">
                    {user?.email}
                </Text>
            </Center>

            <VStack mt={10} space={2} px={4}>
                {menuItems.map((item, index) => (
                    <Pressable key={index} onPress={item.onPress}>
                        <HStack
                            alignItems="center"
                            justifyContent="space-between"
                            bg="white"
                            p={4}
                            borderRadius="lg"
                            shadow={1}
                            borderWidth={1}
                            borderColor="gray.100"
                        >
                            <HStack alignItems="center" space={3}>
                                <Icon
                                    as={Ionicons}
                                    name={item.icon}
                                    size="sm"
                                    color={item.color ?? 'primary.500'}
                                />
                                <Text fontSize="md" fontWeight="medium" color={item.color ?? 'black'}>
                                    {item.label}
                                </Text>
                            </HStack>
                            <Icon as={Ionicons} name="chevron-forward" size="sm" color="gray.400" />
                        </HStack>
                    </Pressable>
                ))}
                <ConfirmationDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={() => {
                        // Handle account deletion logic here
                        // e.g., dispatch(deleteAccountThunk());
                        console.log("Deleting account...");
                    }}
                    type="custom"
                    title="Delete Account"
                    bodyText="Are you sure you want to delete your account? Deleting your account will permanently remove all your data."
                    confirmText="Delete"
                    confirmColor="red.600"
                    iconName="trash-2"
                    iconColor="red.600"
                />

                <ConfirmationDialog
                    isOpen={showLogoutDialog}
                    onClose={() => setShowLogoutDialog(false)}
                    onConfirm={handleSignOut}
                    type="custom"
                    title="Logout "
                    bodyText="Are you sure you want to logout your account?"
                    confirmText="Logout"
                    confirmColor="red.600"
                    iconName="trash-2"
                    iconColor="red.600"
                />
            </VStack>
        </Box>
    );
};

export default ProfileScreen;
