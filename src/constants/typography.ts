/**
 * Typography Constants
 * 
 * This file contains predefined text styles used throughout the app.
 * All styles use the global font configuration.
 */

import { TextStyle } from 'react-native';
import Fonts, { FontWeights, FontSizes } from './fonts';

export const Typography = {
  // Headings
  h1: {
    fontFamily: Fonts.raleway,
    fontSize: FontSizes['5xl'],
    fontWeight: FontWeights.bold,
    lineHeight: 48,
  } as TextStyle,
  
  h2: {
    fontFamily: Fonts.raleway,
    fontSize: FontSizes['4xl'],
    fontWeight: FontWeights.bold,
    lineHeight: 40,
  } as TextStyle,
  
  h3: {
    fontFamily: Fonts.raleway,
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
    lineHeight: 36,
  } as TextStyle,
  
  h4: {
    fontFamily: Fonts.raleway,
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.semiBold,
    lineHeight: 32,
  } as TextStyle,
  
  // Body Text
  bodyLarge: {
    fontFamily: Fonts.openSans,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    lineHeight: 20,
  } as TextStyle,
  
  body: {
    fontFamily: Fonts.openSans,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.regular,
    lineHeight: 20,
  } as TextStyle,
  
  bodySmall: {
    fontFamily: Fonts.openSans,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    lineHeight: 18,
  } as TextStyle,
  
  // Button Text
  button: {
    fontFamily: Fonts.openSans,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    lineHeight: 20,
  } as TextStyle,
  
  buttonLarge: {
    fontFamily: Fonts.openSans,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    lineHeight: 24,
  } as TextStyle,
  
  // Input Text
  input: {
    fontFamily: Fonts.openSans,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.regular,
    lineHeight: 20,
  } as TextStyle,
  
  // Caption/Helper Text
  caption: {
    fontFamily: Fonts.openSans,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    lineHeight: 16,
  } as TextStyle,
  
  // Label
  label: {
    fontFamily: Fonts.openSans,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    lineHeight: 18,
  } as TextStyle,
  
  // Link
  link: {
    fontFamily: Fonts.openSans,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    lineHeight: 20,
  } as TextStyle,
} as const;

export default Typography;

