import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  CommonActions,
} from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import BookingProgressCard from '../components/booking/BookingProgressCard';
import Input from '../components/Input';
import PhoneInput from '../components/PhoneInput';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Icons from '../assets/svg';
import type { DrawerParamList } from '../navigation/HomeStackRoot';
import { postCreateAppointment } from '../api/appointmentsApi';
import { buildCreateAppointmentBody } from '../utils/buildCreateAppointmentBody';
import { usePatientSubscription } from '../hooks/usePatientSubscription';
import { invalidatePatientAppointmentCaches } from '../hooks/useHomeUpcomingAppointments';
import { getData } from '../utils/storage';
import { showErrorToast, showSuccessToast } from '../utils/appToast';
import { patientPatchJson } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import { usePatientMe, type PatientMePayload } from '../hooks/usePatientMe';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { nationalDigitsFromStoredPhone } from '../utils/phoneNationalDigits';
import DocumentPicker from 'react-native-document-picker';
import { uploadPickedReportFile } from '../utils/reportUpload';
import type {
  AppointmentCallTypeApi,
  AppointmentForApi,
  PatientGenderApi,
  PatientPriorityApi,
  PaymentOptionApi,
} from '../types/createAppointment';

function pickString(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  return s ? s : undefined;
}

function normalizePatientMePayload(raw: unknown): PatientMePayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const u =
    r.user && typeof r.user === 'object' ? (r.user as Record<string, unknown>) : null;
  return {
    firstName: pickString(r.firstName) ?? pickString(u?.firstName) ?? null,
    lastName: pickString(r.lastName) ?? pickString(u?.lastName) ?? null,
    email: pickString(r.email) ?? pickString(u?.email) ?? null,
    phone: pickString(r.phone) ?? pickString(u?.phone) ?? null,
    address: pickString(r.address) ?? pickString(u?.address) ?? null,
  };
}

function digitsOnly(v: unknown): string {
  if (typeof v !== 'string') return '';
  return v.replace(/[^0-9]/g, '');
}

function nationalDigitsFromAnyPhone(raw: unknown, ccDigits: string): string {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  const digits = digitsOnly(trimmed);
  const cc = digitsOnly(ccDigits);
  if (!digits) return '';
  // If stored as E.164 (`+<cc><national>`), prefer the shared helper.
  const fromE164 = nationalDigitsFromStoredPhone(trimmed || undefined, cc);
  if (trimmed.startsWith('+')) return fromE164;
  // Some backends store as digits without `+` — still strip the country code.
  if (cc && digits.startsWith(cc) && digits.length > cc.length + 6) {
    return digits.slice(cc.length);
  }
  return digits;
}

function normalizeAuthUserToMePayload(authUser: unknown): PatientMePayload | null {
  if (!authUser || typeof authUser !== 'object') return null;
  const root = authUser as Record<string, unknown>;
  const nested =
    root.user && typeof root.user === 'object'
      ? (root.user as Record<string, unknown>)
      : null;
  const u = nested ?? root;
  const full =
    typeof u.name === 'string' ? u.name.trim().split(/\s+/) : [];
  const first =
    typeof u.firstName === 'string' ? u.firstName : full[0] || '';
  const last =
    typeof u.lastName === 'string' ? u.lastName : full.slice(1).join(' ') || '';
  const email = typeof u.email === 'string' ? u.email : '';
  const storedPhone =
    typeof u.phone === 'string' || typeof u.phone === 'number'
      ? String(u.phone)
      : typeof u.phoneNumber === 'string' || typeof u.phoneNumber === 'number'
        ? String(u.phoneNumber)
        : typeof u.mobile === 'string' || typeof u.mobile === 'number'
          ? String(u.mobile)
          : typeof u.phoneNational === 'string' || typeof u.phoneNational === 'number'
            ? String(u.phoneNational)
            : typeof root.phone === 'string' || typeof root.phone === 'number'
              ? String(root.phone)
              : typeof root.phoneNumber === 'string' || typeof root.phoneNumber === 'number'
                ? String(root.phoneNumber)
                : typeof root.mobile === 'string' || typeof root.mobile === 'number'
                  ? String(root.mobile)
                  : typeof root.phoneNational === 'string' || typeof root.phoneNational === 'number'
                    ? String(root.phoneNational)
                    : typeof (root.profile as any)?.phone === 'string' || typeof (root.profile as any)?.phone === 'number'
                      ? String((root.profile as any).phone)
            : '';
  const phone = nationalDigitsFromAnyPhone(storedPhone, '92');
  const address = typeof u.address === 'string' ? u.address : '';
  const hasAny =
    Boolean(first.trim()) ||
    Boolean(last.trim()) ||
    Boolean(email.trim()) ||
    Boolean(phone.trim()) ||
    Boolean(address.trim());
  if (!hasAny) return null;
  return {
    firstName: first.trim() || null,
    lastName: last.trim() || null,
    email: email.trim() || null,
    phone: phone.trim() || null,
    address: address.trim() || null,
  };
}

