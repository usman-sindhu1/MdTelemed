import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Colors from '../constants/colors';
import Typography from '../constants/typography';

export type InputSize = 'default' | 'half';

export interface InputProps extends TextInputProps {
  /**
   * Optional label shown above the input
   */
  label?: string;
  /**
   * Size variant of the input
   * - 'default': 344.67px width
   * - 'half': 171px width
   * @default 'default'
   */
  size?: InputSize;
  /**
   * Error message to display below the input
   */
  error?: string;
  /**
   * Whether to show error text below the input
   * When false, only the red border will be shown
   * @default true
   */
  showErrorText?: boolean;
}

/**
 * Reusable Input Component
 *
 * A customizable input component with two size variants: default and half.
 * All variants share the same styling for height, border radius, colors, and typography.
 *
 * @example
 * // Default size (344.67px width)
 * <Input
 *   placeholder="Enter your email"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 *
 * @example
 * // Half width input (171px)
 * <Input
 *   size="half"
 *   placeholder="First name"
 *   value={firstName}
 *   onChangeText={setFirstName}
 * />
 *
 * @example
 * // With all TextInput props
 * <Input
 *   placeholder="Password"
 *   value={password}
 *   onChangeText={setPassword}
 *   secureTextEntry
 *   autoCapitalize="none"
 *   keyboardType="email-address"
 * />
 */
export const Input: React.FC<InputProps> = ({
  label,
  size = 'default',
  style,
  placeholderTextColor = Colors.textPlaceholder,
  error,
  showErrorText = true,
  ...props
}) => {
  return (
    <View style={[styles.wrapper, size === 'half' && styles.wrapperHalf]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.base,
          styles[size],
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
      {error && showErrorText && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  } as ViewStyle,
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginBottom: 8,
  } as TextStyle,
  wrapperHalf: {
    width: '48%',
  } as ViewStyle,
  base: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: Colors.inputBackgroundDefault,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    ...Typography.input,
    letterSpacing: 0,
    textAlignVertical: 'center', 
    color: Colors.inputText,
  } as ViewStyle & TextStyle,
  inputError: {
    borderColor: Colors.inputBorderError,
  } as ViewStyle,
  default: {
    width: '100%',
  },
  half: {
    width: '100%',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 4,
  } as TextStyle,
});

export default Input;

