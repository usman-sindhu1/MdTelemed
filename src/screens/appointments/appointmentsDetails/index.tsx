import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';
import AppointmentsInfo from './AppointmentsInfo';
import DoctorInfo from './DoctorInfo';
import PrescriptionContent from './PrescriptionContent';
import Conversation from './Conversation';
import LeaveReviewModal from './LeaveReviewModal';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import { useAppointmentDetailScreen } from '../../../hooks/useAppointmentDetailScreen';
import { useAppointmentChat } from '../../../hooks/useAppointmentChat';
import type { PatientAppointmentDetailPayload } from '../../../types/patientAppointments';
import type { RootState } from '../../../store';
import { patientPaths } from '../../../constants/patientPaths';
import { authorizedPostJson } from '../../../api/patientHttp';
import { mapChatRowsToUi } from '../../../utils/chatMessageUi';
import { isDoctorUserOnline } from '../../../utils/chatPresence';
import { generateAndSaveAppointmentPdf } from '../../../utils/appointmentPdfExport';
import { showErrorToast } from '../../../utils/appToast';

type MainTabType =
  | 'Appointment Info'
  | 'Doctor Info'
  | 'Prescriptions'
  | 'Messages';

type AppointmentDetailsNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'AppointmentDetails'
>;

type AppointmentDetailsRouteProp = RouteProp<
  AppointmentsStackParamList,
  'AppointmentDetails'
>;

/** Space reserved above safe area for stacked primary actions */
const BOTTOM_ACTIONS_BLOCK = 205;

function doctorDisplayName(
  doctor: PatientAppointmentDetailPayload['doctor'],
): string {
  if (!doctor) return 'Doctor';
  const fn = doctor.firstName?.trim() ?? '';
  const ln = doctor.lastName?.trim() ?? '';
  const full = [fn, ln].filter(Boolean).join(' ');
  return full || 'Doctor';
}

