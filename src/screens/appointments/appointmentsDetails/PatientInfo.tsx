import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';

const PatientInfoTab: React.FC = () => {
  const patientData = {
    patientName: 'Emilie Corner',
    appointmentFor: 'My Self',
    serviceRequired: 'Allergist',
    patientAge: '25 years',
    patientGender: 'Female',
  };

  const contactInfo = {
    contactNo: '+1 (234) 567-8900',
    email: 'emilie.corner@gmail.com',
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Patient Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Details</Text>
        <InfoRow label="Patient name:" value={patientData.patientName} />
        <InfoRow label="Appointment for:" value={patientData.appointmentFor} />
        <InfoRow label="Service required:" value={patientData.serviceRequired} />
        <InfoRow label="Patient age:" value={patientData.patientAge} />
        <InfoRow label="Patient gender:" value={patientData.patientGender} />
      </View>

      {/* Contact Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Info</Text>
        <InfoRow label="Contact no:" value={contactInfo.contactNo} />
        <InfoRow label="Email:" value={contactInfo.email} />
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

export default PatientInfoTab;
