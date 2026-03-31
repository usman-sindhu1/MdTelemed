import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';
import Button from '../../../components/Button';
import AppointmentsInfo from './AppointmentsInfo';
import DoctorInfo from './DoctorInfo';
import PatientInfoTab from './PatientInfo';
import MedicalInfo from './MedicalInfo';
import Reports from './Reports';
import PrescriptionContent from './PrescriptionContent';
import Conversation from './Conversation';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';

type MainTabType = 'Appointment Info' | 'Doctor Info' | 'Patient Info' | 'Medical Info' | 'Reports' | 'Prescription' | 'Conversation';

type AppointmentDetailsNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'AppointmentDetails'
>;

const AppointmentDetails: React.FC = () => {
  const navigation = useNavigation<AppointmentDetailsNavigationProp>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<MainTabType>('Appointment Info');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const tabsScrollViewRef = useRef<ScrollView>(null);
  const contentScrollViewRef = useRef<ScrollView>(null);
  const tabPositions = useRef<{ [key: string]: number }>({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  const mainTabs: MainTabType[] = ['Appointment Info', 'Doctor Info', 'Patient Info', 'Medical Info', 'Reports', 'Prescription', 'Conversation'];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
  };

  const handleJoinSession = () => {
    navigation.navigate('JoinSession');
  };

  const handleGenerateReport = () => {
    console.log('Generate Report pressed');
  };

  const handleTabPress = (tab: MainTabType) => {
    setActiveTab(tab);
    
    // Scroll to center the selected tab
    setTimeout(() => {
      const tabPosition = tabPositions.current[tab];
      if (tabPosition !== undefined && tabsScrollViewRef.current) {
        const screenWidth = Dimensions.get('window').width;
        const scrollPosition = tabPosition - (screenWidth / 2) + 80; // 80 is approximate tab width/2
        tabsScrollViewRef.current.scrollTo({
          x: Math.max(0, scrollPosition),
          animated: true,
        });
      }
    }, 100);
  };

  const handleTabLayout = (tab: MainTabType, event: any) => {
    const { x } = event.nativeEvent.layout;
    tabPositions.current[tab] = x;
  };

  useEffect(() => {
    if (isScrolling || isAtBottom) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isScrolling, isAtBottom]);

  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: isSearchActive ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isSearchActive, searchAnim]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Appointment Info':
        return <AppointmentsInfo />;
      case 'Doctor Info':
        return <DoctorInfo />;
      case 'Patient Info':
        return <PatientInfoTab />;
      case 'Medical Info':
        return <MedicalInfo />;
      case 'Reports':
        return <Reports />;
      case 'Prescription':
        return <PrescriptionContent />;
      case 'Conversation':
        return <Conversation />;
      default:
        return <AppointmentsInfo />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerBlock}>
        <View style={[styles.headerContent, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerActionsRow}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Icons.Vector1Icon width={22} height={22} />
            </TouchableOpacity>
            {!isSearchActive && (
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={handleSearchPress}
                activeOpacity={0.7}
              >
                <Icons.Search width={20} height={20} />
              </TouchableOpacity>
            )}
            {isSearchActive && (
              <Animated.View
                style={[
                  styles.searchBar,
                  {
                    opacity: searchAnim,
                    transform: [
                      {
                        translateX: searchAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [80, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Icons.Search width={18} height={18} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="#9CA3AF"
                  value={searchText}
                  onChangeText={setSearchText}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={handleCloseSearch}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.mainSection}>
        <Text style={styles.title}>Appointment Details</Text>

        {/* Main Tabs */}
        <ScrollView
          ref={tabsScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScrollView}
        >
          {mainTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.tabActive,
              ]}
              onPress={() => handleTabPress(tab)}
              onLayout={(event) => handleTabLayout(tab, event)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView
        ref={contentScrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollBegin={() => setIsScrolling(true)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const scrollY = contentOffset.y;
          const contentHeight = contentSize.height;
          const scrollViewHeight = layoutMeasurement.height;
          const isNearBottom = scrollY + scrollViewHeight >= contentHeight - 50; // 50px threshold
          
          if (isNearBottom) {
            setIsAtBottom(true);
          } else if (scrollY < 100) {
            // Near top
            setIsAtBottom(false);
          }
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      </ScrollView>

      {/* Action Buttons - Hidden for Conversation tab */}
      {activeTab !== 'Conversation' && (
        <Animated.View
          style={[
            styles.actionButtonsContainer,
            {
              paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 20,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
              pointerEvents: (isScrolling || isAtBottom) ? 'auto' : 'none',
            },
          ]}
        >
          <Button
            title="Join Session"
            onPress={handleJoinSession}
            style={styles.joinSessionButton}
            textStyle={styles.joinSessionText}
          />
          <Button
            title="Generate Report"
            onPress={handleGenerateReport}
            variant="half-outlined"
            style={styles.generateReportButton}
            textStyle={styles.generateReportText}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBlock: {
    backgroundColor: '#ECF2FD',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerContent: {
    paddingHorizontal: 15,
    paddingBottom: 14,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  cancelText: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  mainSection: {
    paddingHorizontal: 15,
  },
  content: {
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 20,
  },
  tabsScrollView: {
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 15,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    gap: 12,
  },
  joinSessionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 80,
    height: 56,
  },
  joinSessionText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  generateReportButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 80,
    height: 56,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  generateReportText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default AppointmentDetails;

