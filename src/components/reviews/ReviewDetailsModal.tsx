import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import ShimmerBox from '../common/ShimmerBox';
import { usePatientReviewDetail } from '../../hooks/usePatientReviewDetail';
import RatingStars from './RatingStars';
import {
  formatReviewScore,
  formatReviewServiceLabel,
  resolveDoctorForReviewRow,
} from '../../utils/patientReviewDisplay';

type Props = {
  visible: boolean;
  ratingId: string | null;
  onClose: () => void;
};

const ReviewDetailsModalSkeleton: React.FC = () => (
  <View style={styles.body}>
    <ShimmerBox height={14} borderRadius={4} width={180} style={{ marginBottom: 16 }} />
    <View style={styles.doctorBlock}>
      <ShimmerBox width={64} height={64} borderRadius={32} />
      <View style={{ flex: 1, gap: 10 }}>
        <ShimmerBox height={12} borderRadius={4} width={90} />
        <ShimmerBox height={20} borderRadius={8} width="70%" />
      </View>
    </View>
    <ShimmerBox height={12} borderRadius={4} width={48} style={{ marginBottom: 8 }} />
    <ShimmerBox height={22} borderRadius={6} width={140} style={{ marginBottom: 20 }} />
    <ShimmerBox height={12} borderRadius={4} width={52} style={{ marginBottom: 8 }} />
    <ShimmerBox height={18} borderRadius={6} width="80%" style={{ marginBottom: 20 }} />
    <ShimmerBox height={12} borderRadius={4} width={56} style={{ marginBottom: 8 }} />
    <ShimmerBox height={72} borderRadius={12} width="100%" />
  </View>
);

const ReviewDetailsModal: React.FC<Props> = ({ visible, ratingId, onClose }) => {
  const insets = useSafeAreaInsets();
  const detailQuery = usePatientReviewDetail(
    visible && ratingId ? ratingId : undefined,
  );

  const row = detailQuery.data;
  const rating = row?.rating;
  const appointment = row?.appointment;
  const { name, imageUri } = row
    ? resolveDoctorForReviewRow(row)
    : { name: '—', imageUri: undefined };

  const service = formatReviewServiceLabel(appointment?.appointmentType);
  const scoreLabel = rating ? formatReviewScore(rating.score) : '—';
  const comment =
    rating?.comment != null && String(rating.comment).trim()
      ? String(rating.comment).trim()
      : '—';

  const showSkeleton = Boolean(visible && ratingId && detailQuery.isPending);
  const showError =
    visible && ratingId && detailQuery.isError && !detailQuery.isPending;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              marginTop: Math.max(insets.top, 12),
              marginBottom: Math.max(insets.bottom, 12),
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.sheetInner}>
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Review Details</Text>
                <Text style={styles.subtitle}>
                  Full review and rating information.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.closeGlyph}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollPad}
              keyboardShouldPersistTaps="handled"
            >
              {showSkeleton ? (
                <ReviewDetailsModalSkeleton />
              ) : showError ? (
                <Text style={styles.errorText}>
                  {(detailQuery.error as Error)?.message ??
                    'Could not load this review.'}
                </Text>
              ) : rating ? (
                <View style={styles.body}>
                  <Text style={styles.idLine}>
                    <Text style={styles.idLabel}>Id: </Text>
                    <Text style={styles.idValue}>{rating.id}</Text>
                  </Text>

                  <View style={styles.doctorBlock}>
                    <View style={styles.avatarShell}>
                      {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.avatar} />
                      ) : (
                        <View style={styles.avatarPlaceholder} />
                      )}
                    </View>
                    <View style={styles.doctorTextCol}>
                      <Text style={styles.reviewedToHeading}>Reviewed To</Text>
                      <Text style={styles.doctorName}>{name}</Text>
                    </View>
                  </View>

                  <Text style={styles.fieldLabel}>Rating</Text>
                  <View style={styles.ratingRow}>
                    <RatingStars score={rating.score} size={22} />
                    <Text style={styles.scoreBig}>{scoreLabel}</Text>
                  </View>

                  <Text style={styles.fieldLabel}>Service</Text>
                  <Text style={styles.fieldValue}>{service}</Text>

                  <Text style={styles.fieldLabel}>Review</Text>
                  <View style={styles.commentBox}>
                    <Text style={styles.commentText}>{comment}</Text>
                  </View>
                </View>
              ) : null}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sheet: {
    maxHeight: '92%',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  sheetInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: {
    fontSize: 18,
    color: '#475569',
    fontWeight: '600',
  },
  scrollPad: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },
  body: {
    gap: 0,
  },
  idLine: {
    marginBottom: 18,
  },
  idLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#64748B',
  },
  idValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  doctorBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 20,
  },
  doctorTextCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingTop: 4,
  },
  reviewedToHeading: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  avatarShell: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  doctorName: {
    flex: 1,
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  fieldLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  scoreBig: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  fieldValue: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  commentBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  commentText: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  errorText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export default ReviewDetailsModal;
