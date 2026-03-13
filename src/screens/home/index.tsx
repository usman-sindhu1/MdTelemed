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
import HomeHeader from '../../components/common/HomeHeader';
import FeaturedSpecialists from '../../components/homecomponents/FeaturedSpecialists';
import IAmLookingFor from '../../components/homecomponents/IAmLookingFor';
import WellBeing from '../../components/homecomponents/WellBeing';
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

  const handleProfilePress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleAIChatPress = () => {
    // Navigate to AI Chat / chat screen
    navigation.navigate('Chat' as never);
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications' as never);
  };

  const handleFeelingPress = (index: number) => {
    console.log('Feeling emoji pressed:', index);
  };

  const handleStartNow = () => {
    console.log('Start Now pressed');
  };

  const handleSetupForLater = () => {
    (navigation.getParent() as any)?.getParent()?.navigate('BookAppt');
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
    <View style={styles.container}>
      <SafeAreaView style={styles.scrollWrapper} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header scrolls with content */}
        <View style={styles.headerContainer}>
          <HomeHeader
            onProfilePress={handleProfilePress}
            onSearchChange={handleSearchChange}
            onAIChatPress={handleAIChatPress}
            onNotificationPress={handleNotificationPress}
            onFeelingPress={handleFeelingPress}
            placeholder="Search doctor, service"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Connect with top doctors instantly.</Text>

          {/* Two cards: Quick Consultation & Setup For Later */}
          <View style={styles.twoCardRow}>
            <View style={styles.quickConsultCardWrapper}>
              <TouchableOpacity
                style={styles.quickConsultCard}
                onPress={handleStartNow}
                activeOpacity={0.9}
              >
                <View style={styles.quickConsultIconWrap}>
                  <Icons.CalendarTodayIcon width={20} height={20} />
                </View>
                <Text style={styles.quickConsultTitle}>Quick</Text>
                <Text style={[styles.quickConsultTitle, styles.cardTitleSecondLine]}>Consultation</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.setupLaterCardWrapper}>
              <TouchableOpacity
                style={styles.setupLaterCard}
                onPress={handleSetupForLater}
                activeOpacity={0.9}
              >
                <View style={styles.setupLaterIconWrap}>
                  <Icons.CalendarClockIcon width={20} height={20} />
                </View>
                <Text style={styles.setupLaterTitle}>Setup For</Text>
                <Text style={[styles.setupLaterTitle, styles.cardTitleSecondLine]}>Later</Text>
              </TouchableOpacity>
            </View>
          </View>

          <IAmLookingFor />

          <WellBeing />
        </View>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: '#ECF2FD',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 0,
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '400',
    color: '#757575',
    marginTop: 24,
    marginBottom: 16,
  },
  twoCardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  quickConsultCardWrapper: {
    flex: 1,
    minHeight: 120,
    borderRadius: 18,
    // box-shadow: 0px 8px 10px -6px #2B7FFF40
    shadowColor: '#2B7FFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  quickConsultCard: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 18,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
    // box-shadow: 0px 20px 25px -5px #2B7FFF40
    shadowColor: '#2B7FFF',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 5,
  },
  quickConsultIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  quickConsultTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  cardTitleSecondLine: {
    marginTop: -12,
  },
  setupLaterCardWrapper: {
    flex: 1,
    minHeight: 120,
    borderRadius: 18,
    // box-shadow: 0px 4px 6px -4px #0000000D
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  setupLaterCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    // box-shadow: 0px 10px 15px -3px #0000000D
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  setupLaterIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  setupLaterTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 20,
  },
});

export default Home;

