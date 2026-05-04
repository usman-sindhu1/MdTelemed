import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import type { PatientAppointmentDetailPayload } from '../../../types/patientAppointments';
import { extractSpecialty } from '../../../utils/appointmentEnrichment';

export interface DoctorInfoProps {
  detail: PatientAppointmentDetailPayload | undefined;
  therapistData: unknown;
  therapistLoading: boolean;
  isLoading: boolean;
}

function doctorDisplayName(
  doctor: PatientAppointmentDetailPayload['doctor'],
): string {
  if (!doctor) return 'Doctor';
  const fn = doctor.firstName?.trim() ?? '';
  const ln = doctor.lastName?.trim() ?? '';
  const full = [fn, ln].filter(Boolean).join(' ');
  return full || 'Doctor';
}

const DoctorInfo: React.FC<DoctorInfoProps> = ({
  detail,
  therapistData,
  therapistLoading,
  isLoading,
}) => {
  const doctor = detail?.doctor;
  const name = doctorDisplayName(doctor);
  const specialty =
    therapistLoading && !therapistData
      ? '…'
      : extractSpecialty(therapistData);
  const email =
    doctor?.email && doctor.email.trim() ? doctor.email.trim() : '—';
  const doctorId =
    doctor?.id && doctor.id.trim() ? doctor.id.trim() : '—';
  const uri = doctor?.image?.trim() ? doctor.image.trim() : undefined;

  if (isLoading && !detail) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.profileRow}>
        <View style={styles.avatarWrap}>
          {uri ? (
            <Image source={{ uri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
        <View style={styles.profileText}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{specialty}</Text>
          </View>
          <Text style={styles.desc}>
            Doctor information for this appointment.
          </Text>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Doctor ID</Text>
          <Text style={styles.value} selectable>
            {doctorId}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  avatarWrap: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  profileText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  badgeText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  desc: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 8,
    lineHeight: 18,
  },
  details: {
    gap: 16,
    paddingTop: 4,
  },
  field: {
    gap: 4,
  },
  label: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: Colors.textLight,
  },
  value: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    color: Colors.textPrimary,
  },
});

export default DoctorInfo;
