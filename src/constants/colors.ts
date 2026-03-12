/**
 * Global Color Constants
 * 
 * This file contains all color definitions used throughout the app.
 * Update colors here to change them globally across the entire application.
 * 
 * IMPORTANT: Change the base color values below, and all related colors will update automatically.
 */

// Base Color Definitions - Change these to update the entire app
const BASE_COLORS = {
  // Primary Colors - Change this to update primary color everywhere
  PRIMARY: '#2563EB',
  PRIMARY_LIGHT: '#93C5FD',
  PRIMARY_DARK: '#1D4ED8',
  
  // Secondary Colors (complementary to primary blue)
  SECONDARY: '#0EA5E9',
  SECONDARY_LIGHT: '#38BDF8',
  
  // Background Colors
  BACKGROUND: '#FFFFFF',
  BACKGROUND_LIGHT: '#F9FAFB',
  BACKGROUND_GRADIENT_START: '#DBEAFE',
  BACKGROUND_GRADIENT_END: '#FFFFFF',
  
  // Text Colors
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#424242',
  TEXT_TERTIARY: '#525252',
  TEXT_LIGHT: '#757575',
  TEXT_LIGHTER: '#9E9E9E',
  TEXT_PLACEHOLDER: '#757575',
  
  // Button Colors
  BUTTON_TEXT: '#FFFFFF',
  BUTTON_TEXT_DARK: '#000000',
  BUTTON_BORDER: '#E5E5E5',
  
  // Input Colors
  INPUT_BACKGROUND: '#FFFFFF',
  INPUT_BACKGROUND_DEFAULT: '#F9FAFB',
  INPUT_BORDER: '#0F172A14',
  INPUT_BORDER_ERROR: '#EF4444',
  INPUT_TEXT: '#000000',
  
  // Error Colors
  ERROR: '#EF4444',
  ERROR_LIGHT: '#FF2E37',
  
  // Checkbox Colors
  CHECKBOX_BORDER: '#525252',
  CHECKBOX_BACKGROUND: '#FFFFFF',
  CHECKBOX_TEXT: '#FFFFFF',
  
  // Border Colors
  BORDER: '#E5E5E5',
  BORDER_LIGHT: '#0F172A14',
  BORDER_DARK: '#525252',
} as const;

// Derived Colors - These automatically use the base colors above
export const Colors = {
  // Primary Colors
  primary: BASE_COLORS.PRIMARY,
  primaryLight: BASE_COLORS.PRIMARY_LIGHT,
  primaryDark: BASE_COLORS.PRIMARY_DARK,
  
  // Secondary Colors
  secondary: BASE_COLORS.SECONDARY,
  secondaryLight: BASE_COLORS.SECONDARY_LIGHT,
  
  // Background Colors
  background: BASE_COLORS.BACKGROUND,
  backgroundLight: BASE_COLORS.BACKGROUND_LIGHT,
  backgroundGradient: {
    start: BASE_COLORS.BACKGROUND_GRADIENT_START,
    end: BASE_COLORS.BACKGROUND_GRADIENT_END,
  },
  
  // Text Colors
  textPrimary: BASE_COLORS.TEXT_PRIMARY,
  textSecondary: BASE_COLORS.TEXT_SECONDARY,
  textTertiary: BASE_COLORS.TEXT_TERTIARY,
  textLight: BASE_COLORS.TEXT_LIGHT,
  textLighter: BASE_COLORS.TEXT_LIGHTER,
  textPlaceholder: BASE_COLORS.TEXT_PLACEHOLDER,
  
  // Button Colors - Uses PRIMARY for primary buttons
  buttonPrimary: BASE_COLORS.PRIMARY,
  buttonSecondary: BASE_COLORS.SECONDARY,
  buttonText: BASE_COLORS.BUTTON_TEXT,
  buttonTextDark: BASE_COLORS.BUTTON_TEXT_DARK,
  buttonBorder: BASE_COLORS.BUTTON_BORDER,
  
  // Input Colors
  inputBackground: BASE_COLORS.INPUT_BACKGROUND,
  inputBackgroundDefault: BASE_COLORS.INPUT_BACKGROUND_DEFAULT,
  inputBorder: BASE_COLORS.INPUT_BORDER,
  inputBorderError: BASE_COLORS.INPUT_BORDER_ERROR,
  inputText: BASE_COLORS.INPUT_TEXT,
  
  // Error Colors
  error: BASE_COLORS.ERROR,
  errorLight: BASE_COLORS.ERROR_LIGHT,
  
  // Success Colors
  success: BASE_COLORS.SECONDARY,
  
  // Checkbox Colors - Uses PRIMARY for checked state
  checkboxBorder: BASE_COLORS.CHECKBOX_BORDER,
  checkboxChecked: BASE_COLORS.PRIMARY,
  checkboxBackground: BASE_COLORS.CHECKBOX_BACKGROUND,
  checkboxText: BASE_COLORS.CHECKBOX_TEXT,
  
  // Link Colors - Uses PRIMARY for links
  link: BASE_COLORS.PRIMARY,
  linkError: BASE_COLORS.ERROR_LIGHT,
  
  // Border Colors
  border: BASE_COLORS.BORDER,
  borderLight: BASE_COLORS.BORDER_LIGHT,
  borderDark: BASE_COLORS.BORDER_DARK,
  
  // Gradient Colors - Uses PRIMARY for title gradient
  gradient: {
    title: {
      start: BASE_COLORS.PRIMARY,
      end: BASE_COLORS.PRIMARY_LIGHT,
    },
    background: {
      start: BASE_COLORS.BACKGROUND_GRADIENT_START,
      end: BASE_COLORS.BACKGROUND_GRADIENT_END,
    },
  },
  
  // Splash Screen - Uses PRIMARY
  splashBackground: BASE_COLORS.PRIMARY,
  
  // Status Colors
  statusBar: {
    light: 'light-content',
    dark: 'dark-content',
  },
} as const;

export default Colors;

