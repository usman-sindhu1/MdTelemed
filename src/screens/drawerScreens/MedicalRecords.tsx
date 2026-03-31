import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import type { DrawerParamList } from '../../navigation/HomeStackRoot';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';

type MedicalRecordsNavigationProp = NativeStackNavigationProp<DrawerParamList, 'MedicalRecords'>;

interface RecordItem {
  id: string;
  title: string;
  type: string;
  date: string;
}

const RECORDS: RecordItem[] = [
  { id: '1', title: 'Blood Test Results', type: 'Lab Report', date: 'Mar 28, 2026' },
  { id: '2', title: 'Chest X-Ray', type: 'Imaging', date: 'Mar 15, 2026' },
  { id: '3', title: 'Vaccination Record', type: 'Immunization', date: 'Feb 10, 2026' },
];

const MedicalRecords: React.FC = () => {
  const navigation = useNavigation<MedicalRecordsNavigationProp>();

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SimpleBackHeader title="Medical Records" onBackPress={handleBackPress} compact />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {RECORDS.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.docIconBox}>
                <Text style={styles.docIcon}>📄</Text>
              </View>
              <View style={styles.meta}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.type}>{item.type}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.actionsRow}>
              <TouchableOpacity style={[styles.actionBtn, styles.primaryActionBtn]} activeOpacity={0.7}>
                <Text style={[styles.actionText, styles.primaryActionText]}>↓  Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Text style={styles.actionText}>↗  Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 15, paddingBottom: 30, gap: 14 },
  card: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    padding: 14,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  docIconBox: {
    width: 76 / 2,
    height: 76 / 2,
    borderRadius: 14,
    backgroundColor: '#DDE4F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  docIcon: { fontSize: 20 },
  meta: { flex: 1 },
  title: { fontFamily: Fonts.raleway, fontSize: 18, fontWeight: '700', color: '#111827' },
  type: { fontFamily: Fonts.openSans, fontSize: 14, fontWeight: '400', color: '#6B7280', marginTop: 2 },
  date: { fontFamily: Fonts.openSans, fontSize: 13, fontWeight: '400', color: '#6B7280', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#D1D5DB', marginVertical: 12 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryActionBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionText: { fontFamily: Fonts.raleway, fontSize: 15, fontWeight: '700', color: Colors.primary },
  primaryActionText: {
    color: '#FFFFFF',
  },
});

export default MedicalRecords;
