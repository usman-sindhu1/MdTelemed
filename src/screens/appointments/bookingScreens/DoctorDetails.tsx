import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../../components/common/BackHeader';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';

type DoctorDetailsNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'DoctorDetails'
>;

const DoctorDetails: React.FC = () => {
  const navigation = useNavigation<DoctorDetailsNavigationProp>();
  const insets = useSafeAreaInsets();
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const doctorData = {
    id: '5646543',
    name: 'Dr. Ayesha Noor',
    specialty: 'Allergist',
    type: 'Individual',
    rating: 5.4,
    price: '$45.00',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna.',
    education: ['M.B.B.S', 'F.C.P.S'],
    specialistIn: 'Allergist Specialist',
    ageGroup: '8-16 years',
    language: 'English, Spanish',
    fundingOptions: 'Cash & Card',
    serviceDelivery: 'Immidiate',
    specialInterest: [
      'Developmental Language Disorder (DLD)',
      'Literacy',
      'Articulation',
      'Supporting autistic individuals',
      'Parent and caregiver coaching',
      'Early language supports',
      'Social Skills',
    ],
    image: Icons.DoctorImage1,
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSelectContinue = () => {
    navigation.navigate('BookingAvailableSlot');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const buttonContainerHeight = 140;
  const DoctorImage = doctorData.image;

  useEffect(() => {
    if (isScrolling || isAtBottom) {
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
  }, [isScrolling, isAtBottom]);

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
          const isNearBottom = scrollY + scrollViewHeight >= contentHeight - 50; // 50px threshold
          
          if (isNearBottom) {
            setIsAtBottom(true);
          } else if (scrollY < 100) {
            // Near top
            setIsAtBottom(false);
          }
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.heading}>Doctor Details</Text>

          {/* Doctor Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.imageContainer}>
              <DoctorImage width={screenWidth - 30} height={300} preserveAspectRatio="xMidYMid slice" />
              <View style={styles.ratingBadge}>
                <Icons.Star1Icon width={12} height={12} fill="#FFFFFF" />
                <Text style={styles.ratingText}>Ratings: {doctorData.rating}</Text>
              </View>
              <View style={styles.idBadge}>
                <Text style={styles.idText}>ID: {doctorData.id}</Text>
              </View>
            </View>
            <View style={styles.profileContent}>
              <Text style={styles.specialtyText}>
                {doctorData.specialty} - {doctorData.type}
              </Text>
              <View style={styles.namePriceRow}>
                <Text style={styles.doctorName}>{doctorData.name}</Text>
                <Text style={styles.priceText}>{doctorData.price}</Text>
              </View>
              <Text style={styles.descriptionText}>{doctorData.description}</Text>
            </View>
          </View>

          {/* Education Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.educationContainer}>
              {doctorData.education.map((degree, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.degreeText}>{degree}</Text>
                  {index < doctorData.education.length - 1 && (
                    <Text style={styles.separator}>|</Text>
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Other Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other Details</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Specialist in: </Text>
                <Text style={styles.detailValue}>{doctorData.specialistIn}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Age group: </Text>
                <Text style={styles.detailValue}>{doctorData.ageGroup}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Language: </Text>
                <Text style={styles.detailValue}>{doctorData.language}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Funding options: </Text>
                <Text style={styles.detailValue}>{doctorData.fundingOptions}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Service delivery: </Text>
                <Text style={styles.detailValue}>{doctorData.serviceDelivery}</Text>
              </View>
              <View style={styles.specialInterestRow}>
                <Text style={styles.detailLabel}>Special interest area: </Text>
                <Text style={styles.interestText}>
                  {doctorData.specialInterest.join(', ')}
                </Text>
              </View>
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
            pointerEvents: (isScrolling || isAtBottom) ? 'auto' : 'none',
          },
        ]}
      >
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSelectContinue}
            activeOpacity={0.7}
          >
            <Text style={styles.selectButtonText}>Select & Continue</Text>
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
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: Colors.backgroundLight,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#A473E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  ratingText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  idBadge: {
    position: 'absolute',
    top: 50,
    left: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  idText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  profileContent: {
    padding: 16,
    gap: 12,
  },
  specialtyText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  namePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  priceText: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: '#A473E5',
  },
  descriptionText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
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
  educationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  degreeText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  separator: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 0,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
  },
  detailValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginLeft: 0,
  },
  specialInterestRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 0,
    flexWrap: 'wrap',
  },
  interestText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginLeft: 0,
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
  selectButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
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

export default DoctorDetails;

