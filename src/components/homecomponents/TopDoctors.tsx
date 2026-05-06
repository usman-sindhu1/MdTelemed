import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useQueries } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import type { HomeStackParamList } from '../../navigation/HomeStack';
import { usePublicTopDoctors } from '../../hooks/usePublicTopDoctors';
import { publicGetData } from '../../api/publicHttp';
import { publicPaths } from '../../constants/publicPaths';
import type { PublicDoctorTimeslotsPayload } from '../../types/publicDoctors';
import TopDoctorCard, {
  TopDoctorCardSkeleton,
} from './TopDoctorCard';

const TOP_DOCTOR_SKELETON_COUNT = 3;

const TopDoctors: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const q = usePublicTopDoctors();

  const list = q.data?.items ?? [];

  const doctorIds = useMemo(
    () =>
      list
        .map((p) => p.user?.id)
        .filter((id): id is string => Boolean(id && String(id).trim())),
    [list],
  );

  const slotQueries = useQueries({
    queries: doctorIds.map((id) => ({
      queryKey: ['public-doctor-timeslots', id],
      queryFn: () =>
        publicGetData<PublicDoctorTimeslotsPayload>(
          publicPaths.doctorTimeslots(id),
        ),
      enabled: list.length > 0,
      staleTime: 60_000,
    })),
  });

  const slotsByIndex = useMemo(() => {
    return doctorIds.map((_, i) => {
      const data = slotQueries[i]?.data;
      const len = data?.timeSlots?.length ?? 0;
      return len > 0;
    });
  }, [doctorIds, slotQueries]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top Doctors</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('HomeDoctorsList')}
        >
          <Text style={styles.viewAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {q.isPending ? (
        <View style={styles.cardsWrap}>
          {Array.from({ length: TOP_DOCTOR_SKELETON_COUNT }).map((_, i) => (
            <TopDoctorCardSkeleton key={`top-doc-sk-${i}`} />
          ))}
        </View>
      ) : q.isError ? (
        <View style={styles.centerMsg}>
          <View style={styles.centerIcon}>
            <Icons.Doctor1Icon width={28} height={28} />
          </View>
          <Text style={styles.centerTitle}>Could not load doctors</Text>
          <Text style={styles.centerBody}>
            Pull to refresh on Home or try again later.
          </Text>
        </View>
      ) : list.length === 0 ? (
        <View style={styles.centerMsg}>
          <View style={styles.centerIcon}>
            <Icons.Doctor1Icon width={28} height={28} />
          </View>
          <Text style={styles.centerTitle}>No doctors available yet</Text>
          <Text style={styles.centerBody}>
            Check back soon — we’ll show top clinicians here.
          </Text>
        </View>
      ) : (
        <View style={styles.cardsWrap}>
          {list.map((profile, index) => {
            const doctorId = profile.user?.id;
            if (!doctorId) return null;
            const hasSlots = slotsByIndex[index];
            const slotsDone = slotQueries[index]?.isSuccess ?? false;
            return (
              <TopDoctorCard
                key={doctorId}
                profile={profile}
                availabilityKnown={slotsDone}
                hasAvailableSlots={hasSlots}
                onPress={() =>
                  navigation.navigate('HomeDoctorDetails', {
                    doctorId,
                  })
                }
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  cardsWrap: {
    gap: 12,
  },
  muted: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  centerMsg: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  centerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  centerBody: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
  },
});

export default TopDoctors;
