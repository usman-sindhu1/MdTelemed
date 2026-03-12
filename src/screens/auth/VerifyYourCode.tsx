import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Svg, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Icons from '../../assets/svg';
import Button from '../../components/Button';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Fonts from '../../constants/fonts';

type VerifyYourCodeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'VerifyCode'>;

const VerifyYourCode: React.FC = () => {
  const navigation = useNavigation<VerifyYourCodeScreenNavigationProp>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email] = useState('laslie.alexander@gmail.com'); // This could come from props or state
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
    if (otpCode.length === 6) {
      // Handle verification logic here
      console.log('Verify OTP:', otpCode);
      // Navigate to change password screen
      navigation.navigate('ChangePassword');
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    console.log('Resend code');
    
    // Navigate to change password screen
    navigation.navigate('ChangePassword');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleChangeEmail = () => {
    navigation.navigate('ResetPassword');
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
            <Icons.Logo1 width={250} height={125} />
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
                code
              </SvgText>
            </Svg>
          </View>
          <Text style={styles.verifySubtitle}>
            Verification code has been sent to your email{' '}
            <Text style={styles.emailText}>{email}</Text>
            . Please enter your verification code to verify your identity.
          </Text>
          <TouchableOpacity
            onPress={handleChangeEmail}
            activeOpacity={0.7}
            style={styles.changeEmailContainer}
          >
            <Text style={styles.changeEmailLink}>Change Email</Text>
          </TouchableOpacity>
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

        {/* Resend Code Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            If you didn't receive the code then click on the button below.
          </Text>
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
    marginBottom: 12,
  },
  emailText: {
    fontFamily: Fonts.openSans,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  changeEmailContainer: {
    marginTop: 4,
  },
  changeEmailLink: {
    ...Typography.link,
    fontFamily: Fonts.raleway,
    color: Colors.link,
    fontSize: 14,
    fontWeight: '700',
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
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackground,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Fonts.raleway,
    color: Colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: '#F5EFFF',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    ...Typography.body,
    fontFamily: Fonts.openSans,
    color: Colors.textLighter,
    textAlign: 'center',
    marginBottom: 12,
    width: '88%',
  },
  resendLink: {
    ...Typography.link,
    fontFamily: Fonts.raleway,
    color: Colors.link,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default VerifyYourCode;

