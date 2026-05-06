import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import ShimmerBox from '../common/ShimmerBox';
import InitialsAvatar from '../common/InitialsAvatar';
import { useHomeUpcomingAppointments } from '../../hooks/useHomeUpcomingAppointments';

const SKELETON_CARDS = 2;
const CARD_HEIGHT = 164;

const UpcommingAppointments: React.FC = () => {
  const navigation = useNavigation<any>();
  const { cards, isLoading, isEmpty, isError } = useHomeUpcomingAppointments();

  const handleViewAll = () => {
    navigation.navigate('Calendar', { screen: 'AppointmentsMain' });
  };

  const navigateToAppointmentDetails = (appointmentId: string, initialTab?: 'Messages') => {
    const tabNav = navigation.getParent?.();
    if (tabNav) {
      tabNav.navigate('Calendar', {
        screen: 'AppointmentDetails',
        params: { appointmentId, initialTab, source: 'home' },
      });
      return;
    }
    navigation.navigate('Calendar', {
      screen: 'AppointmentDetails',
      params: { appointmentId, initialTab, source: 'home' },
    });
  };

  const callTypeLabel = (t: 'CHAT' | 'AUDIO' | 'VIDEO') => {
    if (t === 'CHAT') return 'CHAT';
    if (t === 'AUDIO') return 'AUDIO';
    return 'VIDEO';
  };

  const primaryActionLabel = (t: 'CHAT' | 'AUDIO' | 'VIDEO') => {
    if (t === 'CHAT') return 'Open Chat';
    if (t === 'AUDIO') return 'Join Audio';
    return 'Join Video';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Appointment</Text>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
          {Array.from({ length: SKELETON_CARDS }).map((_, i) => (
            <View key={`sk-${i}`} style={styles.card}>
              <View style={styles.cardRow}>
                <ShimmerBox width="30%" height={CARD_HEIGHT} borderRadius={0} />
                <View style={styles.cardRight}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <ShimmerBox height={16} borderRadius={8} width="60%" />
                    <ShimmerBox height={20} borderRadius={999} width={72} />
                  </View>
                  <ShimmerBox
                    height={12}
                    borderRadius={6}
                    width="45%"
                    style={{ marginTop: 8 }}
                  />
                  <ShimmerBox
                    height={18}
                    borderRadius={999}
                    width={64}
                    style={{ marginTop: 10 }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      marginTop: 'auto',
                      gap: 10,
                    }}
                  >
                    <View style={{ flexDirection: 'column', gap: 8, flex: 1 }}>
                      <ShimmerBox width={120} height={12} borderRadius={6} />
                      <ShimmerBox width={92} height={12} borderRadius={6} />
                    </View>
                    <ShimmerBox width={108} height={36} borderRadius={999} />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : isError ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Icons.CalendarTodayIcon width={30} height={30} />
          </View>
          <View style={styles.emptyTextCol}>
            <Text style={styles.emptyTitle}>Could not load appointments</Text>
            <Text style={styles.emptySubtitle}>
              Pull to refresh on Home or try again in a moment.
            </Text>
          </View>
        </View>
      ) : isEmpty ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Icons.CalendarClockIcon width={30} height={30} />
          </View>
          <View style={styles.emptyTextCol}>
            <Text style={styles.emptyTitle}>No upcoming appointments yet</Text>
            <Text style={styles.emptySubtitle}>
              When you book a visit, it will show up here.
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
          {cards.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigateToAppointmentDetails(appointment.id)}
            >
              <View style={styles.cardRow}>
                <View style={styles.imageShell}>
                  <InitialsAvatar
                    uri={appointment.doctorImageUri}
                    name={appointment.doctorName}
                    size={CARD_HEIGHT}
                    borderRadius={0}
                    variant="first-letter"
                  />
                </View>

                <View style={styles.cardRight}>
                  <View style={styles.topInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.doctorName} numberOfLines={1}>
                        {appointment.doctorName}
                      </Text>
                      <View style={styles.statusPillUpcoming}>
                        <Text style={styles.statusTextUpcoming}>
                          {appointment.badgeLabel}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.specialty} numberOfLines={1}>
                      {appointment.specialty}
                    </Text>

                    <View style={styles.callTypeRow}>
                      <View style={styles.callTypePill}>
                        <Text style={styles.callTypeText}>
                          {callTypeLabel(appointment.appointmentCallType)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.bottomRow}>
                    <View style={styles.datetimeWrap}>
                      <View style={styles.detailItem}>
                        <Icons.CalendarTodayIcon width={18} height={18} />
                        <Text style={styles.detailText} numberOfLines={1}>
                          {appointment.date}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Icons.NestClockFarsightAnalogIcon width={18} height={18} />
                        <Text style={styles.detailText} numberOfLines={1}>
                          {appointment.time}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.joinBtn}
                      activeOpacity={0.85}
                      onPress={(e) => {
                        (e as any)?.stopPropagation?.();
                        if (appointment.appointmentCallType === 'CHAT') {
                          navigateToAppointmentDetails(appointment.id, 'Messages');
                          return;
                        }
                        const tabNav = navigation.getParent?.();
                        if (tabNav) {
                          tabNav.navigate('Calendar', {
                            screen: 'JoinSession',
                            params: {
                              appointmentId: appointment.id,
                              appointmentCallType: appointment.appointmentCallType,
                            },
                          });
                          return;
                        }
                        navigation.navigate('Calendar', {
                          screen: 'JoinSession',
                          params: {
                            appointmentId: appointment.id,
                            appointmentCallType: appointment.appointmentCallType,
                          },
                        });
                      }}
                    >
                      <Text style={styles.joinBtnText} numberOfLines={1}>
                        {primaryActionLabel(appointment.appointmentCallType)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  cardsContainer: {
    paddingRight: 8,
    gap: 12,
  },
  card: {
    width: 350,
    backgroundColor: '#EEEFF3',
    borderRadius: 28,
    padding: 0,
    height: CARD_HEIGHT,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: '100%',
  },
  cardRight: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  topInfo: {
    minWidth: 0,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  shimmerTextCol: {
    flex: 1,
    marginLeft: 14,
    gap: 10,
    justifyContent: 'center',
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  imageShell: {
    width: '30%',
    minWidth: 110,
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#DDE3EA',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
  },
  doctorTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingTop: 4,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
    flex: 1,
    minWidth: 0,
  },
  specialty: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  datetimeWrap: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  statusPillUpcoming: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8EEF9',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusTextUpcoming: {
    fontFamily: Fonts.raleway,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  detailText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    flexShrink: 1,
  },
  callTypeRow: {
    marginTop: 10,
  },
  callTypePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8EEF9',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  callTypeText: {
    fontFamily: Fonts.raleway,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  joinBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyCard: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextCol: {
    minWidth: 0,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default UpcommingAppointments;
