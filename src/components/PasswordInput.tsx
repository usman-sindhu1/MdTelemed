import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icons from '../assets/svg';
import Colors from '../constants/colors';

export type PasswordInputSize = 'default' | 'half';

export interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  /**
   * Optional label shown above the input
   */
  label?: string;
  /**
   * Size variant of the password input
   * - 'default': 344.67px width
   * - 'half': 171px width
   * @default 'default'
   */
  size?: PasswordInputSize;
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
 * Reusable Password Input Component
 *
 * A password input component with an eye icon toggle to show/hide password.
 * Uses the same styling as the Input component with an additional eye icon on the right.
 *
 * @example
 * // Default size (344.67px width)
 * <PasswordInput
 *   placeholder="Password"
 *   value={password}
 *   onChangeText={setPassword}
 * />
 *
 * @example
 * // Half width input (171px)
 * <PasswordInput
 *   size="half"
 *   placeholder="Password"
 *   value={password}
 *   onChangeText={setPassword}
 * />
 *
 * @example
 * // With all TextInput props
 * <PasswordInput
 *   placeholder="Enter password"
 *   value={password}
 *   onChangeText={setPassword}
 *   autoCapitalize="none"
 *   autoCorrect={false}
 * />
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  size = 'default',
  style,
  placeholderTextColor = Colors.textPlaceholder,
  error,
  showErrorText = true,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Extract backgroundColor from style prop to apply to TextInput
  const containerStyle = style as ViewStyle;
  const backgroundColor = containerStyle?.backgroundColor;
  const containerStyleWithoutBg = backgroundColor
    ? { ...containerStyle, backgroundColor: undefined }
    : containerStyle;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, styles[size], containerStyleWithoutBg]}>
        <TextInput
          style={[
            styles.base,
            error && styles.inputError,
            backgroundColor && { backgroundColor },
          ]}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={!isPasswordVisible}
          {...props}
        />
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={togglePasswordVisibility}
          activeOpacity={0.7}
        >
          <View style={[styles.eyeIconCircle, error && styles.eyeIconCircleError]}>
            <View style={styles.eyeIconInner}>
              {isPasswordVisible ? (
                <Icons.EyeOffIcon
                  width={20}
                  height={20}
                  color={error ? Colors.error : Colors.textPrimary}
                />
              ) : (
                <Icons.EyeIcon
                  width={20}
                  height={20}
                  color={error ? Colors.error : Colors.textPrimary}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
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
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  base: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: Colors.inputBackgroundDefault,
    borderColor: Colors.inputBorder,
    paddingLeft: 16,
    paddingRight: 60, // Extra padding for eye icon
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14, // 100% of fontSize (14px)
    letterSpacing: 0,
    textAlignVertical: 'center', // Vertical alignment middle
    color: Colors.inputText, // Default text color
    width: '100%',
  } as ViewStyle & TextStyle,
  inputError: {
    borderColor: Colors.inputBorderError,
  } as ViewStyle,
  default: {
    width: '100%',
  } as ViewStyle,
  half: {
    width: '45.6%',
  } as ViewStyle,
  eyeIconContainer: {
    position: 'absolute',
    right: 12,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  eyeIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.textLight,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  eyeIconCircleError: {
    borderColor: Colors.error,
  } as ViewStyle,
  eyeIconInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.error,
    marginTop: 4,
    marginLeft: 4,
  } as TextStyle,
});

export default PasswordInput;

