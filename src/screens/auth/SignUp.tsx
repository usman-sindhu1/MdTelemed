import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { showErrorToast } from '../../utils/appToast';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Icons from '../../assets/svg';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';
import PhoneInput from '../../components/PhoneInput';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { signUpSchema, validateWithSchema, validateField } from '../../utils/validation';
import useApi from '../../hooks/UseApi';
import { authPaths } from '../../constants/authPaths';
import { getDeviceTimeZone } from '../../utils/authSession';

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
const SOCIAL_BUTTON_TEXT_COLOR = '#757575';

type SignUpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

type SignupRequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  timezone?: string;
  acceptTermsOfService?: boolean;
  acceptPrivacyPolicy?: boolean;
};

const toE164 = (value: string) => {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return '';
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/[^\d]/g, '');
  return digitsOnly ? `${hasPlus ? '+' : '+'}${digitsOnly}` : '';
};

type LegalDocKind = 'terms' | 'privacy';

const LEGAL_COPY: Record<
  LegalDocKind,
  {
    title: string;
    lastUpdated: string;
    sections: { title: string; body: string; bullets?: string[] }[];
  }
> = {
  terms: {
    title: 'Terms & Conditions',
    lastUpdated: 'Last updated: January 17, 2025',
    sections: [
      {
        title: '1. Acceptance of Terms',
        body:
          'By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
      },
      {
        title: '2. Use License',
        body:
          'Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:',
        bullets: [
          'Modify or copy the materials',
          'Use the materials for any commercial purpose',
          'Attempt to decompile or reverse engineer any software',
          'Remove any copyright or other proprietary notations',
        ],
      },
      {
        title: '3. Medical Disclaimer',
        body:
          'The information provided through this application is for general informational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment.',
      },
      {
        title: '4. User Account',
        body:
          'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.',
      },
      {
        title: '5. Privacy',
        body:
          'Your use of this application is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.',
      },
      {
        title: '6. Limitation of Liability',
        body:
          'In no event shall the application or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the application.',
      },
      {
        title: '7. Revisions',
        body:
          'The materials appearing on the application could include technical, typographical, or photographic errors. We may make changes to the materials contained on the application at any time without notice.',
      },
      {
        title: '8. Contact Information',
        body:
          'If you have any questions about these Terms & Conditions, please contact us through the Contact Us section in the application.',
      },
    ],
  },
  privacy: {
    title: 'Privacy & Security',
    lastUpdated: 'Last updated: January 17, 2025',
    sections: [
      {
        title: '1. Information We Collect',
        body:
          'We collect information that you provide directly to us, including when you create an account, make an appointment, use our services, or contact us for support.',
        bullets: [
          'Personal information (name, email, phone number)',
          'Medical information (appointments, prescriptions, reports)',
          'Payment information (processed securely through third-party providers)',
          'Device information and usage data',
        ],
      },
      {
        title: '2. How We Use Your Information',
        body:
          'We use the information we collect to:',
        bullets: [
          'Provide, maintain, and improve our services',
          'Process your appointments and medical requests',
          'Send you notifications and updates',
          'Respond to your inquiries and provide customer support',
          'Detect, prevent, and address technical issues',
        ],
      },
      {
        title: '3. Information Sharing',
        body:
          'We do not sell, trade, or rent your personal information to third parties. We may share your information only in limited circumstances such as providing care, supporting services, legal requirements, or with your consent.',
      },
      {
        title: '4. Data Security',
        body:
          'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.',
      },
      {
        title: '5. Your Rights',
        body: 'You have the right to:',
        bullets: [
          'Access and receive a copy of your personal data',
          'Request correction of inaccurate information',
          'Request deletion of your personal data',
          'Object to processing of your personal data',
          'Request restriction of processing',
          'Data portability',
        ],
      },
      {
        title: '6. Cookies and Tracking',
        body:
          'We use cookies and similar tracking technologies to track activity on our application and hold certain information. You can instruct your device to refuse all cookies or to indicate when a cookie is being sent.',
      },
      {
        title: "7. Children's Privacy",
        body:
          'Our services are not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.',
      },
      {
        title: '8. Changes to This Policy',
        body:
          'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy and updating the "Last updated" date.',
      },
      {
        title: '9. Contact Us',
        body:
          'If you have any questions about this Privacy Policy, please contact us through the Contact Us section in the application.',
      },
    ],
  },
};

