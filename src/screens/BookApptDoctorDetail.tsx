import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import BookingProgressCard from '../components/booking/BookingProgressCard';
import {
  DoctorProfileDetailCard,
  DoctorProfileDetailSkeleton,
} from '../components/doctor/DoctorProfileDetailCard';
import type { BookingDoctorParams, DrawerParamList } from '../navigation/HomeStackRoot';
import { usePublicDoctorDetail } from '../hooks/usePublicDoctorDetail';
import { mapPublicDoctorToBookingParams } from '../utils/publicDoctorDisplay';

type ScreenRoute = RouteProp<DrawerParamList, 'BookApptDoctorDetail'>;

const ACTION_DOCK_HEIGHT = 124;

function bookApptDetailScrollBottomPadding(bottomInset: number): number {
  // Reserve space for sticky action dock.
  return Math.max(bottomInset, 12) + ACTION_DOCK_HEIGHT;
}

const BookApptDoctorDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ScreenRoute>();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = windowWidth - 30;
  const dockTranslateY = useRef(new Animated.Value(0)).current;
  const lastYRef = useRef(0);

  const { selectedDoctor: routeDoc } = route.params;
  const doctorId = routeDoc?.id != null ? String(routeDoc.id) : undefined;

  const {
    data: profile,
    isPending,
    isError,
  } = usePublicDoctorDetail(doctorId);

  const doctor: BookingDoctorParams = useMemo(() => {
    if (profile) {
      const mapped = mapPublicDoctorToBookingParams(profile);
      return { ...mapped, id: mapped.id } as BookingDoctorParams;
    }
    return routeDoc;
  }, [profile, routeDoc]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    (navigation as unknown as { navigate: (name: keyof DrawerParamList, p?: object) => void }).navigate(
      'BookApptSelectTimeslot',
      {
        selectedDoctor: doctor,
        source: 'bookingFlow',
        bookingMode: 'later',
      },
    );
  };

  const scrollBottomPad = bookApptDetailScrollBottomPadding(insets.bottom);

  const showSkeleton = isPending && !profile && Boolean(doctorId);

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
          subtitle="Appointment Booking progress"
          percent={45}
          dotCount={4}
          activeDotIndex={1}
        />
      </View>

      {showSkeleton ? (
        <DoctorProfileDetailSkeleton
          contentWidth={contentWidth}
          bottomPad={scrollBottomPad}
        />
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollPad,
              { paddingBottom: scrollBottomPad },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScroll={(e) => {
              const y = e.nativeEvent.contentOffset.y;
              const delta = y - lastYRef.current;
              if (Math.abs(delta) < 6) return;
              lastYRef.current = y;
              Animated.timing(dockTranslateY, {
                toValue: delta > 0 ? ACTION_DOCK_HEIGHT + Math.max(insets.bottom, 12) : 0,
                duration: 220,
                useNativeDriver: true,
              }).start();
            }}
            scrollEventThrottle={16}
            onScrollEndDrag={() => {
              Animated.timing(dockTranslateY, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
              }).start();
            }}
            onMomentumScrollEnd={() => {
              Animated.timing(dockTranslateY, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
              }).start();
            }}
          >
          {isError && !profile ? (
            <Text style={styles.warnText}>
              Could not refresh profile. Showing details from your selection.
            </Text>
          ) : null}

          <DoctorProfileDetailCard
            profile={profile ?? undefined}
            bookingFallback={profile ? undefined : doctor}
          />

          <Text style={styles.blurb}>
            Review this clinician, then continue to pick a date and time for your visit.
            You’ll complete personal, medical, and payment details next.
          </Text>
        </ScrollView>

          <Animated.View
            style={[
              styles.actionDock,
              {
                paddingBottom: Math.max(insets.bottom, 12),
                transform: [{ translateY: dockTranslateY }],
              },
            ]}
          >
            <Button
              variant="primary"
              title="Next"
              onPress={handleNext}
              style={styles.nextBtn}
            />
            <TouchableOpacity onPress={handleBackPress} style={styles.backLink}>
              <Text style={styles.backLinkText}>Choose a different doctor</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
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
  scroll: { flex: 1 },
  scrollPad: {
    paddingHorizontal: 15,
    paddingTop: 4,
    gap: 16,
  },
  warnText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#B45309',
    textAlign: 'center',
    marginBottom: 4,
  },
  blurb: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 8,
  },
  nextBtn: { backgroundColor: Colors.primary ?? '#2563EB' },
  actionDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 15,
    paddingTop: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  backLink: { alignItems: 'center', marginTop: 2 },
  backLinkText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary ?? '#2563EB',
  },
});

export default BookApptDoctorDetail;
