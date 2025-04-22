import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import enTranslations from '../locales/en.json';
import hyTranslations from '../locales/hy.json';

const languageDetector: LanguageDetectorAsyncModule = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lng: string | readonly string[] | undefined) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem('user-language');
            if (savedLanguage) {
                callback(savedLanguage);
                return savedLanguage;
            }

            const deviceLanguage = Localization.locale.split('-')[0];
            callback(deviceLanguage);
            return deviceLanguage;
        } catch (error) {
            console.error('Language detection error:', error);
            callback('hy');
            return 'hy';
        }
    },
    init: () => { },
    cacheUserLanguage: async (lng: string) => {
        try {
            await AsyncStorage.setItem('user-language', lng);
        } catch (error) {
            console.error('Language save error:', error);
        }
    }
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'hy',
        resources: {
            hy: { translation: hyTranslations },
            en: { translation: enTranslations },
        },
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    });

export const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
};

export default i18n;