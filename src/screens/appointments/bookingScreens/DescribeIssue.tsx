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

type DescribeIssueNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'DescribeIssue'
>;

const DescribeIssue: React.FC = () => {
  const navigation = useNavigation<DescribeIssueNavigationProp>();
  const insets = useSafeAreaInsets();
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    if (issueDescription.trim()) {
      navigation.navigate('AddMedicalInfo');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const buttonContainerHeight = 140;
  const isContinueDisabled = !issueDescription.trim();

  useEffect(() => {
    if (isScrolling || isAtBottom || issueDescription.trim()) {
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
  }, [isScrolling, isAtBottom, issueDescription]);

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

          {/* How Can The Doctor Help You Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How Can The Doctor Help You?</Text>
            
            <Text style={styles.descriptionText}>
              Specify symptoms or medication needed so doctors can assist. Your request is fully anonymized; doctors see only the description. Avoid personal details.
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Describe your issue"
                placeholderTextColor={Colors.textPlaceholder}
                value={issueDescription}
                onChangeText={setIssueDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
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
            pointerEvents: (isScrolling || isAtBottom || issueDescription.trim()) ? 'auto' : 'none',
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
    marginBottom: 12,
  },
  descriptionText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  inputContainer: {
    marginTop: 0,
  },
  input: {
    width: '100%',
    minHeight: 120,
    backgroundColor: Colors.inputBackgroundDefault,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
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

export default DescribeIssue;

