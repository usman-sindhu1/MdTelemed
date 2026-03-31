import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type ReviewDetailsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'ReviewDetails'
>;

const ReviewDetails: React.FC = () => {
  const navigation = useNavigation<ReviewDetailsNavigationProp>();

  const reviewId = '5646543';
  const rating = 5.0;
  const doctorName = 'Cody Fisher';
  const serviceGot = 'Allergist';
  const serviceDate = 'Jan 22, 2025';
  const reviewedOn = 'Jan 22, 2025';
  const reviewText = 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliqua...';

  const handleBackPress = () => {
    navigation.navigate('RatingsAndReviews');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <SimpleBackHeader
          title="Review Details"
          onBackPress={handleBackPress}
          backgroundColor="#ECF2FD"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.heading}>Review Details</Text>
              <View style={styles.ratingContainer}>
                <Icons.Star1Icon width={16} height={16} fill={Colors.primary} />
                <Text style={styles.ratingText}>{rating}</Text>
              </View>
            </View>
            <View style={styles.idLabel}>
              <Text style={styles.idText}>ID: {reviewId}</Text>
            </View>
          </View>

          {/* Doctor Information Card */}
          <View style={styles.doctorCard}>
            <Text style={styles.doctorLabel}>Doctor name</Text>
            <View style={styles.doctorInfo}>
              <View style={styles.outerBorderContainer}>
                <View style={styles.borderContainer}>
                  <View style={styles.imageContainer}>
                    <View style={styles.placeholderImage} />
                  </View>
                </View>
              </View>
              <Text style={styles.doctorName}>{doctorName}</Text>
            </View>
          </View>

          {/* Service Information */}
          <View style={styles.serviceInfoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Service got:</Text>
              <Text style={styles.infoValue}>{serviceGot}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Service date:</Text>
              <Text style={styles.infoValue}>{serviceDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reviewed on:</Text>
              <Text style={styles.infoValue}>{reviewedOn}</Text>
            </View>
          </View>

          {/* Your Review Section */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Your Review</Text>
            <Text style={styles.reviewText}>{reviewText}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 15,
  },
  titleSection: {
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  idLabel: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  idText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doctorCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  doctorLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  outerBorderContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  borderContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: Colors.backgroundLight,
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 22,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  serviceInfoSection: {
    gap: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
  },
  infoValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginLeft: 4,
  },
  reviewSection: {
    gap: 12,
  },
  reviewTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});

export default ReviewDetails;

