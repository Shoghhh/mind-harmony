import { StyleSheet } from 'react-native';
import colors from './colors';

const globalTextStyles = StyleSheet.create({
  // Font Weights
  textRegular: {
    fontWeight: '400',
  },
  textMedium: {
    fontWeight: '500',
  },
  textBold: {
    fontWeight: '700',
  },

  // Font Sizes
  textSmall: {
    fontSize: 12,
  },
  textMediumSize: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 20,
  },
  textExtraLarge: {
    fontSize: 24,
  },

  // Colors
  textPrimary: {
    color: '#000', // Black
  },
  textPrimaryDark: {
    color: '#555', // Dark Gray
  },
  textTertiary: {
    color: '#888', // Light Gray
  },
  textAccent: {
    color: '#007BFF', // Blue (Accent color)
  },
  textError: {
    color: '#FF0000', // Red (Error text)
  },

  regular12Secondary: {
    fontSize: 12,
    fontWeight: 'normal',
    color: colors.secondary
  },

  regular14PrimaryDark: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.primaryDark,
  },

  regular14Primary: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.primary,
  },

  regular16PrimaryDark: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.primaryDark,
  },

  regular16GrayLight: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.grayLight,
  },

  medium14PrimaryDark: {
    fontSize: 14,
    fontWeight: 'medium',
    color: colors.primaryDark,
  },

  medium14White: {
    fontSize: 14,
    fontWeight: 'medium',
    color: colors.white,
  },

  medium16Primary: {
    fontSize: 16,
    fontWeight: 'medium',
    color: colors.primaryDark,
  },

  medium16PrimaryDark: {
    fontSize: 16,
    fontWeight: 'medium',
    color: colors.primaryDark,
  },

  medium20White: {
    fontSize: 20,
    fontWeight: 'medium',
    color: colors.white
  },
  medium20SecondaryDark: {
    fontSize: 20,
    fontWeight: 'medium',
    color: colors.secondaryDark
  },

  medium22PrimaryDark: {
    fontSize: 22,
    fontWeight: 'medium',
    color: colors.primaryDark,
  },

  regular16GrayDark: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.grayDark,
  },

  bold14White: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },

  bold16White: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },

  bold18Primary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },

  bold22PrimaryDark: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },




});

export default globalTextStyles;
