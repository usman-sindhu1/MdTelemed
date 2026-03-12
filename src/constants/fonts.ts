/**
 * Font Constants
 * 
 * This file contains all font family definitions used throughout the app.
 * Update fonts here to change them globally across the entire application.
 */

// Font Family Names
// For variable fonts, use the base name without the variable font suffix
export const Fonts = {
  // Open Sans Font Family
  openSans: 'OpenSans',
  openSansItalic: 'OpenSans-Italic',
  
  // Raleway Font Family
  raleway: 'Raleway',
  ralewayItalic: 'Raleway-Italic',
  
  // Default System Font (fallback)
  system: 'System',
} as const;

// Font Weights
export const FontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
} as const;

// Font Sizes
export const FontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
} as const;

// Default Font Configuration
export const DefaultFont = {
  family: Fonts.openSans,
  weight: FontWeights.regular,
  size: FontSizes.base,
} as const;

export default Fonts;

