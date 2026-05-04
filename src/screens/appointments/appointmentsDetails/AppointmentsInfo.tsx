import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import type { PatientAppointmentDetailPayload } from '../../../types/patientAppointments';
import { buildAppointmentInfoRows } from '../../../utils/appointmentDetailDisplay';

export interface AppointmentsInfoProps {
  detail: PatientAppointmentDetailPayload | undefined;
  appointmentId: string | undefined;
  isLoading: boolean;
}

const AppointmentsInfo: React.FC<AppointmentsInfoProps> = ({
  detail,
  appointmentId,
  isLoading,
}) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;
  const rows = buildAppointmentInfoRows(detail, appointmentId);

  const Field = ({ label, value }: { label: string; value: string }) => (
    <View style={[styles.field, isWide && styles.fieldWide]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  if (isLoading && !detail) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={[styles.gridRow, isWide && styles.gridRowWide]}>
        <Field label="Appt Id" value={rows.apptId} />
        <Field label="Service" value={rows.service} />
        <Field label="Appt For" value={rows.apptFor} />
      </View>
      <View style={[styles.gridRow, isWide && styles.gridRowWide]}>
        <Field label="Call Type" value={rows.callType} />
        <Field label="Appt Date" value={rows.apptDate} />
        <Field label="Appt Time" value={rows.apptTime} />
      </View>
      <View style={styles.locationBlock}>
        <Field label="Location" value={rows.location} />
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
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  gridRow: {
    gap: 12,
  },
  gridRowWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  field: {
    flexGrow: 1,
    flexBasis: '100%',
    minWidth: 0,
  },
  fieldWide: {
    flexBasis: '30%',
    minWidth: 140,
  },
  locationBlock: {
    marginTop: 4,
  },
  label: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
    marginBottom: 4,
  },
  value: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
});

export default AppointmentsInfo;
