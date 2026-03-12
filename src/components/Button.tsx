import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/colors';
import Typography from '../constants/typography';

export type ButtonVariant = 'primary' | 'half-outlined' | 'half-filled';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * Variant of the button
   * - 'primary': 314px width, 56px height, 12px radius, #10B4D4 background, white text
   * - 'half-outlined': 168px width, 42px height, 8px radius, white background, #E5E5E5 border
   * - 'half-filled': 166px width, 42px height, 8px radius, #00BCD4 background, white text
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Text content of the button
   */
  title: string;
  /**
   * Custom style for the button container
   */
  style?: ViewStyle;
  /**
   * Custom style for the button text
   */
  textStyle?: TextStyle;
  /**
   * Show loading state with activity indicator
   * @default false
   */
  loading?: boolean;
  /**
   * Loading text to display when loading is true
   * If not provided, the original title will be shown
   */
  loadingText?: string;
}

/**
 * Reusable Button Component
 *
 * A customizable button component with three variants: primary, half-outlined, and half-filled.
 * Each variant has specific dimensions, colors, and styling.
 *
 * @example
 * // Primary button (314px width, 56px height)
 * <Button
 *   title="Submit"
 *   onPress={() => console.log('Pressed')}
 * />
 *
 * @example
 * // Half outlined button (168px width, 42px height)
 * <Button
 *   variant="half-outlined"
 *   title="Cancel"
 *   onPress={() => console.log('Cancel')}
 * />
 *
 * @example
 * // Half filled button (166px width, 42px height)
 * <Button
 *   variant="half-filled"
 *   title="Confirm"
 *   onPress={() => console.log('Confirm')}
 * />
 *
 * @example
 * // With disabled state
 * <Button
 *   title="Submit"
 *   onPress={() => {}}
 *   disabled={true}
 * />
 *
 * @example
 * // With custom styles
 * <Button
 *   variant="primary"
 *   title="Custom Button"
 *   onPress={() => {}}
 *   style={{ marginTop: 20 }}
 *   textStyle={{ fontSize: 16 }}
 * />
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  title,
  style,
  textStyle,
  disabled,
  loading = false,
  loadingText,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const displayText = loading && loadingText ? loadingText : title;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'half-outlined' ? Colors.buttonTextDark : Colors.buttonText}
            style={styles.loader}
          />
        ) : null}
        <Text style={[textStyles[variant], textStyle]}>
          {displayText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  primary: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: Colors.buttonSecondary,
  } as ViewStyle,
  'half-outlined': {
    width: '45.6%',
    height: 42,
    borderRadius: 80,
    backgroundColor: Colors.background,
    borderWidth: 0.8,
    borderColor: Colors.buttonBorder,
  } as ViewStyle,
  'half-filled': {
    width: '45.6%',
    height: 42,
    borderRadius: 80,
    backgroundColor: Colors.buttonSecondary,
  } as ViewStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,
  loader: {
    marginRight: 8,
  } as ViewStyle,
});

const textStyles = StyleSheet.create({
  primary: {
    ...Typography.button,
    color: Colors.buttonText,
  } as TextStyle,
  'half-outlined': {
    ...Typography.body,
    color: Colors.buttonTextDark,
  } as TextStyle,
  'half-filled': {
    ...Typography.body,
    color: Colors.buttonText,
  } as TextStyle,
});

export default Button;

