import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as yup from 'yup';
import BackHeader from '../../../components/common/BackHeader';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';
import { validateWithSchema, validateField } from '../../../utils/validation';

type AddMedicalInfoNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'AddMedicalInfo'
>;

// Validation Schema
const addMedicalInfoSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  pronunciation: yup.string(),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup.string().required('Phone number is required'),
  sex: yup.string().required('Sex is required'),
  age: yup.string().required('Age is required'),
  isFirstTherapy: yup.string(),
  takingMedicine: yup.string(),
  lastVisit: yup.string(),
  preCondition: yup.string(),
  currentCondition: yup.string(),
});

interface DropdownOption {
  label: string;
  value: string;
}

const AddMedicalInfo: React.FC = () => {
  const navigation = useNavigation<AddMedicalInfoNavigationProp>();
  const insets = useSafeAreaInsets();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [isFirstTherapy, setIsFirstTherapy] = useState('');
  const [takingMedicine, setTakingMedicine] = useState('');
  const [lastVisit, setLastVisit] = useState('');
  const [preCondition, setPreCondition] = useState('');
  const [currentCondition, setCurrentCondition] = useState('');

  // Dropdown states
  const [sexDropdownOpen, setSexDropdownOpen] = useState(false);
  const [isFirstTherapyDropdownOpen, setIsFirstTherapyDropdownOpen] = useState(false);
  const [takingMedicineDropdownOpen, setTakingMedicineDropdownOpen] = useState(false);
  const [lastVisitDropdownOpen, setLastVisitDropdownOpen] = useState(false);
  const [preConditionDropdownOpen, setPreConditionDropdownOpen] = useState(false);
  const [currentConditionDropdownOpen, setCurrentConditionDropdownOpen] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Scroll and button animation state
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Dropdown options
  const sexOptions: DropdownOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const yesNoOptions: DropdownOption[] = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const lastVisitOptions: DropdownOption[] = [
    { label: 'Within last month', value: 'last_month' },
    { label: 'Within last 3 months', value: 'last_3_months' },
    { label: 'Within last 6 months', value: 'last_6_months' },
    { label: 'More than 6 months ago', value: 'more_than_6_months' },
    { label: 'Never', value: 'never' },
  ];

  const conditionOptions: DropdownOption[] = [
    { label: 'None', value: 'none' },
    { label: 'Diabetes', value: 'diabetes' },
    { label: 'Hypertension', value: 'hypertension' },
    { label: 'Asthma', value: 'asthma' },
    { label: 'Other', value: 'other' },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Field change handlers with validation
  const handleFieldChange = async (field: string, value: string) => {
    // Update field value
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'pronunciation':
        setPronunciation(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'age':
        setAge(value);
        break;
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
        firstName,
        lastName,
        pronunciation,
        email,
        phone,
        sex,
        age,
        isFirstTherapy,
        takingMedicine,
        lastVisit,
        preCondition,
        currentCondition,
        [field]: value,
      };
      const { isValid, error } = await validateField(
        addMedicalInfoSchema,
        field,
        value,
        formData
      );
      if (!isValid && error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    }
  };

  const handleFieldBlur = async (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const formData = {
      firstName,
      lastName,
      pronunciation,
      email,
      phone,
      sex,
      age,
      isFirstTherapy,
      takingMedicine,
      lastVisit,
      preCondition,
      currentCondition,
    };
    const { isValid, error } = await validateField(
      addMedicalInfoSchema,
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

  const handleDropdownSelect = (field: string, value: string) => {
    switch (field) {
      case 'sex':
        setSex(value);
        setSexDropdownOpen(false);
        break;
      case 'isFirstTherapy':
        setIsFirstTherapy(value);
        setIsFirstTherapyDropdownOpen(false);
        break;
      case 'takingMedicine':
        setTakingMedicine(value);
        setTakingMedicineDropdownOpen(false);
        break;
      case 'lastVisit':
        setLastVisit(value);
        setLastVisitDropdownOpen(false);
        break;
      case 'preCondition':
        setPreCondition(value);
        setPreConditionDropdownOpen(false);
        break;
      case 'currentCondition':
        setCurrentCondition(value);
        setCurrentConditionDropdownOpen(false);
        break;
    }
    // Clear error
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleContinue = async () => {
    // Mark all required fields as touched
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'sex', 'age'];
    const newTouched: Record<string, boolean> = {};
    requiredFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate entire form
    const formData = {
      firstName,
      lastName,
      pronunciation,
      email,
      phone,
      sex,
      age,
      isFirstTherapy,
      takingMedicine,
      lastVisit,
      preCondition,
      currentCondition,
    };

    const { isValid, errors: validationErrors } = await validateWithSchema(
      addMedicalInfoSchema,
      formData
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    // Navigate to UploadReport screen
    navigation.navigate('UploadReport');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const buttonContainerHeight = 140;
  const isFormValid = firstName.trim() && lastName.trim() && email.trim() && phone.trim() && sex && age;

  useEffect(() => {
    if (isScrolling || isAtBottom || isFormValid) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isScrolling, isAtBottom, isFormValid]);

  const renderDropdown = (
    field: string,
    value: string,
    options: DropdownOption[],
    isOpen: boolean,
    onToggle: () => void,
    placeholder: string
  ) => {
    const selectedOption = options.find((opt) => opt.value === value);
    const hasError = !!errors[field];

    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[
            styles.dropdown,
            hasError && styles.dropdownError
          ]}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.dropdownText,
            !selectedOption && styles.dropdownPlaceholder
          ]}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <View style={styles.chevronContainer}>
            <View style={isOpen && styles.chevronRotated}>
              <Icons.ChevronDownIcon width={16} height={16} />
            </View>
          </View>
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.dropdownList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownOption}
                onPress={() => handleDropdownSelect(field, option.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {hasError && (
          <Text style={styles.errorText}>{errors[field]}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <BackHeader onBackPress={handleBackPress} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: buttonContainerHeight + (Platform.OS === 'ios' ? insets.bottom : 0) }
        ]}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollBegin={() => setIsScrolling(true)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const scrollY = contentOffset.y;
          const contentHeight = contentSize.height;
          const scrollViewHeight = layoutMeasurement.height;
          const isNearBottom = scrollY + scrollViewHeight >= contentHeight - 50;
          
          if (isNearBottom) {
            setIsAtBottom(true);
          } else if (scrollY < 100) {
            setIsAtBottom(false);
          }
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Book Your Appointment</Text>
            <Text style={styles.subtitle}>
              Complete the following steps to schedule appointment.
            </Text>
          </View>

          {/* Personal Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <TextInput
                  style={[
                    styles.input,
                    errors.firstName && styles.inputError
                  ]}
                  placeholder="First name"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={firstName}
                  onChangeText={(text) => handleFieldChange('firstName', text)}
                  onBlur={() => handleFieldBlur('firstName')}
                />
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}
              </View>
              <View style={styles.halfWidth}>
                <TextInput
                  style={[
                    styles.input,
                    errors.lastName && styles.inputError
                  ]}
                  placeholder="Last name"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={lastName}
                  onChangeText={(text) => handleFieldChange('lastName', text)}
                  onBlur={() => handleFieldBlur('lastName')}
                />
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Pronunciation (optional)"
                placeholderTextColor={Colors.textPlaceholder}
                value={pronunciation}
                onChangeText={(text) => handleFieldChange('pronunciation', text)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  errors.email && styles.inputError
                ]}
                placeholder="Email"
                placeholderTextColor={Colors.textPlaceholder}
                value={email}
                onChangeText={(text) => handleFieldChange('email', text)}
                onBlur={() => handleFieldBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  errors.phone && styles.inputError
                ]}
                placeholder="Phone"
                placeholderTextColor={Colors.textPlaceholder}
                value={phone}
                onChangeText={(text) => handleFieldChange('phone', text)}
                onBlur={() => handleFieldBlur('phone')}
                keyboardType="phone-pad"
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderDropdown(
                  'sex',
                  sex,
                  sexOptions,
                  sexDropdownOpen,
                  () => setSexDropdownOpen(!sexDropdownOpen),
                  'Sex'
                )}
              </View>
              <View style={styles.halfWidth}>
                <TextInput
                  style={[
                    styles.input,
                    errors.age && styles.inputError
                  ]}
                  placeholder="Age"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={age}
                  onChangeText={(text) => handleFieldChange('age', text)}
                  onBlur={() => handleFieldBlur('age')}
                  keyboardType="numeric"
                />
                {errors.age && (
                  <Text style={styles.errorText}>{errors.age}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Medical Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical Info</Text>
            <Text style={styles.descriptionText}>
              Provide your medical history and your conditions. If you've any.
            </Text>

            <View style={styles.inputWrapper}>
              {renderDropdown(
                'isFirstTherapy',
                isFirstTherapy,
                yesNoOptions,
                isFirstTherapyDropdownOpen,
                () => setIsFirstTherapyDropdownOpen(!isFirstTherapyDropdownOpen),
                'Is that your first therapy'
              )}
            </View>

            <View style={styles.inputWrapper}>
              {renderDropdown(
                'takingMedicine',
                takingMedicine,
                yesNoOptions,
                takingMedicineDropdownOpen,
                () => setTakingMedicineDropdownOpen(!takingMedicineDropdownOpen),
                'Are you taking any medicine?'
              )}
            </View>

            <View style={styles.inputWrapper}>
              {renderDropdown(
                'lastVisit',
                lastVisit,
                lastVisitOptions,
                lastVisitDropdownOpen,
                () => setLastVisitDropdownOpen(!lastVisitDropdownOpen),
                'When was your last visit?'
              )}
            </View>

            <View style={styles.inputWrapper}>
              {renderDropdown(
                'preCondition',
                preCondition,
                conditionOptions,
                preConditionDropdownOpen,
                () => setPreConditionDropdownOpen(!preConditionDropdownOpen),
                'Pre condition'
              )}
            </View>

            <View style={styles.inputWrapper}>
              {renderDropdown(
                'currentCondition',
                currentCondition,
                conditionOptions,
                currentConditionDropdownOpen,
                () => setCurrentConditionDropdownOpen(!currentConditionDropdownOpen),
                'Current condition'
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 20,
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
            pointerEvents: (isScrolling || isAtBottom || isFormValid) ? 'auto' : 'none',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isFormValid && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          activeOpacity={0.7}
          disabled={!isFormValid}
        >
          <Text style={[
            styles.continueButtonText,
            !isFormValid && styles.continueButtonTextDisabled
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 150,
  },
  content: {
    paddingHorizontal: 15,
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 24,
    gap: 8,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  descriptionText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.inputBackgroundDefault,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.inputText,
    fontFamily: Fonts.openSans,
  },
  inputError: {
    borderColor: Colors.inputBorderError,
  },
  dropdownContainer: {
    marginBottom: 0,
  },
  dropdown: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.inputBackgroundDefault,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownError: {
    borderColor: Colors.inputBorderError,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.inputText,
    fontFamily: Fonts.openSans,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: Colors.textPlaceholder,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownList: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBorder,
  },
  dropdownOptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.inputText,
    fontFamily: Fonts.openSans,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.error,
    fontFamily: Fonts.openSans,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: 'transparent',
    gap: 12,
  },
  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#CBCACE',
  },
  continueButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#9E9E9E',
  },
  cancelButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default AddMedicalInfo;

