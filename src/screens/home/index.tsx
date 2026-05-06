import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Video from 'react-native-video';
import HomeHeader from '../../components/common/HomeHeader';
import UpcommingAppointments from '../../components/homecomponents/UpcommingAppointments';
import TopDoctors from '../../components/homecomponents/TopDoctors';
import Icons from '../../assets/svg';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { useScrollContext } from '../../contexts/ScrollContext';
import { invalidatePatientAppointmentCaches } from '../../hooks/useHomeUpcomingAppointments';
import type { RootState } from '../../store';
import { getData, storeData } from '../../utils/storage';
import { getUserEmail } from '../../utils/profileDisplay';

const Home: React.FC = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { setIsScrollingDown } = useScrollContext();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const authUser = useSelector(
    (s: RootState) => s.auth.user,
  ) as Record<string, unknown> | null;

  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [introMuted, setIntroMuted] = useState(false);

  const introVideoUri = useMemo(
    () => 'asset:/video/WhatsApp%20Video%202026-05-05%20at%2012.33.27.mp4',
    [],
  );

  const introSeenKey = useMemo(() => {
    const email = getUserEmail(authUser).trim().toLowerCase();
    // If email is unknown, we still gate with a device-level key.
    return `introVideoSeen:${email || 'device'}`;
  }, [authUser]);

  useEffect(() => {
    return () => {
      setIsScrollingDown(false);
    };
  }, [setIsScrollingDown]);

  useEffect(() => {
    let cancelled = false;

    async function checkIntro() {
      // Only when logged in
      if (!authUser) {
        setShowIntroVideo(false);
        return;
      }
      const seen = await getData<boolean>(introSeenKey);
      if (cancelled) return;
      if (seen === true) return;
      setShowIntroVideo(true);
    }

    checkIntro();

    return () => {
      cancelled = true;
    };
  }, [authUser, introSeenKey]);

  const closeIntroVideo = async () => {
    setShowIntroVideo(false);
    try {
      await storeData(introSeenKey, true);
    } catch {
      // If storage fails, we still allow closing.
    }
  };

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

  const handleFeelingPress = (index: number) => {
    console.log('Feeling emoji pressed:', index);
  };

  const handleStartNow = () => {
    (navigation.getParent() as any)?.getParent()?.navigate('BookApptBookingFlow', {
      mode: 'see_doctor_now',
      flowId: `${Date.now()}`,
    });
  };

  const handleSetupForLater = () => {
    (navigation.getParent() as any)?.getParent()?.navigate('BookAppt');
  };

  const handleScrollStart = () => {
    setIsScrollingDown(true);
  };

  const handleScrollStop = () => {
    setIsScrollingDown(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      invalidatePatientAppointmentCaches(queryClient);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['public-doctors'] }),
        queryClient.invalidateQueries({ queryKey: ['urgent-care-availability'] }),
        queryClient.invalidateQueries({ queryKey: ['patient-subscription'] }),
        queryClient.invalidateQueries({ queryKey: ['patient-me'] }),
      ]);
      // Force active queries used by child components to refetch immediately.
      await queryClient.refetchQueries({
        type: 'active',
      });
    } finally {
      setRefreshing(false);
    }
  };


  return (
    <View style={styles.container}>
      {showIntroVideo ? (
        <View style={styles.introOverlay}>
          <Video
            source={{ uri: introVideoUri }}
            style={styles.introVideo}
            resizeMode="cover"
            controls={false}
            muted={introMuted}
            volume={1.0}
            paused={false}
            onEnd={closeIntroVideo}
            onError={() => {
              closeIntroVideo();
            }}
          />
          <TouchableOpacity
            style={[styles.skipBtn, { top: insets.top + 12 }]}
            activeOpacity={0.85}
            onPress={closeIntroVideo}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.introVolumeBtn, { top: insets.top + 12 }]}
            activeOpacity={0.85}
            onPress={() => setIntroMuted((v) => !v)}
          >
            <Text style={styles.skipText}>{introMuted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <SafeAreaView style={styles.scrollWrapper} edges={['bottom']}>
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
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Header scrolls with content */}
        <View style={styles.headerContainer}>
          <HomeHeader
            onProfilePress={handleProfilePress}
            onSearchChange={handleSearchChange}
            onAIChatPress={handleAIChatPress}
            onNotificationPress={handleNotificationPress}
            onFeelingPress={handleFeelingPress}
            placeholder="Search doctor, service"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Connect with top doctors instantly.</Text>

          {/* Two cards: See Doctor Now & Book Later */}
          <View style={styles.twoCardRow}>
            <View style={styles.quickConsultCardWrapper}>
              <TouchableOpacity
                style={styles.quickConsultCard}
                onPress={handleStartNow}
                activeOpacity={0.9}
              >
                <View style={styles.quickConsultIconWrap}>
                  <Icons.SeeDoctorNowIcon
                    width={24}
                    height={24}
                    fill="#1F2937"
                    color="#1F2937"
                  />
                </View>
                <Text
                  style={styles.quickConsultTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  See Doctor Now
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.setupLaterCardWrapper}>
              <TouchableOpacity
                style={styles.setupLaterCard}
                onPress={handleSetupForLater}
                activeOpacity={0.9}
              >
                <View style={styles.setupLaterIconWrap}>
                  <Icons.CalendarClockIcon
                    width={24}
                    height={24}
                    fill="#1F2937"
                  />
                </View>
                <Text
                  style={styles.setupLaterTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Book Later
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <UpcommingAppointments />

          <TopDoctors />
        </View>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  introOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: '#000',
  },
  introVideo: {
    width: '100%',
    height: '100%',
  },
  skipBtn: {
    position: 'absolute',
    right: 14,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introVolumeBtn: {
    position: 'absolute',
    left: 14,
    width: 52,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerContainer: {
    backgroundColor: '#ECF2FD',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 0,
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '400',
    color: '#757575',
    marginTop: 24,
    marginBottom: 16,
  },
  twoCardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  quickConsultCardWrapper: {
    flex: 1,
    height: 108,
    borderRadius: 18,
    // box-shadow: 0px 8px 10px -6px #2B7FFF40
    shadowColor: '#2B7FFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  quickConsultCard: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    height: 108,
    justifyContent: 'space-between',
    // box-shadow: 0px 20px 25px -5px #2B7FFF40
    shadowColor: '#2B7FFF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 5,
  },
  quickConsultIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  quickConsultTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
    alignSelf: 'stretch',
  },
  setupLaterCardWrapper: {
    flex: 1,
    height: 108,
    borderRadius: 18,
    // box-shadow: 0px 4px 6px -4px #0000000D
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  setupLaterCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    height: 108,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    // box-shadow: 0px 10px 15px -3px #0000000D
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  setupLaterIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  setupLaterTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 20,
    alignSelf: 'stretch',
  },
});

export default Home;

