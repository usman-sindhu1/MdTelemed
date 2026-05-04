import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import PhoneNumberInput from '@perttu/react-native-phone-number-input';
import type { CountryCode } from '@perttu/react-native-country-picker-modal';
import Colors from '../constants/colors';

export interface PhoneInputProps {
  /**
   * Phone number value
   */
  value?: string;
  /**
   * Callback when phone number changes
   */
  onChangeText?: (text: string) => void;
  /**
   * Callback when formatted phone number changes
   */
  onChangeFormattedText?: (formattedText: string) => void;
  /**
   * Callback when country code changes
   */
  onChangeCountry?: (country: any) => void;
  /**
   * Default country code (ISO 3166-1 alpha-2)
   * @default 'PK'
   */
  defaultCode?: CountryCode;
  /**
   * Placeholder text for phone number input
   * @default 'Phone number'
   */
  placeholder?: string;
  /**
   * Error message to display below the input
   */
  error?: string;
  /**
   * Callback to get validation state
   */
  onValidationChange?: (isValid: boolean) => void;
  /**
   * When true, render country selector and phone number as two separate bordered inputs (Figma style)
   */
  separateInputs?: boolean;
  /**
   * When false, the phone field is not editable (mirrors TextInput editable).
   */
  editable?: boolean;
}

/**
 * Reusable Phone Input Component
 *
 * A phone input component with country code selector and phone number input.
 * Matches the styling of other input components with country code on the left
 * and phone number input on the right.
 *
 * @example
 * <PhoneInput
 *   value={phoneNumber}
 *   onChangeText={setPhoneNumber}
 *   onChangeFormattedText={(formatted) => console.log(formatted)}
 * />
 */
const INPUT_HEIGHT = 48;
const INPUT_BORDER_RADIUS = 24;

