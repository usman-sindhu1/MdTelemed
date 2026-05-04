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
        <Text style={styles.muted}>
          Could not load doctors. Pull to refresh on Home or try again later.
        </Text>
      ) : list.length === 0 ? (
        <Text style={styles.muted}>No doctors available yet.</Text>
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
});

export default TopDoctors;
