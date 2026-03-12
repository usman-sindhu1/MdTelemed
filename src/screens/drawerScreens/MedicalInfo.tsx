import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../components/common/BackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type MedicalInfoNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'MedicalInfo'
>;

type TabType = 'Medical Info' | 'Reports';

const MedicalInfo: React.FC = () => {
  const navigation = useNavigation<MedicalInfoNavigationProp>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('Medical Info');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonContainerHeight = 100;

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleEditPress = () => {
    console.log('Edit Medical Details pressed');
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

  const medicalDetails = [
    { id: '1', label: 'First Therapy', value: 'Yes', icon: Icons.Report },
    { id: '2', label: 'Taking Medicine', value: 'Yes', icon: Icons.Report },
    { id: '3', label: 'Last Visit', value: 'No visits', icon: Icons.CalendarAltIcon },
    { id: '4', label: 'Pre Condition', value: 'Normal', icon: Icons.Report },
    { id: '5', label: 'Current Condition', value: 'Normal', icon: Icons.Report },
    { id: '6', label: 'Appointment For', value: 'self', icon: Icons.VectorIcon },
  ];

  const renderMedicalInfoTab = () => (
    <View style={styles.tabContent}>
      {/* Doctor/Patient Card */}
      <View style={styles.doctorCard}>
        <View style={styles.doctorInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.placeholderAvatar} />
          </View>
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>Dr. Dr Maahi</Text>
            <View style={styles.dateTimeRow}>
              <Icons.VectorIcon width={16} height={16} fill={Colors.textSecondary} />
              <Text style={styles.dateTimeText}>Nov 18, 2025</Text>
            </View>
            <View style={styles.dateTimeRow}>
              <Icons.CalendarAltIcon width={16} height={16} fill={Colors.textSecondary} />
              <Text style={styles.dateTimeText}>2:30 AM</Text>
            </View>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>No_Show</Text>
        </View>
      </View>

      {/* Medical Details Grid */}
      <View style={styles.gridContainer}>
        {medicalDetails.map((detail) => {
          const DetailIcon = detail.icon;
          return (
            <View key={detail.id} style={styles.detailCard}>
              <View style={styles.detailIconContainer}>
                <DetailIcon width={24} height={24} fill={Colors.primary} />
              </View>
              <Text style={styles.detailLabel}>{detail.label}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          );
        })}
      </View>

      {/* Issue Description Card */}
      <View style={styles.issueCard}>
        <Text style={styles.issueTitle}>Issue Description</Text>
        <Text style={styles.issueText}>Wefwefwefwef</Text>
      </View>
    </View>
  );

  const renderReportsTab = () => (
    <View style={styles.tabContent}>
      {/* Doctor/Patient Card */}
      <View style={styles.doctorCard}>
        <View style={styles.doctorInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.placeholderAvatar} />
          </View>
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>Dr Maahi</Text>
            <Text style={styles.dateTimeTextSingle}>Nov 18, 2025 at 2:30 AM</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>No_Show</Text>
        </View>
      </View>

      {/* Medical Reports Section */}
      <View style={styles.reportsSection}>
        <Text style={styles.reportsTitle}>Medical Reports</Text>
        <View style={styles.reportItem}>
          <View style={styles.reportIconContainer}>
            <Icons.Report width={24} height={24} fill={Colors.primary} />
          </View>
          <Text style={styles.reportName}>Report 1</Text>
          <TouchableOpacity style={styles.viewButton} activeOpacity={0.7}>
            <Icons.EyeIcon width={20} height={20} fill={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: buttonContainerHeight + (Platform.OS === 'ios' ? insets.bottom : 0) }
        ]}
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
          {/* Title */}
          <Text style={styles.heading}>Medical History</Text>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'Medical Info' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('Medical Info')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Medical Info' && styles.tabTextActive,
                ]}
              >
                Medical Info
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'Reports' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('Reports')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Reports' && styles.tabTextActive,
                ]}
              >
                Reports
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'Medical Info' ? renderMedicalInfoTab() : renderReportsTab()}
        </View>
      </ScrollView>

      {/* Bottom Button - Animated */}
      <Animated.View
        style={[
          styles.buttonContainer,
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
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditPress}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonText}>Edit Medical Details</Text>
        </TouchableOpacity>
      </Animated.View>
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
  },
  content: {
    paddingHorizontal: 15,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#A473E5',
  },
  tabText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    gap: 16,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundLight,
  },
  placeholderAvatar: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
  },
  doctorDetails: {
    flex: 1,
    gap: 6,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateTimeText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  dateTimeTextSingle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#A473E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  detailCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0E8FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
    textAlign: 'center',
  },
  detailValue: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  issueTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  issueText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  reportsSection: {
    gap: 16,
  },
  reportsTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  reportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  viewButton: {
    padding: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingTop: 12,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  editButton: {
    width: '100%',
    height: 56,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default MedicalInfo;

