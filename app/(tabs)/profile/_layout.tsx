import { Stack } from "expo-router"
import Header from "@/components/navigation/Header";
import { useTranslation } from 'react-i18next';

export default function ProfileLayout() {
    const { t } = useTranslation();

    return (
        <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' }, animation: 'none' }} >
            <Stack.Screen
                name="index"
                options={{
                    header: () => <Header title={t('profile')} />
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    header: () => <Header title={t('editProfile')} showBack />
                }}
            />
            <Stack.Screen
                name="change-password"
                options={{
                    header: () => <Header title={t('changePassword')} showBack />
                }}
            />
            <Stack.Screen
                name="language"
                options={{
                    header: () => <Header title={t('language')} showBack />
                }}
            />
        </Stack>
    )
}