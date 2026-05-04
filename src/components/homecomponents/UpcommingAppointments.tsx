import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import ShimmerBox from '../common/ShimmerBox';
import { useHomeUpcomingAppointments } from '../../hooks/useHomeUpcomingAppointments';

const SKELETON_CARDS = 2;

const UpcommingAppointments: React.FC = () => {
  const navigation = useNavigation<any>();
  const { cards, isLoading, isEmpty, isError } = useHomeUpcomingAppointments();

  const handleViewAll = () => {
    navigation.navigate('Calendar', { screen: 'AppointmentsMain' });
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
              <View style={styles.topRow}>
                <ShimmerBox width={84} height={84} borderRadius={20} />
                <View style={styles.shimmerTextCol}>
                  <ShimmerBox height={18} borderRadius={8} />
                  <ShimmerBox height={14} borderRadius={6} width="70%" />
                </View>
              </View>
              <View style={styles.bottomRow}>
                <View style={styles.datetimeWrap}>
                  <ShimmerBox width={72} height={14} borderRadius={6} />
                  <ShimmerBox width={72} height={14} borderRadius={6} />
                </View>
                <ShimmerBox width={88} height={36} borderRadius={999} />
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
            <View key={appointment.id} style={styles.card}>
              <View style={styles.topRow}>
                <View style={styles.imageShell}>
                  {appointment.doctorImageUri ? (
                    <Image
                      source={{ uri: appointment.doctorImageUri }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.placeholderImage} />
                  )}
                </View>
                <View style={styles.doctorTextWrap}>
                  <Text style={styles.doctorName} numberOfLines={1}>
                    {appointment.doctorName}
                  </Text>
                  <Text style={styles.specialty} numberOfLines={1}>
                    {appointment.specialty}
                  </Text>
                </View>
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.datetimeWrap}>
                  <View style={styles.detailItem}>
                    <Icons.CalendarTodayIcon width={20} height={20} />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {appointment.date}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icons.NestClockFarsightAnalogIcon width={20} height={20} />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {appointment.time}
                    </Text>
                  </View>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{appointment.badgeLabel}</Text>
                </View>
              </View>
            </View>
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
    padding: 16,
    minHeight: 156,
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
    width: 84,
    height: 84,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 14,
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
  },
  specialty: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  datetimeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 10,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
  },
  statusText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'lowercase',
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
  emptyCard: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
    flex: 1,
    minWidth: 0,
  },
  emptyTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default UpcommingAppointments;
