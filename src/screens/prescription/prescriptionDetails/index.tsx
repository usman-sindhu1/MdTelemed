import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';

const PrescriptionDetails: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: isSearchActive ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isSearchActive, searchAnim]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
  };

  const handleDownloadPress = () => {
    console.log('Download pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerBlock}>
        <View style={[styles.headerContent, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerActionsRow}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Icons.Vector1Icon width={22} height={22} />
            </TouchableOpacity>
            {!isSearchActive && (
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={handleSearchPress}
                activeOpacity={0.7}
              >
                <Icons.Search width={20} height={20} />
              </TouchableOpacity>
            )}
            {isSearchActive && (
              <Animated.View
                style={[
                  styles.searchBar,
                  {
                    opacity: searchAnim,
                    transform: [
                      {
                        translateX: searchAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [80, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Icons.Search width={18} height={18} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="#9CA3AF"
                  value={searchText}
                  onChangeText={setSearchText}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={handleCloseSearch}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Prescription Details</Text>
          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadPress} activeOpacity={0.8}>
            <Text style={styles.downloadBtnText}>Download Prescription</Text>
          </TouchableOpacity>

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

          {/* Medication Instructions */}
          <Text style={styles.sectionTitle}>Medication Instructions</Text>
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
  headerBlock: {
    backgroundColor: '#ECF2FD',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerContent: {
    paddingHorizontal: 15,
    paddingBottom: 14,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  cancelText: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
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
  downloadBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: -4,
  },
  downloadBtnText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
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
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  idLabel: {
    backgroundColor: Colors.primary,
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