const STEPS = 3;
const INPUT_LABEL_COLOR = Colors.primary ?? '#2563EB';
const PLACEHOLDER_COLOR = '#BDBDBD';
const INPUT_SURFACE = '#FFFFFF';

type Route = RouteProp<DrawerParamList, 'BookApptBookingFlow'>;
type CallTab = 'CHAT' | 'AUDIO' | 'VIDEO';
type PayTab = 'onetime' | 'subscription';

function mapBookingFor(label: string): AppointmentForApi | null {
  if (label === 'Myself') return 'ME';
  if (label === 'Someone else') return 'SOMEONE_ELSE';
  return null;
}

function mapPriority(label: string): PatientPriorityApi | null {
  const m: Record<string, PatientPriorityApi> = {
    High: 'HIGH',
    Medium: 'MEDIUM',
    Low: 'LOW',
  };
  return m[label] ?? null;
}

function mapGender(label: string): PatientGenderApi | null {
  const m: Record<string, PatientGenderApi> = {
    Male: 'MALE',
    Female: 'FEMALE',
    Other: 'OTHER',
  };
  return m[label] ?? null;
}

const BookApptBookingFlow: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const queryClient = useQueryClient();
  const authUser = useSelector((s: RootState) => s.auth.user);
  const mode = route.params?.mode ?? 'see_doctor_now';
  const selectedDoctor = route.params?.selectedDoctor;
  const timeSlotId = route.params?.timeSlotId;
  const flowId = route.params?.flowId;
  const lastFlowIdRef = React.useRef<string | undefined>(undefined);

  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bookingFor, setBookingFor] = useState('');
  const [bookingForOpen, setBookingForOpen] = useState(false);
  const [priority, setPriority] = useState('');
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [someoneGender, setSomeoneGender] = useState('');
  const [genderOpen, setGenderOpen] = useState(false);

  const [someoneAge, setSomeoneAge] = useState('');

  const [reportName, setReportName] = useState<string | null>(null);
  const [reportFileUrl, setReportFileUrl] = useState<string | null>(null);
  const [reportUploading, setReportUploading] = useState(false);
  const [callType, setCallType] = useState<CallTab>('VIDEO');
  const [reason, setReason] = useState('');

  const [payTab, setPayTab] = useState<PayTab>('onetime');

  const percent = (step / STEPS) * 100;

  useEffect(() => {
    // When starting a NEW booking attempt (new route param), reset local form state.
    if (!flowId) return;
    if (lastFlowIdRef.current === flowId) return;
    lastFlowIdRef.current = flowId;

    setStep(1);
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setBookingFor('');
    setBookingForOpen(false);
    setPriority('');
    setPriorityOpen(false);
    setSomeoneGender('');
    setGenderOpen(false);
    setSomeoneAge('');
    setReportName(null);
    setReportFileUrl(null);
    setReportUploading(false);
    setCallType('VIDEO');
    setReason('');
    setPayTab('onetime');
  }, [flowId]);

  const bookingForApi = useMemo(() => mapBookingFor(bookingFor), [bookingFor]);
  const shouldLoadMeProfile = step === 1 && bookingForApi === 'ME';

  const authMe = useMemo(
    () => normalizeAuthUserToMePayload(authUser),
    [authUser],
  );

  // Only fetch `/me` if redux user is missing (matches Profile Settings behavior).
  const needsMeRefresh = shouldLoadMeProfile && (!authMe || !authMe.phone);
  const meQuery = usePatientMe(needsMeRefresh);
  const me = useMemo(() => normalizePatientMePayload(meQuery.data), [meQuery.data]);
  const meLoading = meQuery.isFetching && !meQuery.data;
  const meLoadError = meQuery.isError;

  const mergedMe = useMemo((): PatientMePayload | null => {
    if (!authMe && !me) return null;
    const pick = (a: unknown, b: unknown) => {
      const bb = typeof b === 'string' ? b.trim() : b;
      if (typeof bb === 'string' ? bb.length > 0 : bb != null) return b as any;
      const aa = typeof a === 'string' ? a.trim() : a;
      if (typeof aa === 'string' ? aa.length > 0 : aa != null) return a as any;
      return null;
    };
    return {
      firstName: pick(me?.firstName, authMe?.firstName),
      lastName: pick(me?.lastName, authMe?.lastName),
      email: pick(me?.email, authMe?.email),
      phone: pick(me?.phone, authMe?.phone),
      address: pick(me?.address, authMe?.address),
    };
  }, [authMe, me]);

  const [meBase, setMeBase] = useState<PatientMePayload | null>(null);

  useEffect(() => {
    if (!shouldLoadMeProfile) return;
    const src = mergedMe;
    if (!src) return;
    setMeBase({
      firstName: src.firstName ?? '',
      lastName: src.lastName ?? '',
      email: src.email ?? '',
      phone: src.phone ?? '',
      address: src.address ?? '',
    });
    setFirstName(src.firstName ?? '');
    setLastName(src.lastName ?? '');
    setEmail(src.email ?? '');
    setPhone(src.phone ?? '');
    setAddress(src.address ?? '');
  }, [shouldLoadMeProfile, mergedMe]);

  useEffect(() => {
    if (!shouldLoadMeProfile) return;
    if (!meLoadError) return;
    if (authMe?.phone) return;
    const msg =
      meQuery.error instanceof Error ? meQuery.error.message : 'Could not load your profile';
    showErrorToast('Could not fetch profile', msg);
  }, [shouldLoadMeProfile, meLoadError, meQuery.error, authMe?.phone]);

  useEffect(() => {
    if (bookingForApi !== 'SOMEONE_ELSE') return;
    // Someone else: clear patient fields for manual entry.
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setSomeoneGender('');
    setSomeoneAge('');
  }, [bookingForApi]);

  const patchMeMut = useMutation({
    mutationFn: (body: PatientMePayload) =>
      patientPatchJson<unknown, PatientMePayload>(patientPaths.me, body),
  });

  const {
    data: subscriptionPayload,
    isLoading: subscriptionLoading,
    isError: subscriptionQueryError,
  } = usePatientSubscription(step === 3);

  const subscriptionBadge = useMemo(() => {
    if (subscriptionLoading) {
      return 'Checking subscription…';
    }
    if (subscriptionQueryError || !subscriptionPayload) {
      return 'No usable subscription';
    }
    const sub = subscriptionPayload;
    const remaining = sub.remainingAppointments;
    const remainingNum =
      typeof remaining === 'number'
        ? remaining
        : remaining != null
          ? Number(remaining)
          : NaN;
    const usable =
      sub.hasUsableSubscription === true ||
      (sub.hasSubscription === true &&
        Number.isFinite(remainingNum) &&
        remainingNum > 0);
    if (usable && Number.isFinite(remainingNum)) {
      return `Included visits left: ${remainingNum}`;
    }
    return 'No usable subscription';
  }, [subscriptionLoading, subscriptionQueryError, subscriptionPayload]);

  const exitFlow = useCallback(() => {
    if (mode === 'book_later' && selectedDoctor) {
      (navigation as unknown as { navigate: (n: string, p?: object) => void }).navigate(
        'BookApptSelectTimeslot',
        {
          selectedDoctor,
          source: 'bookingFlow',
          bookingMode: 'later',
        },
      );
      return;
    }
    (navigation as unknown as { navigate: (n: string, p?: object) => void }).navigate(
      'MainTabs',
      { screen: 'Home' },
    );
  }, [mode, navigation, selectedDoctor]);

  const createMut = useMutation({
    mutationFn: postCreateAppointment,
    onSuccess: async (data) => {
      invalidatePatientAppointmentCaches(queryClient);
      const checkout = data?.checkoutSession;
      const url =
        checkout?.checkoutSessionUrl != null &&
        typeof checkout.checkoutSessionUrl === 'string'
          ? checkout.checkoutSessionUrl
          : null;
      if (url) {
        const cleanUrl = url.trim();
        (navigation as unknown as { navigate: (n: keyof DrawerParamList, p?: object) => void }).navigate(
          'StripeCheckout',
          { checkoutUrl: cleanUrl },
        );
        return;
      }
      showSuccessToast('Appointment booked', 'No checkout required.');
      (navigation as unknown as { navigate: (n: string, p?: object) => void }).navigate(
        'MainTabs',
        { screen: 'Calendar' },
      );
    },
    onError: (err: unknown) => {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Could not create appointment';
      showErrorToast(msg);
    },
  });

  const handleBackPress = () => {
    if (step > 1) {
      setStep((s) => s - 1);
      return;
    }
    exitFlow();
  };

  const validateStep1 = (): boolean => {
    if (!firstName.trim()) {
      showErrorToast('Enter first name');
      return false;
    }
    if (!lastName.trim()) {
      showErrorToast('Enter last name');
      return false;
    }
    if (!phone.trim()) {
      showErrorToast('Enter phone number');
      return false;
    }
    if (!email.trim()) {
      showErrorToast('Enter email');
      return false;
    }
    if (!bookingFor) {
      showErrorToast('Choose booking for');
      return false;
    }
    const af = mapBookingFor(bookingFor);
    if (!af) {
      showErrorToast('Choose booking for');
      return false;
    }
    if (!priority) {
      showErrorToast('Choose priority');
      return false;
    }
    if (!mapPriority(priority)) {
      showErrorToast('Choose priority');
      return false;
    }
    if (af === 'SOMEONE_ELSE') {
      if (!someoneGender) {
        showErrorToast('Choose patient gender');
        return false;
      }
      if (!mapGender(someoneGender)) {
        showErrorToast('Choose patient gender');
        return false;
      }
      const age = parseInt(someoneAge.trim(), 10);
      if (
        !someoneAge.trim() ||
        Number.isNaN(age) ||
        age < 1 ||
        age > 150
      ) {
        showErrorToast('Enter a valid patient age');
        return false;
      }
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!reason.trim()) {
      showErrorToast('Reason required', 'Describe why you need this visit.');
      return false;
    }
    return true;
  };

  const handlePickAndUploadReport = async () => {
    if (reportUploading) return;
    const token = await getData<string>('accessToken');
    if (!token?.trim()) {
      showErrorToast('Sign in required', 'Log in to upload a medical report.');
      return;
    }
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });
      const file = results?.[0];
      if (!file?.uri) return;
      const name = file.name ?? 'medical-report';
      const type = file.type ?? 'application/octet-stream';
      setReportUploading(true);
      const uploaded = await uploadPickedReportFile({
        uri: file.uri,
        name,
        type,
        sizeBytes: typeof file.size === 'number' ? file.size : undefined,
      });
      setReportName(name);
      setReportFileUrl(uploaded.fileUrl);
      showSuccessToast('Report uploaded', 'We’ll attach it to your booking.');
    } catch (err: unknown) {
      if (DocumentPicker.isCancel(err)) return;
      const msg = err instanceof Error ? err.message : 'Could not upload report';
      showErrorToast('Upload failed', msg);
    } finally {
      setReportUploading(false);
    }
  };

  const handleRemoveReport = () => {
    setReportName(null);
    setReportFileUrl(null);
  };

  const validateBookingReady = (): boolean => {
    if (mode === 'book_later') {
      if (selectedDoctor?.id == null) {
        showErrorToast('Missing doctor', 'Pick a clinician and timeslot again.');
        return false;
      }
      if (!timeSlotId?.trim()) {
        showErrorToast(
          'Missing timeslot',
          'Go back and choose a valid date and time slot.',
        );
        return false;
      }
    }
    return validateStep1() && validateStep2();
  };

  const submitAppointment = async () => {
    if (!validateBookingReady()) {
      return;
    }
    const token = await getData<string>('accessToken');
    if (!token?.trim()) {
      showErrorToast('Sign in required', 'Log in to book an appointment.');
      return;
    }
    const af = mapBookingFor(bookingFor);
    const pr = mapPriority(priority);
    if (!af || !pr) {
      showErrorToast('Complete all required fields');
      return;
    }
    const genderApi =
      af === 'SOMEONE_ELSE' ? mapGender(someoneGender) : undefined;
    const ageParsed =
      af === 'SOMEONE_ELSE' ? parseInt(someoneAge.trim(), 10) : undefined;
    const paymentOption: PaymentOptionApi =
      payTab === 'onetime' ? 'SINGLE_APPOINTMENT' : 'SUBSCRIPTION';

    const body = buildCreateAppointmentBody({
      mode,
      doctorUserId:
        selectedDoctor?.id != null
          ? String(selectedDoctor.id)
          : undefined,
      timeSlotId: timeSlotId?.trim(),
      appointmentCallType: callType as AppointmentCallTypeApi,
      patientPriority: pr,
      paymentOption,
      appointmentFor: af,
      patientFirstName: firstName,
      patientLastName: lastName,
      patientPhone: phone,
      patientGender:
        af === 'SOMEONE_ELSE' ? genderApi ?? undefined : undefined,
      patientAge:
        af === 'SOMEONE_ELSE' &&
        typeof ageParsed === 'number' &&
        !Number.isNaN(ageParsed)
          ? ageParsed
          : undefined,
      reasonForAppointment: reason,
      reports:
        reportFileUrl && reportName
          ? [{ title: reportName, description: '', fileUrl: reportFileUrl }]
          : undefined,
    });

    createMut.mutate(body);
  };

  const handlePrimary = async () => {
    if (createMut.isPending) {
      return;
    }
    if (step < STEPS) {
      if (step === 1 && !validateStep1()) {
        return;
      }
      if (step === 2 && !validateStep2()) {
        return;
      }
      if (step === 1 && bookingForApi === 'ME') {
        const token = await getData<string>('accessToken');
        if (!token?.trim()) {
          showErrorToast('Sign in required', 'Log in to use your saved profile.');
          return;
        }
        if (meLoading) {
          showErrorToast('Loading profile…', 'Please wait a moment.');
          return;
        }
        const base = meBase ?? {};
        const patch: PatientMePayload = {};
        const fn = firstName.trim();
        const ln = lastName.trim();
        const em = email.trim();
        const ph = phone.trim();
        const addr = address.trim();
        if ((base.firstName ?? '') !== fn) patch.firstName = fn;
        if ((base.lastName ?? '') !== ln) patch.lastName = ln;
        if ((base.email ?? '') !== em) patch.email = em;
        if ((base.phone ?? '') !== ph) patch.phone = ph;
        if ((base.address ?? '') !== addr) patch.address = addr;
        const hasChanges = Object.keys(patch).length > 0;
        if (hasChanges) {
          try {
            await patchMeMut.mutateAsync(patch);
            setMeBase({
              firstName: fn,
              lastName: ln,
              email: em,
              phone: ph,
              address: addr,
            });
          } catch (e: unknown) {
            const msg =
              e instanceof Error ? e.message : 'Could not update profile';
            showErrorToast('Profile update failed', msg);
            return;
          }
        }
      }
      setStep((s) => s + 1);
      return;
    }
    await submitAppointment();
  };

  const handleCancel = () => {
    if (createMut.isPending) {
      return;
    }
    // On step 3 (payment), "Cancel" should exit the flow completely.
    if (step === 3) {
      (navigation as any).dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
        }),
      );
      return;
    }
    if (step > 1) {
      setStep((s) => s - 1);
      return;
    }
    exitFlow();
  };

  const isSomeoneElse = bookingFor === 'Someone else';

  const renderStep1 = () => (
    <>
      <Text style={styles.stepHeading}>Personal information</Text>
      <Text style={styles.stepHint}>
        Tell us who this visit is for. All fields are required before you can
        continue.
      </Text>
      <View style={styles.field}>
        <Text style={[styles.selectLabel, styles.inputLabel]}>Booking for</Text>
        <TouchableOpacity
          style={styles.selectOuter}
          onPress={() => {
            setBookingForOpen(!bookingForOpen);
            setPriorityOpen(false);
            setGenderOpen(false);
          }}
          activeOpacity={0.85}
        >
          <Text style={[styles.selectText, !bookingFor && styles.selectPlaceholder]}>
            {bookingFor || 'Write here'}
          </Text>
          <Text style={styles.chev}>▾</Text>
        </TouchableOpacity>
        {bookingForOpen ? (
          <View style={styles.dropdown}>
            {['Myself', 'Someone else'].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownRow}
                onPress={() => {
                  setBookingFor(opt);
                  setBookingForOpen(false);
                }}
              >
                <Text style={styles.dropdownRowText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
        {bookingForApi === 'ME' && meLoading ? (
          <View style={styles.inlineLoadingRow}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.inlineLoadingText}>Fetching your profile…</Text>
          </View>
        ) : null}
        {bookingForApi === 'ME' && !authMe?.phone && meLoadError ? (
          <Text style={styles.inlineErrorText}>
            Could not load your profile. Please type your details manually.
          </Text>
        ) : null}
      </View>
      <Input
        label="First name"
        placeholder="Write here"
        placeholderTextColor={PLACEHOLDER_COLOR}
        labelStyle={styles.inputLabel}
        style={styles.inputSurface}
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        editable={!meLoading}
      />
      <Input
        label="Last name"
        placeholder="Write here"
        placeholderTextColor={PLACEHOLDER_COLOR}
        labelStyle={styles.inputLabel}
        style={styles.inputSurface}
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        editable={!meLoading}
      />
      <View style={styles.phoneFieldWrapper}>
        <Text style={[styles.phoneLabel, styles.inputLabel]}>Phone number</Text>
        <PhoneInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Write here"
          separateInputs
          editable={!meLoading}
        />
      </View>
      <Input
        label="Email"
        placeholder="Write here"
        placeholderTextColor={PLACEHOLDER_COLOR}
        labelStyle={styles.inputLabel}
        style={styles.inputSurface}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!meLoading}
      />
      <View style={styles.field}>
        <Text style={[styles.selectLabel, styles.inputLabel]}>Priority</Text>
        <TouchableOpacity
          style={styles.selectOuter}
          onPress={() => {
            setPriorityOpen(!priorityOpen);
            setBookingForOpen(false);
            setGenderOpen(false);
          }}
          activeOpacity={0.85}
        >
          <Text style={[styles.selectText, !priority && styles.selectPlaceholder]}>
            {priority || 'Write here'}
          </Text>
          <Text style={styles.chev}>▾</Text>
        </TouchableOpacity>
        {priorityOpen ? (
          <View style={styles.dropdown}>
            {['High', 'Medium', 'Low'].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownRow}
                onPress={() => {
                  setPriority(opt);
                  setPriorityOpen(false);
                }}
              >
                <Text style={styles.dropdownRowText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
      {isSomeoneElse ? (
        <View style={styles.field}>
          <Text style={[styles.selectLabel, styles.inputLabel]}>
            Patient gender
          </Text>
          <TouchableOpacity
            style={styles.selectOuter}
            onPress={() => {
              setGenderOpen(!genderOpen);
              setBookingForOpen(false);
              setPriorityOpen(false);
            }}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.selectText,
                !someoneGender && styles.selectPlaceholder,
              ]}
            >
              {someoneGender || 'Write here'}
            </Text>
            <Text style={styles.chev}>▾</Text>
          </TouchableOpacity>
          {genderOpen ? (
            <View style={styles.dropdown}>
              {['Male', 'Female', 'Other'].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.dropdownRow}
                  onPress={() => {
                    setSomeoneGender(opt);
                    setGenderOpen(false);
                  }}
                >
                  <Text style={styles.dropdownRowText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
          <Input
            label="Patient age"
            placeholder="Write here"
            placeholderTextColor={PLACEHOLDER_COLOR}
            labelStyle={styles.patientAgeLabel}
            style={styles.inputSurface}
            value={someoneAge}
            onChangeText={setSomeoneAge}
            keyboardType="number-pad"
          />
        </View>
      ) : null}
      <Input
        label="Address"
        placeholder="Write here"
        placeholderTextColor={PLACEHOLDER_COLOR}
        labelStyle={styles.inputLabel}
        style={styles.inputSurface}
        value={address}
        onChangeText={setAddress}
        multiline
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepHeading}>Medical information</Text>
      <Text style={styles.stepHint}>
        Optional report upload — attach a PDF or image from your phone.
      </Text>
      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={reportFileUrl ? handleRemoveReport : handlePickAndUploadReport}
        activeOpacity={0.85}
        disabled={reportUploading}
      >
        <Icons.Report width={22} height={22} />
        <Text style={styles.uploadBtnText}>
          {reportUploading
            ? 'Uploading…'
            : reportName && reportFileUrl
              ? `Uploaded: ${reportName} (tap to remove)`
              : 'Medical report upload (optional)'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subheading}>Appointment call type</Text>
      <View style={styles.tabRow}>
        {(
          [
            ['CHAT', 'Chat'] as const,
            ['AUDIO', 'Audio'] as const,
            ['VIDEO', 'Video'] as const,
          ] as const
        ).map(([key, label]) => {
          const active = callType === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.tabPill, active && styles.tabPillActive]}
              onPress={() => setCallType(key)}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabPillText, active && styles.tabPillTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Input
        label="Reason for this appointment"
        placeholder="Write here"
        placeholderTextColor={PLACEHOLDER_COLOR}
        labelStyle={styles.inputLabel}
        style={[styles.inputSurface, styles.step2FieldTop]}
        value={reason}
        onChangeText={setReason}
        multiline
      />
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.stepHeading}>Payment information</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Payment summary</Text>
        <Text style={styles.summaryBody}>
          We check your subscription and apply it automatically if available.
        </Text>
        <View style={styles.badgeMuted}>
          <Text style={styles.badgeMutedText}>{subscriptionBadge}</Text>
        </View>
      </View>
      <Text style={styles.subheading}>Choose how to pay</Text>
      <TouchableOpacity
        style={[styles.payOption, payTab === 'onetime' && styles.payOptionOn]}
        onPress={() => setPayTab('onetime')}
        activeOpacity={0.9}
        disabled={createMut.isPending}
      >
        <Icons.ServiceIcon width={26} height={26} />
        <View style={{ flex: 1 }}>
          <Text style={styles.payOptionTitle}>One-time payment</Text>
          <Text style={styles.payOptionSub}>Pay for this visit only</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.payOption, payTab === 'subscription' && styles.payOptionOn]}
        onPress={() => setPayTab('subscription')}
        activeOpacity={0.9}
        disabled={createMut.isPending}
      >
        <Icons.CalendarClockIcon width={26} height={26} />
        <View style={{ flex: 1 }}>
          <Text style={styles.payOptionTitle}>Get subscription</Text>
          <Text style={styles.payOptionSub}>
            Uses subscription allowance when available ($90 checkout otherwise).
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );

  const primaryTitle =
    step === STEPS
      ? 'Save draft & Continue to Payment'
      : 'Save draft & continue';

  return (
    <View style={styles.container}>
      <SimpleBackHeader
        title="Book Appt."
        onBackPress={handleBackPress}
        backgroundColor="#ECF2FD"
        bottomRadius={24}
      />

      <View style={styles.progressWrap}>
        <BookingProgressCard
          subtitle="Booking progress"
          percent={percent}
          dotCount={STEPS}
          activeDotIndex={step - 1}
          timeLabel="~15 min"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {mode === 'see_doctor_now' ? (
          <Text style={styles.ctxLine}>
            Immediate visit — server assigns the next opening.
          </Text>
        ) : null}

        <Text style={styles.kicker}>{`Step ${step} of ${STEPS}`}</Text>

        {step === 1 ? renderStep1() : null}
        {step === 2 ? renderStep2() : null}
        {step === 3 ? renderStep3() : null}

        <View style={styles.dualActions}>
          <TouchableOpacity
            style={[styles.btnGhost, createMut.isPending && styles.btnMuted]}
            onPress={handleCancel}
            disabled={createMut.isPending}
          >
            <Text style={styles.btnGhostText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnPrimary,
              createMut.isPending && styles.btnMuted,
            ]}
            onPress={() => void handlePrimary()}
            disabled={createMut.isPending}
          >
            {createMut.isPending && step === STEPS ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnPrimaryText}>{primaryTitle}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  progressWrap: {
    marginTop: -40,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'stretch',
    width: '100%',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
    gap: 18,
  },
  ctxLine: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 0,
  },
  patientAgeLabel: {
    color: INPUT_LABEL_COLOR,
    marginTop: 14,
  },
  inputLabel: {
    color: INPUT_LABEL_COLOR,
  },
  inputSurface: {
    backgroundColor: INPUT_SURFACE,
  },
  phoneFieldWrapper: {
    width: '100%',
  },
  phoneLabel: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  step2FieldTop: {
    marginTop: 0,
  },
  kicker: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary ?? '#2563EB',
    marginBottom: 0,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  stepHeading: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 0,
  },
  stepHint: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 0,
  },
  subheading: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 18,
    marginBottom: 10,
  },
  field: { marginBottom: 0 },
  selectLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  selectOuter: {
    minHeight: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: INPUT_SURFACE,
  },
  selectText: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    color: Colors.inputText,
    flex: 1,
    paddingVertical: 12,
  },
  inlineLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  inlineLoadingText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#64748B',
  },
  inlineErrorText: {
    marginTop: 10,
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#B45309',
    paddingHorizontal: 4,
  },
  selectPlaceholder: { color: PLACEHOLDER_COLOR },
  chev: { fontSize: 14, color: PLACEHOLDER_COLOR, marginLeft: 8 },
  dropdown: {
    marginTop: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    overflow: 'hidden',
    backgroundColor: INPUT_SURFACE,
  },
  dropdownRow: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  dropdownRowText: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    color: '#111827',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary ?? '#2563EB',
    padding: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
  },
  uploadBtnText: {
    flex: 1,
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary ?? '#2563EB',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tabPill: {
    flex: 1,
    minWidth: 88,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabPillActive: {
    borderColor: Colors.primary ?? '#2563EB',
    backgroundColor: '#ECF2FD',
  },
  tabPillText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabPillTextActive: {
    color: '#1D4ED8',
  },
  summaryCard: {
    borderRadius: 16,
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#E2EEF9',
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  summaryTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryBody: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  badgeMuted: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  badgeMutedText: {
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  payOptionOn: {
    borderColor: Colors.primary ?? '#2563EB',
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
  },
  payOptionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  payOptionSub: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#64748B',
  },
  dualActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    marginBottom: 8,
  },
  btnMuted: {
    opacity: 0.65,
  },
  btnGhost: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  btnPrimary: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: Colors.primary ?? '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  btnPrimaryText: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default BookApptBookingFlow;
