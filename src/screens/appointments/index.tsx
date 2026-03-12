import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppointmentsStackParamList } from '../../navigation/HomeStack';
import HomeHeader from '../../components/common/HomeHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';

type CategoryType = 'Upcoming' | 'Attended' | 'Cancelled' | 'Draft';

interface Appointment {
  id: string;
  doctorName: string;
  doctorImageUri?: string;
  specialty: string;
  patientType: string;
  date: string;
  time: string;
  status: string;
}

type AppointmentsNavigationProp = NativeStackNavigationProp<AppointmentsStackParamList>;

const Appointments: React.FC = () => {
  const navigation = useNavigation<AppointmentsNavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Upcoming');

  const categories: CategoryType[] = ['Upcoming', 'Attended', 'Cancelled', 'Draft'];

  const appointments: Appointment[] = [
    {
      id: '5646543',
      doctorName: 'Cody Fisher',
      specialty: 'Skin care',
      patientType: 'For my self',
      date: 'Jan 22, 2025',
      time: '11:00 am',
      status: 'Paid',
    },
    {
      id: '5646543',
      doctorName: 'Cody Fisher',
      specialty: 'Skin care',
      patientType: 'For my self',
      date: 'Jan 22, 2025',
      time: '11:00 am',
      status: 'Paid',
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

  const handleCardPress = (appointment: Appointment) => {
    navigation.navigate('AppointmentDetails');
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
            <Text style={styles.heading}>Appointments</Text>
            <Text style={styles.subtitle}>
              Appointments which you need to attend in your coming days.
            </Text>
          </View>

          {/* Category Tabs */}
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  selectedCategory === category && styles.categoryTabActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Appointment Cards */}
          <View style={styles.cardsContainer}>
            {appointments.map((appointment, index) => (
              <TouchableOpacity
                key={`${appointment.id}-${index}`}
                style={styles.card}
                onPress={() => handleCardPress(appointment)}
                activeOpacity={0.7}
              >
                {/* ID and Status Labels */}
                <View style={styles.labelRow}>
                  <View style={styles.idLabel}>
                    <Text style={styles.idText}>ID: {appointment.id}</Text>
                  </View>
                  <View style={styles.statusLabel}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>

                {/* Doctor Information */}
                <View style={styles.doctorSection}>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorLabel}>Doctor name</Text>
                    <View style={styles.doctorContent}>
                      <View style={styles.outerBorderContainer}>
                        <View style={styles.borderContainer}>
                          <View style={styles.imageContainer}>
                            {appointment.doctorImageUri ? (
                              <Image
                                source={{ uri: appointment.doctorImageUri }}
                                style={styles.profileImage}
                              />
                            ) : (
                              <View style={styles.placeholderImage} />
                            )}
                          </View>
                        </View>
                      </View>
                      <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                    </View>
                  </View>
                </View>

                {/* Appointment Details */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Icons.ServiceIcon width={16} height={16} stroke={Colors.textSecondary} />
                      <Text style={styles.detailText}>{appointment.specialty}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Icons.VectorIcon width={16} height={16} fill={Colors.textSecondary} />
                      <Text style={styles.detailText}>{appointment.patientType}</Text>
                    </View>
                  </View>
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Icons.VectorIcon width={16} height={16} fill={Colors.textSecondary} />
                      <Text style={styles.detailText}>{appointment.date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Icons.CalendarAltIcon width={16} height={16} fill={Colors.textSecondary} />
                      <Text style={styles.detailText}>{appointment.time}</Text>
                    </View>
                  </View>
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
    marginBottom: 20,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
  },
  categoryTabActive: {
    backgroundColor: '#A473E5',
  },
  categoryText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    minHeight: 200,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  idLabel: {
    backgroundColor: "#A473E5",
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
  statusLabel: {
    backgroundColor: '#F0E8FB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  doctorSection: {
    marginBottom: 16,
  },
  doctorInfo: {
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 12,
  },
  doctorLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
    marginBottom: 8,
  },
  doctorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outerBorderContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 22,
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
  detailsContainer: {
    gap: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  detailText: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textSecondary,
    flex: 1,
  },
});

export default Appointments;