const SignUp: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // digits-only for the input field
  const [phoneFormatted, setPhoneFormatted] = useState(''); // formatted with country code from PhoneInput
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [legalVisible, setLegalVisible] = useState(false);
  const [legalKind, setLegalKind] = useState<LegalDocKind>('terms');

  const { onRequest, isPending } = useApi<SignupRequestBody>({
    method: 'post',
    key: 'patient-signup',
    isSuccessToast: false,
  });

  const handleFieldChange = async (
    field: string,
    value: string | boolean,
    schemaField?: string
  ) => {
    const fieldName = schemaField || field;
    if (field === 'firstName') setFirstName(value as string);
    else if (field === 'lastName') setLastName(value as string);
    else if (field === 'email') setEmail(value as string);
    else if (field === 'phone') setPhone(value as string);
    else if (field === 'password') setPassword(value as string);
    else if (field === 'confirmPassword') setConfirmPassword(value as string);
    else if (field === 'agreeToTerms') setAgreeToTerms(value as boolean);

    if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }

    if (touched[fieldName] && typeof value === 'string') {
      const phoneE164 = toE164(phoneFormatted);
      const formData = {
        firstName,
        lastName,
        email,
        phone: phoneE164,
        password,
        confirmPassword,
        agreeToTerms,
        [field]: value,
      };
      const { isValid, error } = await validateField(
        signUpSchema,
        fieldName,
        value,
        formData
      );
      if (!isValid && error) {
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
      }
    }
  };

  const handleFieldBlur = async (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const phoneE164 = toE164(phoneFormatted);
    const formData = {
      firstName,
      lastName,
      email,
      phone: phoneE164,
      password,
      confirmPassword,
      agreeToTerms,
    };
    const { isValid, error } = await validateField(
      signUpSchema,
      field,
      formData[field as keyof typeof formData],
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

  const handleSignUp = async () => {
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true,
    });

    const phoneE164 = toE164(phoneFormatted);
    const formData = {
      firstName,
      lastName,
      email,
      dateOfBirth: '',
      gender: '',
      phone: phoneE164,
      address: '',
      password,
      confirmPassword,
      agreeToTerms,
    };

    const { isValid, errors: validationErrors } = await validateWithSchema(
      signUpSchema,
      formData
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const finalPhone = toE164(phoneFormatted);
    const apiData: SignupRequestBody = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: finalPhone,
      password,
      role: 'PATIENT',
      timezone: getDeviceTimeZone(),
      acceptTermsOfService: true,
      acceptPrivacyPolicy: true,
    };

    onRequest({
      path: authPaths.signup,
      data: apiData,
      onSuccess: () => {
        navigation.navigate('VerifyEmail', { email: email.trim() });
      },
      onError: (error: any) => {
        showErrorToast(error?.message || 'Failed to create account. Please try again.');
      },
    });
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const backButtonOpacity = useRef(new Animated.Value(1)).current;
  const [backButtonVisible, setBackButtonVisible] = useState(true);

  const showBackButton = () => {
    setBackButtonVisible(true);
    Animated.timing(backButtonOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideBackButton = () => {
    setBackButtonVisible(false);
    Animated.timing(backButtonOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleTermsLink = () => {
    setLegalKind('terms');
    setLegalVisible(true);
  };

  const handlePrivacyLink = () => {
    setLegalKind('privacy');
    setLegalVisible(true);
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
          <Modal
            visible={legalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setLegalVisible(false)}
          >
            <Pressable style={styles.modalBackdrop} onPress={() => setLegalVisible(false)}>
              <Pressable style={styles.modalCard} onPress={() => {}}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{LEGAL_COPY[legalKind].title}</Text>
                  <TouchableOpacity
                    onPress={() => setLegalVisible(false)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.modalClose}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  contentContainerStyle={styles.modalBody}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.modalLastUpdated}>{LEGAL_COPY[legalKind].lastUpdated}</Text>
                  {LEGAL_COPY[legalKind].sections.map((s, idx) => (
                    <View key={`${legalKind}-${idx}`} style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>{s.title}</Text>
                      <Text style={styles.modalSectionBody}>{s.body}</Text>
                      {!!s.bullets?.length && (
                        <View style={styles.modalBullets}>
                          {s.bullets.map((b, i) => (
                            <View key={`${legalKind}-${idx}-b-${i}`} style={styles.modalBulletRow}>
                              <Text style={styles.modalBulletDot}>•</Text>
                              <Text style={styles.modalBulletText}>{b}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              </Pressable>
            </Pressable>
          </Modal>
          <Animated.View
            style={[styles.backButton, { top: insets.top + 8, opacity: backButtonOpacity }]}
            pointerEvents={backButtonVisible ? 'box-none' : 'none'}
          >
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.backButtonTouchable}
            >
              <View style={styles.backButtonInner}>
                <Icons.Back width={22} height={22} />
              </View>
            </TouchableOpacity>
          </Animated.View>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={hideBackButton}
            onScrollEndDrag={showBackButton}
            onMomentumScrollEnd={showBackButton}
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
              <Text style={styles.title}>
                Create Account! <Text style={styles.emoji}>👋</Text>
              </Text>
              <Text style={styles.subtitle}>
                A global platform where you can discover,{'\n'}book and create appointments with ease.
              </Text>
            </View>

            {/* Inputs */}
            <View style={styles.inputSection}>
              <Input
                label="First Name"
                placeholder="Write here"
                placeholderTextColor={PLACEHOLDER_COLOR}
                labelStyle={styles.inputLabel}
                value={firstName}
                onChangeText={(text) => handleFieldChange('firstName', text)}
                onBlur={() => handleFieldBlur('firstName')}
                style={styles.input}
                error={errors.firstName}
                autoCapitalize="words"
              />
              <Input
                label="Last Name"
                placeholder="Write here"
                placeholderTextColor={PLACEHOLDER_COLOR}
                labelStyle={styles.inputLabel}
                value={lastName}
                onChangeText={(text) => handleFieldChange('lastName', text)}
                onBlur={() => handleFieldBlur('lastName')}
                style={styles.input}
                error={errors.lastName}
                autoCapitalize="words"
              />
              <Input
                label="Email"
                placeholder="Write here"
                placeholderTextColor={PLACEHOLDER_COLOR}
                labelStyle={styles.inputLabel}
                value={email}
                onChangeText={(text) => handleFieldChange('email', text)}
                onBlur={() => handleFieldBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                error={errors.email}
              />
              <View style={styles.phoneFieldWrapper}>
                <Text style={[styles.phoneLabel, styles.inputLabel]}>Phone</Text>
                <PhoneInput
                  value={phone}
                  onChangeText={(text) => handleFieldChange('phone', text)}
                  onChangeFormattedText={(text) => setPhoneFormatted(text)}
                  placeholder="Write here"
                  error={errors.phone}
                  separateInputs
                />
              </View>
              <PasswordInput
                label="Password"
                placeholder="Write here"
                placeholderTextColor={PLACEHOLDER_COLOR}
                labelStyle={styles.inputLabel}
                value={password}
                onChangeText={(text) => handleFieldChange('password', text)}
                onBlur={() => handleFieldBlur('password')}
                style={styles.passwordInput}
                error={errors.password}
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Write here"
                placeholderTextColor={PLACEHOLDER_COLOR}
                labelStyle={styles.inputLabel}
                value={confirmPassword}
                onChangeText={(text) => handleFieldChange('confirmPassword', text)}
                onBlur={() => handleFieldBlur('confirmPassword')}
                style={styles.passwordInput}
                error={errors.confirmPassword}
              />
            </View>

            {/* Terms */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleFieldChange('agreeToTerms', !agreeToTerms)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                  {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  I agree to{' '}
                  <Text style={styles.termsLink} onPress={handleTermsLink}>
                    Terms of Services
                  </Text>
                  {' & '}
                  <Text style={styles.termsLink} onPress={handlePrivacyLink}>
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </TouchableOpacity>
              {errors.agreeToTerms && (
                <Text style={styles.termsError}>{errors.agreeToTerms}</Text>
              )}
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleSignUp}
              activeOpacity={0.85}
              disabled={isPending}
            >
              <Text style={styles.createButtonText}>
                {isPending ? 'Creating...' : 'Create Account'}
              </Text>
              <Text style={styles.createButtonArrow}>→</Text>
            </TouchableOpacity>

            {/* Divider */}
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

            {/* Sign In link - scrolls with content */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInPrompt}>Already have an account??</Text>
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
  backButton: {
    position: 'absolute',
    left: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backButtonTouchable: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  phoneFieldWrapper: {
    width: '100%',
  },
  phoneLabel: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  input: {
    backgroundColor: SURFACE_BASE,
  },
  passwordInput: {
    backgroundColor: SURFACE_BASE,
  },
  termsContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
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
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  checkmark: {
    color: Colors.checkboxText,
    fontSize: 12,
    fontWeight: '700',
  },
  termsText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textTertiary,
    flex: 1,
  },
  termsLink: {
    fontFamily: Fonts.raleway,
    color: PRIMARY,
    fontWeight: '600',
  },
  termsError: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 28,
  },
  createButton: {
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
  createButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.buttonText,
  },
  createButtonArrow: {
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: SURFACE_BASE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    maxHeight: '75%',
    paddingBottom: 12,
    width: '100%',
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: INPUT_LABEL_COLOR,
    flex: 1,
  },
  modalClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '800',
    color: PRIMARY,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    gap: 14,
  },
  modalLastUpdated: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  modalSection: {
    gap: 8,
  },
  modalSectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '800',
    color: INPUT_LABEL_COLOR,
  },
  modalSectionBody: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  modalBullets: {
    gap: 6,
    paddingLeft: 2,
  },
  modalBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  modalBulletDot: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginTop: 0,
  },
  modalBulletText: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default SignUp;
