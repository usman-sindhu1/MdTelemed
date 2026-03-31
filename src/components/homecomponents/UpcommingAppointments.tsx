import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';

interface Appointment {
  id: string;
  doctorName: string;
  doctorImageUri?: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Attended' | 'Cancelled' | 'Draft';
}

const UpcommingAppointments: React.FC = () => {
  const navigation = useNavigation<any>();

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
      doctorName: 'Dr. Emily Carter',
      doctorImageUri: 'https://randomuser.me/api/portraits/women/68.jpg',
      specialty: 'Neurologist',
      date: 'Apr 02, 2026',
      time: '9:45 AM',
      status: 'Upcoming',
    },
    {
      id: '5646545',
      doctorName: 'Dr. Michael Chen',
      doctorImageUri: 'https://randomuser.me/api/portraits/men/32.jpg',
      specialty: 'Dermatologist',
      date: 'Apr 05, 2026',
      time: '2:30 PM',
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
  ];

  const upcomingAppointments = appointments
    .filter((appointment) => appointment.status === 'Upcoming')
    .slice(0, 3);

  const handleViewAll = () => {
    // Navigate to Appointments screen in the Calendar (Appointments) stack
    navigation.navigate('Calendar', { screen: 'AppointmentsMain' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Appointment</Text>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Appointment Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {upcomingAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.card}>
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
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>upcoming</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  cardsContainer: {
    paddingRight: 8,
    gap: 12,
  },
  card: {
    width: 350,
    backgroundColor: '#EEEFF3',
    borderRadius: 28,
    padding: 16,
    minHeight: 156,
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
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 10,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
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
  },
  detailText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    flexShrink: 1,
  },
});

export default UpcommingAppointments;

