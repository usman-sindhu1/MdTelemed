import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import type { PublicDoctorProfile } from '../../types/publicDoctors';
import type { BookingDoctorParams } from '../../navigation/HomeStackRoot';
import ShimmerBox from '../common/ShimmerBox';
import {
  formatDoctorPlainName,
  getPublicDoctorDisplayDetails,
  resolveDoctorImageUri,
  type PublicDoctorDisplayDetails,
} from '../../utils/publicDoctorDisplay';

const SERIF_NAME = Platform.OS === 'ios' ? 'Georgia' : 'serif';

function parseReviewsCountFromLine(patientsOrReviewsLine: string): string {
  const m = patientsOrReviewsLine.match(/(\d+)/);
  return m ? m[1] : '—';
}

function buildDisplayFromBooking(b: BookingDoctorParams): PublicDoctorDisplayDetails {
  return {
    contact: '—',
    profEmail: '—',
    regulatory: b.specialty,
    specialty: b.specialty,
    reviews: parseReviewsCountFromLine(b.patients),
    ratingStr: b.rating,
    patientsDisplay: b.patients?.trim() ? b.patients : '0+',
    professionPill: b.specialty,
    tagText: b.specialty,
  };
}

export type DoctorProfileDetailCardProps = {
  profile?: PublicDoctorProfile | null;
  bookingFallback?: BookingDoctorParams;
};

/**
 * Full-width profile card matching `HomeDoctorDetails` — hero image, tag, serif name,
 * contact lines, 2×2 stats, professions pill.
 */
export function DoctorProfileDetailCard({
  profile,
  bookingFallback,
}: DoctorProfileDetailCardProps) {
  if (!profile && !bookingFallback) {
    return null;
  }

  const d: PublicDoctorDisplayDetails = profile
    ? getPublicDoctorDisplayDetails(profile)
    : buildDisplayFromBooking(bookingFallback!);

  const plainName = profile
    ? formatDoctorPlainName(profile)
    : bookingFallback!.name.trim();

  const imageUri = profile
    ? resolveDoctorImageUri(profile)
    : bookingFallback!.imageUri?.startsWith('http')
      ? bookingFallback!.imageUri
      : '';

  return (
    <View style={styles.card}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.heroPlaceholder} />
      )}

      <View style={styles.cardBody}>
        <View style={styles.tagPill}>
          <Text style={styles.tagText} numberOfLines={2}>
            {d.tagText}
          </Text>
        </View>

        <Text style={styles.serifName}>{plainName}</Text>
        <Text style={styles.regulatory}>{d.regulatory}</Text>

        <View style={styles.contactBlock}>
          <Text style={styles.contactLine}>
            <Text style={styles.contactStrong}>Professional Contact: </Text>
            {d.contact}
          </Text>
          <Text style={styles.contactLine}>
            <Text style={styles.contactStrong}>Professional Email: </Text>
            {d.profEmail}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Specialty</Text>
            <Text style={styles.statValue}>{d.specialty}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Reviews</Text>
            <Text style={styles.statValue}>{d.reviews}</Text>
          </View>
          <View style={styles.statCol}>
            <View style={styles.ratingRow}>
              <Text style={styles.statValue}>{d.ratingStr}</Text>
              <Text style={styles.yellowStar} accessibilityLabel="rating star">
                ★
              </Text>
            </View>
            <Text style={styles.statLabel}>Ratings</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statValue}>{d.patientsDisplay}</Text>
            <Text style={styles.statLabel}>Patients</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.professionsBlock}>
          <Text style={styles.professionsPrefix}>Professions: </Text>
          <View style={styles.professionPill}>
            <Text style={styles.professionPillText} numberOfLines={2}>
              {d.professionPill}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function DoctorProfileDetailSkeleton({
  contentWidth,
  bottomPad,
}: {
  contentWidth: number;
  bottomPad: number;
}) {
  const heroH = Math.round((contentWidth * 3) / 4);
  return (
    <ScrollView
      style={styles.skeletonScroll}
      contentContainerStyle={[styles.skeletonContent, { paddingBottom: bottomPad }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
      bounces
    >
      <View style={styles.card}>
        <ShimmerBox
          width={contentWidth}
          height={heroH}
          borderRadius={0}
          style={styles.heroShimmer}
        />
        <View style={styles.cardBody}>
          <ShimmerBox height={28} borderRadius={999} width={160} />
          <ShimmerBox height={28} borderRadius={8} style={{ marginTop: 14 }} />
          <ShimmerBox height={18} borderRadius={6} width="55%" style={{ marginTop: 10 }} />
          <ShimmerBox height={16} borderRadius={6} style={{ marginTop: 18 }} />
          <ShimmerBox height={16} borderRadius={6} width="90%" style={{ marginTop: 8 }} />
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <View style={[styles.statCol, { gap: 8 }]}>
              <ShimmerBox height={12} borderRadius={4} width="50%" />
              <ShimmerBox height={18} borderRadius={6} />
            </View>
            <View style={[styles.statCol, { gap: 8 }]}>
              <ShimmerBox height={12} borderRadius={4} width="50%" />
              <ShimmerBox height={18} borderRadius={6} />
            </View>
            <View style={[styles.statCol, { gap: 8 }]}>
              <ShimmerBox height={12} borderRadius={4} width="50%" />
              <ShimmerBox height={18} borderRadius={6} />
            </View>
            <View style={[styles.statCol, { gap: 8 }]}>
              <ShimmerBox height={12} borderRadius={4} width="50%" />
              <ShimmerBox height={18} borderRadius={6} />
            </View>
          </View>
          <View style={styles.divider} />
          <ShimmerBox height={36} borderRadius={999} width="70%" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  skeletonScroll: {
    flex: 1,
  },
  skeletonContent: {
    padding: 15,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#E2E8F0',
  },
  heroPlaceholder: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#E2E8F0',
  },
  heroShimmer: {
    alignSelf: 'stretch',
  },
  cardBody: {
    padding: 18,
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    maxWidth: '100%',
  },
  tagText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  serifName: {
    fontFamily: SERIF_NAME,
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  regulatory: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 16,
  },
  contactBlock: {
    gap: 10,
    marginBottom: 4,
  },
  contactLine: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '400',
    color: '#111827',
    lineHeight: 22,
  },
  contactStrong: {
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D1D5DB',
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  statCol: {
    width: '47%',
    minWidth: 120,
  },
  statLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  yellowStar: {
    fontSize: 18,
    color: '#EAB308',
    lineHeight: 22,
    marginTop: -2,
  },
  professionsBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  professionsPrefix: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  professionPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  professionPillText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
});
