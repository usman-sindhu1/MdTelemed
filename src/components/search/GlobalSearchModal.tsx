import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { publicGetData } from '../../api/publicHttp';
import { patientGetData } from '../../api/patientHttp';
import { publicPaths } from '../../constants/publicPaths';
import { patientPaths } from '../../constants/patientPaths';
import type { PublicDoctorsListPayload } from '../../types/publicDoctors';
import type { PatientPaymentsListPayload } from '../../types/patientPayments';
import type { PatientReviewsListPayload } from '../../types/patientReviews';
import type { PatientPrescriptionsListPayload } from '../../types/patientPrescriptions';
import type { PatientAppointmentsListPayload } from '../../types/patientAppointments';
import type { PatientMedicalHistoryPayload } from '../../types/patientMedicalHistory';
import { appointmentsListParams, type AppointmentsTab } from '../../utils/appointmentStatusUi';

type GlobalSearchFilter =
  | 'all'
  | 'doctors'
  | 'appointments'
  | 'reviews'
  | 'medical'
  | 'prescriptions'
  | 'payments';

const FILTERS: Array<{ id: GlobalSearchFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'doctors', label: 'Doctors' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'medical', label: 'Medical Info' },
  { id: 'prescriptions', label: 'Prescription' },
  { id: 'payments', label: 'Payments' },
];

const PAGE_SIZE = 6;
const windowHeight = Dimensions.get('window').height;

function includesQuery(haystack: string | undefined | null, q: string) {
  if (!haystack) return false;
  return haystack.toLowerCase().includes(q.toLowerCase());
}

