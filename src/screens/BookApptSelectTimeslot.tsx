import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

const CONTENT_PADDING = 16;
const PROGRESS_PERCENT = 50;

const DAY_LABELS = ['Su.', 'Mo.', 'Tu.', 'We.', 'Th.', 'Fr.', 'Sa.'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const TIME_SLOTS = [
  { id: '1', time: '08:00 AM' },
  { id: '2', time: '09:00 AM' },
  { id: '3', time: '10:00 AM' },
  { id: '4', time: '11:00 AM' },
];

function getDaysForMonthStrip(year: number, month: number): { date: number; dayLabel: string; dayOfWeek: number }[] {
  const days: { date: number; dayLabel: string; dayOfWeek: number }[] = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const start = first.getDate();
  const end = last.getDate();
  for (let d = start; d <= Math.min(start + 13, end); d++) {
    const dObj = new Date(year, month, d);
    days.push({
      date: d,
      dayLabel: DAY_LABELS[dObj.getDay()],
      dayOfWeek: dObj.getDay(),
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

const BookApptSelectTimeslot: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const selectedDoctor = route.params?.selectedDoctor;
  const source = route.params?.source;

  // Reset date & slot when the screen gains focus
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
    Animated.timing(buttonAnim, {
      toValue: selectedSlotId ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedSlotId, buttonAnim]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;
  const stripDays = useMemo(() => getDaysForMonthStrip(year, month), [year, month]);

  const handleBackPress = () => {
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
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isSelected = (dateNum: number) => {
    return (
      selectedDate.getDate() === dateNum &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const onSelectDay = (dateNum: number) => {
    setSelectedDate(new Date(year, month, dateNum));
  };

  const handleContinue = () => {
    (navigation as any).navigate('BookApptPatientSummary');
  };

  const handleCancelProcess = () => {
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Select timeslot</Text>
        <Text style={styles.sectionDescription}>
          Lorem ipsum dolor sit amet consectetur adipiscin elit Ut et massa mi.
        </Text>

        {selectedDoctor ? (
          <View style={styles.selectedDoctorCard}>
            <Text style={styles.selectedDoctorLabel}>Selected doctor</Text>
            <Text style={styles.selectedDoctorName}>{selectedDoctor.name}</Text>
            <Text style={styles.selectedDoctorMeta}>{selectedDoctor.specialty}</Text>
          </View>
        ) : null}

        {/* Stripe calendar */}
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
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stripDaysContent}
          >
            {stripDays.map((day) => {
              const selected = isSelected(day.date);
              return (
                <TouchableOpacity
                  key={`${year}-${month}-${day.date}`}
                  style={[styles.dayCell, selected && styles.dayCellSelected]}
                  onPress={() => onSelectDay(day.date)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayLabel, selected && styles.dayCellTextSelected]}>
                    {day.dayLabel}
                  </Text>
                  <Text style={[styles.dayDate, selected && styles.dayCellTextSelected]}>
                    {day.date}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <Text style={styles.selectedDateText}>{formatSelectedDate(selectedDate)}</Text>

        {TIME_SLOTS.map((slot) => {
          const isSlotSelected = selectedSlotId === slot.id;
          return (
            <TouchableOpacity
              key={slot.id}
              style={[styles.slotRow, isSlotSelected && styles.slotRowSelected]}
              onPress={() => setSelectedSlotId((prev) => (prev === slot.id ? null : slot.id))}
              activeOpacity={0.8}
            >
              <View style={styles.slotLeft}>
                <Icons.VideoCameraIcon width={22} height={22} />
                <Text style={styles.slotOnline}>Online Appt.</Text>
              </View>
              <Text style={styles.slotTime}>{slot.time}</Text>
              {isSlotSelected ? (
                <Icons.RadioButtonCheckedIcon width={22} height={22} />
              ) : (
                <Icons.RadioButtonUncheckedIcon width={22} height={22} />
              )}
            </TouchableOpacity>
          );
        })}

        <Animated.View
          style={[
            styles.actionButtons,
            {
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents={selectedSlotId ? 'auto' : 'none'}
        >
          <Button
            variant="primary"
            title="Continue to Process"
            onPress={handleContinue}
            style={styles.continueButtonPrimary}
          />
          <Button
            variant="half-outlined"
            title="Cancel Process"
            onPress={handleCancelProcess}
            style={styles.cancelButtonPrimary}
            textStyle={styles.cancelButtonText}
          />
        </Animated.View>
      </ScrollView>
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
    alignItems: 'center',
  },
  progressCardShadowWrap: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
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
  progressBar: {
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'visible',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary || '#2563EB',
    borderRadius: 3,
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
    paddingHorizontal: 2,
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
    paddingBottom: 120,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
    lineHeight: 20,
    marginBottom: 16,
  },
  calendarStrip: {
    marginBottom: 20,
  },
  selectedDoctorCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#ECF2FD',
    padding: 12,
    marginBottom: 16,
  },
  selectedDoctorLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#475569',
    marginBottom: 2,
  },
  selectedDoctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  selectedDoctorMeta: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: Colors.primary,
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
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  dayCellSelected: {
    borderColor: Colors.primary || '#2563EB',
    borderWidth: 2,
    backgroundColor: '#ECF2FD',
  },
  dayLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 4,
  },
  dayDate: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  dayCellTextSelected: {
    color: Colors.primary || '#2563EB',
  },
  selectedDateText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
    marginBottom: 16,
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
  actionButtons: {
    marginTop: 24,
  },
  continueButtonPrimary: {
    marginBottom: 12,
    backgroundColor: Colors.primary || '#2563EB',
  },
  cancelButtonPrimary: {
    width: '100%',
    height: 52,
    backgroundColor: '#EEEEEE',
    borderWidth: 0,
  },
  cancelButtonText: {
    color: '#1F2937',
  },
});

export default BookApptSelectTimeslot;
