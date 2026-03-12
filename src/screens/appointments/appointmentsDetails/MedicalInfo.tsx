import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';

const MedicalInfo: React.FC = () => {
  const medicalData = {
    firstTherapy: 'No',
    takingMedicine: 'No',
    lastVisit: 'About a week ago',
    preCondition: 'Normal',
    currentCondition: 'Serious',
    doctorHelp: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.',
    invoiceEmail: 'alexander39@gmail.com',
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <InfoRow label="Is it your first therapy?" value={medicalData.firstTherapy} />
      <InfoRow label="Are you taking any medicine?" value={medicalData.takingMedicine} />
      <InfoRow label="When was your last visit?" value={medicalData.lastVisit} />
      
      <View style={styles.conditionRow}>
        <View style={styles.conditionItem}>
          <Text style={styles.infoLabel}>Pre condition</Text>
          <Text style={styles.infoValue}>{medicalData.preCondition}</Text>
        </View>
        <View style={styles.conditionItem}>
          <Text style={styles.infoLabel}>Current condition</Text>
          <Text style={styles.infoValue}>{medicalData.currentCondition}</Text>
        </View>
      </View>

      <View style={styles.helpSection}>
        <Text style={styles.infoLabel}>How can a doctor help you?</Text>
        <Text style={styles.helpText}>{medicalData.doctorHelp}</Text>
      </View>

      <InfoRow label="Invoice will be sent to" value={medicalData.invoiceEmail} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  conditionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  conditionItem: {
    flex: 1,
    gap: 8,
  },
  helpSection: {
    gap: 8,
    marginBottom: 16,
  },
  helpText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});

export default MedicalInfo;

