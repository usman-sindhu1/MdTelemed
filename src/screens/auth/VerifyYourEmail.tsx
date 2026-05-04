import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { Svg, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Icons from '../../assets/svg';
import Button from '../../components/Button';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Fonts from '../../constants/fonts';
import useApi from '../../hooks/UseApi';
import { authPaths } from '../../constants/authPaths';
import { persistAuthToken, persistAuthUser, sanitizeUser } from '../../utils/authSession';
import { setUser } from '../../store/slices/authSlice';
import { showErrorToast, showSuccessToast } from '../../utils/appToast';

type VerifyYourEmailScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'VerifyEmail'>;

const VerifyYourEmail: React.FC = () => {
  const navigation = useNavigation<VerifyYourEmailScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'VerifyEmail'>>();
  const dispatch = useDispatch();
  const email = route.params?.email ?? '';

  const { onRequest: verifyOtp, isPending: verifying } = useApi<{
    email: string;
    code: string;
  }>({
    key: 'verify-signup-otp',
    isSuccessToast: false,
  });

  const { onRequest: resendSignupOtp, isPending: resending } = useApi<{
    email: string;
    purpose: string;
  }>({
    key: 'resend-signup-otp',
    isSuccessToast: false,
  });

  useEffect(() => {
    if (!email) {
      showErrorToast('Missing email', 'Please sign up again.');
      const t = setTimeout(() => navigation.goBack(), 600);
      return () => clearTimeout(t);
    }
  }, [email, navigation]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    // Handle paste - if multiple digits are entered, distribute them
    if (value.length > 1) {
      // Extract only digits
      const digits = value.replace(/\D/g, '').slice(0, 6);
      
      if (digits.length > 0) {
        const newOtp = ['', '', '', '', '', ''];
        
        // When pasting, always fill from index 0 (first input)
        // This ensures pasting in any input fills all 6 inputs from the start
        for (let i = 0; i < digits.length && i < 6; i++) {
          newOtp[i] = digits[i];
        }
        
        setOtp(newOtp);
        
        // Focus the last filled input or blur if all are filled
        const lastFilledIndex = Math.min(digits.length - 1, 5);
        if (lastFilledIndex < 5) {
          setTimeout(() => {
            inputRefs.current[lastFilledIndex + 1]?.focus();
          }, 0);
        } else {
          setTimeout(() => {
            inputRefs.current[lastFilledIndex]?.blur();
          }, 0);
        }
      }
      return;
    }
    
    // Only allow numbers for single character
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    // Handle backspace to move to previous input
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6 || !email) {
      return;
    }
    verifyOtp({
      path: authPaths.verifySignupOtp,
      data: { email, code: otpCode },
      onSuccess: async (data: { token: string; user: Record<string, unknown> }) => {
        const token = data?.token;
        const rawUser = data?.user;
        const safeUser = sanitizeUser(rawUser as Record<string, unknown>);
        if (token) {
          await persistAuthToken(token);
        }
        if (safeUser) {
          await persistAuthUser(safeUser as Record<string, unknown>);
        }
        dispatch(setUser(safeUser ?? { sessionRestored: true }));
        showSuccessToast('Email verified', 'Your account is ready. Welcome!');
      },
      onError: (err: any) => {
        showErrorToast(err?.message || 'Invalid or expired code.');
      },
    });
  };

  const handleResend = () => {
    if (!email) return;
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    resendSignupOtp({
      path: authPaths.resendOtp,
      data: { email, purpose: 'SIGNUP' },
      onSuccess: () => {
        showSuccessToast(
          'Code sent',
          'If an account exists for this email, a new code has been sent.',
        );
      },
      onError: (err: any) => {
        showErrorToast(err?.message || 'Could not resend code.');
      },
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
            <Image
              source={require('../../assets/svg/logo1.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="MdTelemed logo"
            />
          </View>
        </View>

        {/* Verify Prompt */}
        <View style={styles.verifyPrompt}>
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
                Verify your
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
                email!
              </SvgText>
            </Svg>
          </View>
          <Text style={styles.verifySubtitle}>
            We've sent a verification code to{' '}
            <Text style={styles.emailHighlight}>{email || 'your email'}</Text>. Please enter the code below to verify your account.
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                otp[index] && styles.otpInputFilled,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={6}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Verify Button */}
        <Button
          variant="primary"
          title="Verify Email"
          onPress={handleVerify}
          style={styles.verifyButton}
          textStyle={styles.verifyButtonText}
          loading={verifying}
          disabled={resending || otp.join('').length !== 6}
        />

        {/* Resend Code Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity
            onPress={handleResend}
            activeOpacity={0.7}
          >
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    justifyContent: 'center',
    paddingVertical: 4,
  },
  logo: {
    width: 80,
    height: 80,
  },
  verifyPrompt: {
    marginBottom: 32,
    alignItems: 'center',
  },
  titleWrapper: {
    width: '100%',
    height: 80,
    marginBottom: 16,
  },
  verifySubtitle: {
    ...Typography.bodyLarge,
    fontFamily: Fonts.openSans,
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    width: '88%',
  },
  emailHighlight: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.22)',
    backgroundColor: Colors.gradient.background.start,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Fonts.raleway,
    color: Colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    /** Primary-light tint (matches Colors.primaryLight #93C5FD at ~55% opacity on white) */
    backgroundColor: 'rgba(147, 197, 253, 0.55)',
  },
  verifyButton: {
    backgroundColor: Colors.buttonPrimary,
    marginBottom: 24,
  },
  verifyButtonText: {
    ...Typography.button,
    fontFamily: Fonts.raleway,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    ...Typography.body,
    fontFamily: Fonts.openSans,
    color: Colors.textLighter,
    marginBottom: 8,
  },
  resendLink: {
    ...Typography.link,
    fontFamily: Fonts.raleway,
    color: Colors.link,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default VerifyYourEmail;