const AppointmentDetails: React.FC = () => {
  const navigation = useNavigation<AppointmentDetailsNavigationProp>();
  const route = useRoute<AppointmentDetailsRouteProp>();
  const appointmentId = route.params?.appointmentId;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<MainTabType>('Appointment Info');
  const [reviewOpen, setReviewOpen] = useState(false);
  const [pdfWorking, setPdfWorking] = useState(false);
  const tabsScrollViewRef = useRef<ScrollView>(null);
  const tabPositions = useRef<{ [key: string]: number }>({});

  const currentUserId = useSelector((s: RootState) => {
    const u = s.auth.user;
    if (u && typeof u === 'object' && 'id' in u) {
      return String((u as { id?: string }).id ?? '');
    }
    return '';
  });

  const {
    detail,
    isLoading,
    isFetching,
    refetch,
    therapistLoading,
    therapistData,
  } = useAppointmentDetailScreen(appointmentId);

  const messagesTabActive = activeTab === 'Messages';
  const { messagesQuery, onlineQuery, sendMutation } = useAppointmentChat(
    appointmentId,
    { enabled: messagesTabActive },
  );

  const mainTabs: MainTabType[] = [
    'Appointment Info',
    'Doctor Info',
    'Prescriptions',
    'Messages',
  ];

  const status = detail?.appointment?.status;
  const hasRating = detail?.rating != null;
  const canLeaveReview =
    !hasRating && (status === 'COMPLETED' || status === 'CONFIRMED');

  const chatMessages = messagesQuery.data?.messages ?? [];
  const chatUiMessages = useMemo(
    () => mapChatRowsToUi(chatMessages, currentUserId || undefined),
    [chatMessages, currentUserId],
  );

  const doctorChatUserId = detail?.doctor?.userId;
  const isDoctorOnline = isDoctorUserOnline(
    onlineQuery.data,
    doctorChatUserId,
  );

  const chatInactive = status === 'CANCELLED';
  const chatComposerHint = chatInactive
    ? 'Chat is not available for cancelled appointments.'
    : undefined;

  const scrollBottomPad = BOTTOM_ACTIONS_BLOCK + insets.bottom;

  const submitReviewMutation = useMutation({
    mutationFn: async (payload: { score: number; comment: string }) => {
      if (!appointmentId) {
        throw new Error('Missing appointment');
      }
      return authorizedPostJson<unknown, {
        appointmentId: string;
        score: number;
        comment?: string;
      }>(patientPaths.reviews, {
        appointmentId,
        score: payload.score,
        comment: payload.comment || undefined,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['patient-appointment-detail', appointmentId],
      });
      setReviewOpen(false);
      Alert.alert('Thank you', 'Your review was submitted.');
    },
    onError: (e: Error) => {
      Alert.alert(
        'Could not submit review',
        e.message ?? 'Please try again later.',
      );
    },
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleJoinSession = () => {
    navigation.navigate('JoinSession');
  };

  const handleDownloadPdf = useCallback(async () => {
    if (!appointmentId || !detail) {
      showErrorToast('Could not create PDF', 'Appointment data is not loaded yet.');
      return;
    }
    try {
      setPdfWorking(true);
      await generateAndSaveAppointmentPdf(detail, appointmentId);
    } catch (e) {
      showErrorToast(
        'Could not create PDF',
        (e as Error)?.message ?? 'Try again later.',
      );
    } finally {
      setPdfWorking(false);
    }
  }, [appointmentId, detail]);

  const handleLeaveReviewPress = () => {
    if (hasRating) {
      Alert.alert('Review', 'You have already submitted a review for this visit.');
      return;
    }
    if (!canLeaveReview) {
      Alert.alert(
        'Leave a review',
        'Reviews can be submitted for confirmed or completed appointments.',
      );
      return;
    }
    setReviewOpen(true);
  };

  const handleTabPress = (tab: MainTabType) => {
    setActiveTab(tab);
    setTimeout(() => {
      const tabPosition = tabPositions.current[tab];
      if (tabPosition !== undefined && tabsScrollViewRef.current) {
        const screenWidth = Dimensions.get('window').width;
        const scrollPosition = tabPosition - screenWidth / 2 + 80;
        tabsScrollViewRef.current.scrollTo({
          x: Math.max(0, scrollPosition),
          animated: true,
        });
      }
    }, 50);
  };

  const handleTabLayout = (
    tab: MainTabType,
    event: { nativeEvent: { layout: { x: number } } },
  ) => {
    const { x } = event.nativeEvent.layout;
    tabPositions.current[tab] = x;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Appointment Info':
        return (
          <AppointmentsInfo
            detail={detail}
            appointmentId={appointmentId}
            isLoading={isLoading}
          />
        );
      case 'Doctor Info':
        return (
          <DoctorInfo
            detail={detail}
            therapistData={therapistData}
            therapistLoading={therapistLoading}
            isLoading={isLoading}
          />
        );
      case 'Prescriptions':
        return (
          <PrescriptionContent
            isLoading={isLoading}
            prescription={detail?.prescription}
            medicines={detail?.medicines}
          />
        );
      case 'Messages':
        return null;
      default:
        return null;
    }
  };

  const titleBlock = (
    <View style={styles.mainSection}>
      <Text style={styles.title}>Details</Text>
      <Text style={styles.subtitle}>
        See appointment details and other details.
      </Text>
      <ScrollView
        ref={tabsScrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
        style={styles.tabsScrollView}
      >
        {mainTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => handleTabPress(tab)}
            onLayout={(e) => handleTabLayout(tab, e)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const bottomActions = useCallback(
    () => (
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <TouchableOpacity
          style={styles.actionOutlined}
          onPress={handleDownloadPdf}
          activeOpacity={0.8}
          disabled={pdfWorking || !detail}
        >
          {pdfWorking ? (
            <ActivityIndicator color={Colors.primary} size="small" />
          ) : (
            <Icons.ClipboardListSolidIcon width={18} height={18} />
          )}
          <Text style={styles.actionOutlinedText} numberOfLines={2}>
            Download Appointment PDF
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionOutlined,
            (!canLeaveReview || hasRating) && styles.actionDisabled,
          ]}
          onPress={handleLeaveReviewPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionOutlinedText}>Leave Review</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionPrimary}
          onPress={handleJoinSession}
          activeOpacity={0.85}
        >
          <Text style={styles.actionPrimaryText}>Join Appointment</Text>
        </TouchableOpacity>
      </View>
    ),
    [canLeaveReview, detail, hasRating, handleDownloadPdf, insets.bottom, pdfWorking],
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom']}
      key={appointmentId ?? 'appointment-detail'}
    >
      <View style={styles.headerBlock}>
        <View style={[styles.headerContent, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerActionsRow}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Icons.Vector1Icon width={22} height={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {activeTab === 'Messages' ? (
          <View style={styles.messagesLayout}>
            {titleBlock}
            <View style={styles.messagesFlex}>
              <Conversation
                doctorDisplayName={doctorDisplayName(detail?.doctor)}
                isOnline={isDoctorOnline}
                messages={chatUiMessages}
                messagesLoading={messagesQuery.isPending}
                onSend={(text) => {
                  if (!appointmentId || chatInactive) return;
                  sendMutation.mutate(text);
                }}
                sendPending={sendMutation.isPending}
                composerDisabled={chatInactive}
                composerHint={chatComposerHint}
              />
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: scrollBottomPad },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={() => refetch()}
                tintColor={Colors.primary}
              />
            }
          >
            {titleBlock}
            <View style={styles.content}>{renderTabContent()}</View>
          </ScrollView>
        )}
      </View>

      {activeTab !== 'Messages' ? bottomActions() : null}

      <LeaveReviewModal
        visible={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onSubmit={(rating, comment) => {
          if (!appointmentId) return;
          submitReviewMutation.mutate({ score: rating, comment });
        }}
        onSkip={() => {}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
  },
  messagesLayout: {
    flex: 1,
  },
  messagesFlex: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 15,
    paddingBottom: 4,
  },
  headerBlock: {
    backgroundColor: '#ECF2FD',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerContent: {
    paddingHorizontal: 15,
    paddingBottom: 14,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  mainSection: {
    paddingHorizontal: 15,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 16,
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 20,
  },
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingTop: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  actionOutlined: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  actionDisabled: {
    opacity: 0.55,
  },
  actionOutlinedText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    flexShrink: 1,
  },
  actionPrimary: {
    minHeight: 52,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  actionPrimaryText: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabsScrollView: {
    marginBottom: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 15,
    paddingBottom: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default AppointmentDetails;
