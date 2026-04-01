import React, { useEffect, useMemo, useState } from 'react';
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
import { useScrollContext } from '../../contexts/ScrollContext';

interface NotificationData {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  type: 'Appointment' | 'Payment' | 'Prescription' | 'Push';
  isRead: boolean;
}

const Notifications: React.FC = () => {
  const navigation = useNavigation();
  const { setIsScrollingDown } = useScrollContext();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Appointment' | 'Payment' | 'Prescription' | 'Push'>('All');

  useEffect(() => {
    return () => {
      setIsScrollingDown(false);
    };
  }, [setIsScrollingDown]);

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
    {
      id: '4',
      title: 'Push Notifications Enabled',
      message: 'Firebase push notifications are active. You will receive reminders and prescription updates.',
      date: 'Jan 20, 2025',
      time: '08:20 AM',
      type: 'Push',
      isRead: true,
    },
  ];

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleAIChatPress = () => {
    const tabNavigation = navigation.getParent();
    if (tabNavigation) {
      tabNavigation.navigate('Chat' as never);
      return;
    }
    navigation.navigate('Chat' as never);
  };

  const handleNotificationPress = (notification: NotificationData) => {
    console.log('Notification pressed:', notification);
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'All') {
      return notifications;
    }
    return notifications.filter((item) => item.type === activeFilter);
  }, [activeFilter, notifications]);

  const getTypeStyle = (type: NotificationData['type']) => {
    switch (type) {
      case 'Appointment':
        return styles.typeAppointment;
      case 'Payment':
        return styles.typePayment;
      case 'Prescription':
        return styles.typePrescription;
      case 'Push':
        return styles.typePush;
      default:
        return styles.typeAppointment;
    }
  };

  const handleScrollStart = () => {
    setIsScrollingDown(true);
  };

  const handleScrollStop = () => {
    setIsScrollingDown(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.scrollWrapper} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={handleScrollStart}
          onMomentumScrollBegin={handleScrollStart}
          onScrollEndDrag={handleScrollStop}
          onMomentumScrollEnd={handleScrollStop}
        >
          <View style={styles.headerContainer}>
            <HomeHeader
              onProfilePress={handleMenuPress}
              onSearchChange={handleSearchChange}
              onAIChatPress={handleAIChatPress}
              placeholder="Search notifications"
              showFeelingRow={false}
              showNotificationIcon={false}
            />
          </View>
          <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Notifications</Text>
            <Text style={styles.description}>
              Appointment reminders, payment confirmations, prescription updates, and push notification status.
            </Text>
          </View>

          <View style={styles.filterRow}>
            {(['All', 'Appointment', 'Payment', 'Prescription', 'Push'] as const).map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Notification Cards */}
          <View style={styles.cardsContainer}>
            {filteredNotifications.map((notification) => (
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
                  <View style={[styles.typeLabel, getTypeStyle(notification.type)]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollWrapper: {
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  pushStatusCard: {
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 12,
    marginBottom: 16,
  },
  pushStatusTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  pushStatusText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 18,
  },
  notificationCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unreadCard: {
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeLabel: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  typeAppointment: {
    backgroundColor: Colors.primary,
  },
  typePayment: {
    backgroundColor: '#16A34A',
  },
  typePrescription: {
    backgroundColor: '#7C3AED',
  },
  typePush: {
    backgroundColor: '#0EA5E9',
  },
  typeText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateLabel: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  dateText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
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
