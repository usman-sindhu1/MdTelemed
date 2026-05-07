import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import HomeHeader from '../../components/common/HomeHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { useScrollContext } from '../../contexts/ScrollContext';
import type { PatientNotification } from '../../types/notifications';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  usePatientNotifications,
} from '../../hooks/usePatientNotifications';

type UiTab = 'All' | 'Appointment' | 'Payment' | 'Prescription' | 'Push';

const Notifications: React.FC = () => {
  const navigation = useNavigation();
  const { setIsScrollingDown } = useScrollContext();
  const [activeFilter, setActiveFilter] = useState<UiTab>('All');
  const [search, setSearch] = useState('');
  const [isScrollable, setIsScrollable] = useState(false);
  const layoutHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const lastYRef = useRef(0);

  const notificationsQuery = usePatientNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useEffect(() => {
    return () => {
      setIsScrollingDown(false);
    };
  }, [setIsScrollingDown]);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  const handleAIChatPress = () => {
    const tabNavigation = navigation.getParent();
    if (tabNavigation) {
      tabNavigation.navigate('Chat' as never);
      return;
    }
    navigation.navigate('Chat' as never);
  };

  const parseAppointmentIdFromUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    const m = String(url).match(/\/patient\/appointments\/([^/]+)\s*$/i);
    return m?.[1] ? decodeURIComponent(m[1]) : null;
  };

  const handleNotificationPress = (notification: PatientNotification) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
    const apptId = parseAppointmentIdFromUrl(notification.url);
    if (apptId) {
      // Notifications live under BottomTabs; route via the Appointments tab stack.
      (navigation as any).navigate('Calendar', {
        screen: 'AppointmentDetails',
        params: { appointmentId: apptId },
      });
    }
  };

  const tabLabelFromType = (type: string): Exclude<UiTab, 'All'> => {
    const t = String(type ?? '').trim().toUpperCase();
    if (t.startsWith('APPOINTMENT')) return 'Appointment';
    if (t === 'PAYMENT') return 'Payment';
    if (t === 'PRESCRIPTION') return 'Prescription';
    return 'Push';
  };

  const filteredNotifications = useMemo(() => {
    const list = notificationsQuery.data ?? [];
    const q = search.trim().toLowerCase();
    return list.filter((n) => {
      const tab = tabLabelFromType(n.type);
      const matchesTab = activeFilter === 'All' ? true : tab === activeFilter;
      if (!matchesTab) return false;
      if (!q) return true;
      const dt = n.createdAt ? formatDateTime(n.createdAt) : null;
      const dateStr = dt ? `${dt.date} ${dt.time}` : '';
      const hay = `${n.title ?? ''}\n${n.description ?? ''}\n${dateStr}`.toLowerCase();
      return hay.includes(q);
    });
  }, [activeFilter, notificationsQuery.data, search]);

  const updateScrollable = () => {
    const layoutH = layoutHeightRef.current;
    const contentH = contentHeightRef.current;
    // small slack to avoid flicker when heights are close
    const canScroll = contentH > layoutH + 8;
    setIsScrollable(canScroll);
    if (!canScroll) {
      setIsScrollingDown(false);
    }
  };

  const getTypeStyle = (type: string) => {
    const tab = tabLabelFromType(type);
    if (tab === 'Appointment') return styles.typeAppointment;
    if (tab === 'Payment') return styles.typePayment;
    if (tab === 'Prescription') return styles.typePrescription;
    return styles.typePush;
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const date = d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const time = d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return { date, time };
  };

  const handleScroll = (y: number) => {
    if (!isScrollable) return;
    const prev = lastYRef.current;
    const delta = y - prev;
    // Ignore tiny jitter
    if (Math.abs(delta) < 6) return;
    setIsScrollingDown(delta > 0);
    lastYRef.current = y;
  };

  const handleScrollStop = () => {
    setIsScrollingDown(false);
  };

  const onRefresh = async () => {
    await notificationsQuery.refetch();
  };

  const anyUnread = useMemo(
    () => (notificationsQuery.data ?? []).some((n) => !n.isRead),
    [notificationsQuery.data],
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.scrollWrapper} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onLayout={(e) => {
            layoutHeightRef.current = e.nativeEvent.layout.height;
            updateScrollable();
          }}
          onContentSizeChange={(_, h) => {
            contentHeightRef.current = h;
            updateScrollable();
          }}
          onScroll={(e) => handleScroll(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
          onScrollEndDrag={handleScrollStop}
          onMomentumScrollEnd={handleScrollStop}
          refreshControl={
            <RefreshControl
              refreshing={Boolean(notificationsQuery.isFetching)}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
          <View style={styles.headerContainer}>
            <HomeHeader
              onProfilePress={handleMenuPress}
              onSearchChange={handleSearchChange}
              onAIChatPress={handleAIChatPress}
              placeholder="Search notifications"
              value={search}
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
            <View style={styles.titleActionsRow}>
              <Text style={styles.unreadCount}>
                Unread: {(notificationsQuery.data ?? []).filter((n) => !n.isRead).length}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => markAllRead.mutate()}
                disabled={!anyUnread || markAllRead.isPending}
                style={[styles.markAllBtn, (!anyUnread || markAllRead.isPending) && styles.markAllBtnDisabled]}
              >
                <Text style={[styles.markAllBtnText, (!anyUnread || markAllRead.isPending) && styles.markAllBtnTextDisabled]}>
                  Mark all read
                </Text>
              </TouchableOpacity>
            </View>
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
            {filteredNotifications.length === 0 ? (
              <View style={styles.searchEmptyWrap}>
                <Text style={styles.searchEmptyTitle}>No results</Text>
                <Text style={styles.searchEmptyText}>
                  Try searching by title, message, date, or time.
                </Text>
              </View>
            ) : (
              filteredNotifications.map((notification) => (
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
                      <Text style={styles.typeText}>
                        {tabLabelFromType(notification.type)}
                      </Text>
                    </View>
                    <View style={styles.dateLabel}>
                      {(() => {
                        const dt = formatDateTime(notification.createdAt);
                        return (
                          <View style={styles.dateRow}>
                            {!notification.isRead ? <View style={styles.unreadDot} /> : null}
                            <Text style={styles.dateText}>
                              {dt.date} | {dt.time}
                            </Text>
                          </View>
                        );
                      })()}
                    </View>
                  </View>

                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.description}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
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
  titleActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  unreadCount: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  markAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E8EEF9',
  },
  markAllBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  markAllBtnText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  markAllBtnTextDisabled: {
    color: '#94A3B8',
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
  searchEmptyWrap: {
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchEmptyTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  searchEmptyText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
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
    backgroundColor: '#EEEFF3',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 3,
    borderLeftColor: '#E2E8F0',
  },
  unreadCard: {
    backgroundColor: '#EEEFF3',
    borderColor: '#BFDBFE',
    borderLeftColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
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
