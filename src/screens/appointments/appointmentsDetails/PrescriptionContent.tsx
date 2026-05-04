import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import type {
  PatientAppointmentMedicine,
  PatientAppointmentPrescription,
} from '../../../types/patientAppointments';

export interface PrescriptionContentProps {
  isLoading: boolean;
  prescription?: PatientAppointmentPrescription | null;
  medicines?: PatientAppointmentMedicine[];
}

function hasPrescriptionData(
  prescription: PatientAppointmentPrescription | null | undefined,
  medicines: PatientAppointmentMedicine[] | undefined,
): boolean {
  if (prescription != null) return true;
  return Array.isArray(medicines) && medicines.length > 0;
}

function adviseText(p: PatientAppointmentPrescription): string {
  const raw = p.advise ?? p.advice;
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  return '';
}

function titleText(p: PatientAppointmentPrescription): string {
  if (typeof p.title === 'string' && p.title.trim()) return p.title.trim();
  if (typeof p.id === 'string' && p.id.trim()) return `Prescription ${p.id.slice(0, 8)}…`;
  return 'Prescription';
}

const PrescriptionContent: React.FC<PrescriptionContentProps> = ({
  isLoading,
  prescription,
  medicines = [],
}) => {
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!hasPrescriptionData(prescription, medicines)) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.iconCircle}>
          <Icons.PageInfoIcon width={40} height={40} />
        </View>
        <Text style={styles.emptyTitle}>No prescription yet</Text>
        <Text style={styles.emptySubtitle}>
          Your doctor has not added a prescription for this appointment.
        </Text>
      </View>
    );
  }

  const p = prescription ?? {};
  const advise = adviseText(p as PatientAppointmentPrescription);
  const title = titleText(p as PatientAppointmentPrescription);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Title</Text>
        <Text style={styles.title}>{title}</Text>
        {advise ? (
          <>
            <Text style={[styles.sectionLabel, styles.sectionSpaced]}>Advise</Text>
            <Text style={styles.body}>{advise}</Text>
          </>
        ) : null}
        {medicines.length > 0 ? (
          <>
            <Text style={[styles.sectionLabel, styles.sectionSpaced]}>Medicines</Text>
            <View style={styles.medList}>
              {medicines.map((med, idx) => (
                <View
                  key={`${med.name ?? 'm'}-${idx}`}
                  style={styles.medRow}
                >
                  <Text style={styles.medName}>
                    {typeof med.name === 'string' && med.name.trim()
                      ? med.name.trim()
                      : `Medicine ${idx + 1}`}
                  </Text>
                  {typeof med.dosage === 'string' && med.dosage.trim() ? (
                    <Text style={styles.medMeta}>Dosage: {med.dosage}</Text>
                  ) : null}
                  {typeof med.frequency === 'string' && med.frequency.trim() ? (
                    <Text style={styles.medMeta}>Frequency: {med.frequency}</Text>
                  ) : null}
                  {typeof med.duration === 'string' && med.duration.trim() ? (
                    <Text style={styles.medMeta}>Duration: {med.duration}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 480,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  loading: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
    marginBottom: 4,
  },
  sectionSpaced: {
    marginTop: 16,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  medList: {
    gap: 12,
    marginTop: 8,
  },
  medRow: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  medName: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  medMeta: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 220,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});

export default PrescriptionContent;
