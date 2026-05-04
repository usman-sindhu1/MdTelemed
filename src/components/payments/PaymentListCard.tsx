import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import ShimmerBox from '../common/ShimmerBox';
import type { PatientPaymentListRow } from '../../types/patientPayments';
import {
  formatPaymentMoney,
  formatPaymentInvoiceDate,
  formatPaymentServiceLabel,
  paymentStatusStyle,
  resolveDoctorForPaymentRow,
} from '../../utils/paymentDisplay';

export type PaymentListCardProps = {
  row: PatientPaymentListRow;
  onPress: () => void;
};

const PaymentListCard: React.FC<PaymentListCardProps> = ({ row, onPress }) => {
  const { payment, appointment } = row;
  const { name, imageUri } = resolveDoctorForPaymentRow(row);
  const service = formatPaymentServiceLabel(appointment?.appointmentType);
  const amount = formatPaymentMoney(payment.amount, payment.currency);
  const visitPrice =
    typeof appointment?.fixedFee === 'number'
      ? formatPaymentMoney(appointment.fixedFee, payment.currency)
      : '—';
  const paidOn = formatPaymentInvoiceDate(payment.createdAt);
  const statusUi = paymentStatusStyle(payment.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        <View style={styles.avatarShell}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
        <View style={styles.topText}>
          <Text style={styles.paidToLabel}>Paid to</Text>
          <Text style={styles.doctorName} numberOfLines={2}>
            {name}
          </Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusUi.bg }]}>
          <Text style={[styles.statusText, { color: statusUi.text }]}>
            {statusUi.label}
          </Text>
        </View>
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Service</Text>
          <Text style={styles.metaValue} numberOfLines={2}>
            {service}
          </Text>
        </View>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Amount</Text>
          <Text style={styles.amountValue}>{amount}</Text>
        </View>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Visit price</Text>
          <Text style={styles.metaValue}>{visitPrice}</Text>
        </View>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Paid on</Text>
          <Text style={styles.metaValue}>{paidOn}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const PaymentListCardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.topRow}>
      <ShimmerBox width={52} height={52} borderRadius={14} />
      <View style={styles.shimTitle}>
        <ShimmerBox height={12} borderRadius={6} width={56} />
        <ShimmerBox height={18} borderRadius={8} width="88%" />
      </View>
      <ShimmerBox width={56} height={26} borderRadius={999} />
    </View>
    <View style={styles.metaGrid}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.metaCell}>
          <ShimmerBox height={11} borderRadius={4} width="70%" />
          <ShimmerBox height={16} borderRadius={6} width="90%" />
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarShell: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
  },
  topText: {
    flex: 1,
    minWidth: 0,
  },
  paidToLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '700',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  metaCell: {
    width: '47%',
    minWidth: 130,
  },
  metaLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metaValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  amountValue: {
    fontFamily: Fonts.raleway,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
  },
  shimTitle: {
    flex: 1,
    gap: 8,
    minWidth: 0,
    justifyContent: 'center',
  },
});

export default PaymentListCard;
