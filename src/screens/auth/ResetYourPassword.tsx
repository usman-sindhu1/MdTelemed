import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Icons from '../../assets/svg';
import Input from '../../components/Input';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { signInSchema, validateField } from '../../utils/validation';

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

type ResetYourPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;

const ResetYourPassword: React.FC = () => {
  const navigation = useNavigation<ResetYourPasswordScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleEmailChange = async (text: string) => {
    setEmail(text);
    if (errors.email) {
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    }
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
    setTouched({ email: true });
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
    setErrors({});
    navigation.navigate('VerifyCode');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

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
            colors={[
              'transparent',
              'transparent',
              BLUE_SHADE_LIGHT,
              BLUE_SHADE_MID,
              BLUE_SHADE_RIGHT,
            ]}
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
            {/* Logo */}
            <View style={styles.logoSection}>
              <Image
                source={require('../../assets/svg/logo1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Reset your password</Text>
              <Text style={styles.subtitle}>
                Kindly provide your email address to reset your account password.
              </Text>
            </View>

            {/* Email input */}
            <View style={styles.inputSection}>
              <Input
                label="Email"
                placeholder="Write here"
                placeholderTextColor={PLACEHOLDER_COLOR}
                labelStyle={styles.inputLabel}
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                error={errors.email}
              />
            </View>

            {/* Send OTP button */}
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendResetLink}
              activeOpacity={0.85}
            >
              <Text style={styles.sendButtonText}>Send OTP</Text>
              <Text style={styles.sendButtonArrow}>→</Text>
            </TouchableOpacity>

            {/* Sign In link - scrolls with content */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInPrompt}>Remember your password?</Text>
              <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SURFACE_BASE,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  gradientOverlayWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
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
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
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
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    color: INPUT_LABEL_COLOR,
  },
  input: {
    backgroundColor: SURFACE_BASE,
  },
  sendButton: {
    backgroundColor: PRIMARY,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  sendButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.buttonText,
  },
  sendButtonArrow: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.buttonText,
  },
  signInContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  signInPrompt: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  signInLink: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '600',
    color: PRIMARY,
  },
});

export default ResetYourPassword;
