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
import { DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomeHeader from '../../components/common/HomeHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { PrescriptionStackParamList } from '../../navigation/HomeStack';

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
}

const Prescription: React.FC = () => {
  const navigation = useNavigation<PrescriptionNavigationProp>();

  const prescriptions: PrescriptionData[] = [
    {
      id: '5646543',
      date: 'Jan 12, 2025',
      title: 'Prescription Title Here',
      doctorName: 'Cody Fisher',
      service: 'Skin Care',
      appointmentFor: 'My Self',
      medPrescribed: '2',
    },
    {
      id: '5646543',
      date: 'Jan 12, 2025',
      title: 'Prescription Title Here',
      doctorName: 'Cody Fisher',
      service: 'Skin Care',
      appointmentFor: 'My Self',
      medPrescribed: '2',
    },
  ];

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleCardPress = (prescription: PrescriptionData) => {
    navigation.navigate('PrescriptionDetails');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <HomeHeader
          onMenuPress={handleMenuPress}
          onSearchPress={handleSearchPress}
          onSearchChange={handleSearchChange}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>My Prescriptions</Text>
            <Text style={styles.description}>
              All of the prescriptions received by the doctors from the start you've registered till date.
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
                    <Text style={styles.dateText}>{prescription.date}</Text>
                  </View>
                </View>

                <View style={styles.prescriptionSection}>
                  <Text style={styles.sectionLabel}>Prescription title:</Text>
                  <Text style={styles.prescriptionTitle}>{prescription.title}</Text>
                </View>

                <View style={styles.doctorSection}>
                  <Text style={styles.sectionLabel}>Doctor name</Text>
                  <View style={styles.doctorInfo}>
                    <View style={styles.outerBorderContainer}>
                      <View style={styles.borderContainer}>
                        <View style={styles.imageContainer}>
                          <View style={styles.placeholderImage} />
                        </View>
                      </View>
                    </View>
                    <Text style={styles.doctorName}>{prescription.doctorName}</Text>
                  </View>
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailText}>Service: {prescription.service}</Text>
                  <Text style={styles.detailText}>Appointment for: {prescription.appointmentFor}</Text>
                  <Text style={styles.detailText}>Med. Prescribed: {prescription.medPrescribed}</Text>
                </View>
              </TouchableOpacity>
            ))}
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
  headerContainer: {
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
    zIndex: 10,
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
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idLabel: {
    backgroundColor: '#A473E5',
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
    backgroundColor: '#F0E8FB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  dateText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textPrimary,
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
    gap: 8,
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 12,
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
    color: Colors.textSecondary,
    flex: 1,
  },
  detailsSection: {
    gap: 8,
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
