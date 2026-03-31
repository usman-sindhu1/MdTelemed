import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, DrawerActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';
import Button from '../../components/Button';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import type { DrawerParamList } from '../../navigation/HomeStackRoot';

type DoctorDetailsNavigationProp = NativeStackNavigationProp<DrawerParamList, 'DoctorDetails'>;
type DoctorDetailsRouteProp = RouteProp<DrawerParamList, 'DoctorDetails'>;

const DoctorDetails: React.FC = () => {
  const navigation = useNavigation<DoctorDetailsNavigationProp>();
  const route = useRoute<DoctorDetailsRouteProp>();
  const doctorData = route.params?.selectedDoctor ?? {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Allergies',
    rating: '4.8',
    years: '12 years',
    patients: '1.2k patients',
    fee: '$50',
    imageUri: 'https://randomuser.me/api/portraits/women/44.jpg',
  };

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleContinue = () => {
    navigation.navigate('BookAppt', {
      selectedDoctor: doctorData,
      preselectedCategoryId: doctorData.specialty.toLowerCase(),
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerContainer}>
        <SimpleBackHeader
          title="Doctor Details"
          onBackPress={handleBackPress}
          backgroundColor="#ECF2FD"
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={{ uri: doctorData.imageUri }} style={styles.image} />
          <Text style={styles.name}>{doctorData.name}</Text>
          <Text style={styles.specialty}>{doctorData.specialty}</Text>
          <Text style={styles.meta}>
            {doctorData.rating} rating  |  {doctorData.years}  |  {doctorData.patients}
          </Text>
          <Text style={styles.fee}>Consultation Fee: {doctorData.fee}</Text>
          <Text style={styles.about}>
            Experienced specialist available for quick and scheduled consultations.
            Continue to appointment flow with this doctor pre-selected.
          </Text>
        </View>

        <Button title="Continue to Appointment" onPress={handleContinue} style={styles.primaryBtn} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { backgroundColor: '#FFFFFF', zIndex: 10 },
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

export default DoctorDetails;

