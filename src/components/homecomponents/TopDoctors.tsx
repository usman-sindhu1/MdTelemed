import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/HomeStack';

interface DoctorCard {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  years: string;
  patients: string;
  fee: string;
  imageUri: string;
}

interface TopDoctorsProps {
  selectedCategoryId?: string;
}

const TOP_DOCTORS: DoctorCard[] = [
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

const CATEGORY_TO_SPECIALTY: Record<string, string> = {
  allergies: 'allergies',
  dermatology: 'dermatologist',
  neurology: 'neurologist',
  gastroenterology: 'gastroenterologist',
};

const TopDoctors: React.FC<TopDoctorsProps> = ({ selectedCategoryId = 'all' }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const normalizedCategory = selectedCategoryId.toLowerCase();
  const filteredDoctors = normalizedCategory === 'all'
    ? TOP_DOCTORS
    : TOP_DOCTORS.filter((doctor) => {
        const doctorSpecialty = doctor.specialty.toLowerCase();
        const categoryMatch = CATEGORY_TO_SPECIALTY[normalizedCategory];
        return categoryMatch ? doctorSpecialty.includes(categoryMatch) : true;
      });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top Doctors</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('HomeDoctorsList', { selectedCategoryId })}
        >
          <Text style={styles.viewAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsWrap}>
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
                <Text style={styles.name} numberOfLines={1}>{doctor.name}</Text>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 38 / 2,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  cardsWrap: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 108 / 2,
    height: 108 / 2,
    borderRadius: 16,
    marginRight: 14,
  },
  topInfo: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: Fonts.raleway,
    fontSize: 22 / 2,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  specialty: {
    fontFamily: Fonts.openSans,
    fontSize: 34 / 2,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
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
  feeLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  feeValue: {
    fontFamily: Fonts.raleway,
    fontSize: 34 / 2,
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

export default TopDoctors;
