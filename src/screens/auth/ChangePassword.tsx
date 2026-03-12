import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Svg, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Icons from '../../assets/svg';
import PasswordInput from '../../components/PasswordInput';
import Button from '../../components/Button';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Fonts from '../../constants/fonts';
import { signUpSchema, validateField } from '../../utils/validation';

type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ChangePassword'>;

const ChangePassword: React.FC = () => {
  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handlePasswordChange = async (field: string, value: string) => {
    if (field === 'newPassword') {
      setNewPassword(value);
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value);
    }

    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    // Validate on blur if field was touched
    if (touched[field]) {
      const formData = {
        password: field === 'newPassword' ? value : newPassword,
        confirmPassword: field === 'confirmPassword' ? value : confirmPassword,
      };

      const { isValid, error } = await validateField(
        signUpSchema,
        field === 'newPassword' ? 'password' : 'confirmPassword',
        value,
        formData
      );
      if (!isValid && error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    }
  };

  const handlePasswordBlur = async (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    const formData = {
      password: newPassword,
      confirmPassword: confirmPassword,
    };

    const fieldName = field === 'newPassword' ? 'password' : 'confirmPassword';
    const { isValid, error } = await validateField(
      signUpSchema,
      fieldName,
      field === 'newPassword' ? newPassword : confirmPassword,
      formData
    );
    
    if (!isValid && error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleUpdatePassword = async () => {
    // Mark all fields as touched
    setTouched({
      newPassword: true,
      confirmPassword: true,
    });

    // Validate passwords
    const formData = {
      password: newPassword,
      confirmPassword: confirmPassword,
    };

    const { isValid: isPasswordValid, error: passwordError } = await validateField(
      signUpSchema,
      'password',
      newPassword,
      formData
    );

    const { isValid: isConfirmValid, error: confirmError } = await validateField(
      signUpSchema,
      'confirmPassword',
      confirmPassword,
      formData
    );

    if (!isPasswordValid && passwordError) {
      setErrors((prev) => ({ ...prev, newPassword: passwordError }));
    }
    if (!isConfirmValid && confirmError) {
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }

    if (!isPasswordValid || !isConfirmValid) {
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    // Handle update password logic here
    console.log('Update password pressed', { newPassword, confirmPassword });

    // Navigate to sign in after successful password change
    navigation.navigate('SignIn');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button and Logo */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Icons.Back width={24} height={24} />
          </TouchableOpacity>
          <View style={styles.logoSection}>
            <Icons.Logo1 width={250} height={125} />
          </View>
        </View>

        {/* Change Password Prompt */}
        <View style={styles.changePasswordPrompt}>
          <View style={styles.titleWrapper}>
            <Svg height="80" width="100%">
              <Defs>
                <SvgLinearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor={Colors.gradient.title.start} stopOpacity="1" />
                  <Stop offset="100%" stopColor={Colors.gradient.title.end} stopOpacity="1" />
                </SvgLinearGradient>
              </Defs>
              <SvgText
                x="50%"
                y="36"
                fontSize="40"
                fontWeight="700"
                fontFamily={Fonts.raleway}
                fill="url(#titleGradient)"
                textAnchor="middle"
              >
                New
              </SvgText>
              <SvgText
                x="50%"
                y="76"
                fontSize="40"
                fontWeight="700"
                fontFamily={Fonts.raleway}
                fill="url(#titleGradient)"
                textAnchor="middle"
              >
                password
              </SvgText>
            </Svg>
          </View>
          <Text style={styles.changePasswordSubtitle}>
            Enter your new password below to reset your account password.
          </Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputSection}>
          <PasswordInput
            placeholder="New password"
            value={newPassword}
            onChangeText={(text) => handlePasswordChange('newPassword', text)}
            onBlur={() => handlePasswordBlur('newPassword')}
            style={styles.passwordInput}
            error={errors.newPassword}
          />

          <PasswordInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={(text) => handlePasswordChange('confirmPassword', text)}
            onBlur={() => handlePasswordBlur('confirmPassword')}
            style={styles.passwordInput}
            error={errors.confirmPassword}
          />
        </View>

        {/* Update Password Button */}
        <Button
          variant="primary"
          title="Update Password"
          onPress={handleUpdatePassword}
          style={styles.updateButton}
          textStyle={styles.updateButtonText}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    position: 'relative',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  logoSection: {
    alignItems: 'center',
    flex: 1,
  },
  changePasswordPrompt: {
    marginBottom: 16,
    alignItems: 'center',
  },
  titleWrapper: {
    width: '100%',
    height: 80,
    marginBottom: 16,
  },
  changePasswordSubtitle: {
    ...Typography.bodyLarge,
    fontFamily: Fonts.openSans,
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    width: '88%',
  },
  inputSection: {
    marginBottom: 20,
    gap: 16,
  },
  passwordInput: {
    backgroundColor: Colors.inputBackground,
  },
  updateButton: {
    backgroundColor: Colors.buttonPrimary,
    marginBottom: 16,
  },
  updateButtonText: {
    ...Typography.button,
    fontFamily: Fonts.raleway,
  },
});

export default ChangePassword;

