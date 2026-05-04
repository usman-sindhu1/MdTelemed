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
import type { PatientRatingRow } from '../../types/patientReviews';
import RatingStars from './RatingStars';
import {
  formatReviewScore,
  formatReviewServiceLabel,
  resolveDoctorForReviewRow,
} from '../../utils/patientReviewDisplay';

export type ReviewListCardProps = {
  row: PatientRatingRow;
  onPress: () => void;
};

const ReviewListCard: React.FC<ReviewListCardProps> = ({ row, onPress }) => {
  const { rating, appointment } = row;
  const { name, imageUri } = resolveDoctorForReviewRow(row);
  const service = formatReviewServiceLabel(appointment?.appointmentType);
  const scoreLabel = formatReviewScore(rating.score);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        <View style={styles.avatarShell}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
        <View style={styles.topText}>
          <Text style={styles.reviewedLabel}>Reviewed To</Text>
          <Text style={styles.doctorName} numberOfLines={2}>
            {name}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Ratings</Text>
        <View style={styles.ratingWrap}>
          <RatingStars score={rating.score} size={16} />
          <Text style={styles.scoreNum}>{scoreLabel}</Text>
        </View>
      </View>

      <View style={[styles.metaRow, styles.metaRowLast]}>
        <Text style={styles.metaLabel}>Service</Text>
        <Text style={styles.serviceValue} numberOfLines={2}>
          {service}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const ReviewListCardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.topRow}>
      <ShimmerBox width={52} height={52} borderRadius={14} />
      <View style={styles.shimTitle}>
        <ShimmerBox height={11} borderRadius={4} width={72} />
        <ShimmerBox height={18} borderRadius={8} width="85%" />
      </View>
    </View>
    <View style={styles.divider} />
    <View style={styles.metaRow}>
      <ShimmerBox height={12} borderRadius={4} width={48} />
      <View style={styles.ratingWrap}>
        <ShimmerBox height={16} borderRadius={4} width={100} />
        <ShimmerBox height={16} borderRadius={4} width={32} />
      </View>
    </View>
    <View style={[styles.metaRow, styles.metaRowLast]}>
      <ShimmerBox height={12} borderRadius={4} width={52} />
      <ShimmerBox height={16} borderRadius={6} width="55%" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarShell: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: '#CBD5E1',
  },
  topText: {
    flex: 1,
    minWidth: 0,
  },
  reviewedLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  metaRowLast: {
    marginBottom: 0,
  },
  metaLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    minWidth: 72,
  },
  ratingWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    flexWrap: 'wrap',
  },
  scoreNum: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  serviceValue: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  shimTitle: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    minWidth: 0,
  },
});

export default ReviewListCard;
