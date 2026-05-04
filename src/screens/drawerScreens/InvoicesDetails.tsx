import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';
import { usePatientPaymentDetail } from '../../hooks/usePatientPaymentDetail';
import ShimmerBox from '../../components/common/ShimmerBox';
import {
  formatPaymentMoney,
  formatPaymentInvoiceDate,
  formatPaymentServiceLabel,
  paymentStatusStyle,
  patientFullName,
  patientPaymentDoctorName,
} from '../../utils/paymentDisplay';
import { generateAndSharePaymentInvoicePdf } from '../../utils/paymentPdfExport';
import { showErrorToast } from '../../utils/appToast';

type InvoiceDetailsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'InvoiceDetails'
>;

type InvoiceDetailsRouteProp = RouteProp<DrawerParamList, 'InvoiceDetails'>;

const InvoiceDetailsSkeleton: React.FC = () => (
  <View style={styles.cardOuter}>
    <ShimmerBox height={140} borderRadius={16} style={{ marginBottom: 12 }} />
    <ShimmerBox height={88} borderRadius={12} style={{ marginBottom: 16 }} />
    <ShimmerBox height={36} borderRadius={8} style={{ marginBottom: 8 }} />
    <ShimmerBox height={44} borderRadius={8} style={{ marginBottom: 8 }} />
    <ShimmerBox height={44} borderRadius={8} />
    <View style={{ height: 24 }} />
    <ShimmerBox height={120} borderRadius={12} />
  </View>
);

