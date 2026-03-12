import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../../components/common/BackHeader';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';

type BookingAvailableSlotNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'BookingAvailableSlot'
>;

interface TimeSlot {
  id: string;
  time: string;
}

const BookingAvailableSlot: React.FC = () => {
  const navigation = useNavigation<BookingAvailableSlotNavigationProp>();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<string>('Th. 22');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const dates = [
    { id: '1', day: 'Tu.', date: '20' },
    { id: '2', day: 'We.', date: '21' },
    { id: '3', day: 'Th.', date: '22', isSelected: true },
    { id: '4', day: 'Fr.', date: '23' },
    { id: '5', day: 'Sa.', date: '24' },
    { id: '6', day: 'Su.', date: '25' },
    { id: '7', day: 'M', date: '26' },
  ];

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '08:00 AM' },
    { id: '2', time: '09:00 AM' },
    { id: '3', time: '10:00 AM' },
    { id: '4', time: '11:00 AM' },
    { id: '5', time: '12:00 PM' },
  ];

  const selectedDateFull = 'Thursday, Jan 22, 2025';

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDatePress = (dateId: string, day: string, date: string) => {
    setSelectedDate(`${day} ${date}`);
  };

  const handleTimeSlotPress = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(selectedTimeSlot === timeSlot.id ? null : timeSlot.id);
  };

  const handleContinue = () => {
    if (selectedTimeSlot) {
      navigation.navigate('SetupAnAppointment');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const buttonContainerHeight = 140;

  useEffect(() => {
    if (isScrolling || isAtBottom || selectedTimeSlot) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isScrolling, isAtBottom, selectedTimeSlot]);

  const isContinueDisabled = !selectedTimeSlot;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <BackHeader onBackPress={handleBackPress} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: buttonContainerHeight + (Platform.OS === 'ios' ? insets.bottom : 0) }
        ]}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollBegin={() => setIsScrolling(true)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const scrollY = contentOffset.y;
          const contentHeight = contentSize.height;
          const scrollViewHeight = layoutMeasurement.height;
          const isNearBottom = scrollY + scrollViewHeight >= contentHeight - 50;
          
          if (isNearBottom) {
            setIsAtBottom(true);
          } else if (scrollY < 100) {
            setIsAtBottom(false);
          }
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Book Your Appointment</Text>
            <Text style={styles.subtitle}>
              Complete the following steps to schedule appointment.
            </Text>
          </View>

          {/* Calendar Section */}
          <View style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity activeOpacity={0.7}>
                <Icons.Vector1Icon width={20} height={20} />
              </TouchableOpacity>
              <Text style={styles.monthText}>January</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <View style={styles.chevronRight}>
                  <Icons.Vector1Icon width={20} height={20} />
                </View>
              </TouchableOpacity>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContainer}
            >
              {dates.map((date) => {
                const isSelected = selectedDate === `${date.day} ${date.date}`;
                return (
                  <TouchableOpacity
                    key={date.id}
                    style={[
                      styles.dateCard,
                      isSelected && styles.dateCardSelected
                    ]}
                    onPress={() => handleDatePress(date.id, date.day, date.date)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.dateDay,
                      isSelected && styles.dateDaySelected
                    ]}>
                      {date.day}
                    </Text>
                    <Text style={[
                      styles.dateNumber,
                      isSelected && styles.dateNumberSelected
                    ]}>
                      {date.date}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Time Slot Selection */}
          <View style={styles.timeSlotSection}>
            <Text style={styles.timeSlotTitle}>Select Time Slot</Text>
            <Text style={styles.selectedDateText}>{selectedDateFull}</Text>
            
            <View style={styles.timeSlotsGrid}>
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot.id;
                return (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlotCard,
                      isSelected && styles.timeSlotCardSelected
                    ]}
                    onPress={() => handleTimeSlotPress(slot)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      isSelected && styles.timeSlotTextSelected
                    ]}>
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 20,
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
            pointerEvents: (isScrolling || isAtBottom || selectedTimeSlot) ? 'auto' : 'none',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            isContinueDisabled && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          activeOpacity={0.7}
          disabled={isContinueDisabled}
        >
          <Text style={[
            styles.continueButtonText,
            isContinueDisabled && styles.continueButtonTextDisabled
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 150,
  },
  content: {
    paddingHorizontal: 15,
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 24,
    gap: 8,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  calendarSection: {
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  chevronRight: {
    transform: [{ rotate: '180deg' }],
  },
  datesContainer: {
    gap: 12,
    paddingRight: 15,
  },
  dateCard: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dateCardSelected: {
    backgroundColor: '#F0E8FB',
    borderColor: '#A473E5',
    borderWidth: 2,
  },
  dateDay: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  dateDaySelected: {
    color: '#A473E5',
    fontWeight: '600',
  },
  dateNumber: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dateNumberSelected: {
    color: '#A473E5',
  },
  timeSlotSection: {
    marginBottom: 24,
  },
  timeSlotTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  selectedDateText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlotCard: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotCardSelected: {
    backgroundColor: '#F0E8FB',
    borderColor: '#A473E5',
    borderWidth: 2,
  },
  timeSlotText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  timeSlotTextSelected: {
    color: '#A473E5',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: 'transparent',
    gap: 12,
  },
  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#CBCACE',
  },
  continueButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#9E9E9E',
  },
  cancelButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default BookingAvailableSlot;

