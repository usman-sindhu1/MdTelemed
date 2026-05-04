import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import ShimmerBox from '../common/ShimmerBox';
import type { PublicDoctorProfile } from '../../types/publicDoctors';
import {
  formatDoctorDisplayName,
  formatPlatformTenure,
  formatRating,
  formatTotalReviewsCount,
  getPublicDoctorDisplayDetails,
  resolveDoctorImageUri,
} from '../../utils/publicDoctorDisplay';

export type TopDoctorCardProps = {
  profile: PublicDoctorProfile;
  /** When set, show green/grey slot status; otherwise show “Book”. */
  availabilityKnown?: boolean;
  hasAvailableSlots?: boolean;
  onPress: () => void;
};

/**
 * Compact doctor row: same design on Home “Top Doctors” and “See all” list.
 * Full profile → `HomeDoctorDetails`.
 */
const TopDoctorCard: React.FC<TopDoctorCardProps> = ({
  profile,
  availabilityKnown,
  hasAvailableSlots,
  onPress,
}) => {
  const d = getPublicDoctorDisplayDetails(profile);
  const displayName = formatDoctorDisplayName(profile);
  const imageUri = resolveDoctorImageUri(profile);
  const showBadge = availabilityKnown === true;
  const memberTenure = formatPlatformTenure(profile.user);
  const reviewCount = formatTotalReviewsCount(profile);
  const ratingValue = formatRating(profile);
  const subtitle =
    d.regulatory !== '—' ? d.regulatory : d.tagText;
  const professionFooter =
    profile.professionalInfo?.[0]?.profession?.trim() ||
    d.professionPill;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.inner}>
        <View style={styles.topRow}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )}
          <View style={styles.textCol}>
            <Text style={styles.name} numberOfLines={2}>
              {displayName}
            </Text>
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Rating</Text>
            <View style={styles.ratingValueRow}>
              <Text style={styles.statValue}>{ratingValue}</Text>
              <Text
                style={styles.yellowStar}
                accessibilityLabel="Average rating"
              >
                ★
              </Text>
            </View>
          </View>
          <View style={[styles.statCell, styles.statCellDivider]}>
            <Text style={styles.statLabel}>Member</Text>
            <Text
              style={styles.statValue}
              numberOfLines={1}
              accessibilityLabel="Time on the app, not years of practice"
            >
              {memberTenure}
            </Text>
            <Text style={styles.statHint} numberOfLines={1}>
              on app
            </Text>
          </View>
          <View style={[styles.statCell, styles.statCellDivider]}>
            <Text style={styles.statLabel}>Reviews</Text>
            <Text style={styles.statValue} numberOfLines={1}>
              {reviewCount}
            </Text>
            <Text style={styles.statHint} numberOfLines={1}>
              from patients
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.footerRow}>
          <Text style={styles.footerProfession} numberOfLines={1}>
            {professionFooter}
          </Text>
          <View style={styles.footerBadgeWrap}>
            {showBadge ? (
              <View
                style={[
                  styles.availablePill,
                  !hasAvailableSlots && styles.unavailablePill,
                ]}
              >
                <Text
                  style={[
                    styles.availableText,
                    !hasAvailableSlots && styles.unavailableText,
                  ]}
                >
                  {hasAvailableSlots ? 'Available' : 'No slots soon'}
                </Text>
              </View>
            ) : (
              <View style={styles.availablePillMuted}>
                <Text style={styles.availableTextMuted}>Book</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/** Loading placeholder matching `TopDoctorCard` layout. */
export const TopDoctorCardSkeleton: React.FC = () => (
  <View style={sk.card}>
    <View style={sk.inner}>
      <View style={sk.topRow}>
        <ShimmerBox width={56} height={56} borderRadius={14} />
        <View style={sk.titleCol}>
          <ShimmerBox height={18} borderRadius={8} width="88%" />
          <ShimmerBox height={14} borderRadius={6} width="70%" />
        </View>
      </View>
      <View style={sk.statsRow}>
        <View style={sk.statBox}>
          <ShimmerBox height={10} borderRadius={4} width="60%" />
          <ShimmerBox height={16} borderRadius={6} width="80%" />
        </View>
        <View style={sk.statBox}>
          <ShimmerBox height={10} borderRadius={4} width="60%" />
          <ShimmerBox height={16} borderRadius={6} width="80%" />
        </View>
        <View style={sk.statBox}>
          <ShimmerBox height={10} borderRadius={4} width="60%" />
          <ShimmerBox height={16} borderRadius={6} width="50%" />
        </View>
      </View>
      <View style={sk.divider} />
      <View style={sk.footer}>
        <View style={sk.footerTextSk}>
          <ShimmerBox width="100%" height={14} borderRadius={6} />
        </View>
        <ShimmerBox width={100} height={32} borderRadius={999} />
      </View>
    </View>
  </View>
);

const sk = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    overflow: 'hidden',
  },
  inner: { padding: 12 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start' },
  titleCol: {
    flex: 1,
    marginLeft: 12,
    gap: 8,
    minWidth: 0,
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 0,
  },
  statBox: {
    flex: 1,
    gap: 6,
    paddingHorizontal: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 10,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  footerTextSk: {
    flex: 1,
    minWidth: 0,
    marginRight: 4,
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    overflow: 'hidden',
  },
  inner: {
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    backgroundColor: '#E2E8F0',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  statCell: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  statCellDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#E5E7EB',
  },
  statLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  statHint: {
    fontFamily: Fonts.openSans,
    fontSize: 9,
    fontWeight: '400',
    color: '#9CA3AF',
    marginTop: 2,
    textAlign: 'center',
  },
  ratingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  yellowStar: {
    fontSize: 15,
    color: '#EAB308',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 10,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  footerProfession: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    minWidth: 0,
    paddingRight: 6,
  },
  footerBadgeWrap: {
    flexShrink: 0,
  },
  availablePill: {
    backgroundColor: '#ECFDF5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  unavailablePill: {
    backgroundColor: '#F3F4F6',
  },
  availableText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  unavailableText: {
    color: '#6B7280',
  },
  availablePillMuted: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  availableTextMuted: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
});

export default TopDoctorCard;
