import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  type RouteProp,
} from '@react-navigation/native';
import type { DrawerParamList } from '../navigation/HomeStackRoot';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import ShimmerBox from '../components/common/ShimmerBox';
import { useDoctorAvailableSlots } from '../hooks/useDoctorAvailableSlots';
import {
  slotsForLocalDay,
  sortSlotsByStartAscending,
  formatSlotTimeRange,
  buildLocalDayKeysWithSlots,
  localDayKey,
  type DoctorTimeSlotLite,
} from '../utils/doctorTimeSlotsDisplay';
import { showErrorToast } from '../utils/appToast';

const CONTENT_PADDING = 16;
const PROGRESS_PERCENT = 50;

const DAY_LABELS = ['Su.', 'Mo.', 'Tu.', 'We.', 'Th.', 'Fr.', 'Sa.'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function getDaysInCalendarMonth(year: number, month: number): {
  date: number;
  dayLabel: string;
}[] {
  const last = new Date(year, month + 1, 0).getDate();
  const days: { date: number; dayLabel: string }[] = [];
  for (let d = 1; d <= last; d++) {
    const dObj = new Date(year, month, d);
    days.push({
      date: d,
      dayLabel: DAY_LABELS[dObj.getDay()],
    });
  }
  return days;
}

function formatSelectedDate(date: Date): string {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = MONTH_SHORT[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${weekday}, ${month} ${day}, ${year}`;
}

function normalizeSlots(
  raw: Array<{
    id?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
  }>,
): DoctorTimeSlotLite[] {
  const out: DoctorTimeSlotLite[] = [];
  for (const r of raw) {
    const id = r.id?.trim();
    const startDate = r.startDate?.trim();
    if (!id || !startDate) continue;
    out.push({
      id,
      startDate,
      endDate: typeof r.endDate === 'string' ? r.endDate : undefined,
      userId: typeof r.userId === 'string' ? r.userId : undefined,
    });
  }
  return sortSlotsByStartAscending(out);
}

type TimeslotRoute = RouteProp<DrawerParamList, 'BookApptSelectTimeslot'>;

const BookApptSelectTimeslot: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<TimeslotRoute>();
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const actionAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const selectedDoctor = route.params?.selectedDoctor;
  const source = route.params?.source;
  const stripScrollRef = useRef<ScrollView>(null);
  const stripViewportW = useRef(0);
  const dayCellLayouts = useRef<Record<number, { x: number; width: number }>>({});

  const doctorUserId =
    selectedDoctor?.id != null ? String(selectedDoctor.id).trim() : undefined;

  const {
    data: slotsPayload,
    isLoading: slotsLoading,
    isFetching: slotsFetching,
    isError: slotsError,
    error: slotsErr,
    refetch: refetchSlots,
  } = useDoctorAvailableSlots(doctorUserId);

  const allSlots = useMemo(
    () => normalizeSlots(slotsPayload?.timeSlots ?? []),
    [slotsPayload],
  );

  const daysWithSlots = useMemo(
    () => buildLocalDayKeysWithSlots(allSlots),
    [allSlots],
  );

  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1));
      setSelectedDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
      setSelectedSlotId(null);
      return () => {};
    }, []),
  );

  useEffect(() => {
    if (slotsError && slotsErr instanceof Error) {
      showErrorToast('Could not load time slots', slotsErr.message);
    }
  }, [slotsError, slotsErr]);

  useEffect(() => {
    if (!selectedSlotId) {
      actionAnim.setValue(0);
      return;
    }
    actionAnim.setValue(0);
    Animated.timing(actionAnim, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [selectedSlotId, actionAnim]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;
  const stripDays = useMemo(() => getDaysInCalendarMonth(year, month), [year, month]);

  const slotsForSelectedDay = useMemo(
    () => slotsForLocalDay(allSlots, selectedDate),
    [allSlots, selectedDate],
  );

  const handleBackPress = () => {
    if (source === 'bookingFlow' && selectedDoctor) {
      (navigation as unknown as { navigate: (n: keyof DrawerParamList, p?: object) => void }).navigate(
        'BookApptDoctorDetail',
        { selectedDoctor },
      );
      return;
    }
    if (source === 'topDoctors') {
      if ((navigation as any).canGoBack?.()) {
        (navigation as any).goBack();
      } else {
        (navigation as any).navigate('BookApptSelectDoctor');
      }
      return;
    }
    (navigation as any).navigate('BookApptSelectDoctor');
  };

  const handlePrevMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedSlotId(null);
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedSlotId(null);
  };

  const isSelectedDayCell = (dateNum: number) => {
    return (
      selectedDate.getDate() === dateNum &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const centerSelectedDayInStrip = useCallback(
    (dateNum: number) => {
      const layout = dayCellLayouts.current[dateNum];
      const viewportW = stripViewportW.current;
      if (!layout || !viewportW || !stripScrollRef.current) return;
      const targetX = Math.max(0, layout.x + layout.width / 2 - viewportW / 2);
      stripScrollRef.current.scrollTo({ x: targetX, animated: true });
    },
    [],
  );

  const onSelectDay = (dateNum: number) => {
    setSelectedDate(new Date(year, month, dateNum));
    setSelectedSlotId(null);
    requestAnimationFrame(() => centerSelectedDayInStrip(dateNum));
  };

  useEffect(() => {
    // When month changes or initial render, try to center the current selected day (if it is in the visible month)
    if (selectedDate.getFullYear() !== year || selectedDate.getMonth() !== month) return;
    const d = selectedDate.getDate();
    requestAnimationFrame(() => centerSelectedDayInStrip(d));
  }, [centerSelectedDayInStrip, month, selectedDate, year]);

  const handleContinue = () => {
    if (!selectedSlotId) {
      return;
    }
    (navigation as unknown as { navigate: (n: keyof DrawerParamList, p?: object) => void }).navigate(
      'BookApptBookingFlow',
      {
        mode: 'book_later',
        selectedDoctor: selectedDoctor ?? undefined,
        timeSlotId: selectedSlotId,
        flowId: `${Date.now()}`,
      },
    );
  };

  const handleCancelProcess = () => {
    if (source === 'bookingFlow' && selectedDoctor) {
      (navigation as unknown as { navigate: (n: keyof DrawerParamList, p?: object) => void }).navigate(
        'BookApptDoctorDetail',
        { selectedDoctor },
      );
      return;
    }
    if (source === 'topDoctors') {
      if ((navigation as any).canGoBack?.()) {
        (navigation as any).goBack();
      } else {
        (navigation as any).navigate('BookApptSelectDoctor');
      }
      return;
    }
    (navigation as any).navigate('BookApptSelectDoctor');
  };

  const showSlotsLoading = slotsLoading && !slotsPayload;

  const scrollBottomPadding =
    24 +
    (selectedSlotId ? 128 : 0) +
    Math.max(insets.bottom, 8);

  return (
    <View style={styles.container}>
      <SimpleBackHeader
        title="Book Appt."
        onBackPress={handleBackPress}
        backgroundColor="#ECF2FD"
        bottomRadius={24}
      />

      <View style={styles.progressCardWrap}>
        <View style={styles.progressCardShadowWrap}>
          <View style={[styles.card, styles.progressCard]}>
            <Text style={styles.cardSubtitle}>Appointment Booking progress</Text>
            <View style={styles.cardRow}>
              <Text style={styles.percentText}>{PROGRESS_PERCENT}% completed</Text>
              <View style={styles.timeRow}>
                <Icons.NestClockFarsightAnalogIcon width={14} height={14} />
                <Text style={styles.timeText}>10min</Text>
              </View>
            </View>
            <View style={styles.progressTrackInset}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${PROGRESS_PERCENT}%` }]} />
                <View style={styles.progressDots}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <View key={i} style={styles.dot} />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: scrollBottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={slotsFetching && !slotsLoading && Boolean(doctorUserId)}
            onRefresh={() => refetchSlots()}
          />
        }
      >
        <Text style={styles.sectionTitle}>Select timeslot</Text>
        <Text style={styles.sectionDescription}>
          Pick a day with availability, then choose an online visit time. Times
          are shown in your device timezone.
        </Text>

        {!doctorUserId ? (
          <Text style={styles.warnBanner}>
            No clinician selected — go back and choose a doctor first.
          </Text>
        ) : null}

        {/* Calendar */}
        <View style={styles.calendarStrip}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.calendarArrow} hitSlop={12}>
              <Text style={styles.calendarArrowText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.calendarMonth}>{monthLabel}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.calendarArrow} hitSlop={12}>
              <Text style={styles.calendarArrowText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={stripScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stripDaysContent}
            onLayout={(e) => {
              stripViewportW.current = e.nativeEvent.layout.width;
              if (selectedDate.getFullYear() === year && selectedDate.getMonth() === month) {
                requestAnimationFrame(() => centerSelectedDayInStrip(selectedDate.getDate()));
              }
            }}
          >
            {stripDays.map((day) => {
              const selected = isSelectedDayCell(day.date);
              const cellDate = new Date(year, month, day.date);
              const hasSlots = daysWithSlots.has(localDayKey(cellDate));
              return (
                <TouchableOpacity
                  key={`${year}-${month}-${day.date}`}
                  style={[
                    styles.dayCell,
                    hasSlots ? styles.dayCellHasSlots : styles.dayCellNoSlots,
                    selected && styles.dayCellSelected,
                  ]}
                  onPress={() => onSelectDay(day.date)}
                  onLayout={(e) => {
                    const { x, width } = e.nativeEvent.layout;
                    dayCellLayouts.current[day.date] = { x, width };
                    if (selected) {
                      requestAnimationFrame(() => centerSelectedDayInStrip(day.date));
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      hasSlots && !selected && styles.dayLabelOnAvailable,
                      selected && styles.dayCellTextSelected,
                    ]}
                  >
                    {day.dayLabel}
                  </Text>
                  <Text
                    style={[
                      styles.dayDate,
                      hasSlots && !selected && styles.dayDateOnAvailable,
                      selected && styles.dayCellTextSelected,
                    ]}
                  >
                    {day.date}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <Text style={styles.selectedDateText}>{formatSelectedDate(selectedDate)}</Text>

        {showSlotsLoading ? (
          <View style={styles.slotSkeletonList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={`slot-sk-${i}`} style={styles.slotSkeletonRow}>
                <ShimmerBox width={22} height={22} borderRadius={6} />
                <ShimmerBox height={14} borderRadius={6} style={{ flex: 1, marginLeft: 10 }} />
                <ShimmerBox width={22} height={22} borderRadius={999} />
              </View>
            ))}
          </View>
        ) : null}

        {!showSlotsLoading && doctorUserId && slotsForSelectedDay.length === 0 ? (
          <View style={styles.emptyState} accessibilityRole="none">
            <View style={styles.emptyStateIconWrap}>
              <Icons.CalendarClockIcon width={52} height={52} />
            </View>
            <Text style={styles.emptyStateTitle}>No times on this day</Text>
            <Text style={styles.emptyStateBody}>
              Swipe the dates above and choose a day with the blue-tinted
              background — those days have at least one open slot.
            </Text>
          </View>
        ) : null}

        {slotsForSelectedDay.map((slot) => {
          const isSlotSelected = selectedSlotId === slot.id;
          const label = formatSlotTimeRange(slot.startDate, slot.endDate);
          return (
            <TouchableOpacity
              key={slot.id}
              style={[styles.slotRow, isSlotSelected && styles.slotRowSelected]}
              onPress={() =>
                setSelectedSlotId((prev) => (prev === slot.id ? null : slot.id))
              }
              activeOpacity={0.8}
            >
              <View style={styles.slotLeft}>
                <Icons.VideoCameraIcon width={22} height={22} />
                <Text style={styles.slotOnline}>Online Appt.</Text>
              </View>
              <Text style={styles.slotTime}>{label}</Text>
              {isSlotSelected ? (
                <Icons.RadioButtonCheckedIcon width={22} height={22} />
              ) : (
                <Icons.RadioButtonUncheckedIcon width={22} height={22} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedSlotId ? (
        <Animated.View
          style={[
            styles.actionDock,
            {
              paddingBottom: Math.max(insets.bottom, 12),
              opacity: actionAnim,
              transform: [
                {
                  translateY: actionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="box-none"
        >
          <Button
            variant="primary"
            title="Next"
            onPress={handleContinue}
            style={styles.dockNextBtn}
          />
          <Button
            variant="half-outlined"
            title="Cancel"
            onPress={handleCancelProcess}
            style={styles.dockCancelBtn}
            textStyle={styles.dockCancelText}
          />
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressCardWrap: {
    marginTop: -40,
    paddingHorizontal: CONTENT_PADDING,
    marginBottom: 16,
    alignItems: 'stretch',
    width: '100%',
  },
  progressCardShadowWrap: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  progressCard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    overflow: 'hidden',
  },
  cardSubtitle: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '400',
    color: '#757575',
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentText: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary || '#2563EB',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '500',
    color: '#757575',
    marginLeft: 4,
  },
  progressTrackInset: {
    marginHorizontal: 10,
  },
  progressBar: {
    height: 7,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'visible',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary || '#2563EB',
    borderRadius: 4,
  },
  progressDots: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.primary || '#2563EB',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: CONTENT_PADDING,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  warnBanner: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#B45309',
    marginBottom: 12,
  },
  doctorCardWrap: {
    marginBottom: 16,
  },
  calendarStrip: {
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  calendarArrow: {
    padding: 8,
  },
  calendarArrowText: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarMonth: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  stripDaysContent: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  dayCell: {
    minWidth: 56,
    marginRight: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  /** At least one bookable slot starts on this calendar day (local TZ). */
  dayCellHasSlots: {
    backgroundColor: '#DBEAFE',
    borderColor: '#60A5FA',
  },
  dayCellNoSlots: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.72,
  },
  dayCellSelected: {
    borderColor: Colors.primary ?? '#2563EB',
    borderWidth: 2,
    backgroundColor: '#ECF2FD',
    opacity: 1,
  },
  dayLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 4,
  },
  dayLabelOnAvailable: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  dayDate: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  dayDateOnAvailable: {
    color: '#1E40AF',
  },
  dayCellTextSelected: {
    color: Colors.primary ?? '#2563EB',
  },
  selectedDateText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
    marginBottom: 16,
  },
  slotSkeletonList: {
    marginBottom: 12,
    gap: 10,
  },
  slotSkeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyStateTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateBody: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 300,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  slotRowSelected: {
    borderColor: Colors.primary || '#2563EB',
    borderWidth: 2,
    backgroundColor: '#ECF2FD',
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotOnline: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 10,
  },
  slotTime: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
  },
  actionDock: {
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  dockNextBtn: {
    backgroundColor: Colors.primary ?? '#2563EB',
  },
  dockCancelBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#F1F5F9',
    borderWidth: 0,
  },
  dockCancelText: {
    color: '#1F2937',
    fontFamily: Fonts.raleway,
    fontWeight: '700',
  },
});

export default BookApptSelectTimeslot;
