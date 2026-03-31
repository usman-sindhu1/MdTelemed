import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import type { HomeStackParamList } from '../../navigation/HomeStack';

type HomeDoctorDetailsNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeDoctorDetails'>;
type HomeDoctorDetailsRouteProp = RouteProp<HomeStackParamList, 'HomeDoctorDetails'>;

const HomeDoctorDetails: React.FC = () => {
  const navigation = useNavigation<HomeDoctorDetailsNavigationProp>();
  const route = useRoute<HomeDoctorDetailsRouteProp>();
  const insets = useSafeAreaInsets();
  const doctor = route.params?.doctor;
  const selectedCategoryId = route.params?.selectedCategoryId;

  const handleContinue = () => {
    (navigation.getParent() as any)?.getParent()?.navigate('BookAppt', {
      preselectedCategoryId: selectedCategoryId,
      selectedDoctor: doctor,
    });
  };

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
          <Text style={styles.headerTitle}>Doctor Details</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={{ uri: doctor.imageUri }} style={styles.image} />
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <Text style={styles.meta}>
            {doctor.rating} rating  |  {doctor.years}  |  {doctor.patients}
          </Text>
          <Text style={styles.fee}>Consultation Fee: {doctor.fee}</Text>
          <Text style={styles.about}>
            Experienced specialist available for quick and scheduled consultations.
            Continue to appointment flow with this doctor pre-selected.
          </Text>
        </View>

        <Button title="Continue to Appointment" onPress={handleContinue} style={styles.primaryBtn} />
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
  content: { padding: 15, paddingBottom: 30 },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
  },
  image: { width: '100%', height: 220, borderRadius: 14, marginBottom: 14 },
  name: { fontFamily: Fonts.raleway, fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  specialty: { fontFamily: Fonts.openSans, fontSize: 16, fontWeight: '400', color: '#6B7280', marginBottom: 8 },
  meta: { fontFamily: Fonts.openSans, fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 10 },
  fee: { fontFamily: Fonts.raleway, fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 10 },
  about: { fontFamily: Fonts.openSans, fontSize: 14, fontWeight: '400', color: '#475569', lineHeight: 20 },
  primaryBtn: { backgroundColor: Colors.primary },
});

export default HomeDoctorDetails;
