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

type AppointmentStatus = 'Upcoming' | 'Attended' | 'Cancelled' | 'Draft';
type CategoryType = 'All' | AppointmentStatus;

interface Appointment {
  id: string;
  doctorName: string;
  doctorImageUri?: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

type AppointmentsNavigationProp = NativeStackNavigationProp<AppointmentsStackParamList>;

const Appointments: React.FC = () => {
  const navigation = useNavigation<AppointmentsNavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');

  const categories: CategoryType[] = ['All', 'Upcoming', 'Attended', 'Cancelled', 'Draft'];

  const appointments: Appointment[] = [
    {
      id: '5646543',
      doctorName: 'Dr. Sarah Johnson',
      doctorImageUri: 'https://randomuser.me/api/portraits/women/44.jpg',
      specialty: 'Cardiologist',
      date: 'Mar 31, 2026',
      time: '10:00 AM',
      status: 'Upcoming',
    },
    {
      id: '5646544',
      doctorName: 'Dr. Michael Chen',
      doctorImageUri: 'https://randomuser.me/api/portraits/men/32.jpg',
      specialty: 'Dermatologist',
      date: 'Mar 28, 2026',
      time: '2:30 PM',
      status: 'Attended',
    },
    {
      id: '5646545',
      doctorName: 'Dr. Emily Carter',
      doctorImageUri: 'https://randomuser.me/api/portraits/women/68.jpg',
      specialty: 'Neurologist',
      date: 'Apr 02, 2026',
      time: '9:45 AM',
      status: 'Upcoming',
    },
    {
      id: '5646546',
      doctorName: 'Dr. James Lee',
      doctorImageUri: 'https://randomuser.me/api/portraits/men/75.jpg',
      specialty: 'Gastroenterologist',
      date: 'Mar 20, 2026',
      time: '4:15 PM',
      status: 'Cancelled',
    },
    {
      id: '5646547',
      doctorName: 'Dr. Olivia Brown',
      doctorImageUri: 'https://randomuser.me/api/portraits/women/29.jpg',
      specialty: 'Endocrinologist',
      date: 'Apr 10, 2026',
      time: '1:00 PM',
      status: 'Draft',
    },
  ];

  const filteredAppointments = selectedCategory === 'All'
    ? appointments
    : appointments.filter((appointment) => appointment.status === selectedCategory);

  const handleProfilePress = () => {
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

  const handleCardPress = (appointment: Appointment) => {
    navigation.navigate('AppointmentDetails');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.scrollWrapper} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <HomeHeader
              onProfilePress={handleProfilePress}
              onSearchChange={handleSearchChange}
              onAIChatPress={handleAIChatPress}
              onNotificationPress={handleNotificationPress}
              placeholder="Search doctor, service"
              showFeelingRow={false}
            />
          </View>
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
            {filteredAppointments.map((appointment, index) => (
              <TouchableOpacity
                key={`${appointment.id}-${index}`}
                style={styles.card}
                onPress={() => handleCardPress(appointment)}
                activeOpacity={0.7}
              >
                <View style={styles.topRow}>
                  <View style={styles.imageShell}>
                    {appointment.doctorImageUri ? (
                      <Image source={{ uri: appointment.doctorImageUri }} style={styles.profileImage} />
                    ) : (
                      <View style={styles.placeholderImage} />
                    )}
                  </View>
                  <View style={styles.doctorTextWrap}>
                    <Text style={styles.doctorName} numberOfLines={1}>
                      {appointment.doctorName}
                    </Text>
                    <Text style={styles.specialty} numberOfLines={1}>
                      {appointment.specialty}
                    </Text>
                  </View>
                </View>

                <View style={styles.bottomRow}>
                  <View style={styles.datetimeWrap}>
                    <View style={styles.detailItem}>
                      <Icons.CalendarTodayIcon width={20} height={20} />
                      <Text style={styles.detailText} numberOfLines={1}>
                        {appointment.date}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Icons.NestClockFarsightAnalogIcon width={20} height={20} />
                      <Text style={styles.detailText} numberOfLines={1}>
                        {appointment.time}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      appointment.status === 'Upcoming'
                        ? styles.statusUpcoming
                        : appointment.status === 'Attended'
                        ? styles.statusAttended
                        : appointment.status === 'Cancelled'
                        ? styles.statusCancelled
                        : styles.statusDraft,
                    ]}
                  >
                    <Text style={styles.statusText}>{appointment.status.toLowerCase()}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {filteredAppointments.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No appointments in this status.</Text>
              </View>
            ) : null}
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
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#EEEFF3',
    borderRadius: 24,
    padding: 16,
    width: '100%',
    minHeight: 152,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  imageShell: {
    width: 84,
    height: 84,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: '#DDE3EA',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
  },
  doctorTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingTop: 4,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  specialty: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  datetimeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: 8,
    columnGap: 14,
    flex: 1,
    minWidth: 0,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  statusUpcoming: {
    backgroundColor: Colors.primary,
  },
  statusAttended: {
    backgroundColor: '#10B981',
  },
  statusCancelled: {
    backgroundColor: '#EF4444',
  },
  statusDraft: {
    backgroundColor: '#9CA3AF',
  },
  statusText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'lowercase',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
    maxWidth: '48%',
  },
  detailText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    flexShrink: 1,
  },
  emptyState: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textLight,
  },
});

export default Appointments;
