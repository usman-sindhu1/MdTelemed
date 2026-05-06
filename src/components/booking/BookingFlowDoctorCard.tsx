import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import type { BookingDoctorParams } from '../../navigation/HomeStackRoot';
import InitialsAvatar from '../common/InitialsAvatar';

export type BookingFlowDoctorCardProps = {
  doctor: BookingDoctorParams;
  /** Tap to select (list mode). Omit for read-only (detail / summary). */
  onPress?: () => void;
  /** Highlight when selected on the picker list */
  selected?: boolean;
};

/**
 * Mirrors {@link ../homecomponents/TopDoctorCard.tsx} layout for static booking payloads.
 */
const BookingFlowDoctorCard: React.FC<BookingFlowDoctorCardProps> = ({
  doctor,
  onPress,
  selected,
}) => {
  const name = doctor.name?.trim() || '—';
  const subtitle = doctor.specialty?.trim() || '—';
  const ratingDisp = doctor.rating?.trim() ?? '—';
  const membership = doctor.years?.trim() ?? '—';
  const reviews = doctor.patients?.trim() ?? '—';

  const inner = (
    <View style={styles.inner}>
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          <InitialsAvatar
            uri={doctor.imageUri}
            name={name}
            size={56}
            borderRadius={14}
            variant="first-letter"
          />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
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
            <Text style={styles.statValue}>{ratingDisp}</Text>
            <Text style={styles.yellowStar} accessibilityLabel="Average rating">
              ★
            </Text>
          </View>
        </View>
        <View style={[styles.statCell, styles.statCellDivider]}>
          <Text style={styles.statLabel}>Experience</Text>
          <Text
            style={styles.statValue}
            numberOfLines={1}
            accessibilityLabel="Experience summary"
          >
            {membership}
          </Text>
          <Text style={styles.statHint} numberOfLines={1}>
            listed
          </Text>
        </View>
        <View style={[styles.statCell, styles.statCellDivider]}>
          <Text style={styles.statLabel}>Patients</Text>
          <Text style={styles.statValue} numberOfLines={1}>
            {reviews}
          </Text>
          <Text style={styles.statHint} numberOfLines={1}>
            from records
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <Text style={styles.footerProfession} numberOfLines={2}>
          {subtitle}
        </Text>
        <View style={styles.footerBadgeWrap}>
          <View style={styles.availablePillMuted}>
            <Text style={styles.availableTextMuted}>
              {onPress ? 'Book' : 'Selected'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const wrapperStyle = [
    styles.card,
    selected && styles.cardSelected,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={wrapperStyle}
        activeOpacity={0.85}
        onPress={onPress}
      >
        {inner}
      </TouchableOpacity>
    );
  }

  return <View style={wrapperStyle}>{inner}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: Colors.primary ?? '#2563EB',
    borderWidth: 2,
    backgroundColor: '#F8FAFF',
  },
  inner: {
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
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
    color: Colors.primary ?? '#2563EB',
  },
});

export default BookingFlowDoctorCard;
