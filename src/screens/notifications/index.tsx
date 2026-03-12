import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import HomeHeader from '../../components/common/HomeHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  type: string;
  isRead: boolean;
}

const Notifications: React.FC = () => {
  const navigation = useNavigation();

  const notifications: NotificationData[] = [
    {
      id: '1',
      title: 'Appointment Reminder',
      message: 'You have an appointment with Dr. Cody Fisher tomorrow at 11:00 AM',
      date: 'Jan 22, 2025',
      time: '10:30 AM',
      type: 'Appointment',
      isRead: false,
    },
    {
      id: '2',
      title: 'Prescription Ready',
      message: 'Your prescription for Skin Care is ready for download',
      date: 'Jan 21, 2025',
      time: '02:15 PM',
      type: 'Prescription',
      isRead: false,
    },
    {
      id: '3',
      title: 'Payment Confirmed',
      message: 'Your payment of $150 has been confirmed for appointment ID: 5646543',
      date: 'Jan 20, 2025',
      time: '09:45 AM',
      type: 'Payment',
      isRead: true,
    },
  ];

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleNotificationPress = (notification: NotificationData) => {
    console.log('Notification pressed:', notification);
    // TODO: Handle notification press
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
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Notifications</Text>
            <Text style={styles.description}>
              All of your notifications and updates from the app will appear here.
            </Text>
          </View>

          {/* Notification Cards */}
          <View style={styles.cardsContainer}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.isRead && styles.unreadCard,
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.typeLabel}>
                    <Text style={styles.typeText}>{notification.type}</Text>
                  </View>
                  <View style={styles.dateLabel}>
                    <Text style={styles.dateText}>
                      {notification.date} | {notification.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
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
  notificationCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeLabel: {
    backgroundColor: '#A473E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  typeText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateLabel: {
    backgroundColor: '#F0E8FB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  dateText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  notificationContent: {
    gap: 8,
  },
  notificationTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  notificationMessage: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default Notifications;
