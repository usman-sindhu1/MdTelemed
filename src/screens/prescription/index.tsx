import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomeHeader from '../../components/common/HomeHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { PrescriptionStackParamList } from '../../navigation/HomeStack';
import Icons from '../../assets/svg';
import { useScrollContext } from '../../contexts/ScrollContext';

type PrescriptionNavigationProp = NativeStackNavigationProp<
  PrescriptionStackParamList,
  'PrescriptionMain'
>;

interface PrescriptionData {
  id: string;
  date: string;
  title: string;
  doctorName: string;
  service: string;
  appointmentFor: string;
  medPrescribed: string;
  instructions: string;
}

const Prescription: React.FC = () => {
  const navigation = useNavigation<PrescriptionNavigationProp>();
  const { setIsScrollingDown } = useScrollContext();

  useEffect(() => {
    return () => {
      setIsScrollingDown(false);
    };
  }, [setIsScrollingDown]);

  const prescriptions: PrescriptionData[] = [
    {
      id: '5646543',
      date: 'Jan 12, 2025',
      title: 'Prescription Title Here',
      doctorName: 'Cody Fisher',
      service: 'Skin Care',
      appointmentFor: 'My Self',
      medPrescribed: '2',
      instructions: 'After meals, twice daily',
    },
    {
      id: '5646544',
      date: 'Jan 18, 2025',
      title: 'Dermatitis Follow-up',
      doctorName: 'Dr. Michael Chen',
      service: 'Dermatology',
      appointmentFor: 'My Self',
      medPrescribed: '3',
      instructions: 'Use ointment morning and night',
    },
  ];

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleAIChatPress = () => {
    const tabNavigation = navigation.getParent();
    if (tabNavigation) {
      tabNavigation.navigate('Chat' as never);
      return;
    }
    navigation.navigate('Chat' as never);
  };

  const handleNotificationPress = () => {
    const tabNavigation = navigation.getParent();
    if (tabNavigation) {
      tabNavigation.navigate('Notifications' as never);
      return;
    }
    navigation.navigate('Notifications' as never);
  };

  const handleCardPress = (prescription: PrescriptionData) => {
    navigation.navigate('PrescriptionDetails');
  };

  const handleScrollStart = () => {
    setIsScrollingDown(true);
  };

  const handleScrollStop = () => {
    setIsScrollingDown(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.scrollWrapper} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={handleScrollStart}
          onMomentumScrollBegin={handleScrollStart}
          onScrollEndDrag={handleScrollStop}
          onMomentumScrollEnd={handleScrollStop}
        >
          <View style={styles.headerContainer}>
            <HomeHeader
              onProfilePress={handleMenuPress}
              onSearchChange={handleSearchChange}
              onAIChatPress={handleAIChatPress}
              onNotificationPress={handleNotificationPress}
              placeholder="Search prescription, doctor"
              showFeelingRow={false}
            />
          </View>
          <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>My Prescriptions</Text>
            <Text style={styles.description}>
              Digital prescriptions from your doctors. View, download, and follow medication instructions.
            </Text>
          </View>

          {/* Prescription Cards */}
          <View style={styles.cardsContainer}>
            {prescriptions.map((prescription, index) => (
              <TouchableOpacity
                key={index}
                style={styles.prescriptionCard}
                onPress={() => handleCardPress(prescription)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.idLabel}>
                    <Text style={styles.idText}>ID: {prescription.id}</Text>
                  </View>
                  <View style={styles.dateLabel}>
                    <Icons.CalendarTodayIcon width={14} height={14} />
                    <Text style={styles.dateText}>{prescription.date}</Text>
                  </View>
                </View>

                <View style={styles.prescriptionSection}>
                  <Text style={styles.sectionLabel}>Prescription title:</Text>
                  <Text style={styles.prescriptionTitle}>{prescription.title}</Text>
                </View>

                <View style={styles.doctorSection}>
                  <View style={styles.doctorInfo}>
                    <View style={styles.outerBorderContainer}>
                      <View style={styles.borderContainer}>
                        <View style={styles.imageContainer}>
                          <View style={styles.placeholderImage} />
                        </View>
                      </View>
                    </View>
                    <View style={styles.doctorTextWrap}>
                      <Text style={styles.sectionLabel}>Doctor</Text>
                      <Text style={styles.doctorName}>{prescription.doctorName}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>Service: {prescription.service}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>For: {prescription.appointmentFor}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipText}>Meds: {prescription.medPrescribed}</Text>
                  </View>
                </View>

                <View style={styles.instructionsCard}>
                  <Text style={styles.instructionsTitle}>Medication instructions</Text>
                  <Text style={styles.detailText}>{prescription.instructions}</Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.secondaryPill} activeOpacity={0.8}>
                    <Text style={styles.secondaryPillText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryPill}
                    activeOpacity={0.8}
                    onPress={() => handleCardPress(prescription)}
                  >
                    <Text style={styles.primaryPillText}>View Prescription</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: '#ECF2FD',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 0,
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
  cardsContainer: {
    gap: 16,
  },
  prescriptionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idLabel: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  idText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateLabel: {
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  prescriptionSection: {
    gap: 8,
  },
  sectionLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  prescriptionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  doctorSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  outerBorderContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  borderContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: Colors.backgroundLight,
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 22,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  doctorTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  metaChipText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  instructionsCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
  },
  instructionsTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  secondaryPill: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    flex: 1,
    alignItems: 'center',
  },
  secondaryPillText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  primaryPill: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: Colors.primary,
    flex: 1.2,
    alignItems: 'center',
  },
  primaryPillText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 20,
  },
});

export default Prescription;
