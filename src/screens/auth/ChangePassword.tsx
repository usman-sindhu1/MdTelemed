import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Icons from '../../assets/svg';
import PasswordInput from '../../components/PasswordInput';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { signUpSchema, validateField } from '../../utils/validation';
import useApi from '../../hooks/UseApi';
import { authPaths } from '../../constants/authPaths';
import { showErrorToast, showSuccessToast } from '../../utils/appToast';

const SURFACE_BASE = '#FFFFFF';
const PRIMARY = '#2563EB';
const GRADIENT_TOP = '#F8FAFC';
const GRADIENT_MID = '#F0F4F8';
const GRADIENT_BOTTOM = '#E8ECF4';
const BLUE_SHADE_LIGHT = 'rgba(37, 99, 235, 0.06)';
const BLUE_SHADE_MID = 'rgba(37, 99, 235, 0.12)';
const BLUE_SHADE_RIGHT = 'rgba(37, 99, 235, 0.2)';
const INPUT_LABEL_COLOR = '#424242';
const PLACEHOLDER_COLOR = '#BDBDBD';

type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ChangePassword'>;

const ChangePassword: React.FC = () => {
  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ChangePassword'>>();
  const insets = useSafeAreaInsets();
  const resetToken = route.params?.resetToken ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { onRequest, isPending } = useApi<{ resetToken: string; newPassword: string }>({
    key: 'new-password-after-reset',
    isSuccessToast: false,
  });

  const handlePasswordChange = async (field: string, value: string) => {
    if (field === 'newPassword') setNewPassword(value);
    else if (field === 'confirmPassword') setConfirmPassword(value);
    if (errors[field]) {
      const next = { ...errors };
      delete next[field];
      setErrors(next);
    }
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
      if (!isValid && error) setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handlePasswordBlur = async (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const formData = { password: newPassword, confirmPassword };
    const fieldName = field === 'newPassword' ? 'password' : 'confirmPassword';
    const value = field === 'newPassword' ? newPassword : confirmPassword;
    const { isValid, error } = await validateField(signUpSchema, fieldName, value, formData);
    if (!isValid && error) setErrors((prev) => ({ ...prev, [field]: error }));
    else if (errors[field]) {
      const next = { ...errors };
      delete next[field];
      setErrors(next);
    }
  };

  const handleUpdatePassword = async () => {
    setTouched({ newPassword: true, confirmPassword: true });
    const formData = { password: newPassword, confirmPassword };
    const { isValid: pValid, error: pError } = await validateField(signUpSchema, 'password', newPassword, formData);
    const { isValid: cValid, error: cError } = await validateField(signUpSchema, 'confirmPassword', confirmPassword, formData);
    if (!pValid && pError) setErrors((prev) => ({ ...prev, newPassword: pError }));
    if (!cValid && cError) setErrors((prev) => ({ ...prev, confirmPassword: cError }));
    if (!pValid || !cValid) return;
    if (!resetToken) {
      showErrorToast('Session expired', 'Please request a new reset link.');
      setTimeout(() => navigation.navigate('ResetPassword'), 500);
      return;
    }
    setErrors({});
    onRequest({
      path: authPaths.newPassword,
      data: { resetToken, newPassword },
      onSuccess: () => {
        showSuccessToast('Password reset', 'You can sign in with your new password.');
        setTimeout(() => navigation.navigate('SignIn'), 1800);
      },
      onError: (err: any) => {
        showErrorToast(err?.message || 'Could not update password. Try again.');
      },
    });
  };

  const handleBack = () => navigation.goBack();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[GRADIENT_TOP, GRADIENT_MID, GRADIENT_BOTTOM]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.gradientOverlayWrap} pointerEvents="none">
          <LinearGradient
            colors={['transparent', 'transparent', BLUE_SHADE_LIGHT, BLUE_SHADE_MID, BLUE_SHADE_RIGHT]}
            locations={[0, 0.35, 0.6, 0.8, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientOverlay}
          />
        </View>
        <SafeAreaView style={styles.container} edges={['top']}>
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 8 }]}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View style={styles.backButtonInner}>
              <Icons.Back width={22} height={22} />
            </View>
          </TouchableOpacity>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoSection}>
              <Image source={require('../../assets/svg/logo1.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <View style={styles.header}>
              <Text style={styles.title}>New password</Text>
              <Text style={styles.subtitle}>
                Enter your new password below to reset your account password.
              </Text>
            </View>
            <View style={styles.inputSection}>
              <PasswordInput
                label="New password"
                placeholder="Write here"
                placeholderTextColor={PLACEHOLDER_COLOR}
                labelStyle={styles.inputLabel}
                value={newPassword}
                onChangeText={(text) => handlePasswordChange('newPassword', text)}
                onBlur={() => handlePasswordBlur('newPassword')}
                style={styles.passwordInput}
                error={errors.newPassword}
              />
              <PasswordInput
                label="Confirm password"
                placeholder="Write here"
                placeholderTextColor={PLACEHOLDER_COLOR}
                labelStyle={styles.inputLabel}
                value={confirmPassword}
                onChangeText={(text) => handlePasswordChange('confirmPassword', text)}
                onBlur={() => handlePasswordBlur('confirmPassword')}
                style={styles.passwordInput}
                error={errors.confirmPassword}
              />
            </View>
            <TouchableOpacity
              style={[styles.updateButton, isPending && { opacity: 0.85 }]}
              onPress={handleUpdatePassword}
              activeOpacity={0.85}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color={Colors.buttonText} />
              ) : (
                <>
                  <Text style={styles.updateButtonText}>Update Password</Text>
                  <Text style={styles.updateButtonArrow}>→</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SURFACE_BASE },
  gradient: { flex: 1 },
  container: { flex: 1 },
  gradientOverlayWrap: { ...StyleSheet.absoluteFillObject },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backButton: {
    position: 'absolute',
    left: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SURFACE_BASE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  logoSection: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 80, height: 80 },
  header: { alignItems: 'center', marginBottom: 28 },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 26,
    fontWeight: '700',
    color: INPUT_LABEL_COLOR,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  inputSection: { marginBottom: 24, gap: 18 },
  inputLabel: { color: INPUT_LABEL_COLOR },
  passwordInput: { backgroundColor: SURFACE_BASE },
  updateButton: {
    backgroundColor: PRIMARY,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  updateButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.buttonText,
  },
  updateButtonArrow: { fontSize: 18, fontWeight: '600', color: Colors.buttonText },
});

export default ChangePassword;
