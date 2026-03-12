import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';

const Reports: React.FC = () => {
  const reports = [
    {
      id: '1',
      title: 'File title.pdf',
      size: '39mb',
    },
    {
      id: '2',
      title: 'File title.pdf',
      size: '39mb',
    },
  ];

  return (
    <View style={styles.container}>
      {reports.map((report) => (
        <View key={report.id} style={styles.reportItem}>
          <Text style={styles.reportLabel}>Report title</Text>
          <View style={styles.reportContent}>
            <View style={styles.pdfIcon}>
              <Text style={styles.pdfIconText}>PDF</Text>
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportSize}>Size: {report.size}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  reportItem: {
    gap: 12,
  },
  reportLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
  },
  reportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pdfIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfIconText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reportInfo: {
    flex: 1,
    gap: 4,
  },
  reportTitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  reportSize: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
});

export default Reports;

