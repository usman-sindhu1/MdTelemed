import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';
import {
  CONTACT_SUPPORT_EMAIL,
  CONTACT_SUPPORT_PHONE_DISPLAY,
  CONTACT_SUPPORT_PHONE_TEL,
} from '../../constants/contactSupport';
import { publicPaths } from '../../constants/publicPaths';
import { publicPostJson } from '../../api/publicHttp';
import type { SubmitUserQueryBody, UserQueryRecord } from '../../types/userQuery';
import { showErrorToast, showSuccessToast } from '../../utils/appToast';
import { Svg, Path } from 'react-native-svg';
import axios from 'axios';

type ContactUsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'ContactUs'
>;

const LAYOUT_BREAKPOINT = 600;
const FORM_BG = '#F0F7FF';

/** Sent to API as `reason` (stable for admin filters). */
const CONTACT_REASONS: { label: string; value: string }[] = [
  { label: 'Billing', value: 'Billing' },
  { label: 'Appointments', value: 'Appointments' },
  { label: 'Technical support', value: 'Technical support' },
  { label: 'Account', value: 'Account' },
  { label: 'Other', value: 'Other' },
];

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

const ContactUs: React.FC = () => {
  const navigation = useNavigation<ContactUsNavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= LAYOUT_BREAKPOINT;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);

  const reasonLabel = useMemo(
    () => CONTACT_REASONS.find((r) => r.value === reason)?.label ?? '',
    [reason],
  );

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      isValidEmail(email) &&
      contact.trim().length > 0 &&
      reason.trim().length > 0 &&
      message.trim().length > 0 &&
      agreed
    );
  }, [name, email, contact, reason, message, agreed]);

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const submit = useCallback(async () => {
    if (!canSubmit || submitting) return;
    const body: SubmitUserQueryBody = {
      name: name.trim(),
      email: email.trim(),
      contact: contact.trim(),
      reason: reason.trim(),
      message: message.trim(),
    };
    try {
      setSubmitting(true);
      await publicPostJson<UserQueryRecord, SubmitUserQueryBody>(
        publicPaths.userQueries,
        body,
      );
      showSuccessToast(
        'Message sent',
        'We typically respond within 24 hours.',
      );
      setName('');
      setEmail('');
      setContact('');
      setReason('');
      setMessage('');
      setAgreed(false);
    } catch (e) {
      let detail = 'Please try again.';
      if (axios.isAxiosError(e)) {
        const data = e.response?.data as { message?: string } | undefined;
        if (data?.message) {
          detail = data.message;
        } else if (e.message) {
          detail = e.message;
        }
      } else if (e instanceof Error && e.message) {
        detail = e.message;
      }
      showErrorToast('Could not send message', detail);
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, submitting, name, email, contact, reason, message]);

  const leftColumn = (
    <View style={[styles.leftCol, isWide && styles.leftColWide]}>
      <View style={styles.badge}>
        <Icons.Chat1Icon width={14} height={14} fill="#FFFFFF" />
        <Text style={styles.badgeText}>Get in Touch</Text>
      </View>
      <Text style={styles.heroTitle}>Contact Support</Text>
      <Text style={styles.heroIntro}>
        Have questions? We’re here to help. Reach out to our team and we’ll get
        back to you as soon as possible. Your health is our priority.
      </Text>

      <TouchableOpacity
        style={styles.infoBlock}
        onPress={() => Linking.openURL(`mailto:${CONTACT_SUPPORT_EMAIL}`)}
        activeOpacity={0.75}
      >
        <View style={styles.infoIconSq}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4 6h16v12H4V6zm0 0l8 6 8-6"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <View style={styles.infoTextCol}>
          <Text style={styles.infoHeading}>Email Us</Text>
          <Text style={styles.infoPrimary}>{CONTACT_SUPPORT_EMAIL}</Text>
          <Text style={styles.infoMuted}>We’ll respond within 24 hours</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.infoBlock}
        onPress={() => Linking.openURL(`tel:${CONTACT_SUPPORT_PHONE_TEL}`)}
        activeOpacity={0.75}
      >
        <View style={styles.infoIconSq}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 006 6l1.5-2L21 14.5V18a2 2 0 01-2.2 2A17 17 0 013 5.2 2 2 0 015.2 3z"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <View style={styles.infoTextCol}>
          <Text style={styles.infoHeading}>Call Us</Text>
          <Text style={styles.infoPrimary}>{CONTACT_SUPPORT_PHONE_DISPLAY}</Text>
          <Text style={styles.infoMuted}>Available 24/7 for emergencies</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const formCard = (
    <View style={[styles.formCard, isWide && styles.formCardWide]}>
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Write here"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Write here"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Phone No.</Text>
        <TextInput
          style={styles.input}
          placeholder="Write here"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={contact}
          onChangeText={setContact}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Reason of Contacting</Text>
        <TouchableOpacity
          style={styles.selectOuter}
          onPress={() => setReasonModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text
            style={[styles.selectText, !reason && styles.selectPlaceholder]}
            numberOfLines={1}
          >
            {reason ? reasonLabel || reason : 'Write here'}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write here"
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
        />
      </View>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setAgreed(!agreed)}
        activeOpacity={0.8}
      >
        <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
          {agreed ? <Text style={styles.checkMark}>✓</Text> : null}
        </View>
        <Text style={styles.checkboxLabel}>
          I agree to the privacy policy and terms of service
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitBtn, (!canSubmit || submitting) && styles.submitBtnDisabled]}
        onPress={submit}
        disabled={!canSubmit || submitting}
        activeOpacity={0.85}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.submitBtnText}>Send Message</Text>
            <Text style={styles.submitArrow}>→</Text>
          </>
        )}
      </TouchableOpacity>
      <Text style={styles.formFooter}>We typically respond within 24 hours</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerContainer}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Icons.Back width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Support</Text>
          <View style={styles.headerIconButton} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.columns,
              isWide ? styles.columnsWide : styles.columnsNarrow,
            ]}
          >
            {leftColumn}
            {formCard}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={reasonModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReasonModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setReasonModalVisible(false)}
        >
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Reason of Contacting</Text>
            {CONTACT_REASONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={styles.modalRow}
                onPress={() => {
                  setReason(opt.value);
                  setReasonModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalRowText,
                    reason === opt.value && styles.modalRowTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setReasonModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
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
  headerIconButton: {
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingTop: 16,
  },
  columns: {
    gap: 22,
  },
  columnsWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  columnsNarrow: {
    flexDirection: 'column',
  },
  leftCol: {
    width: '100%',
  },
  leftColWide: {
    flex: 2,
    minWidth: 0,
    maxWidth: '100%',
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  heroIntro: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 22,
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 18,
  },
  infoIconSq: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextCol: {
    flex: 1,
    minWidth: 0,
  },
  infoHeading: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  infoPrimary: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoMuted: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  formCard: {
    width: '100%',
    backgroundColor: FORM_BG,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2EEF9',
  },
  formCardWide: {
    flex: 3,
    minWidth: 0,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: Colors.textPrimary,
    fontFamily: Fonts.openSans,
    fontSize: 15,
  },
  selectOuter: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 12,
  },
  selectPlaceholder: {
    color: '#9CA3AF',
  },
  chevron: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
    paddingBottom: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  submitBtn: {
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  formFooter: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 28,
    paddingTop: 12,
    maxHeight: '70%',
  },
  modalTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  modalRow: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  modalRowText: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  modalRowTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  modalCancel: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCancelText: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
});

export default ContactUs;
