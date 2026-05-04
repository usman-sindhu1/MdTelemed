import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';

export interface LeaveReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  onSkip: () => void;
}

const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  visible,
  onClose,
  onSubmit,
  onSkip,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!visible) {
      setRating(0);
      setComment('');
    }
  }, [visible]);

  const sheetContent = (
    <>
      <Pressable style={styles.dim} onPress={onClose} />
      <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Leave a review</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.prompt}>How was your appointment?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setRating(n)}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                {n <= rating ? (
                  <Icons.StarFill1Icon width={36} height={36} />
                ) : (
                  <Icons.Star1Icon width={36} height={36} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Optional comment"
            placeholderTextColor={Colors.textLight}
            value={comment}
            onChangeText={setComment}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => {
                onSkip();
                onClose();
              }}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                rating < 1 && styles.submitBtnDisabled,
              ]}
              disabled={rating < 1}
              onPress={() => {
                if (rating < 1) return;
                onSubmit(rating, comment.trim());
              }}
            >
              <Text style={styles.submitText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {Platform.OS === 'android' ? (
        <View style={styles.backdrop}>{sheetContent}</View>
      ) : (
        <KeyboardAvoidingView style={styles.backdrop} behavior="padding">
          {sheetContent}
        </KeyboardAvoidingView>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    zIndex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  closeText: {
    fontSize: 22,
    color: Colors.textPrimary,
    marginTop: -2,
  },
  prompt: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    padding: 14,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    flexWrap: 'wrap',
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: '#FFFFFF',
  },
  skipText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: Colors.primary,
  },
  submitBtnDisabled: {
    opacity: 0.45,
  },
  submitText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default LeaveReviewModal;
