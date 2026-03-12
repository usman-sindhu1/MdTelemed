import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';

const AppointmentsInfo: React.FC = () => {
  const appointmentData = {
    appointmentId: 'Skin Allergy',
    service: 'Allergy',
    date: 'Thu, Jan 29, 2025',
    timeSlot: '11:00 pm',
    feeStatus: 'Paid',
  };

  const appointmentWith = {
    doctorName: 'Ahmad Aslam',
    linkedClinic: 'Fatmia Memorial Hospital',
    contactNo: '+1 (234) 567-8900',
    email: 'admin@fmh.com',
    website: 'fatimamemorialhospital.com',
    servicesOffered: '12',
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Overview Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <InfoRow label="Appointment Id:" value={appointmentData.appointmentId} />
        <InfoRow label="Service:" value={appointmentData.service} />
        <InfoRow label="Date:" value={appointmentData.date} />
        <InfoRow label="Time slot:" value={appointmentData.timeSlot} />
        <InfoRow label="Fee status:" value={appointmentData.feeStatus} />
      </View>

      {/* Appointment With Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appointment With</Text>
        <InfoRow label="Doctor name:" value={appointmentWith.doctorName} />
        <InfoRow label="Linked clinic:" value={appointmentWith.linkedClinic} />
        <InfoRow label="Contact no:" value={appointmentWith.contactNo} />
        <InfoRow label="Email:" value={appointmentWith.email} />
        <InfoRow label="Website:" value={appointmentWith.website} />
        <InfoRow label="Services offered:" value={appointmentWith.servicesOffered} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
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
});

export default AppointmentsInfo;

