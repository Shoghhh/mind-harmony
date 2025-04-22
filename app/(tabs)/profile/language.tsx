import React, { useState } from 'react';
import { Box, Radio, VStack, Text, Button } from 'native-base';
import { changeLanguage } from '@/i18n';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const LanguageScreen = () => {
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
    const router = useRouter();

    const handleSave = () => {
        changeLanguage(selectedLanguage);
        router.back();
    };

    return (
        <Box flex={1} safeArea p={4}>
            <Text fontSize="xl" fontWeight="medium" mb={4}>
                {t('chooseLanguage')}
            </Text>
            <Radio.Group
                name="languageGroup"
                value={selectedLanguage}
                onChange={setSelectedLanguage}
            >
                <VStack space={3}>
                    <Radio value="en">{t('english')}</Radio>
                    <Radio value="hy">{t('armenian')}</Radio>
                </VStack>
            </Radio.Group>
            <Button 
                mt={6} 
                onPress={handleSave}
                bg={'primary.600'}
                _pressed={{ opacity: 0.8, bg: 'primary.550' }}
                _text={{ fontWeight: 'bold' }}
                py={4}
                rounded="xl"
                shadow={3}
            >
                {t('save')}
            </Button>
        </Box>
    );
};

export default LanguageScreen;