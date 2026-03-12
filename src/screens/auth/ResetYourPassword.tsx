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
import Input from '../../components/Input';
import Button from '../../components/Button';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Fonts from '../../constants/fonts';
import { signInSchema, validateField } from '../../utils/validation';

type ResetYourPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;

const ResetYourPassword: React.FC = () => {
  const navigation = useNavigation<ResetYourPasswordScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleEmailChange = async (text: string) => {
    setEmail(text);
    // Clear error when user starts typing
    if (errors.email) {
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    }
    // Validate on blur if field was touched
    if (touched.email) {
      const { isValid, error } = await validateField(
        signInSchema,
        'email',
        text,
        { email: text }
      );
      if (!isValid && error) {
        setErrors((prev) => ({ ...prev, email: error }));
      }
    }
  };

  const handleEmailBlur = async () => {
    setTouched((prev) => ({ ...prev, email: true }));
    
    const { isValid, error } = await validateField(
      signInSchema,
      'email',
      email,
      { email }
    );
    
    if (!isValid && error) {
      setErrors((prev) => ({ ...prev, email: error }));
    } else if (errors.email) {
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    }
  };

  const handleSendResetLink = async () => {
    // Mark field as touched
    setTouched({ email: true });

    // Validate email
    const { isValid, error } = await validateField(
      signInSchema,
      'email',
      email,
      { email }
    );

    if (!isValid && error) {
      setErrors({ email: error });
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    // Handle send reset link logic here
    console.log('Send reset link pressed', { email });

    // Navigate to verify code screen
    navigation.navigate('VerifyCode');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
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

        {/* Reset Prompt */}
        <View style={styles.resetPrompt}>
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
                Reset your
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
          <Text style={styles.resetSubtitle}>
            Kindly provide your email address to reset your account password.
          </Text>
        </View>

        {/* Input Field */}
        <View style={styles.inputSection}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            onBlur={handleEmailBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={errors.email}
          />
        </View>

        {/* Send Reset Link Button */}
        <Button
          variant="primary"
          title="Send OTP"
          onPress={handleSendResetLink}
          style={styles.resetButton}
          textStyle={styles.resetButtonText}
        />

        {/* Sign In Section */}
        <View style={styles.signInSection}>
          <Text style={styles.signInPrompt}>Remember your password?</Text>
          <TouchableOpacity
            onPress={handleSignUp}
            activeOpacity={0.7}
          >
            <Text style={styles.signUpLink}>Sign In</Text>
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
  resetPrompt: {
    marginBottom: 16,
    alignItems: 'center',
  },
  titleWrapper: {
    width: '100%',
    height: 80,
    marginBottom: 16,
  },
  resetSubtitle: {
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
  input: {
    backgroundColor: Colors.inputBackground,
  },
  resetButton: {
    backgroundColor: Colors.buttonPrimary,
    marginBottom: 16,
  },
  resetButtonText: {
    ...Typography.button,
    fontFamily: Fonts.raleway,
  },
  signInSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  signInPrompt: {
    ...Typography.body,
    fontFamily: Fonts.openSans,
    color: Colors.textLighter,
    marginBottom: 4,
  },
  signUpLink: {
    ...Typography.link,
    fontFamily: Fonts.raleway,
    color: Colors.link,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ResetYourPassword;

