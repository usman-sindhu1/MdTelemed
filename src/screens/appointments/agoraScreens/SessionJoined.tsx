import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icons from '../../../assets/svg';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';
import { AGORA_APP_ID } from '../../../constants/agoraConfig';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import { showErrorToast } from '../../../utils/appToast';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type SessionJoinedNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'SessionJoined'
>;

type SessionJoinedRouteProp = RouteProp<
  AppointmentsStackParamList,
  'SessionJoined'
>;

function safeAgoraModule(): any | null {
  try {
    // When not linked, react-native-agora returns a Proxy that throws on property access.
    const mod = require('react-native-agora');
    const create = mod?.createAgoraRtcEngine;
    // Touch a property to force proxy throw (caught here).
    if (typeof create !== 'function') return null;
    return mod;
  } catch {
    return null;
  }
}

const SessionJoined: React.FC = () => {
  const navigation = useNavigation<SessionJoinedNavigationProp>();
  const route = useRoute<SessionJoinedRouteProp>();
  const insets = useSafeAreaInsets();
  const isAudioOnly = route.params?.appointmentCallType === 'AUDIO';
  const channelName = route.params?.channelName;
  const rtcToken = route.params?.rtcToken;
  const uid = route.params?.uid;
  const localUid = useMemo(() => {
    const n = Number.parseInt(String(uid ?? ''), 10);
    return Number.isFinite(n) ? n : 0;
  }, [uid]);

  const engineRef = useRef<any>(null);
  const [joined, setJoined] = useState(false);
  const [remoteUids, setRemoteUids] = useState<number[]>([]);
  const [starting, setStarting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(!isAudioOnly);

  const handleBackPress = () => {
    navigation.goBack();
  };

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
    } catch {
      // ignore
    }
  };

  const handleShareScreen = () => {
    navigation.navigate('InSessionChat', { appointmentId: route.params?.appointmentId });
  };

  const handleEndCall = () => {
    try {
      engineRef.current?.leaveChannel?.();
      engineRef.current?.release?.();
      engineRef.current = null;
    } catch {
      // ignore
    }
    setJoined(false);
    navigation.navigate('ReviewsScreen');
  };

  useEffect(() => {
    let cancelled = false;

    async function ensurePermissions() {
      if (Platform.OS !== 'android') return true;
      const perms = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] as string[];
      if (!isAudioOnly) perms.push(PermissionsAndroid.PERMISSIONS.CAMERA);
      const res = await PermissionsAndroid.requestMultiple(perms as any);
      return perms.every(
        (p) => (res as Record<string, string>)[p] === PermissionsAndroid.RESULTS.GRANTED,
      );
    }

    async function startAgora() {
      if (!AGORA_APP_ID.trim()) {
        showErrorToast('Agora not configured', 'Set AGORA_APP_ID to enable calls.');
        setStarting(false);
        return;
      }
      if (!channelName || !rtcToken) {
        showErrorToast('Missing call data', 'Channel/token not available.');
        setStarting(false);
        return;
      }

      const ok = await ensurePermissions();
      if (!ok) {
        showErrorToast(
          'Permissions required',
          'Please allow microphone/camera permissions.',
        );
        setStarting(false);
        return;
      }

      const Agora = safeAgoraModule();
      if (!Agora) {
        showErrorToast(
          'Agora not linked',
          'Rebuild the app after installing react-native-agora.',
        );
        setStarting(false);
        return;
      }

      try {
        const engine = Agora.createAgoraRtcEngine();
        engineRef.current = engine;

        engine.registerEventHandler({
          onJoinChannelSuccess: () => {
            if (cancelled) return;
            setJoined(true);
          },
          onUserJoined: (_conn: any, remoteUid: number) => {
            if (cancelled) return;
            setRemoteUids((prev) =>
              prev.includes(remoteUid) ? prev : [...prev, remoteUid],
            );
          },
          onUserOffline: (_conn: any, remoteUid: number) => {
            if (cancelled) return;
            setRemoteUids((prev) => prev.filter((u) => u !== remoteUid));
          },
          onLeaveChannel: () => {
            if (cancelled) return;
            setJoined(false);
            setRemoteUids([]);
          },
        });

        engine.initialize({
          appId: AGORA_APP_ID.trim(),
          channelProfile: Agora.ChannelProfileType.ChannelProfileCommunication,
        });

        engine.enableAudio();
        engine.muteLocalAudioStream(Boolean(isMuted));

        if (!isAudioOnly) {
          engine.enableVideo();
          engine.muteLocalVideoStream(!isVideoOn);
          engine.startPreview();
        }

        engine.joinChannel(rtcToken, channelName, localUid, {
          clientRoleType: Agora.ClientRoleType.ClientRoleBroadcaster,
        });
      } catch (e) {
        showErrorToast(
          'Could not start call',
          (e as Error)?.message ?? 'Try again later.',
        );
      } finally {
        if (!cancelled) setStarting(false);
      }
    }

    void startAgora();

    return () => {
      cancelled = true;
      try {
        engineRef.current?.leaveChannel?.();
        engineRef.current?.release?.();
        engineRef.current = null;
      } catch {
        // ignore
      }
    };
  }, [channelName, rtcToken, isAudioOnly, isMuted, isVideoOn, localUid]);

  return (
    <View style={styles.container}>
      {/* Main Video Feed - Doctor - Full Screen */}
      {isAudioOnly ? (
        <View style={styles.audioOnlyBg}>
          <Icons.Vector3Icon width={52} height={52} />
        </View>
      ) : (
        <View style={styles.mainVideoContainer}>
          {(() => {
            const Agora = safeAgoraModule();
            const RemoteView = Agora?.RtcSurfaceView;
            if (!RemoteView) {
              return (
                <View style={styles.fallbackBox}>
                  <Text style={styles.fallbackTitle}>Video preview unavailable</Text>
                  <Text style={styles.fallbackBody}>
                    Rebuild the app to enable Agora video.
                  </Text>
                </View>
              );
            }
            const remoteUid = remoteUids[0];
            return remoteUid ? (
              <RemoteView style={styles.rtcFull} canvas={{ uid: remoteUid } as any} />
            ) : (
              <View style={styles.waitingBox}>
                <Text style={styles.waitingTitle}>
                  {joined ? 'Waiting for doctor…' : starting ? 'Connecting…' : 'Not connected'}
                </Text>
              </View>
            );
          })()}
        </View>
      )}

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Icons.ArrowLeftIcon width={24} height={24} />
      </TouchableOpacity>

      {/* Picture-in-Picture - Patient (video only) */}
      {!isAudioOnly ? (
        <View style={[styles.pipContainer, { bottom: 100 + insets.bottom }]}>
          {(() => {
            const Agora = safeAgoraModule();
            const LocalView = Agora?.RtcSurfaceView;
            return LocalView ? (
              <LocalView
                style={styles.rtcPip}
                canvas={{ uid: 0 } as any}
              />
            ) : (
              <Icons.WomanHeadsetIcon
                width={120}
                height={160}
                preserveAspectRatio="xMidYMid meet"
              />
            );
          })()}
        </View>
      ) : null}

      {/* Control Bar */}
      <View style={[styles.controlBar, { bottom: insets.bottom }]}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={handleMuteToggle}
          activeOpacity={0.7}
        >
          <Icons.Vector3Icon width={24} height={24} />
          {isMuted && (
            <View style={styles.crossOverlay}>
              <View style={styles.crossLine} />
            </View>
          )}
        </TouchableOpacity>

        {!isAudioOnly ? (
          <TouchableOpacity
            style={[
              styles.controlButton,
              isVideoOn && styles.controlButtonActive,
            ]}
            onPress={handleVideoToggle}
            activeOpacity={0.7}
          >
            <Icons.Vector4Icon width={24} height={24} />
            {!isVideoOn && (
              <View style={styles.crossOverlay}>
                <View style={styles.crossLine} />
              </View>
            )}
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleShareScreen}
          activeOpacity={0.7}
        >
          <Icons.ShareScreenIcon width={24} height={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleEndCall}
          activeOpacity={0.7}
        >
          <Icons.EndCallIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width: screenWidth,
    height: screenHeight,
  },
  audioOnlyBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1220',
    opacity: 0.98,
  },
  mainVideoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  rtcFull: {
    width: screenWidth,
    height: screenHeight,
  },
  rtcPip: {
    width: 120,
    height: 160,
  },
  waitingBox: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  waitingTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  fallbackBox: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  fallbackTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  fallbackBody: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pipContainer: {
    position: 'absolute',
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 5,
  },
  controlBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 16,
    zIndex: 10,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#3A3A3A',
  },
  endCallButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossLine: {
    width: 32,
    height: 3,
    backgroundColor: '#FF3B30',
    position: 'absolute',
    borderRadius: 1.5,
    transform: [{ rotate: '-45deg' }],
  },
});

export default SessionJoined;

