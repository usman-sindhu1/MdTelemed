import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Svg, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Icons from '../../assets/svg';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';
import PhoneInput from '../../components/PhoneInput';
import Button from '../../components/Button';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Fonts from '../../constants/fonts';
import { signUpSchema, validateWithSchema, validateField } from '../../utils/validation';
import useApi from '../../hooks/UseApi';

type SignUpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUp: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Initialize API hook
  type SignUpData = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    date_of_birth: string;
    address: string;
    gender: string;
    phone: string;
    country: string;
    city: string;
  };
  
  const { onRequest, isPending } = useApi<SignUpData>({
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
    
    // Update state
    if (field === 'firstName') setFirstName(value as string);
    else if (field === 'lastName') setLastName(value as string);
    else if (field === 'email') setEmail(value as string);
    else if (field === 'dateOfBirth') setDateOfBirth(value as string);
    else if (field === 'gender') setGender(value as string);
    else if (field === 'phone') setPhone(value as string);
    else if (field === 'address') setAddress(value as string);
    else if (field === 'password') setPassword(value as string);
    else if (field === 'confirmPassword') setConfirmPassword(value as string);
    else if (field === 'agreeToTerms') setAgreeToTerms(value as boolean);

    // Clear error when user starts typing
    if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }

    // Validate on blur if field was touched
    if (touched[fieldName] && typeof value === 'string') {
      const formData = {
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender,
        phone,
        address,
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
    
    const formData = {
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      phone,
      address,
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
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      dateOfBirth: true,
      gender: true,
      phone: true,
      address: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true,
    });

    // Validate entire form
    const formData = {
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      phone,
      address,
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

    // Clear errors if validation passes
    setErrors({});

    // Prepare API request data
    const apiData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      date_of_birth: dateOfBirth,
      address: address,
      gender: gender,
      phone: phone,
      country: country || '',
      city: city || '',
    };

    // Call the API
    onRequest<SignUpData>({
      path: '/otp/patient/signup',
      data: apiData as SignUpData,
      onSuccess: (response) => {
        console.log('Sign up successful:', response);
        // Navigate to verify email screen on success
        navigation.navigate('VerifyEmail');
      },
      onError: (error: any) => {
        console.error('Sign up error:', error);
        // Show error message to user
        const errorMessage = error?.message || 'Failed to create account. Please try again.';
        Alert.alert('Sign Up Failed', errorMessage, [{ text: 'OK' }]);
      },
    });
  };

  const handleSignIn = () => {
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

        {/* Sign Up Prompt */}
        <View style={styles.signUpPrompt}>
          <View style={styles.titleWrapper}>
            <Svg height="40" width="100%">
              <Defs>
                <SvgLinearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor={Colors.gradient.title.start} stopOpacity="1" />
                  <Stop offset="100%" stopColor={Colors.gradient.title.end} stopOpacity="1" />
                </SvgLinearGradient>
              </Defs>
              <SvgText
                x="50%"
                y="28"
                fontSize="32"
                fontWeight="700"
                fontFamily={Fonts.raleway}
                fill="url(#titleGradient)"
                textAnchor="middle"
              >
                Create your account!
              </SvgText>
            </Svg>
          </View>
          <Text style={styles.signUpSubtitle}>
            Provide your information below to create your account on Smart Health Center.
          </Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputSection}>
          {/* First Name and Last Name Row */}
          <View style={styles.nameRow}>
            <Input
              placeholder="First name"
              value={firstName}
              onChangeText={(text) => handleFieldChange('firstName', text)}
              onBlur={() => handleFieldBlur('firstName')}
              size="half"
              style={styles.input}
              error={errors.firstName}
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChangeText={(text) => handleFieldChange('lastName', text)}
              onBlur={() => handleFieldBlur('lastName')}
              size="half"
              style={styles.input}
              error={errors.lastName}
            />
          </View>

          <Input
            placeholder="Email"
            value={email}
            onChangeText={(text) => handleFieldChange('email', text)}
            onBlur={() => handleFieldBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={errors.email}
          />

          <Input
            placeholder="Date of birth"
            value={dateOfBirth}
            onChangeText={(text) => handleFieldChange('dateOfBirth', text)}
            onBlur={() => handleFieldBlur('dateOfBirth')}
            style={styles.input}
            error={errors.dateOfBirth}
          />

          <Input
            placeholder="Gender"
            value={gender}
            onChangeText={(text) => handleFieldChange('gender', text)}
            onBlur={() => handleFieldBlur('gender')}
            style={styles.input}
            error={errors.gender}
          />

          <PhoneInput
            value={phone}
            onChangeText={(text) => handleFieldChange('phone', text)}
            placeholder="Phone"
            error={errors.phone}
          />

          <Input
            placeholder="Address"
            value={address}
            onChangeText={(text) => handleFieldChange('address', text)}
            onBlur={() => handleFieldBlur('address')}
            style={styles.input}
            error={errors.address}
          />

          <PasswordInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => handleFieldChange('password', text)}
            onBlur={() => handleFieldBlur('password')}
            style={styles.passwordInput}
            error={errors.password}
          />

          <PasswordInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={(text) => handleFieldChange('confirmPassword', text)}
            onBlur={() => handleFieldBlur('confirmPassword')}
            style={styles.passwordInput}
            error={errors.confirmPassword}
          />
        </View>

        {/* Terms & Conditions Checkbox */}
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
              I agree with{' '}
              <Text style={styles.termsLink}>Terms & Conditions.</Text>
            </Text>
          </TouchableOpacity>
          {errors.agreeToTerms && (
            <Text style={styles.termsError}>{errors.agreeToTerms}</Text>
          )}
        </View>

        {/* Sign Up Button */}
        <Button
          variant="primary"
          title={isPending ? "Creating Account..." : "Create Account"}
          onPress={handleSignUp}
          style={styles.signUpButton}
          textStyle={styles.signUpButtonText}
          disabled={isPending}
        />

        {/* Sign In Section */}
        <View style={styles.signInSection}>
          <Text style={styles.signInPrompt}>Already have an account?</Text>
          <TouchableOpacity
            onPress={handleSignIn}
            activeOpacity={0.7}
          >
            <Text style={styles.signInLink}>Sign In</Text>
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
  signUpPrompt: {
    marginBottom: 16,
    alignItems: 'center',
    marginTop: 0,
  },
  titleWrapper: {
    width: '100%',
    height: 40,
    alignItems: 'center',
  },
  signUpSubtitle: {
    ...Typography.bodyLarge,
    fontFamily: Fonts.openSans,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 13,
    width: '88%',
  },
  inputSection: {
    marginBottom: 20,
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  input: {
    backgroundColor: Colors.inputBackground,
  },
  passwordInput: {
    backgroundColor: Colors.inputBackground,
  },
  termsContainer: {
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.checkboxChecked,
    borderColor: Colors.checkboxChecked,
  },
  checkmark: {
    color: Colors.checkboxText,
    fontSize: 12,
    fontWeight: '700',
  },
  termsText: {
    ...Typography.body,
    fontFamily: Fonts.openSans,
    color: Colors.textTertiary,
    flex: 1,
    flexWrap: 'wrap',
  },
  termsLink: {
    ...Typography.link,
    fontFamily: Fonts.raleway,
    color: Colors.link,
  },
  termsError: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 28,
  },
  signUpButton: {
    backgroundColor: Colors.buttonPrimary,
    marginBottom: 16,
  },
  signUpButtonText: {
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
    marginBottom: 0,
  },
  signInLink: {
    ...Typography.link,
    fontFamily: Fonts.raleway,
    color: Colors.link,
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default SignUp;

