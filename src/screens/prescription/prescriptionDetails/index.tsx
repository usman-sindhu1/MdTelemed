import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BackHeader from '../../../components/common/BackHeader';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';

const PrescriptionDetails: React.FC = () => {
  const navigation = useNavigation();

  const prescriptionData = {
    service: 'Skin Care',
    date: 'Jan 23, 2025',
    time: '04:37 pm',
    id: '5646543',
    doctorName: 'Dr. Joseph Chem',
    qualifications: 'M.B.B.S., M.D., M.S.',
    regNo: '1561235',
    mobileNo: '+1 (234) 567-8900',
    clinicName: 'Care Clinic',
    clinicPhone: '09423380390',
    clinicTiming: '09:00 AM - 11:59 AM',
  };

  const medicines = [
    {
      id: '1',
      type: 'Tablet',
      name: 'Demo Med Name 01',
      dosage: '50mg',
      duration: 'One Month',
      takenTimes: '1 Morning, 1 Afternoon, 1 Evening, 1 Night',
    },
    {
      id: '2',
      type: 'Tablet',
      name: 'Demo Med Name 01',
      dosage: '50mg',
      duration: 'One Month',
      takenTimes: '1 Morning, 1 Afternoon, 1 Evening, 1 Night',
    },
  ];

  const advice = 'Avoid oily and spicy foods.';

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleDownloadPress = () => {
    console.log('Download pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContent}>
        <BackHeader
          onBackPress={handleBackPress}
          onSearchPress={handleSearchPress}
          onSearchChange={handleSearchChange}
          showSearchIcon={true}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Prescription Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service:</Text>
            <Text style={styles.infoValue}>{prescriptionData.service}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>
              {prescriptionData.date} | {prescriptionData.time}
            </Text>
          </View>

          {/* Doctor and Clinic Card */}
          <View style={styles.doctorCard}>
            <View style={styles.idLabel}>
              <Text style={styles.idText}>ID: {prescriptionData.id}</Text>
            </View>

            <Text style={styles.doctorName}>{prescriptionData.doctorName}</Text>
            <Text style={styles.qualifications}>
              {prescriptionData.qualifications} | Reg. No: {prescriptionData.regNo}
            </Text>
            <Text style={styles.mobileNo}>Mob. No: {prescriptionData.mobileNo}</Text>

            <View style={styles.divider} />

            <Text style={styles.clinicName}>{prescriptionData.clinicName}</Text>
            <Text style={styles.clinicInfo}>Ph: {prescriptionData.clinicPhone}</Text>
            <Text style={styles.clinicInfo}>{prescriptionData.clinicTiming}</Text>
          </View>

          {/* Prescribed Medicines */}
          <Text style={styles.sectionTitle}>Prescribed Medicines</Text>
          <View style={styles.medicinesContainer}>
            {medicines.map((medicine) => (
              <View key={medicine.id} style={styles.medicineCard}>
                <Text style={styles.medicineType}>{medicine.type}</Text>
                <View style={styles.medicineHeader}>
                  <Text style={styles.medicineName}>{medicine.name}</Text>
                  <View style={styles.dosageBadge}>
                    <Text style={styles.dosageText}>{medicine.dosage}</Text>
                  </View>
                </View>
                <Text style={styles.medicineDetail}>
                  Duration: {medicine.duration}
                </Text>
                <Text style={styles.medicineDetail}>
                  Taken times: {medicine.takenTimes}
                </Text>
              </View>
            ))}
          </View>

          {/* Advise Given */}
          <Text style={styles.sectionTitle}>Advise Given</Text>
          <Text style={styles.adviceText}>{advice}</Text>
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
  headerContent: {
    paddingHorizontal: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 24,
    gap: 20,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
  },
  infoValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginLeft: 4,
  },
  doctorCard: {
    backgroundColor: '#F0E8FB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  idLabel: {
    backgroundColor: '#A473E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  idText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  qualifications: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  mobileNo: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 8,
  },
  clinicName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  clinicInfo: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  medicinesContainer: {
    gap: 12,
    marginTop: 8,
  },
  medicineCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  medicineType: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  medicineName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  dosageBadge: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  dosageText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  medicineDetail: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
    marginTop: 4,
  },
  adviceText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
});

export default PrescriptionDetails;

