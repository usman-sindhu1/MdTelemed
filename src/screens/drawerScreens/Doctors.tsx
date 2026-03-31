import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type DoctorsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'Doctors'
>;

interface DoctorData {
  id: string | number;
  name: string;
  specialty: string;
  rating: string;
  years: string;
  patients: string;
  fee: string;
  imageUri: string;
}

const Doctors: React.FC = () => {
  const navigation = useNavigation<DoctorsNavigationProp>();
  const insets = useSafeAreaInsets();

  const doctors: DoctorData[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Allergies',
      rating: '4.8',
      years: '12 years',
      patients: '1.2k patients',
      fee: '$50',
      imageUri: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      rating: '4.9',
      years: '8 years',
      patients: '980 patients',
      fee: '$45',
      imageUri: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 3,
      name: 'Dr. Emily Carter',
      specialty: 'Neurologist',
      rating: '4.7',
      years: '9 years',
      patients: '870 patients',
      fee: '$55',
      imageUri: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      id: 4,
      name: 'Dr. James Lee',
      specialty: 'Gastroenterologist',
      rating: '4.6',
      years: '10 years',
      patients: '1.0k patients',
      fee: '$48',
      imageUri: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
  ];

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCardPress = (doctor: DoctorData) => {
    navigation.navigate('DoctorDetails', { selectedDoctor: doctor });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerBlock}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Icons.Back width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Top Doctors</Text>
          <View style={styles.headerRight} />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Book Appointment</Text>
            <Text style={styles.description}>
              Select a doctor to book your appointment.
            </Text>
          </View>

          {doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={styles.card}
              onPress={() => handleCardPress(doctor)}
              activeOpacity={0.8}
            >
              <View style={styles.topRow}>
                <Image source={{ uri: doctor.imageUri }} style={styles.avatar} />
                <View style={styles.topInfo}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.specialtyText}>{doctor.specialty}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Icons.StarIcon width={14} height={14} />
                      <Text style={styles.metaText}>{doctor.rating}</Text>
                    </View>
                    <Text style={styles.metaText}>{doctor.years}</Text>
                    <Text style={styles.metaText}>{doctor.patients}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.bottomRow}>
                <View>
                  <Text style={styles.feeLabel}>Consultation Fee</Text>
                  <Text style={styles.feeValue}>{doctor.fee}</Text>
                </View>
                <View style={styles.availablePill}>
                  <Text style={styles.availableText}>Available</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  headerBlock: {
    backgroundColor: '#ECF2FD',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerRight: {
    width: 36,
    height: 36,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 15,
  },
  titleSection: {
    marginTop: 22,
    marginBottom: 16,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 14,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    marginRight: 14,
  },
  topInfo: {
    flex: 1,
    minWidth: 0,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specialtyText: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  feeLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  feeValue: {
    fontFamily: Fonts.raleway,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  availablePill: {
    backgroundColor: '#ECFDF5',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  availableText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});

export default Doctors;

