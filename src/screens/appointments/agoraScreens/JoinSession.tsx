import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import Button from '../../../components/Button';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';
import Icons from '../../../assets/svg';
import { createAgoraToken } from '../../../api/agoraApi';
import { showErrorToast } from '../../../utils/appToast';
import type { RootState } from '../../../store';

type JoinSessionNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'JoinSession'
>;

type JoinSessionRouteProp = RouteProp<AppointmentsStackParamList, 'JoinSession'>;

const JoinSession: React.FC = () => {
  const navigation = useNavigation<JoinSessionNavigationProp>();
  const route = useRoute<JoinSessionRouteProp>();
  const insets = useSafeAreaInsets();
  const [joining, setJoining] = useState(false);

  const appointmentId = route.params?.appointmentId;
  const appointmentCallType = route.params?.appointmentCallType ?? 'VIDEO';

  const authUid = useSelector((s: RootState) => {
    const u = s.auth.user;
    const id = u && typeof u === 'object' && 'id' in u ? (u as any).id : '';
    return String(id ?? '').trim();
  });

  const numericUid = (() => {
    const n = Number.parseInt(authUid, 10);
    if (Number.isFinite(n) && n > 0) return String(n);
    // fallback: keep only digits (Agora uid must be numeric)
    const digits = authUid.replace(/\D+/g, '');
    return digits ? digits : undefined;
  })();

  const handleBackPress = () => {
    const source = route.params?.source;
    if (source === 'immediateCare') {
      // Return to Immediate Care confirmation flow instead of appointments stack
      const drawerNav = (navigation.getParent() as any)?.getParent?.();
      if (drawerNav) {
        drawerNav.navigate('ImmediateCarePriorityConfirm');
        return;
      }
    }
    navigation.goBack();
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleJoinSession = async () => {
    if (appointmentCallType === 'CHAT') {
      navigation.navigate('AppointmentDetails', {
        appointmentId,
        initialTab: 'Messages',
      });
      return;
    }
    if (!appointmentId) {
      Alert.alert('Missing appointment', 'Could not find appointment id.');
      return;
    }

    try {
      setJoining(true);
      const tokenResp = await createAgoraToken({
        appointmentId,
        channelName: appointmentId,
        uid: numericUid,
        role: 'PUBLISHER',
        expireSeconds: 3600,
      });

      if (!tokenResp?.token) {
        throw new Error('Could not get Agora token');
      }

      navigation.navigate('SessionJoined', {
        appointmentId,
        appointmentCallType,
        channelName: tokenResp.channelName ?? appointmentId,
        uid: tokenResp.uid,
        rtcToken: tokenResp.token,
      });
    } catch (e) {
      showErrorToast(
        'Could not join session',
        (e as Error)?.message ?? 'Try again later.',
      );
    } finally {
      setJoining(false);
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
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={handleSearchPress}
              activeOpacity={0.7}
            >
              <Icons.Search width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Join Session</Text>

          {/* Video Placeholder */}
          {appointmentCallType === 'VIDEO' ? (
            <View style={styles.videoPlaceholder}>{/* video preview */}</View>
          ) : appointmentCallType === 'AUDIO' ? (
            <View style={styles.audioPlaceholder}>
              <Icons.VideoCameraIcon width={28} height={28} />
            </View>
          ) : null}

          {/* Session Details */}
          <View style={styles.sessionDetails}>
            <Text style={styles.sessionTitle}>Join Session</Text>
            <Text style={styles.sessionDescription}>
              Attend your medical session with your doctor.
            </Text>
          </View>

          {/* Join Session Button */}
          <View style={styles.buttonContainer}>
            <Button
              title={
                appointmentCallType === 'CHAT'
                  ? 'Open Chat'
                  : appointmentCallType === 'AUDIO'
                    ? 'Join Audio'
                    : 'Join Video'
              }
              onPress={handleJoinSession}
              loading={joining}
              style={styles.joinButton}
              textStyle={styles.joinButtonText}
            />
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 24,
    gap: 24,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginTop: 8,
  },
  audioPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#111827',
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  sessionDetails: {
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  sessionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sessionDescription: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    borderRadius: 80,
    height: 56,
    width: '100%',
  },
  joinButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default JoinSession;

