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
import BackHeader from '../../../components/common/BackHeader';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';

type WhoRequireNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'WhoRequire'
>;

interface WhoRequireOption {
  id: string;
  label: string;
}

const WhoRequire: React.FC = () => {
  const navigation = useNavigation<WhoRequireNavigationProp>();
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [patientAge, setPatientAge] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const whoRequireOptions: WhoRequireOption[] = [
    {
      id: '1',
      label: 'Me',
    },
    {
      id: '2',
      label: 'Someone else',
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleOptionPress = (optionId: string) => {
    setSelectedOption(optionId === selectedOption ? null : optionId);
  };

  const handleContinue = () => {
    if (selectedOption && patientAge.trim()) {
      navigation.navigate('DescribeIssue');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const buttonContainerHeight = 140;
  const isContinueDisabled = !selectedOption || !patientAge.trim();

  useEffect(() => {
    if (isScrolling || isAtBottom || (selectedOption && patientAge.trim())) {
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
  }, [isScrolling, isAtBottom, selectedOption, patientAge]);

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

          {/* Who Requires Medical Attention Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who Requires Medical Attention?</Text>
            
            <View style={styles.optionsContainer}>
              {whoRequireOptions.map((option) => {
                const isSelected = selectedOption === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.optionRow}
                    onPress={() => handleOptionPress(option.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.radioButtonContainer}>
                      <View style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected
                      ]}>
                        {isSelected && <View style={styles.radioButtonInner} />}
                      </View>
                    </View>
                    <Text style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Patient Age Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Age</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g. 25"
                placeholderTextColor={Colors.textPlaceholder}
                value={patientAge}
                onChangeText={setPatientAge}
                keyboardType="numeric"
              />
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
            pointerEvents: (isScrolling || isAtBottom || (selectedOption && patientAge.trim())) ? 'auto' : 'none',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            isContinueDisabled && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          activeOpacity={0.7}
          disabled={isContinueDisabled}
        >
          <Text style={[
            styles.continueButtonText,
            isContinueDisabled && styles.continueButtonTextDisabled
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  optionLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
    flex: 1,
  },
  optionLabelSelected: {
    color: Colors.textPrimary,
  },
  inputContainer: {
    marginTop: 0,
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

export default WhoRequire;

