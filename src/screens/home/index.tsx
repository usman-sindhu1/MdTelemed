import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../../components/common/HomeHeader';
import FeaturedSpecialists from '../../components/homecomponents/FeaturedSpecialists';
import UpcommingAppointments from '../../components/homecomponents/UpcommingAppointments';
import OurServices from '../../components/homecomponents/OurServices';
import Icons from '../../assets/svg';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Fonts from '../../constants/fonts';
import { useScrollContext } from '../../contexts/ScrollContext';

const Home: React.FC = () => {
  const navigation = useNavigation();
  const { setIsScrollingDown } = useScrollContext();
  const scrollY = useRef(0);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleStartNow = () => {
    console.log('Start Now pressed');
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollingDown = currentScrollY > scrollY.current;
    
    if (scrollingDown && currentScrollY > 50) {
      // Scrolling down and past threshold
      setIsScrollingDown(true);
    } else if (!scrollingDown) {
      // Scrolling up
      setIsScrollingDown(false);
    }
    
    scrollY.current = currentScrollY;
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <HomeHeader
          onMenuPress={handleMenuPress}
          onSearchPress={handleSearchPress}
          onSearchChange={handleSearchChange}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>How We Can Help</Text>
            <Text style={styles.heading}>You With?</Text>
          </View>

          {/* Gradient Card */}
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={['#6715D3', '#D1B9F2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradientCard}
            >
              {/* Icon with white dot */}
              <View style={styles.iconWrapper}>
                <View style={styles.iconContainer}>
                  <Icons.VideoIcon width={32} height={32} />
                  <View style={styles.dotContainer}>
                    <Icons.WhiteDot width={16} height={16} />
                  </View>
                </View>
              </View>

              {/* Title */}
              <Text style={styles.cardTitle}>Instant Video Consultation</Text>

              {/* Description */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.cardDescription}>
                  Connect with certified doctors in seconds.
                </Text>
                <Text style={styles.cardDescription}>
                  Available 24/7 for your health needs.
                </Text>
              </View>

              {/* Start Now Button */}
              <TouchableOpacity
                style={styles.startNowButton}
                onPress={handleStartNow}
                activeOpacity={0.8}
              >
                <Text style={styles.startNowText}>Start Now</Text>
                <View style={styles.arrowContainer}>
                  <Icons.ArrowRight width={20} height={20} />
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Featured Specialists */}
          <FeaturedSpecialists />

          {/* Upcoming Appointments */}
          <UpcommingAppointments />

          {/* Our Services */}
          <OurServices />
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 15,
  },
  headingContainer: {
    marginTop: 24,
    marginBottom: 15,
  },
  heading: {
    ...Typography.h4,
    fontFamily: Fonts.raleway,
    color: Colors.textPrimary,
    fontWeight:700
  },
  cardContainer: {
    width: '100%',

  },
  gradientCard: {
    borderRadius: 20,
    paddingBottom: 30,
    minHeight: 240,
  },
  iconWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginTop: 30,

  },
  dotContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    zIndex: 1,
  },
  cardTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 32,
    marginLeft: 30
  },
  descriptionContainer: {
    marginBottom: 24,
    textAlign: 'center',
    
  },
  cardDescription: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    opacity: 0.9,
    textAlign: 'left',
    marginLeft: 30
  },
  startNowButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginLeft: 30,
    marginBottom: 30,
  },
  startNowText: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 8,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;

