import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../components/common/BackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type DoctorsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'Doctors'
>;

interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: React.ComponentType<any>;
}

const Doctors: React.FC = () => {
  const navigation = useNavigation<DoctorsNavigationProp>();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 30 - 16) / 2; // screen width - padding - gap, divided by 2
  const cardHeight = 250;
  const imageHeight = cardHeight * 0.7; // 70% of card height

  const doctors: DoctorData[] = [
    {
      id: '5646543',
      name: 'Dr. Ayesha',
      specialty: 'Allergist',
      rating: 5.4,
      image: Icons.DoctorImage1,
    },
    {
      id: '5646543',
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
      id: '5646543',
      name: 'Dr. Maria',
      specialty: 'Allergist',
      rating: 5.4,
      image: Icons.DoctorImage4,
    },
  ];

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleCardPress = (doctor: DoctorData) => {
    navigation.navigate('DoctorDetails');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <BackHeader
            onBackPress={handleBackPress}
            onSearchPress={handleSearchPress}
            onSearchChange={handleSearchChange}
            showSearchIcon={true}
          />

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Doctors</Text>
            <Text style={styles.description}>
              Search for the doctors by your need or services.
            </Text>
          </View>

          {/* Doctors Grid */}
          <View style={styles.gridContainer}>
            {doctors.map((doctor, index) => {
              const DoctorImage = doctor.image;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.doctorCard}
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
    flexGrow: 1,
    paddingBottom: 100,
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
  description: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
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
});

export default Doctors;

