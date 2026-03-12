import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../components/common/BackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type RatingsAndReviewsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'RatingsAndReviews'
>;

interface ReviewData {
  id: string;
  rating: number;
  reviewText: string;
}

const RatingsAndReviews: React.FC = () => {
  const navigation = useNavigation<RatingsAndReviewsNavigationProp>();

  const reviews: ReviewData[] = [
    {
      id: '5646543',
      rating: 5.0,
      reviewText: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliqua...',
    },
    {
      id: '5646543',
      rating: 5.0,
      reviewText: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliqua...',
    },
    {
      id: '5646543',
      rating: 5.0,
      reviewText: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliqua...',
    },
  ];

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleCardPress = (review: ReviewData) => {
    navigation.navigate('ReviewDetails');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <BackHeader
          onBackPress={handleBackPress}
          onSearchPress={handleSearchPress}
          onSearchChange={handleSearchChange}
          showSearchIcon={true}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Ratings & Reviews</Text>
            <Text style={styles.description}>
              Ratings & feedback you've submitted against your sessions.
            </Text>
          </View>

          {/* Review Cards */}
          <View style={styles.cardsContainer}>
            {reviews.map((review, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reviewCard}
                onPress={() => handleCardPress(review)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.idLabel}>
                    <Text style={styles.idText}>ID: {review.id}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Icons.Star1Icon width={16} height={16} fill="#A473E5" />
                    <Text style={styles.ratingText}>{review.rating}</Text>
                  </View>
                </View>

                <View style={styles.reviewSection}>
                  <Text style={styles.reviewLabel}>Your review</Text>
                  <Text style={styles.reviewText} numberOfLines={3}>
                    {review.reviewText}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
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
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
    zIndex: 10,
    paddingBottom: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 15,
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 24,
    gap: 8,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  cardsContainer: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idLabel: {
    backgroundColor: '#A473E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  idText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
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
    color: '#A473E5',
  },
  reviewSection: {
    gap: 8,
  },
  reviewLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  reviewText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});

export default RatingsAndReviews;

