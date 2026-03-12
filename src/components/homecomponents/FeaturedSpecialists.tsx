import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  imageUri?: string; // Use URI for remote images
}

const FeaturedSpecialists: React.FC = () => {
  const navigation = useNavigation<any>(); // Use 'any' for nested navigation

  // Sample data - replace with actual data source
  const specialists: Specialist[] = [
    {
      id: '1',
      name: 'Dr. Emily Chen',
      specialty: 'Cardiology',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Dr. Emily Chen',
      specialty: 'Cardiology',
      rating: 4.8,
    },
    {
      id: '3',
      name: 'Dr. Emily Chen',
      specialty: 'Cardiology',
      rating: 4.8,
    },
    {
      id: '4',
      name: 'Dr. Emily Chen',
      specialty: 'Cardiology',
      rating: 4.8,
    },
  ];

  const handleViewAll = () => {
    // Navigate to SelectDoctor screen in the Calendar (Appointments) stack
    // Using the same pattern as OurServices component
    navigation.navigate('Calendar', { screen: 'SelectDoctor' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Featured Specialists</Text>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrollable List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {specialists.map((specialist) => (
          <View key={specialist.id} style={styles.card}>
            {/* Profile Picture */}
            <View style={styles.outerBorderContainer}>
              <View style={styles.borderContainer}>
                <View style={styles.imageContainer}>
                  {specialist.imageUri ? (
                    <Image
                      source={{ uri: specialist.imageUri }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.placeholderImage} />
                  )}
                </View>
              </View>
            </View>

            {/* Name */}
            <Text style={styles.name}>{specialist.name}</Text>

            {/* Specialty */}
            <Text style={styles.specialty}>{specialist.specialty}</Text>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Icons.StarIcon width={14} height={14} />
              <Text style={styles.rating}>{specialist.rating}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
   
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollView: {
    marginLeft: 0, // Remove margin since parent has padding
  },
  scrollContent: {
    paddingRight: 15, // Keep right padding for last item spacing
  },
  card: {
    alignItems: 'center',
    width: 108,
  },
  outerBorderContainer: {
    width: 86,
    height: 86,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Android shadow
    elevation: 4,
  },
  borderContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: Colors.backgroundLight,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 50,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 50,
  },
  name: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  specialty: {
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rating: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 4,
  },
});

export default FeaturedSpecialists;

