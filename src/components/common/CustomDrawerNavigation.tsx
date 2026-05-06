import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Svg, Path, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { logout } from '../../store/slices/authSlice';
import { clearAuthSession } from '../../utils/authSession';
import type { RootState } from '../../store';
import { useLocationDisplay } from '../../hooks/useLocationDisplay';
import {
  getSavedAddress,
  getUserAvatarUri,
  getUserDisplayName,
  getUserEmail,
} from '../../utils/profileDisplay';

interface DrawerItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isDestructive?: boolean;
}

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const insets = useSafeAreaInsets();
  const authUser = useSelector((s: RootState) => s.auth.user) as Record<
    string,
    unknown
  > | null;
  const displayName = getUserDisplayName(authUser);
  const email = getUserEmail(authUser);
  const avatarUri = getUserAvatarUri(authUser);
  const { locationLine } = useLocationDisplay(getSavedAddress(authUser));

  // Get current route state
  const state = props.state;
  const currentRoute = state.routes[state.index];
  const currentRouteName = currentRoute?.name;

  // Get active tab if on MainTabs
  let activeTabName: string | null = null;
  if (currentRouteName === 'MainTabs' && currentRoute?.state) {
    const tabState = currentRoute.state as any;
    const activeTab = tabState.routes[tabState.index];
    activeTabName = activeTab?.name;
  }

  // Determine which drawer item is active
  const getActiveItemId = (): string | null => {
    // Check if on a drawer screen
    if (currentRouteName && currentRouteName !== 'MainTabs') {
      // Map drawer screen names to item IDs
      const screenToItemMap: { [key: string]: string } = {
        'Invoices': 'invoices',
        'InvoiceDetails': 'invoices',
        'RatingsAndReviews': 'rating',
        'ProfileSettings': 'profile-settings',
        'ProfileDetails': 'profile-settings',
        'ChangePassword': 'change-password',
        'Doctors': 'doctors',
        'DoctorDetails': 'doctors',
        'ContactUs': 'contact',
        'MedicalInfo': 'medical-info',
        'NotificationSettings': 'profile-settings',
        'HelpAndFaqs': 'profile-settings',
        'TermsAndConditions': 'profile-settings',
        'PrivacyPolicy': 'profile-settings',
        'Language': 'language',
      };
      return screenToItemMap[currentRouteName] || null;
    }

    // Check if on a tab
    if (activeTabName) {
      const tabToItemMap: { [key: string]: string } = {
        'Home': 'home',
        'Calendar': 'appointments',
        'Prescription': 'prescriptions',
        'Notifications': 'notifications',
        'Settings': 'profile-settings',
      };
      return tabToItemMap[activeTabName] || null;
    }

    // Default to home
    return 'home';
  };

  const activeItemId = getActiveItemId();

  // Profile Options Items
  const profileOptions: DrawerItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M9 22V12h6v10" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Icons.Calendar2Icon width={24} height={24} />,
    },
    {
      id: 'prescriptions',
      label: 'My Prescriptions',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="16" height="16" rx="2" stroke="#000" strokeWidth="1.5" />
          <SvgText x="12" y="16" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000">A</SvgText>
        </Svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Icons.NotificationsBlackIcon width={24} height={24} />,
    },
    {
      id: 'doctors',
      label: 'Doctors',
      icon: <Icons.Vector6Icon width={24} height={24} />,
    },
    {
      id: 'invoices',
      label: 'Payments',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M12 2v20M17 5H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
    },
    {
      id: 'rating',
      label: 'Rating & Reviews',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
    },
    {
      id: 'medical-info',
      label: 'Medical History',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="16" height="16" rx="2" stroke="#000" strokeWidth="1.5" />
          <SvgText x="12" y="16" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000">A</SvgText>
        </Svg>
      ),
    },
    {
      id: 'contact',
      label: 'Contact us',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
    },
  ];

  // Account Settings Items
  const accountSettings: DrawerItem[] = [
    {
      id: 'profile-settings',
      label: 'Settings',
      icon: <Icons.UserSettingsIcon width={24} height={24} />,
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: <Icons.PasswordIcon width={24} height={24} />,
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M16 17l5-5-5-5" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M21 12H9" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
      isDestructive: true,
    },
  ];

  const handleItemPress = (itemId: string) => {
    // Map item ID to tab name or drawer screen
    const tabMap: { [key: string]: string } = {
      'home': 'Home',
      'appointments': 'Calendar',
      'prescriptions': 'Prescription',
      'notifications': 'Notifications',
      'profile-settings': 'Settings',
    };

    const screenName = tabMap[itemId];

    if (screenName) {
      // Navigate to bottom tab
      props.navigation.navigate('MainTabs', {
        screen: screenName,
      });
    } else if (itemId === 'invoices') {
      // Navigate to drawer screen
      props.navigation.navigate('Invoices');
    } else if (itemId === 'rating') {
      // Navigate to Ratings & Reviews screen
      props.navigation.navigate('RatingsAndReviews');
    } else if (itemId === 'profile-settings') {
      // Navigate to Profile Settings screen
      props.navigation.navigate('ProfileSettings');
    } else if (itemId === 'change-password') {
      // Navigate to Change Password screen
      props.navigation.navigate('ChangePassword');
    } else if (itemId === 'doctors') {
      // Navigate to Doctors screen
      props.navigation.navigate('Doctors');
    } else if (itemId === 'contact') {
      // Navigate to Contact Us screen
      props.navigation.navigate('ContactUs');
    } else if (itemId === 'medical-info') {
      props.navigation.navigate('MedicalInfo');
    } else if (itemId === 'language') {
      // Navigate to Language screen
      props.navigation.navigate('Language');
    } else if (itemId === 'logout') {
      // Handle logout
      handleLogout();
      return; // Don't close drawer here, let logout handle it
    }

    // Close drawer after navigation
    props.navigation.closeDrawer();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Close drawer first
    props.navigation.closeDrawer();
    
    // Simulate logout process (e.g., API call, clearing storage, etc.)
    setTimeout(async () => {
      await clearAuthSession();
      dispatch(logout());
      setIsLoggingOut(false);
    }, 1000);
  };

  const renderDrawerItem = (item: DrawerItem) => {
    const isActive = activeItemId === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.drawerItem,
          isActive && styles.drawerItemActive,
        ]}
        onPress={() => handleItemPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {item.icon}
        </View>
        <Text style={[
          styles.drawerItemText,
          item.isDestructive && styles.destructiveText,
          isActive && styles.drawerItemTextActive,
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <DrawerContentScrollView
        {...props}
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: 20 + Math.max(insets.bottom, 12) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>
                  {(displayName.trim() || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.headerTextCol}>
              <Text style={styles.headerName} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.headerEmail} numberOfLines={1}>
                {email || '—'}
              </Text>
              <View style={styles.locationRow}>
                <Icons.LocationIcon width={14} height={14} />
                <Text style={styles.locationText} numberOfLines={2}>
                  {locationLine}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Menu</Text>
        <View style={styles.sectionCard}>{profileOptions.map(renderDrawerItem)}</View>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Account Settings</Text>
        <View style={styles.sectionCard}>{accountSettings.map(renderDrawerItem)}</View>

        {/* Logout Loading Modal */}
        <Modal
          visible={isLoggingOut}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Logging out...</Text>
            </View>
          </View>
        </Modal>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 10,
    marginLeft: 2,
  },
  headerCard: {
    borderRadius: 18,
    backgroundColor: '#ECF2FD',
    padding: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  headerTextCol: { flex: 1, minWidth: 0 },
  headerName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerEmail: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  locationText: {
    flex: 1,
    minWidth: 0,
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  drawerItemActive: {
    backgroundColor: '#E8EEF9',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerItemText: {
    flex: 1,
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  drawerItemTextActive: {
    color: Colors.primary,
  },
  destructiveText: {
    color: '#EF4444',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 150,
  },
  loadingText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginTop: 16,
  },
});

export default CustomDrawer;