const InvoiceDetails: React.FC = () => {
  const navigation = useNavigation<InvoiceDetailsNavigationProp>();
  const route = useRoute<InvoiceDetailsRouteProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 560;
  const paymentId = route.params?.paymentId?.trim() ?? '';

  const detailQuery = usePatientPaymentDetail(paymentId || undefined);
  const [pdfLoading, setPdfLoading] = useState(false);

  const data = detailQuery.data;
  const payment = data?.payment;
  const appointment = data?.appointment;
  const patient = data?.patient;
  const doctor = data?.doctor;

  const handleDownload = useCallback(async () => {
    if (!data || !paymentId) return;
    try {
      setPdfLoading(true);
      await generateAndSharePaymentInvoicePdf(data, paymentId);
    } catch (e) {
      showErrorToast(
        'Could not create PDF',
        (e as Error)?.message ?? 'Try again later.',
      );
    } finally {
      setPdfLoading(false);
    }
  }, [data, paymentId]);

  const providerName = patientPaymentDoctorName(doctor, appointment?.doctorUser);
  const providerAddr =
    doctor?.address && String(doctor.address).trim()
      ? String(doctor.address).trim()
      : '—';
  const billName = patientFullName(patient ?? undefined);
  const billAddr =
    patient?.address && String(patient.address).trim()
      ? String(patient.address).trim()
      : '—';
  const service = formatPaymentServiceLabel(appointment?.appointmentType);
  const amountStr =
    payment != null
      ? formatPaymentMoney(payment.amount, payment.currency)
      : '—';
  const taxStr =
    payment != null ? formatPaymentMoney(0, payment.currency) : '$0.00';
  const paidOn =
    payment != null ? formatPaymentInvoiceDate(payment.createdAt) : '—';
  const statusUi =
    payment != null ? paymentStatusStyle(payment.status) : null;

  const missingId = !paymentId;
  const showSkeleton = detailQuery.isPending && !missingId;
  const showError = detailQuery.isError && !showSkeleton;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerBlock}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icons.Back width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invoice</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <View style={styles.titleBlock}>
            <Text style={styles.heading}>Invoice</Text>
            <Text style={styles.sub}>
              Here are the details of your invoice.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.downloadBtn,
              (pdfLoading || !data) && styles.downloadBtnDisabled,
            ]}
            onPress={handleDownload}
            disabled={pdfLoading || !data}
            activeOpacity={0.85}
          >
            {pdfLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Icons.ShareScreenIcon width={20} height={20} />
            )}
            <Text style={styles.downloadBtnText}>Download invoice</Text>
          </TouchableOpacity>

          {missingId ? (
            <Text style={styles.errorText}>Missing payment reference.</Text>
          ) : showSkeleton ? (
            <InvoiceDetailsSkeleton />
          ) : showError ? (
            <Text style={styles.errorText}>
              {(detailQuery.error as Error)?.message ??
                'Could not load this invoice.'}
            </Text>
          ) : payment ? (
            <>
              <View style={styles.cardOuter}>
                <View
                  style={[
                    styles.invoiceTop,
                    isWide && styles.invoiceTopWide,
                  ]}
                >
                  <View
                    style={[
                      styles.blueBlock,
                      isWide && { flex: 1, minWidth: 200 },
                    ]}
                  >
                    <View style={styles.brandRow}>
                      <Image
                        source={require('../../assets/svg/logo1.png')}
                        style={styles.logoImg}
                        resizeMode="contain"
                      />
                      <Text style={styles.brandText}>Md Telemed</Text>
                    </View>
                    <Text style={styles.blueMeta}>
                      <Text style={styles.blueLabel}>Invoice Id{'\n'}</Text>
                      <Text style={styles.blueValue}>{payment.id}</Text>
                    </Text>
                    <Text style={styles.blueMeta}>
                      <Text style={styles.blueLabel}>Date{'\n'}</Text>
                      <Text style={styles.blueValue}>{paidOn}</Text>
                    </Text>
                    <Text style={styles.blueMeta}>
                      <Text style={styles.blueLabel}>Paid to{'\n'}</Text>
                      <Text style={styles.blueValue}>{providerName}</Text>
                    </Text>
                    <Text style={styles.blueMeta}>
                      <Text style={styles.blueLabel}>Location{'\n'}</Text>
                      <Text style={styles.blueValue}>{providerAddr}</Text>
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.billBlock,
                      isWide && { flex: 1, minWidth: 200 },
                    ]}
                  >
                    <Text style={styles.billLabel}>Bill to</Text>
                    <View style={styles.billNameRow}>
                      <Text style={styles.billName}>{billName}</Text>
                      {statusUi ? (
                        <View
                          style={[
                            styles.statusPill,
                            { backgroundColor: statusUi.bg },
                          ]}
                        >
                          <Text
                            style={[styles.statusText, { color: statusUi.text }]}
                          >
                            {statusUi.label}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.billAddr}>{billAddr}</Text>
                  </View>
                </View>

                <View style={styles.tableWrap}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.th, styles.colNo]}>#No.</Text>
                    <Text style={[styles.th, styles.colSvc]}>Service</Text>
                    <Text style={[styles.th, styles.colMoney]}>Amount</Text>
                    <Text style={[styles.th, styles.colMoney]}>Tax</Text>
                    <Text style={[styles.th, styles.colMoney]}>Total</Text>
                  </View>
                  <View style={styles.tableDataRow}>
                    <Text style={[styles.td, styles.colNo]}>01</Text>
                    <Text style={[styles.td, styles.colSvc]} numberOfLines={2}>
                      {service}
                    </Text>
                    <Text style={[styles.td, styles.colMoney]}>{amountStr}</Text>
                    <Text style={[styles.td, styles.colMoney]}>{taxStr}</Text>
                    <Text style={[styles.td, styles.colMoney]}>{amountStr}</Text>
                  </View>
                </View>

                <View style={styles.totals}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Sub total</Text>
                    <Text style={styles.totalVal}>{amountStr}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tax</Text>
                    <Text style={styles.totalVal}>{taxStr}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabelBold}>Grand total</Text>
                    <Text style={styles.totalValBold}>{amountStr}</Text>
                  </View>
                </View>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBlock: {
    backgroundColor: '#ECF2FD',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerRight: {
    width: 36,
    height: 36,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    paddingHorizontal: 15,
    paddingTop: 16,
  },
  titleBlock: {
    marginBottom: 12,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sub: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 20,
  },
  downloadBtnDisabled: {
    opacity: 0.55,
  },
  downloadBtnText: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardOuter: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  invoiceTop: {
    flexDirection: 'column',
  },
  invoiceTopWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  blueBlock: {
    backgroundColor: Colors.primary,
    padding: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  logoImg: {
    width: 36,
    height: 36,
  },
  brandText: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  blueMeta: {
    marginBottom: 10,
  },
  blueLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  blueValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
  billBlock: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  billLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  billNameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  billName: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '700',
  },
  billAddr: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  tableWrap: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  th: {
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  td: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  colNo: {
    width: '12%',
    minWidth: 36,
  },
  colSvc: {
    flex: 1.4,
    paddingRight: 6,
  },
  colMoney: {
    width: '17%',
    minWidth: 52,
    textAlign: 'right',
  },
  totals: {
    padding: 16,
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: '#FAFAFA',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
    minWidth: 220,
  },
  totalLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  totalVal: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    minWidth: 72,
    textAlign: 'right',
  },
  totalLabelBold: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalValBold: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    minWidth: 72,
    textAlign: 'right',
  },
  errorText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export default InvoiceDetails;
