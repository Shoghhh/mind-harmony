import React, { useState } from 'react';
import { Box, Radio, VStack, Text, Button } from 'native-base';

const LanguageScreen = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const handleSave = () => {
        // TODO: Integrate with i18n / app language setting
        console.log('Selected Language:', selectedLanguage);
    };

    return (
        <Box flex={1} safeArea p={4} >
            <Text fontSize="xl" fontWeight="medium" mb={4}>Choose Language</Text>
            <Radio.Group
                name="languageGroup"
                value={selectedLanguage}
                onChange={setSelectedLanguage}
            >
                <VStack space={3}>
                    <Radio value="en">English</Radio>
                    <Radio value="hy">Հայերեն</Radio>
                    <Radio value="ru">Русский</Radio>
                </VStack>
            </Radio.Group>
            <Button mt={6} onPress={handleSave}  // isLoading={loading}
                bg={'primary.600'}
                _pressed={{ opacity: 0.8, bg: 'primary.550' }}
                _text={{ fontWeight: 'bold' }}
                py={4}
                rounded="xl"
                shadow={3}
            >
                Save
            </Button>
        </Box>
    );
};

export default LanguageScreen;
