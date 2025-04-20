import React, { useEffect, useState } from 'react';
import { Image, View, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchUserProfileImage } from '@/features/auth/authThunk';
import colors from '@/styles/colors';

interface ProfileImageProps {
    size?: number;
    source?: ImageSourcePropType;
    userId?: string;
}

const ProfileImage = ({ size = 50, source, userId }: ProfileImageProps) => {
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, photoUri } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const loadImage = async () => {
            if (!source && (userId || user?.uid)) {
                try {
                    const idToUse = userId || user?.uid;
                    if (idToUse) {
                        const base64 = await fetchUserProfileImage(idToUse);
                        setImageBase64(base64);
                    }
                } catch (error) {
                    console.error('Error loading profile image:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadImage();
    }, [user, userId, source]);

    if (loading) {
        return <ActivityIndicator color={colors.primary[600]} style={{ height: size, width: size }} />;
    }

    const imageSource = source
        ? source
        : imageBase64
                ? { uri: `data:image/jpeg;base64,${imageBase64}` }
                : require('@/assets/images/default-profile.png');
    return (
        <Image
            source={imageSource}
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                resizeMode: 'cover'
            }}
        />
    );
};

export default ProfileImage;