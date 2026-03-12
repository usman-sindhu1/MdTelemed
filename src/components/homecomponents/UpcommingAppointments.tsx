import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
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
  patientType: string;
  date: string;
  time: string;
  status: string;
}

const UpcommingAppointments: React.FC = () => {
  const navigation = useNavigation<any>();

  // Sample data - replace with actual data source
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
  ];

  const handleViewAll = () => {
    // Navigate to Appointments screen in the Calendar (Appointments) stack
    navigation.navigate('Calendar', { screen: 'AppointmentsMain' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Appointments</Text>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Appointment Cards */}
      <View style={styles.cardsContainer}>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.card}>
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
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
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
    fontSize: 20,
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
    width: '100%',
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
    backgroundColor: "#D1B9F2",
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
  doctorLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: "#9E9E9E",
    marginBottom: 8,
  },
  doctorInfo: {
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 12,
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
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Android shadow
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

export default UpcommingAppointments;

