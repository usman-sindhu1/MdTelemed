import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../../components/common/BackHeader';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';

type FinalBookingDataNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'FinalBookingData'
>;

type TabType = 'personalInfo' | 'appointmentInfo' | 'doctorInfo' | 'medicalInfo' | 'reports';

const FinalBookingData: React.FC = () => {
  const navigation = useNavigation<FinalBookingDataNavigationProp>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('personalInfo');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Sample data - in real app, this would come from navigation params or context
  const personalInfo = {
    name: 'Alexander Jones',
    email: 'alexander@gmail.com',
    phone: '+1 (234) 567-8900',
    sex: 'Male',
    age: '25',
  };

  const appointmentInfo = {
    appointmentFor: 'Skin Allergy',
    fee: '$25.00',
    dateTime: 'January 14, 2025 | 5:15',
  };

  const doctorInfo = {
    specialistIn: 'Allergiest',
    ageGroup: '8-16 years',
    education: 'MBBS, FCPS',
    language: 'English, Spanish',
  };

  const medicalInfo = {
    isFirstTherapy: 'No',
    takingMedicine: 'No',
    lastVisit: 'About a week ago',
    preCondition: 'Normal',
    currentCondition: 'Serious',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.',
    invoiceEmail: 'alexander39@gmail.com',
  };

  const reports = [
    { id: '1', title: 'File title.pdf', size: '39mb' },
    { id: '2', title: 'File title.pdf', size: '39mb' },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleContinue = async () => {
    if (isAgreed) {
      setIsBooking(true);
      // Simulate booking API call
      setTimeout(() => {
        setIsBooking(false);
        setShowSuccessModal(true);
      }, 1500);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Navigate to home screen - go to root and then to MainTabs Home
    const rootNavigation = navigation.getParent()?.getParent()?.getParent();
    if (rootNavigation) {
      rootNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              state: {
                routes: [
                  {
                    name: 'MainTabs',
                    state: {
                      routes: [{ name: 'Home' }],
                      index: 0,
                    },
                  },
                ],
                index: 0,
              },
            },
          ],
        })
      );
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const buttonContainerHeight = 140;
  const isFormValid = isAgreed;

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

  const renderPersonalInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Name:</Text>
        <Text style={styles.infoValue}>{personalInfo.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{personalInfo.email}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Phone:</Text>
        <Text style={styles.infoValue}>{personalInfo.phone}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Sex:</Text>
        <Text style={styles.infoValue}>{personalInfo.sex}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Age:</Text>
        <Text style={styles.infoValue}>{personalInfo.age}</Text>
      </View>
    </View>
  );

  const renderAppointmentInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Appointment for:</Text>
        <Text style={styles.infoValue}>{appointmentInfo.appointmentFor}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Appointment fee:</Text>
        <Text style={styles.infoValue}>{appointmentInfo.fee}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Date & time:</Text>
        <Text style={styles.infoValue}>{appointmentInfo.dateTime}</Text>
      </View>
    </View>
  );

  const renderDoctorInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Specialist in:</Text>
        <Text style={styles.infoValue}>{doctorInfo.specialistIn}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Age group:</Text>
        <Text style={styles.infoValue}>{doctorInfo.ageGroup}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Education:</Text>
        <Text style={styles.infoValue}>{doctorInfo.education}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Language:</Text>
        <Text style={styles.infoValue}>{doctorInfo.language}</Text>
      </View>
    </View>
  );

  const renderMedicalInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Is it your first therapy?</Text>
        <Text style={styles.infoValue}>{medicalInfo.isFirstTherapy}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Are you taking any medicine?</Text>
        <Text style={styles.infoValue}>{medicalInfo.takingMedicine}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>When was your last visit?</Text>
        <Text style={styles.infoValue}>{medicalInfo.lastVisit}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Pre condition</Text>
        <Text style={styles.infoValue}>{medicalInfo.preCondition}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Current condition</Text>
        <Text style={styles.infoValue}>{medicalInfo.currentCondition}</Text>
      </View>
      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionTitle}>How can a doctor help you?</Text>
        <Text style={styles.descriptionText}>{medicalInfo.description}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Invoice will be sent to</Text>
        <Text style={styles.infoValue}>{medicalInfo.invoiceEmail}</Text>
      </View>
    </View>
  );

  const renderReports = () => (
    <View style={styles.tabContent}>
      {reports.map((report) => (
        <View key={report.id} style={styles.reportItem}>
          <View style={styles.reportContent}>
            <Text style={styles.reportTitleLabel}>Report title</Text>
            <View style={styles.reportFileRow}>
              <Icons.Report width={24} height={24} fill={Colors.primary} />
              <Text style={styles.reportFileName}>{report.title}</Text>
            </View>
            <Text style={styles.reportSize}>Size: {report.size}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const tabs = [
    { id: 'personalInfo' as TabType, label: 'Personal Info' },
    { id: 'appointmentInfo' as TabType, label: 'Appointment Info' },
    { id: 'doctorInfo' as TabType, label: 'Doctor Info' },
    { id: 'medicalInfo' as TabType, label: 'Medical Info' },
    { id: 'reports' as TabType, label: 'Reports' },
  ];

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

          {/* Review Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Review Info</Text>
            
            {/* Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContainer}
              style={styles.tabsScrollView}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      styles.tab,
                      isActive && styles.tabActive
                    ]}
                    onPress={() => setActiveTab(tab.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.tabText,
                      isActive && styles.tabTextActive
                    ]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Tab Content */}
            <View style={styles.tabContentContainer}>
              {activeTab === 'personalInfo' && renderPersonalInfo()}
              {activeTab === 'appointmentInfo' && renderAppointmentInfo()}
              {activeTab === 'doctorInfo' && renderDoctorInfo()}
              {activeTab === 'medicalInfo' && renderMedicalInfo()}
              {activeTab === 'reports' && renderReports()}
            </View>
          </View>

          {/* Terms and Conditions Checkbox */}
          <View style={styles.termsSection}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsAgreed(!isAgreed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]}>
                {isAgreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                By submitting this request, you authorize the use of your data and acknowledge that you've read and accept our{' '}
                <Text style={styles.termsLink} onPress={() => navigation.navigate('TermsAndConditions' as any)}>
                  Terms and Conditions
                </Text>
                {' '}and{' '}
                <Text style={styles.termsLink} onPress={() => navigation.navigate('PrivacyPolicy' as any)}>
                  Privacy Policy
                </Text>
                .
              </Text>
            </TouchableOpacity>
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
            (!isFormValid || isBooking) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          activeOpacity={0.7}
          disabled={!isFormValid || isBooking}
        >
          <Text style={[
            styles.continueButtonText,
            (!isFormValid || isBooking) && styles.continueButtonTextDisabled
          ]}>
            {isBooking ? 'Booking Appointment...' : 'Booking Appointment'}
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

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Appointment Booked</Text>
            <Text style={styles.successMessage}>
              Your appointment has been successfully booked. You will receive a confirmation shortly.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessModalClose}
              activeOpacity={0.7}
            >
              <Text style={styles.successButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  tabsScrollView: {
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 15,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabContentContainer: {
    minHeight: 200,
  },
  tabContent: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  infoLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  infoValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  descriptionSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  descriptionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  descriptionText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  reportItem: {
    marginBottom: 16,
  },
  reportContent: {
    gap: 8,
  },
  reportTitleLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  reportFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportFileName: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    flex: 1,
  },
  reportSize: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  termsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
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
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  successTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  successButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default FinalBookingData;

