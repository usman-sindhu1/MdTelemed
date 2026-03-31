import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import type { HomeStackParamList } from '../../navigation/HomeStack';

type HomeDoctorsListNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeDoctorsList'>;
type HomeDoctorsListRouteProp = RouteProp<HomeStackParamList, 'HomeDoctorsList'>;

const DOCTORS = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Allergies',
    rating: '4.8',
    years: '12 years',
    patients: '1.2k patients',
    fee: '$50',
    imageUri: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    rating: '4.9',
    years: '8 years',
    patients: '980 patients',
    fee: '$45',
    imageUri: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '3',
    name: 'Dr. Emily Carter',
    specialty: 'Neurologist',
    rating: '4.7',
    years: '9 years',
    patients: '870 patients',
    fee: '$55',
    imageUri: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: '4',
    name: 'Dr. James Lee',
    specialty: 'Gastroenterologist',
    rating: '4.6',
    years: '10 years',
    patients: '1.0k patients',
    fee: '$48',
    imageUri: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
];

const HomeDoctorsList: React.FC = () => {
  const navigation = useNavigation<HomeDoctorsListNavigationProp>();
  const route = useRoute<HomeDoctorsListRouteProp>();
  const insets = useSafeAreaInsets();
  const selectedCategoryId = route.params?.selectedCategoryId ?? 'all';
  const normalizedCategory = selectedCategoryId.toLowerCase();

  const categoryToSpecialty: Record<string, string> = {
    allergies: 'allergies',
    dermatology: 'dermatologist',
    neurology: 'neurologist',
    gastroenterology: 'gastroenterologist',
  };

  const filteredDoctors = normalizedCategory === 'all'
    ? DOCTORS
    : DOCTORS.filter((doctor) => {
        const doctorSpecialty = doctor.specialty.toLowerCase();
        const categoryMatch = categoryToSpecialty[normalizedCategory];
        return categoryMatch ? doctorSpecialty.includes(categoryMatch) : true;
      });

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icons.Back width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Top Doctors</Text>
          <View style={styles.headerRight} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.pageHeading}>Book Appointment</Text>
          <Text style={styles.pageDescription}>Select a doctor to book your appointment.</Text>
        </View>
        {filteredDoctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('HomeDoctorDetails', { doctor, selectedCategoryId })}
          >
            <View style={styles.topRow}>
              <Image source={{ uri: doctor.imageUri }} style={styles.avatar} />
              <View style={styles.topInfo}>
                <Text style={styles.name}>{doctor.name}</Text>
                <Text style={styles.specialty}>{doctor.specialty}</Text>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
    fontSize: 31 / 2,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerRight: {
    width: 36,
    height: 36,
  },
  titleSection: {
    marginBottom: 12,
  },
  pageHeading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  pageDescription: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
  },
  content: { padding: 15, paddingBottom: 30, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    padding: 14,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 54, height: 54, borderRadius: 16, marginRight: 14 },
  topInfo: { flex: 1, minWidth: 0 },
  name: { fontFamily: Fonts.raleway, fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 3 },
  specialty: { fontFamily: Fonts.openSans, fontSize: 16, fontWeight: '400', color: '#6B7280', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: Fonts.openSans, fontSize: 14, fontWeight: '600', color: '#6B7280' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feeLabel: { fontFamily: Fonts.openSans, fontSize: 12, fontWeight: '400', color: '#6B7280' },
  feeValue: { fontFamily: Fonts.raleway, fontSize: 17, fontWeight: '700', color: Colors.primary, marginTop: 2 },
  availablePill: { backgroundColor: '#ECFDF5', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  availableText: { fontFamily: Fonts.raleway, fontSize: 14, fontWeight: '600', color: '#10B981' },
});

export default HomeDoctorsList;
