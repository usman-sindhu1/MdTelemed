import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Path, Circle, Rect, Text as SvgText } from 'react-native-svg';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

interface DrawerItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  isDestructive?: boolean;
}

interface CustomDrawerProps {
  onClose: () => void;
  onItemPress?: (itemId: string) => void;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ onClose, onItemPress }) => {
  // Profile Options Items
  const profileOptions: DrawerItem[] = [
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
      id: 'appointments',
      label: 'Appointments',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#000" strokeWidth="1.5" />
          <Path d="M3 10h18" stroke="#000" strokeWidth="1.5" />
          <Circle cx="8" cy="7" r="1" fill="#000" />
          <Circle cx="16" cy="7" r="1" fill="#000" />
          <SvgText x="12" y="18" fontSize="10" textAnchor="middle" fill="#000">17</SvgText>
        </Svg>
      ),
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
      id: 'doctors',
      label: 'Doctors',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx="9" cy="7" r="4" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#000" strokeWidth="1.5" fill="none" />
          <Circle cx="18" cy="7" r="4" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
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
      id: 'chats',
      label: 'Chats',
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M17 9a2 2 0 0 1-2 2H3l-2 2V1a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" stroke="#000" strokeWidth="1.5" fill="none" />
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
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="8" r="5" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#000" strokeWidth="1.5" fill="none" />
          <Circle cx="18" cy="18" r="3" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
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
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M12 8v4M12 16h.01" stroke="#000" strokeWidth="1.5" fill="none" />
          <Path d="M9 12l2 2 4-4" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
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
      id: 'help',
      label: "Help & FAQ's",
      icon: (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#000" strokeWidth="1.5" fill="none" />
          <Circle cx="12" cy="10" r="1" fill="#000" />
          <Path d="M12 13v-1" stroke="#000" strokeWidth="1.5" fill="none" />
        </Svg>
      ),
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

  const handleItemPress = (item: DrawerItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (onItemPress) {
      onItemPress(item.id);
    }
  };

  const renderDrawerItem = (item: DrawerItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.drawerItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {item.icon}
      </View>
      <Text style={[styles.drawerItemText, item.isDestructive && styles.destructiveText]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback>
        <SafeAreaView style={styles.drawerContent} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile Options</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6l12 12" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity onPress={() => onItemPress?.('terms')} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Terms & Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onItemPress?.('privacy')} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: '70%',
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
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
  destructiveText: {
    color: '#EF4444',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginTop: 8,
  },
  footerLink: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
});

export default CustomDrawer;

