import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';
import { usePatientMedicalHistory } from '../../hooks/usePatientMedicalHistory';
import ShimmerBox from '../../components/common/ShimmerBox';
import type { PatientMedicalReport } from '../../types/patientMedicalHistory';
import { formatMedicalReportDate } from '../../utils/medicalHistoryDisplay';
import { showErrorToast } from '../../utils/appToast';

type MedicalInfoNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'MedicalInfo'
>;

function reportReasonText(
  report: PatientMedicalReport,
  globalReason: string | undefined | null,
): string {
  const d = report.description?.trim();
  if (d) return d;
  const g = globalReason?.trim();
  if (g) return g;
  return '—';
}

const ReportCard: React.FC<{
  report: PatientMedicalReport;
  globalReason: string | undefined | null;
  onViewReport: (url: string) => void;
}> = ({ report, globalReason, onViewReport }) => {
  const reason = reportReasonText(report, globalReason);
  const dateStr = formatMedicalReportDate(report.createdAt);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Icons.Report width={22} height={22} fill={Colors.primary} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle} numberOfLines={3}>
            {report.title?.trim() || 'Report'}
          </Text>
          <Text style={styles.cardDate}>{dateStr}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.reasonLabel}>Reason for appointment</Text>
      <Text style={styles.reasonBody}>{reason}</Text>
      <TouchableOpacity
        style={styles.viewLinkWrap}
        onPress={() => onViewReport(report.fileUrl)}
        activeOpacity={0.7}
      >
        <Text style={styles.viewLink}>View report</Text>
      </TouchableOpacity>
    </View>
  );
};

const ReportCardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <ShimmerBox width={48} height={48} borderRadius={24} />
      <View style={{ flex: 1, gap: 8 }}>
        <ShimmerBox height={18} borderRadius={6} width="90%" />
        <ShimmerBox height={14} borderRadius={5} width={120} />
      </View>
    </View>
    <View style={styles.divider} />
    <ShimmerBox height={12} borderRadius={4} width={140} style={{ marginBottom: 8 }} />
    <ShimmerBox height={16} borderRadius={6} width="100%" />
    <ShimmerBox height={14} borderRadius={4} width={80} style={{ alignSelf: 'flex-start', marginTop: 12 }} />
  </View>
);

const MedicalInfo: React.FC = () => {
  const navigation = useNavigation<MedicalInfoNavigationProp>();
  const insets = useSafeAreaInsets();
  const query = usePatientMedicalHistory();

  const medicalInfo = query.data?.medicalInfo ?? null;
  const reports = query.data?.reports ?? [];
  const globalReason = medicalInfo?.reasonForAppointment;

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const openReport = useCallback(async (url: string) => {
    try {
      const u = url?.trim();
      if (!u) {
        showErrorToast('Cannot open report', 'Missing file link.');
        return;
      }
      const supported = await Linking.canOpenURL(u);
      if (supported) {
        await Linking.openURL(u);
      } else {
        showErrorToast(
          'Cannot open link',
          'This file type may not be supported on your device.',
        );
      }
    } catch (e) {
      showErrorToast(
        'Could not open report',
        (e as Error)?.message ?? 'Try again later.',
      );
    }
  }, []);

  const showSkeleton = query.isPending;
  const showError = query.isError && !showSkeleton;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerBlock}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Icons.Back width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medical History</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching && !query.isPending}
            onRefresh={() => query.refetch()}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.inner}>
          <Text style={styles.pageTitle}>Full Medical History</Text>
          <Text style={styles.pageSubtitle}>
            All your medical history records.
          </Text>

          {showSkeleton ? (
            <View style={styles.skeletonStack}>
              {[0, 1, 2].map((i) => (
                <ReportCardSkeleton key={`mh-sk-${i}`} />
              ))}
            </View>
          ) : showError ? (
            <Text style={styles.errorText}>
              {(query.error as Error)?.message ??
                'Could not load medical history.'}
            </Text>
          ) : (
            <>
              {globalReason?.trim() && reports.length === 0 ? (
                <View style={styles.globalReasonCard}>
                  <Text style={styles.reasonLabel}>Reason for appointment</Text>
                  <Text style={styles.reasonBody}>{globalReason.trim()}</Text>
                  <Text style={styles.hintMuted}>
                    No report files uploaded yet. When your provider adds
                    reports, they will appear below.
                  </Text>
                </View>
              ) : null}

              {reports.map((report) => (
                <View key={report.id} style={styles.cardGap}>
                  <ReportCard
                    report={report}
                    globalReason={globalReason}
                    onViewReport={openReport}
                  />
                </View>
              ))}

              {reports.length === 0 && !globalReason?.trim() ? (
                <Text style={styles.emptyText}>No reports yet.</Text>
              ) : null}
            </>
          )}
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
    paddingTop: 20,
  },
  pageTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECF1',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardGap: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  cardDate: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  reasonLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  reasonBody: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  viewLinkWrap: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingVertical: 4,
  },
  viewLink: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  globalReasonCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  hintMuted: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#64748B',
    marginTop: 12,
    lineHeight: 20,
  },
  skeletonStack: {
    gap: 14,
  },
  emptyText: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  errorText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export default MedicalInfo;
