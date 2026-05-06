import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  RefreshControl,
  ListRenderItem,
  Dimensions,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppointmentsStackParamList } from '../../navigation/HomeStack';
import HomeHeader from '../../components/common/HomeHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import ShimmerBox from '../../components/common/ShimmerBox';
import InitialsAvatar from '../../components/common/InitialsAvatar';
import { useScrollContext } from '../../contexts/ScrollContext';
import { invalidatePatientAppointmentCaches } from '../../hooks/useHomeUpcomingAppointments';
import {
  usePatientAppointmentsList,
  type AppointmentListRow,
} from '../../hooks/usePatientAppointmentsList';
import type {
  AppointmentsTab,
  BadgeTone,
} from '../../utils/appointmentStatusUi';

type AppointmentsNavigationProp = NativeStackNavigationProp<AppointmentsStackParamList>;

const TAB_OPTIONS: { key: AppointmentsTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'missed', label: 'Missed' },
];

const EMPTY_COPY: Record<AppointmentsTab, string> = {
  all: 'No appointments yet.',
  upcoming: 'No upcoming appointments.',
  pending: 'No pending appointments.',
  completed: 'No completed appointments.',
  cancelled: 'No cancelled appointments.',
  missed: 'No missed appointments.',
};

const SKELETON_ROWS = 3;

function badgeToneToStyle(tone: BadgeTone) {
  switch (tone) {
    case 'upcoming':
      return styles.statusUpcoming;
    case 'completed':
      return styles.statusCompleted;
    case 'cancelled':
      return styles.statusCancelled;
    case 'pending':
      return styles.statusPending;
    case 'missed':
      return styles.statusMissed;
    default:
      return styles.statusMissed;
  }
}