export const PhoneInput = forwardRef<PhoneNumberInput, PhoneInputProps>(
  (
    {
      value = '',
      onChangeText,
      onChangeFormattedText,
      onChangeCountry,
      defaultCode = 'PK',
      placeholder = 'Phone number',
      error,
      onValidationChange,
      separateInputs = false,
      editable = true,
    },
    ref,
  ) => {
  const phoneInputRef = useRef<PhoneNumberInput>(null);
  useImperativeHandle(ref, () => phoneInputRef.current as PhoneNumberInput);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleChangeText = (text: string) => {
    // Filter out non-numeric characters (keep only digits)
    const numericOnly = text.replace(/[^0-9]/g, '');
    
    // Update parent with the filtered numeric value only
    onChangeText?.(numericOnly);
    
    // Validate phone number based on country code using the numeric text
    if (phoneInputRef.current && numericOnly) {
      try {
        const valid = phoneInputRef.current.isValidNumber(numericOnly);
        setIsValid(valid);
        onValidationChange?.(valid);
      } catch (error) {
        // If validation method doesn't exist, use basic validation
        const basicValid = numericOnly.length >= 8;
        setIsValid(basicValid);
        onValidationChange?.(basicValid);
      }
    } else {
      setIsValid(null);
      onValidationChange?.(false);
    }
  };

  const handleChangeFormattedText = (formattedText: string) => {
    onChangeFormattedText?.(formattedText);
    
    // Validate phone number based on country code with formatted text
    if (phoneInputRef.current && formattedText) {
      try {
        const valid = phoneInputRef.current.isValidNumber(formattedText);
        setIsValid(valid);
        onValidationChange?.(valid);
      } catch (error) {
        // If validation method doesn't exist, use basic validation
        const basicValid = formattedText.length >= 8;
        setIsValid(basicValid);
        onValidationChange?.(basicValid);
      }
    } else {
      setIsValid(null);
      onValidationChange?.(false);
    }
  };

  const containerStyle = separateInputs
    ? [styles.container, styles.containerSeparate, error && styles.containerError]
    : [styles.container, error && styles.containerError];

  const phoneContainerStyle = separateInputs
    ? [styles.phoneContainer, styles.phoneContainerSeparate]
    : styles.phoneContainer;

  const flagButtonStyle = separateInputs
    ? [styles.flagButton, styles.flagButtonSeparate, error && styles.flagButtonSeparateError]
    : [styles.flagButton];

  const textContainerStyle = separateInputs
    ? [styles.textContainer, styles.textContainerSeparate, error && styles.textContainerSeparateError]
    : [styles.textContainer];

  return (
    <View style={styles.wrapper}>
      <View style={containerStyle}>
        <PhoneNumberInput
          ref={phoneInputRef}
          value={value}
          defaultCode={defaultCode}
          layout="first"
          onChangeText={handleChangeText}
          onChangeFormattedText={handleChangeFormattedText}
          onChangeCountry={onChangeCountry}
          containerStyle={phoneContainerStyle}
          textContainerStyle={textContainerStyle}
          textInputStyle={[styles.textInput, error && styles.textInputError]}
          codeTextStyle={[styles.codeText, error && styles.codeTextError]}
          flagButtonStyle={flagButtonStyle}
          countryPickerButtonStyle={separateInputs ? [styles.countryPickerButton, styles.countryPickerButtonSeparate] : styles.countryPickerButton}
          renderDropdownImage={<Text style={styles.arrowIcon}>▼</Text>}
          withDarkTheme={false}
          withShadow={false}
          autoFocus={false}
          textInputProps={{
            placeholder,
            placeholderTextColor: '#BDBDBD',
            autoCapitalize: 'none',
            autoCorrect: false,
            keyboardType: 'numeric',
            maxLength: 15,
            editable,
          }}
          disableArrowIcon={!editable}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

PhoneInput.displayName = 'PhoneInput';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  } as ViewStyle,
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackground,
    overflow: 'hidden',
  } as ViewStyle,
  containerError: {
    borderColor: '#EF4444',
  } as ViewStyle,
  containerSeparate: {
    height: INPUT_HEIGHT,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
    gap: 12,
  } as ViewStyle,
  phoneContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 80,
    paddingHorizontal: 0,
    paddingVertical: 0,
  } as ViewStyle,
  phoneContainerSeparate: {
    flexDirection: 'row',
    height: INPUT_HEIGHT,
    borderRadius: 0,
    gap: 12,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  } as ViewStyle,
  textContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 80,
    height: '100%',
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  textContainerSeparate: {
    flex: 1,
    height: INPUT_HEIGHT,
    borderRadius: INPUT_BORDER_RADIUS,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  } as ViewStyle,
  textContainerSeparateError: {
    borderColor: '#EF4444',
  } as ViewStyle,
  textInput: {
    height: '100%',
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    paddingVertical: 0,
    paddingLeft: 0,
    paddingRight: 16,
    textAlignVertical: 'center',
    flex: 1,
    lineHeight: 15
  } as TextStyle,
  codeText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    textAlignVertical: 'center',
    includeFontPadding: false,
    margin: 0,
    paddingVertical: 0,
    paddingHorizontal: 8,
    lineHeight: 14,
  } as TextStyle,
  codeTextError: {
    color: '#EF4444',
  } as TextStyle,
  textInputError: {
    color: '#EF4444',
  } as TextStyle,
  flagButton: {
    width: 95,
    height: '100%',
    backgroundColor: 'transparent',
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
    paddingLeft: 12,
    paddingRight: 8,
    marginRight: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  } as ViewStyle,
  flagButtonSeparate: {
    width: 95,
    minWidth: 95,
    height: INPUT_HEIGHT,
    borderRadius: INPUT_BORDER_RADIUS,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: '#FFFFFF',
    marginRight: 0,
  } as ViewStyle,
  flagButtonSeparateError: {
    borderColor: '#EF4444',
  } as ViewStyle,
  countryPickerButton: {
    width: 95,
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    flexDirection: 'row',
  } as ViewStyle,
  countryPickerButtonSeparate: {
    height: INPUT_HEIGHT,
  } as ViewStyle,
  flagStyle: {
    width: 20,
    height: 15,
    marginRight: 6,
  } as ViewStyle,
  arrowIcon: {
    fontSize: 10,
    color: '#1F2933',
    marginLeft: 4,
  } as TextStyle,
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  } as TextStyle,
});

export default PhoneInput