import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
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
import { AGORA_APP_ID } from '../../../constants/agoraConfig';

type JoinSessionNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'JoinSession'
>;

type JoinSessionRouteProp = RouteProp<AppointmentsStackParamList, 'JoinSession'>;

function safeAgoraModule(): any | null {
  try {
    const mod = require('react-native-agora');
    const create = mod?.createAgoraRtcEngine;
    if (typeof create !== 'function') return null;
    return mod;
  } catch {
    return null;
  }
}

function normalizeAgoraUid(input: unknown): number {
  const n = Math.floor(Number(input));
  if (!Number.isFinite(n) || n <= 0) return 1;
  const uid = n % 2_000_000_000;
  return uid > 0 ? uid : 1;
}

const JoinSession: React.FC = () => {
  const navigation = useNavigation<JoinSessionNavigationProp>();
  const route = useRoute<JoinSessionRouteProp>();
  const insets = useSafeAreaInsets();
  const [joining, setJoining] = useState(false);
  const engineRef = useRef<any>(null);
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [hasMic, setHasMic] = useState(Platform.OS !== 'android');
  const [hasCamera, setHasCamera] = useState(Platform.OS !== 'android');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const appointmentId = route.params?.appointmentId;
  const appointmentCallType = route.params?.appointmentCallType ?? 'VIDEO';

  const authUid = useSelector((s: RootState) => {
    const u = s.auth.user;
    const id = u && typeof u === 'object' && 'id' in u ? (u as any).id : '';
    return String(id ?? '').trim();
  });

  const numericUid = useMemo(() => {
    const n = Number.parseInt(authUid, 10);
    if (Number.isFinite(n) && n > 0) return String(n);
    // fallback: keep only digits (Agora uid must be numeric)
    const digits = authUid.replace(/\D+/g, '');
    return digits ? digits : undefined;
  }, [authUid]);

  const stableRtcUid = useMemo(() => {
    // Agora "uid" must be a positive 32-bit int. Many backends store user ids as UUID/CUID.
    // Use a stable hash so the uid we request the token for matches the uid we join with.
    const src = String(authUid || '').trim() || '0';
    let h = 5381;
    for (let i = 0; i < src.length; i++) {
      h = ((h << 5) + h) ^ src.charCodeAt(i); // djb2 xor
    }
    const uid32 = (h >>> 0) % 2_000_000_000; // keep within safe signed range
    return uid32 > 0 ? uid32 : 1;
  }, [authUid]);

  const isAudioOnly = appointmentCallType === 'AUDIO';
  const isChatOnly = appointmentCallType === 'CHAT';

  useEffect(() => {
    if (isAudioOnly) setIsVideoOn(false);
  }, [isAudioOnly]);

  async function ensurePermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    const perms = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] as string[];
    if (!isAudioOnly) perms.push(PermissionsAndroid.PERMISSIONS.CAMERA);
    const res = await PermissionsAndroid.requestMultiple(perms as any);
    const micOk =
      (res as Record<string, string>)[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const camOk = isAudioOnly
      ? true
      : (res as Record<string, string>)[PermissionsAndroid.PERMISSIONS.CAMERA] ===
        PermissionsAndroid.RESULTS.GRANTED;
    setHasMic(Boolean(micOk));
    setHasCamera(Boolean(camOk));
    setPermissionsChecked(true);
    return micOk && camOk;
  }

  useEffect(() => {
    let cancelled = false;

    async function startPreview() {
      if (isChatOnly) return;

      const ok = await ensurePermissions();
      if (!ok || cancelled) return;

      const Agora = safeAgoraModule();
      if (!Agora) return;

      const appId = AGORA_APP_ID.trim();
      if (!appId) return;

      try {
        const engine = Agora.createAgoraRtcEngine();
        engineRef.current = engine;
        engine.initialize({
          appId,
          channelProfile: Agora.ChannelProfileType.ChannelProfileCommunication,
        });

        engine.enableAudio();
        engine.muteLocalAudioStream(Boolean(isMuted));

        if (!isAudioOnly) {
          engine.enableVideo();
          // Some Agora SDK versions require binding a local canvas before preview renders.
          try {
            engine.setupLocalVideo?.({
              uid: 0,
              // renderMode etc are optional and SDK-specific
            });
          } catch {
            // ignore
          }
          engine.muteLocalVideoStream(!isVideoOn);
          engine.startPreview();
        }
      } catch {
        // ignore preview failures; join will handle errors.
      }
    }

    void startPreview();

    return () => {
      cancelled = true;
      try {
        engineRef.current?.stopPreview?.();
        engineRef.current?.release?.();
        engineRef.current = null;
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentCallType, isAudioOnly, isChatOnly]);

  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    try {
      engineRef.current?.muteLocalAudioStream?.(next);
    } catch {
      // ignore
    }
  };

  const handleVideoToggle = () => {
    if (isAudioOnly) return;
    const next = !isVideoOn;
    setIsVideoOn(next);
    try {
      engineRef.current?.muteLocalVideoStream?.(!next);
      if (next) engineRef.current?.startPreview?.();
      else engineRef.current?.stopPreview?.();
    } catch {
      // ignore
    }
  };

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
    if (isChatOnly) {
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

      const permOk = await ensurePermissions();
      if (!permOk) {
        showErrorToast(
          'Permissions required',
          'Please allow microphone/camera permissions.',
        );
        return;
      }

      const tokenResp = await createAgoraToken({
        appointmentId,
        uid: numericUid ?? String(stableRtcUid),
        role: 'PUBLISHER',
      });

      if (!tokenResp?.token) {
        throw new Error('Could not get Agora token');
      }

      const serverUidRaw = String((tokenResp as any).uid ?? '').trim();
      const serverUidNum = Number.parseInt(serverUidRaw, 10);
      const joinUid = normalizeAgoraUid(
        Number.isFinite(serverUidNum) && serverUidNum > 0 ? serverUidNum : stableRtcUid,
      );

      const appId = String(tokenResp.appId ?? AGORA_APP_ID ?? '').trim();
      if (!appId) {
        showErrorToast(
          'Calls unavailable',
          'Agora App ID is missing in the mobile client. Set AGORA_APP_ID or have the server return appId.',
        );
        return;
      }

      try {
        engineRef.current?.stopPreview?.();
        engineRef.current?.release?.();
        engineRef.current = null;
      } catch {
        // ignore
      }

      navigation.navigate('SessionJoined', {
        appointmentId,
        appointmentCallType,
        channelName: tokenResp.channelName ?? appointmentId,
        // IMPORTANT: Join with the uid the server used to build the token.
        uid: String(joinUid),
        rtcToken: tokenResp.token,
        appId,
        expiresAt: tokenResp.expiresAt,
        startMuted: isMuted,
        startVideoOn: isAudioOnly ? false : isVideoOn,
      });
    } catch (e) {
      const msg = (e as Error)?.message ?? 'Try again later.';
      if (msg.toLowerCase().includes('agora credentials are not configured')) {
        showErrorToast('Calls unavailable', 'Agora is not configured on the server.');
      } else if (msg.toLowerCase().includes('unauthorized')) {
        showErrorToast('Session expired', 'Please sign in again.');
      } else {
        showErrorToast('Could not join session', msg);
      }
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
            <View style={styles.videoPlaceholder}>
              {(() => {
                const Agora = safeAgoraModule();
                const LocalView = Agora?.RtcSurfaceView;
                if (!LocalView || !AGORA_APP_ID.trim()) {
                  return (
                    <View style={styles.previewFallback}>
                      <Text style={styles.previewFallbackTitle}>Preview unavailable</Text>
                      <Text style={styles.previewFallbackBody}>
                        {!AGORA_APP_ID.trim()
                          ? 'Set AGORA_APP_ID to enable camera preview.'
                          : 'Rebuild the app to enable Agora video.'}
                      </Text>
                    </View>
                  );
                }
                return isVideoOn ? (
                  <LocalView style={styles.rtcPreview} canvas={{ uid: 0 } as any} />
                ) : (
                  <View style={styles.previewFallback}>
                    <Text style={styles.previewFallbackTitle}>Camera off</Text>
                    <Text style={styles.previewFallbackBody}>
                      Turn on video to see your preview.
                    </Text>
                  </View>
                );
              })()}
            </View>
          ) : appointmentCallType === 'AUDIO' ? (
            <View style={styles.audioPlaceholder}>
              <Icons.VideoCameraIcon width={28} height={28} />
            </View>
          ) : null}

          {!isChatOnly ? (
            <View style={styles.prejoinControls}>
              <View style={styles.permissionRow}>
                <Text style={styles.permissionText}>
                  Mic: {hasMic ? 'Allowed' : permissionsChecked ? 'Blocked' : '—'}
                </Text>
                <Text style={styles.permissionText}>
                  Camera:{' '}
                  {isAudioOnly
                    ? 'Not needed'
                    : hasCamera
                      ? 'Allowed'
                      : permissionsChecked
                        ? 'Blocked'
                        : '—'}
                </Text>
                {!hasMic || (!isAudioOnly && !hasCamera) ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (Platform.OS === 'android') {
                        void ensurePermissions();
                      } else {
                        void Linking.openSettings();
                      }
                    }}
                    activeOpacity={0.7}
                    style={styles.permissionButton}
                  >
                    <Text style={styles.permissionButtonText}>
                      {Platform.OS === 'android' ? 'Grant' : 'Settings'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleButton, isMuted && styles.toggleButtonActive]}
                  onPress={handleMuteToggle}
                  activeOpacity={0.7}
                >
                  <View style={styles.toggleIconWrap}>
                    <Icons.Vector3Icon
                      width={18}
                      height={18}
                      fill={isMuted ? '#FFFFFF' : Colors.textPrimary}
                    />
                    {isMuted ? (
                      <View style={styles.toggleSlashOverlay}>
                        <View style={styles.toggleSlashLine} />
                      </View>
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.toggleText,
                      isMuted && styles.toggleTextActive,
                    ]}
                  >
                    {isMuted ? 'Mic off' : 'Mic on'}
                  </Text>
                </TouchableOpacity>

                {!isAudioOnly ? (
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      !isVideoOn && styles.toggleButtonActive,
                    ]}
                    onPress={handleVideoToggle}
                    activeOpacity={0.7}
                  >
                    <View style={styles.toggleIconWrap}>
                      <Icons.Vector4Icon
                        width={18}
                        height={18}
                        fill={!isVideoOn ? '#FFFFFF' : Colors.textPrimary}
                      />
                      {!isVideoOn ? (
                        <View style={styles.toggleSlashOverlay}>
                          <View style={styles.toggleSlashLine} />
                        </View>
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.toggleText,
                        !isVideoOn && styles.toggleTextActive,
                      ]}
                    >
                      {isVideoOn ? 'Video on' : 'Video off'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
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
    overflow: 'hidden',
  },
  rtcPreview: {
    width: '100%',
    height: '100%',
  },
  previewFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  previewFallbackTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  previewFallbackBody: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 18,
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
  prejoinControls: {
    gap: 12,
    marginTop: 4,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  permissionText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  permissionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  permissionButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  toggleText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  toggleIconWrap: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleSlashOverlay: {
    position: 'absolute',
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleSlashLine: {
    width: 16,
    height: 2.5,
    backgroundColor: '#FF3B30',
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
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

