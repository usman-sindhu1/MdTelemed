import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Icons from '../../assets/svg';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

const SURFACE_BASE = '#FFFFFF';
const PRIMARY = '#2563EB';
const GRADIENT_TOP = '#F8FAFC';
const GRADIENT_MID = '#F0F4F8';
const GRADIENT_BOTTOM = '#E8ECF4';
const BLUE_SHADE_LIGHT = 'rgba(37, 99, 235, 0.06)';
const BLUE_SHADE_MID = 'rgba(37, 99, 235, 0.12)';
const BLUE_SHADE_RIGHT = 'rgba(37, 99, 235, 0.2)';
const INPUT_LABEL_COLOR = '#424242';

type VerifyYourCodeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'VerifyCode'>;

const VerifyYourCode: React.FC = () => {
  const navigation = useNavigation<VerifyYourCodeScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email] = useState('laslie.alexander@gmail.com');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6);
      if (digits.length > 0) {
        const newOtp = ['', '', '', '', '', ''];
        for (let i = 0; i < digits.length && i < 6; i++) {
          newOtp[i] = digits[i];
        }
        setOtp(newOtp);
        const lastFilledIndex = Math.min(digits.length - 1, 5);
        if (lastFilledIndex < 5) {
          setTimeout(() => inputRefs.current[lastFilledIndex + 1]?.focus(), 0);
        } else {
          setTimeout(() => inputRefs.current[lastFilledIndex]?.blur(), 0);
        }
      }
      return;
    }
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      navigation.navigate('ChangePassword');
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleBack = () => navigation.goBack();
  const handleChangeEmail = () => navigation.navigate('ResetPassword');

  const isComplete = otp.every((d) => d !== '');

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
              <Text style={styles.title}>Verify your code.</Text>
              <Text style={styles.subtitle}>
                Verification code has been sent to your email{' '}
                <Text style={styles.emailText}>{email}</Text>
                . Please enter your verification code to verify your identity.
              </Text>
              <TouchableOpacity onPress={handleChangeEmail} activeOpacity={0.7} style={styles.changeEmailWrap}>
                <Text style={styles.linkText}>Change Email</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                  value={digit}
                  onChangeText={(v) => handleOtpChange(index, v)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                  keyboardType="number-pad"
                  maxLength={6}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>
            <View style={styles.resendSection}>
              <Text style={styles.resendPrompt}>
                If you didn't receive the code then click on the button below.
              </Text>
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={styles.linkText}>Resend Code</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.verifyButton, !isComplete && styles.verifyButtonDisabled]}
              onPress={handleVerify}
              activeOpacity={0.85}
              disabled={!isComplete}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
              <Text style={styles.verifyButtonArrow}>→</Text>
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
    marginBottom: 8,
  },
  emailText: { fontFamily: Fonts.openSans, color: INPUT_LABEL_COLOR, fontWeight: '600' },
  changeEmailWrap: { marginBottom: 24 },
  linkText: { fontFamily: Fonts.raleway, fontSize: 15, fontWeight: '600', color: PRIMARY },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: SURFACE_BASE,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Fonts.raleway,
    color: Colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: PRIMARY,
    backgroundColor: '#F0F4FF',
  },
  resendSection: { alignItems: 'center', marginBottom: 28 },
  resendPrompt: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  verifyButton: {
    backgroundColor: PRIMARY,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  verifyButtonDisabled: { opacity: 0.6 },
  verifyButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.buttonText,
  },
  verifyButtonArrow: { fontSize: 18, fontWeight: '600', color: Colors.buttonText },
});

export default VerifyYourCode;
