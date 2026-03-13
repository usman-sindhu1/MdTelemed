import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Icons from '../../assets/svg';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Fonts from '../../constants/fonts';
import { signInSchema, validateWithSchema, validateField } from '../../utils/validation';
import { setUser } from '../../store/slices/authSlice';

const SURFACE_BASE = '#FFFFFF';
const PRIMARY = '#2563EB';
// Figma: subtle vertical gradient – light blue-white at top to muted lavender-blue at bottom
const GRADIENT_TOP = '#F8FAFC';       // very light blue-white
const GRADIENT_MID = '#F0F4F8';      // light cool grey-blue
const GRADIENT_BOTTOM = '#E8ECF4';   // muted lavender-blue
// Soft blue tint for right-side gradient (smooth blend, no hard edge)
const BLUE_SHADE_LIGHT = 'rgba(37, 99, 235, 0.06)';
const BLUE_SHADE_MID = 'rgba(37, 99, 235, 0.12)';
const BLUE_SHADE_RIGHT = 'rgba(37, 99, 235, 0.2)';
const FORGOT_PASSWORD_RED = '#DC2626';
const INPUT_LABEL_COLOR = '#424242';
const PLACEHOLDER_COLOR = '#BDBDBD';
const SOCIAL_BUTTON_TEXT_COLOR = '#757575';

type SignInScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

const SignIn: React.FC = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
        { email: text, password }
      );
      if (!isValid && error) {
        setErrors((prev) => ({ ...prev, email: error }));
      }
    }
  };

  const handlePasswordChange = async (text: string) => {
    setPassword(text);
    if (errors.password) {
      const newErrors = { ...errors };
      delete newErrors.password;
      setErrors(newErrors);
    }
    if (touched.password) {
      const { isValid, error } = await validateField(
        signInSchema,
        'password',
        text,
        { email, password: text }
      );
      if (!isValid && error) {
        setErrors((prev) => ({ ...prev, password: error }));
      }
    }
  };

  const handleEmailBlur = async () => {
    setTouched((prev) => ({ ...prev, email: true }));
    const { isValid, error } = await validateField(
      signInSchema,
      'email',
      email,
      { email, password }
    );
    if (!isValid && error) {
      setErrors((prev) => ({ ...prev, email: error }));
    } else if (errors.email) {
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    }
  };

  const handlePasswordBlur = async () => {
    setTouched((prev) => ({ ...prev, password: true }));
    const { isValid, error } = await validateField(
      signInSchema,
      'password',
      password,
      { email, password }
    );
    if (!isValid && error) {
      setErrors((prev) => ({ ...prev, password: error }));
    } else if (errors.password) {
      const newErrors = { ...errors };
      delete newErrors.password;
      setErrors(newErrors);
    }
  };

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    const { isValid, errors: validationErrors } = await validateWithSchema(
      signInSchema,
      { email, password }
    );
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    dispatch(setUser({ id: '1', email, name: 'User' }));
  };

  const handleForgotPassword = () => {
    navigation.navigate('ResetPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
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
        {/* Full-width soft blue shade – smooth blend from left to right, no half-half */}
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* App Icon */}
            <View style={styles.logoSection}>
              <Image
                source={require('../../assets/svg/logo1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                Login to Account! <Text style={styles.emoji}>👋</Text>
              </Text>
              <Text style={styles.subtitle}>
                A global platform where you can discover,{'\n'}book and create appointments with ease.
              </Text>
            </View>

            {/* Inputs with labels */}
            <View style={styles.inputSection}>
              <Input
                label="Email Address"
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
              <PasswordInput
                label="Password"
                placeholder="Write here"
                placeholderTextColor={PLACEHOLDER_COLOR}
                labelStyle={styles.inputLabel}
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={handlePasswordBlur}
                style={styles.passwordInput}
                error={errors.password}
              />
            </View>

            {/* Remember me + Forgot Password */}
            <View style={styles.loginOptions}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button with arrow */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.loginButtonText}>Login to Account</Text>
              <Text style={styles.loginButtonArrow}>→</Text>
            </TouchableOpacity>

            {/* Divider: or continue with */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
              <Icons.AppleIcon width={22} height={22} />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
              <Icons.GoogleIcon width={22} height={22} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Sign up link - scrolls with content */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpPrompt}>Don't have an account?</Text>
              <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
                <Text style={styles.signUpLink}>Create One</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  gradientOverlayWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
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
  emoji: {
    fontSize: 26,
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
    marginBottom: 20,
    gap: 18,
  },
  inputLabel: {
    color: INPUT_LABEL_COLOR,
  },
  input: {
    backgroundColor: SURFACE_BASE,
  },
  passwordInput: {
    backgroundColor: SURFACE_BASE,
  },
  loginOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.checkboxBorder,
    backgroundColor: Colors.checkboxBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.checkboxText,
    fontSize: 12,
    fontWeight: '700',
  },
  rememberMeText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textTertiary,
  },
  forgotPasswordText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '500',
    color: FORGOT_PASSWORD_RED,
  },
  loginButton: {
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
  loginButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.buttonText,
  },
  loginButtonArrow: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.buttonText,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  dividerText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: Colors.textLight,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: SURFACE_BASE,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 28,
    paddingVertical: 14,
    marginBottom: 12,
  },
  socialButtonText: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '500',
    color: SOCIAL_BUTTON_TEXT_COLOR,
  },
  signUpContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  signUpPrompt: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  signUpLink: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '600',
    color: PRIMARY,
  },
});

export default SignIn;
