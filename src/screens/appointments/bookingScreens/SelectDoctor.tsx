import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

type SelectDoctorNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'SelectDoctor'
>;

interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: React.ComponentType<any>;
}

const SelectDoctor: React.FC = () => {
  const navigation = useNavigation<SelectDoctorNavigationProp>();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardWidth = (screenWidth - 30 - 16) / 2; // screen width - padding - gap, divided by 2
  const cardHeight = 250;
  const imageHeight = cardHeight * 0.7; // 70% of card height

  const doctors: DoctorData[] = [
    {
      id: '5646541',
      name: 'Dr. Ayesha',
      specialty: 'Allergist',
      rating: 5.4,
      image: Icons.DoctorImage1,
    },
    {
      id: '5646542',
      name: 'Dr. Kely',
      specialty: 'Allergist',
      rating: 5.4,
      image: Icons.DoctorImage2,
    },
    {
      id: '5646543',
      name: 'Dr. Imran',
      specialty: 'Allergist',
      rating: 5.4,
      image: Icons.DoctorImage3,
    },
    {
      id: '5646544',
      name: 'Dr. Maria',
      specialty: 'Allergist',
      rating: 5.4,
      image: Icons.DoctorImage4,
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCardPress = (doctor: DoctorData) => {
    setSelectedDoctorId(doctor.id === selectedDoctorId ? null : doctor.id);
  };

  const handleViewDetails = () => {
    if (selectedDoctorId) {
      navigation.navigate('DoctorDetails');
    }
  };

  const isViewDetailsDisabled = !selectedDoctorId;

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
    // TODO: Handle filter
  };

  const buttonContainerHeight = 140; // Approximate height of button container

  useEffect(() => {
    if (isScrolling || isAtBottom || selectedDoctorId) {
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
  }, [isScrolling, isAtBottom, selectedDoctorId]);

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
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Book Your Appointment</Text>
            <Text style={styles.subtitle}>
              Complete the following steps to schedule appointment.
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <Icons.Search width={20} height={20} fill={Colors.textPlaceholder} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search here..."
              placeholderTextColor={Colors.textPlaceholder}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Select Doctor Section */}
          <View style={styles.doctorSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Select Doctor</Text>
              <TouchableOpacity
                onPress={handleFilterPress}
                activeOpacity={0.7}
              >
                <Icons.Vector2Icon width={24} height={24} fill={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.gridContainer}>
              {doctors.map((doctor, index) => {
                const isSelected = selectedDoctorId === doctor.id;
                const DoctorImage = doctor.image;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.doctorCard,
                      isSelected && styles.doctorCardSelected
                    ]}
                    onPress={() => handleCardPress(doctor)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardImageContainer}>
                      <View style={styles.imageWrapper}>
                        <DoctorImage width={cardWidth} height={imageHeight} preserveAspectRatio="xMidYMid slice" />
                      </View>
                      <View style={styles.ratingBadge}>
                        <Icons.Star1Icon width={12} height={12} fill="#FFFFFF" />
                        <Text style={styles.ratingText}>Ratings: {doctor.rating}</Text>
                      </View>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.specialtyText}>{doctor.specialty}</Text>
                      <Text style={styles.doctorName}>{doctor.name}</Text>
                      <Text style={styles.doctorId}>ID: {doctor.id}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
            pointerEvents: (isScrolling || isAtBottom || selectedDoctorId) ? 'auto' : 'none',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.viewDetailsButton,
            isViewDetailsDisabled && styles.viewDetailsButtonDisabled
          ]}
          onPress={handleViewDetails}
          activeOpacity={0.7}
          disabled={isViewDetailsDisabled}
        >
          <Text style={[
            styles.viewDetailsButtonText,
            isViewDetailsDisabled && styles.viewDetailsButtonTextDisabled
          ]}>View Details</Text>
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackgroundDefault,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.inputText,
    padding: 0,
  },
  doctorSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  doctorCard: {
    width: '47%',
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#F0E8FB',
  },
  cardImageContainer: {
    width: '100%',
    height: '70%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: Colors.backgroundLight,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#A473E5',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  ratingText: {
    fontFamily: Fonts.raleway,
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardContent: {
    width: '100%',
    height: '30%',
    padding: 12,
    gap: 4,
    justifyContent: 'center',
  },
  specialtyText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  doctorId: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
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
  viewDetailsButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewDetailsButtonDisabled: {
    backgroundColor: '#CBCACE',
  },
  viewDetailsButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewDetailsButtonTextDisabled: {
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

export default SelectDoctor;