export default function GlobalSearchModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<GlobalSearchFilter>('all');
  const [input, setInput] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setDebounced(input.trim()), 350);
    return () => clearTimeout(t);
  }, [input, visible]);

  useEffect(() => {
    if (visible) return;
    setInput('');
    setDebounced('');
    setFilter('all');
  }, [visible]);

  const q = debounced.trim();
  const enabled = visible && q.length >= 2;

  const doctorsQuery = useQuery({
    queryKey: ['global-search', 'doctors', q] as const,
    enabled: enabled && (filter === 'all' || filter === 'doctors'),
    queryFn: () =>
      publicGetData<PublicDoctorsListPayload>(publicPaths.doctors, {
        page: 1,
        pageSize: PAGE_SIZE,
        sortBy: 'averageRating',
        sortOrder: 'desc',
        search: q,
      }),
    staleTime: 60_000,
  });

  const paymentsQuery = useQuery({
    queryKey: ['global-search', 'payments', q] as const,
    enabled: enabled && (filter === 'all' || filter === 'payments'),
    queryFn: () =>
      patientGetData<PatientPaymentsListPayload>(patientPaths.payments, {
        page: 1,
        pageSize: PAGE_SIZE,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        search: q,
      }),
    staleTime: 30_000,
  });

  const reviewsQuery = useQuery({
    queryKey: ['global-search', 'reviews', q] as const,
    enabled: enabled && (filter === 'all' || filter === 'reviews'),
    queryFn: () =>
      patientGetData<PatientReviewsListPayload>(patientPaths.reviews, {
        page: 1,
        pageSize: PAGE_SIZE,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        search: q,
      }),
    staleTime: 30_000,
  });

  const prescriptionsQuery = useQuery({
    queryKey: ['global-search', 'prescriptions', q] as const,
    enabled: enabled && (filter === 'all' || filter === 'prescriptions'),
    queryFn: () =>
      patientGetData<PatientPrescriptionsListPayload>(patientPaths.prescriptions, {
        page: 1,
        pageSize: PAGE_SIZE,
        search: q,
      }),
    staleTime: 30_000,
  });

  const apptUpcomingQuery = useQuery({
    queryKey: ['global-search', 'appointments', 'upcoming', q] as const,
    enabled: enabled && (filter === 'all' || filter === 'appointments'),
    queryFn: () =>
      patientGetData<PatientAppointmentsListPayload>(
        patientPaths.appointments,
        appointmentsListParams('upcoming' as AppointmentsTab, 1, 10),
      ),
    staleTime: 15_000,
  });

  const apptPastQuery = useQuery({
    queryKey: ['global-search', 'appointments', 'past', q] as const,
    enabled: enabled && (filter === 'all' || filter === 'appointments'),
    queryFn: () =>
      patientGetData<PatientAppointmentsListPayload>(
        patientPaths.appointments,
        appointmentsListParams('past' as AppointmentsTab, 1, 10),
      ),
    staleTime: 15_000,
  });

  const medicalQuery = useQuery({
    queryKey: ['global-search', 'medical', q] as const,
    enabled: enabled && (filter === 'all' || filter === 'medical'),
    queryFn: () =>
      patientGetData<PatientMedicalHistoryPayload>(patientPaths.medicalHistory),
    staleTime: 30_000,
  });

  const doctorItems = doctorsQuery.data?.items ?? [];
  const paymentItems = paymentsQuery.data?.items ?? [];
  const reviewItems = reviewsQuery.data?.items ?? [];
  const prescriptionItems = prescriptionsQuery.data?.items ?? [];
  const apptItems = useMemo(() => {
    const u = apptUpcomingQuery.data?.items ?? [];
    const p = apptPastQuery.data?.items ?? [];
    const all = [...u, ...p];
    const seen = new Set<string>();
    const uniq = all.filter((it) => {
      if (!it?.id) return false;
      if (seen.has(it.id)) return false;
      seen.add(it.id);
      return true;
    });
    return uniq.filter((it) => {
      const docName =
        `${it.doctor?.firstName ?? ''} ${it.doctor?.lastName ?? ''}`.trim();
      return includesQuery(docName, q);
    });
  }, [apptUpcomingQuery.data?.items, apptPastQuery.data?.items, q]);

  const medicalMatches = useMemo(() => {
    const reports = medicalQuery.data?.reports ?? [];
    const globalReason = medicalQuery.data?.medicalInfo?.reasonForAppointment ?? '';
    return reports.filter((r) => {
      return (
        includesQuery(r.title, q) ||
        includesQuery(r.description, q) ||
        includesQuery(globalReason, q)
      );
    });
  }, [medicalQuery.data, q]);

  const anyLoading =
    doctorsQuery.isFetching ||
    paymentsQuery.isFetching ||
    reviewsQuery.isFetching ||
    prescriptionsQuery.isFetching ||
    apptUpcomingQuery.isFetching ||
    apptPastQuery.isFetching ||
    medicalQuery.isFetching;

  const anyResults =
    doctorItems.length > 0 ||
    apptItems.length > 0 ||
    reviewItems.length > 0 ||
    medicalMatches.length > 0 ||
    prescriptionItems.length > 0 ||
    paymentItems.length > 0;

  const close = () => onClose();

  const goDoctor = (doctorId: string) => {
    close();
    navigation.navigate('HomeDoctorDetails', { doctorId });
  };

  const goAppointment = (appointmentId: string) => {
    close();
    navigation.navigate('Calendar', {
      screen: 'AppointmentDetails',
      params: { appointmentId, source: 'home' },
    });
  };

  const goPrescription = (prescriptionId: string) => {
    close();
    navigation.navigate('Prescription', {
      screen: 'PrescriptionDetails',
      params: { prescriptionId },
    });
  };

  const goPayment = (paymentId: string) => {
    close();
    navigation.navigate('InvoiceDetails', { paymentId });
  };

  const goReviews = () => {
    close();
    navigation.navigate('RatingsAndReviews');
  };

  const goMedical = () => {
    close();
    navigation.navigate('MedicalInfo');
  };

  const Section = ({
    title,
    rightAction,
    children,
  }: {
    title: string;
    rightAction?: { label: string; onPress: () => void };
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress} activeOpacity={0.7}>
            <Text style={styles.sectionAction}>{rightAction.label}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {children}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[styles.modal, { paddingTop: insets.top + 10 }]}>
        <View style={styles.topBar}>
          <Text style={styles.modalTitle}>Search</Text>
          <TouchableOpacity onPress={close} activeOpacity={0.7} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Icons.Search width={18} height={18} />
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Search doctors, appointments, reviews..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            autoFocus
          />
          {input.length > 0 ? (
            <TouchableOpacity onPress={() => setInput('')} activeOpacity={0.7}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setFilter(f.id)}
                activeOpacity={0.75}
                style={[styles.chip, active ? styles.chipActive : null]}
              >
                <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView
          style={styles.body}
          contentContainerStyle={[
            styles.bodyContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 16, minHeight: windowHeight * 0.6 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {!enabled ? (
            <View style={styles.hintWrap}>
              <Text style={styles.hintTitle}>Search across your app</Text>
              <Text style={styles.hintSub}>
                Type at least 2 characters to search doctors, appointments, reviews, medical info,
                prescriptions, and payments.
              </Text>
            </View>
          ) : anyLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Searching…</Text>
            </View>
          ) : !anyResults ? (
            <View style={styles.hintWrap}>
              <Text style={styles.hintTitle}>No results</Text>
              <Text style={styles.hintSub}>Try a different keyword.</Text>
            </View>
          ) : (
            <>
              {(filter === 'all' || filter === 'doctors') && doctorItems.length > 0 ? (
                <Section title="Doctors">
                  {doctorItems.map((d: any) => {
                    const doctorId = d?.user?.id != null ? String(d.user.id) : '';
                    const name = `${d?.user?.firstName ?? ''} ${d?.user?.lastName ?? ''}`.trim() || 'Doctor';
                    const specialty = String(d?.category?.name ?? d?.speciality ?? '').trim();
                    if (!doctorId) return null;
                    return (
                      <TouchableOpacity
                        key={doctorId}
                        style={styles.row}
                        activeOpacity={0.75}
                        onPress={() => goDoctor(doctorId)}
                      >
                        <View style={styles.rowIconCircle}>
                          <Icons.Doctor1Icon width={18} height={18} fill={Colors.primary} />
                        </View>
                        <View style={styles.rowTextCol}>
                          <Text style={styles.rowTitle} numberOfLines={1}>{name}</Text>
                          {specialty ? (
                            <Text style={styles.rowSub} numberOfLines={1}>{specialty}</Text>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </Section>
              ) : null}

              {(filter === 'all' || filter === 'appointments') && apptItems.length > 0 ? (
                <Section title="Appointments">
                  {apptItems.slice(0, PAGE_SIZE).map((a: any) => {
                    const appointmentId = a?.id != null ? String(a.id) : '';
                    const name =
                      `${a?.doctor?.firstName ?? ''} ${a?.doctor?.lastName ?? ''}`.trim() || 'Appointment';
                    if (!appointmentId) return null;
                    return (
                      <TouchableOpacity
                        key={appointmentId}
                        style={styles.row}
                        activeOpacity={0.75}
                        onPress={() => goAppointment(appointmentId)}
                      >
                        <View style={styles.rowIconCircle}>
                          <Icons.CalendarTodayIcon width={18} height={18} fill={Colors.primary} />
                        </View>
                        <View style={styles.rowTextCol}>
                          <Text style={styles.rowTitle} numberOfLines={1}>{name}</Text>
                          <Text style={styles.rowSub} numberOfLines={1}>
                            Status: {String(a?.status ?? '—')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </Section>
              ) : null}

              {(filter === 'all' || filter === 'reviews') && reviewItems.length > 0 ? (
                <Section title="Reviews" rightAction={{ label: 'See all', onPress: goReviews }}>
                  {reviewItems.map((r: any) => {
                    const id = r?.id != null ? String(r.id) : undefined;
                    const title =
                      String(r?.doctor?.fullName ?? r?.doctorName ?? 'Review').trim();
                    const body = String(r?.review ?? r?.comment ?? '').trim();
                    if (!id) return null;
                    return (
                      <TouchableOpacity
                        key={id}
                        style={styles.row}
                        activeOpacity={0.75}
                        onPress={goReviews}
                      >
                        <View style={styles.rowIconCircle}>
                          <Icons.StarFill1Icon width={18} height={18} fill={Colors.primary} />
                        </View>
                        <View style={styles.rowTextCol}>
                          <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
                          {body ? (
                            <Text style={styles.rowSub} numberOfLines={1}>{body}</Text>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </Section>
              ) : null}

              {(filter === 'all' || filter === 'medical') && medicalMatches.length > 0 ? (
                <Section title="Medical Info" rightAction={{ label: 'Open', onPress: goMedical }}>
                  {medicalMatches.slice(0, PAGE_SIZE).map((m: any) => {
                    const id = m?.id != null ? String(m.id) : undefined;
                    const title = String(m?.title ?? 'Report').trim();
                    const desc = String(m?.description ?? '').trim();
                    if (!id) return null;
                    return (
                      <TouchableOpacity
                        key={id}
                        style={styles.row}
                        activeOpacity={0.75}
                        onPress={goMedical}
                      >
                        <View style={styles.rowIconCircle}>
                          <Icons.Report width={18} height={18} fill={Colors.primary} />
                        </View>
                        <View style={styles.rowTextCol}>
                          <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
                          {desc ? <Text style={styles.rowSub} numberOfLines={1}>{desc}</Text> : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </Section>
              ) : null}

              {(filter === 'all' || filter === 'prescriptions') && prescriptionItems.length > 0 ? (
                <Section title="Prescriptions">
                  {prescriptionItems.map((p: any) => {
                    const id = p?.id != null ? String(p.id) : '';
                    const title = String(p?.doctorName ?? p?.doctor?.name ?? 'Prescription').trim();
                    if (!id) return null;
                    return (
                      <TouchableOpacity
                        key={id}
                        style={styles.row}
                        activeOpacity={0.75}
                        onPress={() => goPrescription(id)}
                      >
                        <View style={styles.rowIconCircle}>
                          <Icons.Report width={18} height={18} fill={Colors.primary} />
                        </View>
                        <View style={styles.rowTextCol}>
                          <Text style={styles.rowTitle} numberOfLines={1}>{title || 'Prescription'}</Text>
                          <Text style={styles.rowSub} numberOfLines={1}>Tap to view</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </Section>
              ) : null}

              {(filter === 'all' || filter === 'payments') && paymentItems.length > 0 ? (
                <Section title="Payments">
                  {paymentItems.map((p: any) => {
                    const id = p?.id != null ? String(p.id) : '';
                    const amount = p?.amount != null ? String(p.amount) : '';
                    if (!id) return null;
                    return (
                      <TouchableOpacity
                        key={id}
                        style={styles.row}
                        activeOpacity={0.75}
                        onPress={() => goPayment(id)}
                      >
                        <View style={styles.rowIconCircle}>
                          <Icons.LocalAtmIcon width={18} height={18} fill={Colors.primary} />
                        </View>
                        <View style={styles.rowTextCol}>
                          <Text style={styles.rowTitle} numberOfLines={1}>Payment</Text>
                          <Text style={styles.rowSub} numberOfLines={1}>
                            {amount ? `Amount: ${amount}` : 'Tap to view invoice'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </Section>
              ) : null}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  closeText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearText: {
    fontFamily: Fonts.openSans,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  filtersScroll: {
    maxHeight: 54,
  },
  filtersRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  chipActive: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  chipText: {
    fontFamily: Fonts.openSans,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#111827',
  },
  chipTextActive: {
    color: Colors.primary,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
  },
  hintWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 42,
    paddingHorizontal: 20,
  },
  hintTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  hintSub: {
    fontFamily: Fonts.openSans,
    fontSize: 14.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 42,
    gap: 10,
  },
  loadingText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#64748B',
  },
  section: {
    marginTop: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sectionAction: {
    fontFamily: Fonts.openSans,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  rowIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  rowSub: {
    fontFamily: Fonts.openSans,
    fontSize: 12.5,
    fontWeight: '400',
    color: '#64748B',
  },
});

