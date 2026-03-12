import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Svg, Path, Circle, Rect, Text as SvgText } from 'react-native-svg';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { logout } from '../../store/slices/authSlice';

interface DrawerItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isDestructive?: boolean;
}

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        'ReviewDetails': 'rating',
        'ProfileSettings': 'profile-settings',
        'ChangePassword': 'change-password',
        'Doctors': 'doctors',
        'DoctorDetails': 'doctors',
        'Services': 'services',
        'ContactUs': 'contact',
        'MedicalInfo': 'medical-info',
        'NotificationSettings': 'notification-settings',
        'HelpAndFaqs': 'help-faqs',
        'TermsAndConditions': 'terms',
        'PrivacyPolicy': 'privacy',
        'Language': 'language',
      };
      return screenToItemMap[currentRouteName] || null;
    }

    // Check if on a tab
    if (activeTabName) {
      const tabToItemMap: { [key: string]: string } = {
        'Home': 'home',
        'Calendar': 'appointments',
        'Chat': 'chats',
        'Prescription': 'prescriptions',
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
      id: 'chats',
      label: 'Chats',
      icon: <Icons.Chat1Icon width={24} height={24} />,
    },
    {
      id: 'services',
      label: 'Services',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
    },
    {
      id: 'doctors',
      label: 'Doctors',
      icon: <Icons.Vector6Icon width={24} height={24} />,
    },
    {
      id: 'invoices',
      label: 'Invoices',
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
      label: 'Medical Info',
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
      label: 'Profile Settings',
      icon: <Icons.UserSettingsIcon width={24} height={24} />,
    },
    {
      id: 'language',
      label: 'Language',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: <Icons.PasswordIcon width={24} height={24} />,
    },
    {
      id: 'notification-settings',
      label: 'Notification Settings',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
    },
    {
      id: 'help-faqs',
      label: "Help & FAQ's",
      icon: <Icons.Vector7Icon width={24} height={24} />,
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
      'chats': 'Chat',
      'prescriptions': 'Prescription',
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
    } else if (itemId === 'services') {
      // Navigate to Services screen
      props.navigation.navigate('Services');
    } else if (itemId === 'contact') {
      // Navigate to Contact Us screen
      props.navigation.navigate('ContactUs');
    } else if (itemId === 'medical-info') {
      // Navigate to Medical Info screen
      props.navigation.navigate('MedicalInfo');
    } else if (itemId === 'notification-settings') {
      // Navigate to Notification Settings screen
      props.navigation.navigate('NotificationSettings');
    } else if (itemId === 'help-faqs') {
      // Navigate to Help & FAQs screen
      props.navigation.navigate('HelpAndFaqs');
    } else if (itemId === 'terms') {
      // Navigate to Terms & Conditions screen
      props.navigation.navigate('TermsAndConditions');
    } else if (itemId === 'privacy') {
      // Navigate to Privacy Policy screen
      props.navigation.navigate('PrivacyPolicy');
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
    setTimeout(() => {
      // Dispatch logout action - this will update Redux state
      // RootNavigator will automatically switch to AuthStack when isAuthenticated becomes false
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
    <DrawerContentScrollView {...props} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Icons.Logo1 width={220} height={80} preserveAspectRatio="xMidYMid meet" />
        </View>
        <Text style={styles.headerTitle}>Profile Options</Text>
      </View>

      {/* Profile Options Section */}
      <View style={styles.section}>
        {profileOptions.map(renderDrawerItem)}
      </View>

      {/* Account Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        {accountSettings.map(renderDrawerItem)}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerLinkContainer}
          onPress={() => handleItemPress('terms')} 
          activeOpacity={0.7}
        >
          <Text style={styles.footerLink} numberOfLines={2}>
            Terms & Conditions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerLinkContainer}
          onPress={() => handleItemPress('privacy')} 
          activeOpacity={0.7}
        >
          <Text style={styles.footerLink} numberOfLines={2}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: 12,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: -65
  },
  headerTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  drawerItemActive: {
    backgroundColor: '#F0E8FB',
    borderTopRightRadius: 80,
    borderBottomRightRadius: 80,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerItemText: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
    flex: 1,
  },
  drawerItemTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  destructiveText: {
    color: '#EF4444',
  },
  footer: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 0,
    gap: 8,
  },
  footerLinkContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  footerLink: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'left',
    lineHeight: 18,
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

