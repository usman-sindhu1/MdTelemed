import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icons from '../../../assets/svg';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';

type ReviewsScreenNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'ReviewsScreen'
>;

const ReviewsScreen: React.FC = () => {
  const navigation = useNavigation<ReviewsScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleStarPress = (index: number) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    console.log('Submit review:', { rating, review });
    // TODO: Submit review logic
    setIsVisible(false);
    setTimeout(() => {
      // Reset navigation stack to Home tab, clearing all previous screens
      const parent = navigation.getParent();
      if (parent) {
        parent.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        );
      } else {
        // Fallback: navigate to home screen directly
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HomeMain' as any }],
          })
        );
      }
    }, 300); // Wait for modal animation to complete
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
          <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            {/* Title */}
            <Text style={styles.title}>Submit Your Review</Text>

            {/* Instructions */}
            <Text style={styles.instructions}>
              Please rate and write your experience the / the doctor and our app.
            </Text>

            {/* Star Rating */}
            <View style={styles.starContainer}>
              {[0, 1, 2, 3, 4].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleStarPress(index)}
                  activeOpacity={0.7}
                  style={styles.starButton}
                >
                  <Icons.Star1Icon
                    width={32}
                    height={32}
                    fill={index < rating ? '#FFD700' : 'none'}
                    stroke={index < rating ? '#FFD700' : '#525252'}
                    strokeWidth={index < rating ? 2 : 1.5}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Input */}
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review"
              placeholderTextColor={Colors.textLight}
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.textLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  instructions: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  starButton: {
    padding: 4,
  },
  reviewInput: {
    minHeight: 120,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cancelButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default ReviewsScreen;

