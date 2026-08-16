/**
 * AINutriMind Theme System
 *
 * This file contains:
 * 1. Original Expo-compatible Colors
 * 2. Platform font configuration
 * 3. AINutriMind's custom premium design system
 */

import { Platform } from 'react-native';

/* -------------------------------------------------------------------------- */
/*                         EXPO DEFAULT COLOR SYSTEM                           */
/* -------------------------------------------------------------------------- */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },

  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/* -------------------------------------------------------------------------- */
/*                                  FONTS                                     */
/* -------------------------------------------------------------------------- */

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },

  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },

  web: {
    sans:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",

    serif:
      "Georgia, 'Times New Roman', serif",

    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",

    mono:
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/* -------------------------------------------------------------------------- */
/*                       AINUTRIMIND DESIGN SYSTEM                            */
/* -------------------------------------------------------------------------- */

export const AppTheme = {
  colors: {
    /* Main surfaces */

    background: '#F6F7F5',
    surface: '#FFFFFF',
    surfaceSoft: '#F0F3EF',
    surfaceElevated: '#FAFBFA',

    /* Typography */

    ink: '#101828',
    text: '#182230',
    textSecondary: '#667085',
    textMuted: '#98A2B3',

    /* Brand */

    accent: '#16A36A',
    accentSoft: '#E7F7EF',
    accentDark: '#087A4C',
    accentBright: '#34D399',

    /* Borders */

    border: '#E4E7EC',
    borderSoft: '#F0F2F4',

    /* Status */

    success: '#16A36A',
    warning: '#E9A23B',
    danger: '#E5484D',

    /* Dark premium surfaces */

    darkSurface: '#101828',
    darkSurfaceSoft: '#1D2939',
    darkBorder: '#344054',

    /* Neutral */

    white: '#FFFFFF',
    black: '#000000',
  },

  radius: {
    small: 12,
    medium: 18,
    large: 24,
    xl: 30,
    pill: 999,
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 30,
    xxl: 40,
  },

  typography: {
    hero: 32,
    title: 24,
    heading: 19,
    body: 15,
    small: 13,
    tiny: 11,
  },

  shadow: {
    soft: {
      shadowColor: '#101828',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },

    medium: {
      shadowColor: '#101828',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 5,
    },
  },
};