import React, { useEffect, useState } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchUserProfileImage } from '@/features/auth/authThunk';

const ProfileImage = () => {
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state: RootState) => state.auth); // assuming you have user in redux

    useEffect(() => {
        const loadImage = async () => {
            if (user?.uid) {
                const base64 = await fetchUserProfileImage(user.uid);
                setImageBase64(base64);
                setLoading(false);
            }
        };

        loadImage();
    }, [user]);

    if (loading) return <ActivityIndicator style={{height: 50, width: 50}} />;

    if (!imageBase64) return <View />;

    return (
        <Image
            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
            style={{ width: 50, height: 50, borderRadius: 60 }}
        />
    );
};

export default ProfileImage;