const Appointments: React.FC = () => {
  const navigation = useNavigation<AppointmentsNavigationProp>();
  const queryClient = useQueryClient();
  const { setIsScrollingDown } = useScrollContext();
  const { height: windowHeight } = useWindowDimensions();

  const [selectedTab, setSelectedTab] = useState<AppointmentsTab>('all');
  const [refreshing, setRefreshing] = useState(false);
  const tabBarScrollRef = useRef<ScrollView>(null);
  const tabMeasurements = useRef<
    Partial<Record<AppointmentsTab, { x: number; width: number }>>
  >({});

  const centerSelectedTab = useCallback(() => {
    const m = tabMeasurements.current[selectedTab];
    const scroller = tabBarScrollRef.current;
    if (!m || !scroller) {
      return;
    }
    const vw = Dimensions.get('window').width;
    const tabCenter = m.x + m.width / 2;
    const targetX = Math.max(0, tabCenter - vw / 2);
    scroller.scrollTo({ x: targetX, animated: true });
  }, [selectedTab]);

  const onTabLayout = useCallback(
    (key: AppointmentsTab) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      tabMeasurements.current[key] = { x, width };
      if (key === selectedTab) {
        requestAnimationFrame(() => centerSelectedTab());
      }
    },
    [selectedTab, centerSelectedTab],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => centerSelectedTab());
    return () => cancelAnimationFrame(id);
  }, [selectedTab, centerSelectedTab]);

  const {
    rows,
    page,
    totalPages,
    canGoPrev,
    canGoNext,
    goToPrev,
    goToNext,
    isLoading,
    isEmpty,
    isError,
    refetch,
  } = usePatientAppointmentsList(selectedTab);

  useEffect(() => {
    return () => {
      setIsScrollingDown(false);
    };
  }, [setIsScrollingDown]);

  const handleProfilePress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleAIChatPress = () => {
    const tabNavigation = navigation.getParent();
    if (tabNavigation) {
      tabNavigation.navigate('Chat' as never);
      return;
    }
    navigation.navigate('Chat' as never);
  };

  const handleNotificationPress = () => {
    const tabNavigation = navigation.getParent();
    if (tabNavigation) {
      tabNavigation.navigate('Notifications' as never);
      return;
    }
    navigation.navigate('Notifications' as never);
  };

  const handleCardPress = useCallback(
    (appointmentId: string) => {
      navigation.navigate('AppointmentDetails', { appointmentId });
    },
    [navigation],
  );

  const handleCardPrimaryAction = useCallback(
    (row: AppointmentListRow) => {
      if (row.appointmentCallType === 'CHAT') {
        navigation.navigate('AppointmentDetails', {
          appointmentId: row.id,
          initialTab: 'Messages',
        });
        return;
      }
      navigation.navigate('JoinSession', {
        appointmentId: row.id,
        appointmentCallType: row.appointmentCallType,
      });
    },
    [navigation],
  );

  const callTypeLabel = useCallback((t: AppointmentListRow['appointmentCallType']) => {
    if (t === 'CHAT') return 'Chat';
    if (t === 'AUDIO') return 'Audio';
    return 'Video';
  }, []);

  const primaryActionLabel = useCallback(
    (row: AppointmentListRow) => {
      if (row.appointmentCallType === 'CHAT') return 'Open Chat';
      if (row.appointmentCallType === 'AUDIO') return 'Join Audio';
      return 'Join Video';
    },
    [],
  );

  const handleScrollStart = () => {
    setIsScrollingDown(true);
  };

  const handleScrollStop = () => {
    setIsScrollingDown(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    invalidatePatientAppointmentCaches(queryClient);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, refetch]);

  const renderItem: ListRenderItem<AppointmentListRow> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardRow}>
          <View style={styles.imageShell}>
            <InitialsAvatar
              uri={item.doctorImageUri}
              name={item.doctorName}
              size={152}
              borderRadius={0}
              variant="first-letter"
            />
          </View>

          <View style={styles.cardRight}>
            <View style={styles.nameRow}>
              <Text style={styles.doctorName} numberOfLines={1}>
                {item.doctorName}
              </Text>
              <View
                style={[
                  styles.statusPill,
                  item.badgeTone === 'upcoming'
                    ? styles.statusPillUpcoming
                    : badgeToneToStyle(item.badgeTone),
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.badgeTone === 'upcoming' && styles.statusTextUpcoming,
                  ]}
                >
                  {item.badgeLabel}
                </Text>
              </View>
            </View>
            <Text style={styles.specialty} numberOfLines={1}>
              {item.specialty}
            </Text>
            <View style={styles.callTypeRow}>
              <View style={styles.callTypePill}>
                <Text style={styles.callTypeText}>{callTypeLabel(item.appointmentCallType)}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.datetimeWrap}>
                <View style={styles.detailItem}>
                  <Icons.CalendarTodayIcon width={18} height={18} />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {item.date}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Icons.NestClockFarsightAnalogIcon width={18} height={18} />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {item.time}
                  </Text>
                </View>
              </View>

              {item.badgeTone === 'upcoming' ? (
                <TouchableOpacity
                  style={styles.joinBtn}
                  onPress={(e) => {
                    (e as any)?.stopPropagation?.();
                    handleCardPrimaryAction(item);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.joinBtnText} numberOfLines={1}>
                    {primaryActionLabel(item)}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [callTypeLabel, handleCardPress, handleCardPrimaryAction, primaryActionLabel],
  );

  const ListHeader = (
    <>
      <View style={styles.headerContainer}>
        <HomeHeader
          onProfilePress={handleProfilePress}
          onSearchChange={handleSearchChange}
          onAIChatPress={handleAIChatPress}
          onNotificationPress={handleNotificationPress}
          placeholder="Search doctor, service"
          showFeelingRow={false}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.heading}>Appointments</Text>
          <Text style={styles.subtitle}>
            Appointments which you need to attend in your coming days.
          </Text>
        </View>

        <View style={styles.categoryScrollOuter}>
          <ScrollView
            ref={tabBarScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {TAB_OPTIONS.map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryTab,
                  selectedTab === key && styles.categoryTabActive,
                ]}
                onPress={() => setSelectedTab(key)}
                onLayout={onTabLayout(key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedTab === key && styles.categoryTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.scrollWrapper} edges={['bottom']}>
        {isLoading ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={handleScrollStart}
            onMomentumScrollBegin={handleScrollStart}
            onScrollEndDrag={handleScrollStop}
            onMomentumScrollEnd={handleScrollStop}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          >
            {ListHeader}
            <View style={styles.shimmerBlock}>
              {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <View key={`sk-${i}`} style={styles.card}>
                  <View style={styles.cardRow}>
                    <ShimmerBox width="30%" height={152} borderRadius={0} />
                    <View style={styles.cardRight}>
                      {/* name + status pill */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <ShimmerBox height={16} borderRadius={8} width="60%" />
                        <ShimmerBox height={20} borderRadius={999} width={72} />
                      </View>
                      {/* specialty */}
                      <ShimmerBox
                        height={12}
                        borderRadius={6}
                        width="45%"
                        style={{ marginTop: 8 }}
                      />
                      {/* call type pill */}
                      <ShimmerBox
                        height={18}
                        borderRadius={999}
                        width={64}
                        style={{ marginTop: 10 }}
                      />
                      {/* date/time stacked + action button */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          marginTop: 'auto',
                          gap: 10,
                        }}
                      >
                        <View style={{ flexDirection: 'column', gap: 8, flex: 1 }}>
                          <ShimmerBox width={120} height={12} borderRadius={6} />
                          <ShimmerBox width={92} height={12} borderRadius={6} />
                        </View>
                        <ShimmerBox width={108} height={36} borderRadius={999} />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={
              <View
                style={[
                  styles.emptyCenterWrap,
                  { minHeight: Math.max(windowHeight * 0.5, 340) },
                ]}
              >
                <View
                  style={[
                    styles.emptyIconCircle,
                    isError && styles.emptyIconCircleError,
                  ]}
                >
                  {isError ? (
                    <Icons.PageInfoIcon width={44} height={44} fill="#EF4444" />
                  ) : (
                    <Icons.CalendarTodayIcon
                      width={44}
                      height={44}
                      fill={Colors.primary}
                    />
                  )}
                </View>
                <Text style={styles.emptyStateTitle}>
                  {isError ? 'Could not load appointments' : 'No appointments'}
                </Text>
                <Text style={styles.emptyStateText}>
                  {isError
                    ? 'Pull down to refresh, or check your connection and try again.'
                    : EMPTY_COPY[selectedTab]}
                </Text>
              </View>
            }
            ListFooterComponent={
              !isEmpty && !isError ? (
                <View style={styles.paginationBar}>
                  <TouchableOpacity
                    style={[
                      styles.pageNavBtn,
                      !canGoPrev && styles.pageNavBtnDisabled,
                    ]}
                    onPress={goToPrev}
                    disabled={!canGoPrev}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pageNavBtnText,
                        !canGoPrev && styles.pageNavBtnTextDisabled,
                      ]}
                    >
                      Previous
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.pageIndicator}>
                    Page {page} of {totalPages}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.pageNavBtn,
                      !canGoNext && styles.pageNavBtnDisabled,
                    ]}
                    onPress={goToNext}
                    disabled={!canGoNext}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pageNavBtnText,
                        !canGoNext && styles.pageNavBtnTextDisabled,
                      ]}
                    >
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
            contentContainerStyle={[
              styles.scrollContent,
              styles.listContentPadded,
              isEmpty && styles.scrollContentEmpty,
            ]}
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={handleScrollStart}
            onMomentumScrollBegin={handleScrollStart}
            onScrollEndDrag={handleScrollStop}
            onMomentumScrollEnd={handleScrollStop}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: '#ECF2FD',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 0,
    // Header should span full width even when list content is padded.
    marginHorizontal: -15,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  scrollContentEmpty: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 15,
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 20,
  },
  categoryScrollOuter: {
    marginBottom: 20,
  },
  categoryScrollContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexShrink: 0,
  },
  categoryTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textLight,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  listContentPadded: {
    paddingHorizontal: 15,
  },
  shimmerBlock: {
    gap: 16,
    paddingHorizontal: 15,
  },
  shimmerTextCol: {
    flex: 1,
    marginLeft: 14,
    gap: 10,
    justifyContent: 'center',
    minWidth: 0,
  },
  card: {
    backgroundColor: '#EEEFF3',
    borderRadius: 24,
    padding: 0,
    width: '100%',
    height: 152,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: '100%',
  },
  imageShell: {
    width: '30%',
    minWidth: 110,
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#DDE3EA',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
  },
  cardRight: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  doctorTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingTop: 4,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
    flex: 1,
    minWidth: 0,
  },
  specialty: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  callTypeRow: {
    marginTop: 6,
  },
  callTypePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8EEF9',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  callTypeText: {
    fontFamily: Fonts.raleway,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
    gap: 10,
  },
  datetimeWrap: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  statusPillUpcoming: {
    backgroundColor: '#E8EEF9',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusUpcoming: {
    backgroundColor: Colors.primary,
  },
  statusCompleted: {
    backgroundColor: '#10B981',
  },
  statusCancelled: {
    backgroundColor: '#EF4444',
  },
  statusPending: {
    backgroundColor: '#9CA3AF',
  },
  statusMissed: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'lowercase',
  },
  statusTextUpcoming: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
    maxWidth: '100%',
  },
  detailText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    flexShrink: 1,
  },
  joinBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyCenterWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    alignSelf: 'stretch',
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8EEF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIconCircleError: {
    backgroundColor: '#FEF2F2',
  },
  emptyStateTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  paginationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  pageNavBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  pageNavBtnDisabled: {
    backgroundColor: '#E5E7EB',
  },
  pageNavBtnText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pageNavBtnTextDisabled: {
    color: '#9CA3AF',
  },
  pageIndicator: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

export default Appointments;
