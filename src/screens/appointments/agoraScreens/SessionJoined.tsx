import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Text,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import Icons from '../../../assets/svg';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';
import { AGORA_APP_ID } from '../../../constants/agoraConfig';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import { showErrorToast, showSuccessToast } from '../../../utils/appToast';
import { createAgoraToken } from '../../../api/agoraApi';
import { useAppointmentChat } from '../../../hooks/useAppointmentChat';
import { mapChatRowsToUi } from '../../../utils/chatMessageUi';
import type { RootState } from '../../../store';
import { useAppointmentDetailScreen } from '../../../hooks/useAppointmentDetailScreen';
import DocumentPicker from 'react-native-document-picker';
import RNBlobUtil from 'react-native-blob-util';
import { uploadPickedReportFile } from '../../../utils/reportUpload';
import { AttachmentPreviewModal } from '../../../components/chat/AttachmentPreviewModal';

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

function normalizeAgoraUid(input: unknown): number {
  const n = Math.floor(Number(input));
  if (!Number.isFinite(n) || n <= 0) return 0;
  const uid = n % 2_000_000_000;
  return uid > 0 ? uid : 0;
}

function filenameFromUrl(url: string | undefined): string {
  if (!url) return '';
  try {
    const clean = decodeURIComponent(url.split('?')[0]);
    return clean.split('/').pop() || '';
  } catch {
    return '';
  }
}

const SessionJoined: React.FC = () => {
  const navigation = useNavigation<SessionJoinedNavigationProp>();
  const route = useRoute<SessionJoinedRouteProp>();
  const insets = useSafeAreaInsets();
  const appointmentId = route.params?.appointmentId;
  const isAudioOnly = route.params?.appointmentCallType === 'AUDIO';
  const startMuted = Boolean(route.params?.startMuted);
  const startVideoOn = isAudioOnly ? false : route.params?.startVideoOn ?? true;
  const channelNameRaw = route.params?.channelName;
  const rtcTokenRaw = route.params?.rtcToken;
  const uid = route.params?.uid;
  const appIdFromRoute = String(route.params?.appId ?? '').trim();
  const expiresAt = String((route.params as any)?.expiresAt ?? '').trim();
  const channelNameInit = useMemo(
    () => String(channelNameRaw ?? '').trim(),
    [channelNameRaw],
  );
  const rtcTokenInit = useMemo(() => String(rtcTokenRaw ?? '').trim(), [rtcTokenRaw]);
  const localUid = useMemo(() => {
    return normalizeAgoraUid(uid);
  }, [uid]);

  const engineRef = useRef<any>(null);
  const [joined, setJoined] = useState(false);
  const [remoteUids, setRemoteUids] = useState<number[]>([]);
  const [remoteVideoOff, setRemoteVideoOff] = useState<Record<number, boolean>>({});
  const [remoteAudioOff, setRemoteAudioOff] = useState<Record<number, boolean>>({});
  const [starting, setStarting] = useState(true);
  const [isMuted, setIsMuted] = useState(startMuted);
  const [isVideoOn, setIsVideoOn] = useState(startVideoOn);
  const [channelName, setChannelName] = useState(channelNameInit);
  const [rtcToken, setRtcToken] = useState(rtcTokenInit);
  const [refreshing, setRefreshing] = useState(false);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [panel, setPanel] = useState<'chat' | 'rx' | null>(null);
  const [preview, setPreview] = useState<{
    visible: boolean;
    kind: 'image' | 'file';
    url?: string;
    title?: string;
  }>({ visible: false, kind: 'file' });
  const [chatDraft, setChatDraft] = useState('');

  const currentUserId = useSelector((s: RootState) => {
    const u = s.auth.user;
    if (u && typeof u === 'object' && 'id' in u) return String((u as any).id ?? '');
    return '';
  });

  const chatEnabled = panel === 'chat' && Boolean(appointmentId);
  const { messagesQuery, sendMutation } = useAppointmentChat(appointmentId, {
    enabled: chatEnabled,
  });
  const chatUi = useMemo(
    () => mapChatRowsToUi(messagesQuery.data?.messages ?? [], currentUserId || undefined),
    [messagesQuery.data?.messages, currentUserId],
  );
  const chatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (panel !== 'chat') return;
    // Keep newest message visible at the bottom.
    requestAnimationFrame(() => {
      chatListRef.current?.scrollToEnd?.({ animated: true });
    });
  }, [panel, chatUi.length]);

  const rxEnabled = panel === 'rx' && Boolean(appointmentId);
  const { detail: apptDetail } = useAppointmentDetailScreen(rxEnabled ? appointmentId : undefined);
  const rx = apptDetail?.prescription ?? null;
  const rxMeds = apptDetail?.medicines ?? [];

  useEffect(() => {
    setChannelName(channelNameInit);
  }, [channelNameInit]);
  useEffect(() => {
    setRtcToken(rtcTokenInit);
  }, [rtcTokenInit]);

  useEffect(() => {
    if (!joined || remoteUids.length > 0) {
      setWaitSeconds(0);
      return;
    }
    const startedAt = Date.now();
    const t = setInterval(() => {
      setWaitSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [joined, remoteUids.length]);

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
      engineRef.current?.enableLocalVideo?.(next);
      engineRef.current?.muteLocalVideoStream?.(!next);
      if (next) engineRef.current?.startPreview?.();
      else engineRef.current?.stopPreview?.();
    } catch {
      // ignore
    }
  };

  const handleOpenChat = () => setPanel('chat');
  const handleOpenRx = () => setPanel('rx');

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

  const handleSendChat = () => {
    const msg = chatDraft.trim();
    if (!msg) return;
    if (sendMutation.isPending) return;
    sendMutation.mutate({ content: msg, messageType: 'TEXT' }, {
      onSuccess: () => setChatDraft(''),
    });
  };

  const handleAttachChat = async () => {
    if (sendMutation.isPending) return;
    try {
      const res = await DocumentPicker.pickSingle({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.plainText,
          DocumentPicker.types.allFiles,
        ],
        presentationStyle: 'fullScreen',
      } as any);

      const uri = res.uri;
      const name = res.name || 'attachment';
      const mimeType = res.type || 'application/octet-stream';
      let sizeBytes: number | undefined =
        typeof res.size === 'number' ? res.size : undefined;
      if (!sizeBytes) {
        try {
          const stat = await RNBlobUtil.fs.stat(uri);
          sizeBytes = Number(stat.size);
        } catch {
          // ignore; upload helper validates size
        }
      }

      const { fileUrl } = await uploadPickedReportFile({
        uri,
        name,
        type: mimeType,
        sizeBytes,
      });

      const isImage = mimeType.startsWith('image/');
      sendMutation.mutate(
        {
          content: chatDraft.trim() || undefined,
          fileUrl,
          fileName: name,
          fileSize: sizeBytes,
          messageType: isImage ? 'IMAGE' : 'FILE',
        },
        { onSuccess: () => setChatDraft('') },
      );
    } catch (e) {
      if (DocumentPicker.isCancel(e)) return;
      showErrorToast('Upload failed', (e as Error)?.message ?? 'Try again.');
    }
  };

  const joinWithToken = (token: string) => {
    const Agora = safeAgoraModule();
    if (!Agora) return;
    if (!channelName) return;
    try {
      engineRef.current?.joinChannel?.(token, channelName, localUid, {
        clientRoleType: Agora.ClientRoleType.ClientRoleBroadcaster,
        channelProfile: Agora.ChannelProfileType.ChannelProfileCommunication,
        autoSubscribeAudio: true,
        autoSubscribeVideo: true,
        publishMicrophoneTrack: !isMuted,
        publishCameraTrack: !isAudioOnly && isVideoOn,
      });
    } catch (e) {
      showErrorToast('Reconnect failed', (e as Error)?.message ?? 'Try again.');
    }
  };

  const handleReconnect = () => {
    if (!rtcToken || !channelName) return;
    try {
      engineRef.current?.leaveChannel?.();
    } catch {
      // ignore
    }
    setRemoteUids([]);
    setJoined(false);
    setStarting(true);
    joinWithToken(rtcToken);
    setStarting(false);
  };

  const handleRefreshToken = async () => {
    const appointmentId = route.params?.appointmentId;
    if (!appointmentId) return;
    setRefreshing(true);
    try {
      const resp = await createAgoraToken({
        appointmentId,
        uid: String(localUid || 1),
        role: 'PUBLISHER',
      });
      const nextToken = String(resp?.token ?? '').trim();
      const nextChannel = String(resp?.channelName ?? channelName).trim();
      if (!nextToken) throw new Error('No token returned');
      if (nextChannel) setChannelName(nextChannel);
      setRtcToken(nextToken);
      try {
        engineRef.current?.leaveChannel?.();
      } catch {
        // ignore
      }
      setRemoteUids([]);
      setJoined(false);
      setStarting(true);
      showSuccessToast('Refreshed token', 'Reconnecting…');
      joinWithToken(nextToken);
    } catch (e) {
      showErrorToast('Could not refresh token', (e as Error)?.message ?? 'Try again.');
    } finally {
      setRefreshing(false);
      setStarting(false);
    }
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
      const appId = appIdFromRoute || AGORA_APP_ID.trim();
      if (!appId) {
        showErrorToast(
          'Calls unavailable',
          'Agora App ID is missing in the mobile client.',
        );
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
          onError: (_err: any, msg?: string) => {
            if (cancelled) return;
            showErrorToast('Call error', msg ? String(msg) : 'Agora error');
          },
          onConnectionStateChanged: (_conn: any, state: number, reason: number) => {
            if (cancelled) return;
            // If disconnected after attempting to join, surface a short hint.
            if (state === 5 /* DISCONNECTED */) {
              showErrorToast('Not connected', `Connection state: ${state} (reason ${reason})`);
            }
          },
          onUserJoined: (_conn: any, remoteUid: number) => {
            if (cancelled) return;
            try {
              engine.setupRemoteVideo?.({
                uid: remoteUid,
                channelId: channelName,
              });
            } catch {
              // ignore
            }
            setRemoteVideoOff((prev) => ({ ...prev, [remoteUid]: false }));
            setRemoteAudioOff((prev) => ({ ...prev, [remoteUid]: false }));
            setRemoteUids((prev) =>
              prev.includes(remoteUid) ? prev : [...prev, remoteUid],
            );
          },
          onUserMuteAudio: (_conn: any, remoteUid: number, muted: boolean) => {
            if (cancelled) return;
            setRemoteAudioOff((prev) => ({ ...prev, [remoteUid]: Boolean(muted) }));
          },
          onRemoteAudioStateChanged: (
            _conn: any,
            remoteUid: number,
            state: number,
            reason: number,
          ) => {
            if (cancelled) return;
            // `onUserMuteAudio` is the primary signal; this is a fallback.
            // RemoteAudioStateStopped(0) / RemoteAudioStateReasonRemoteMuted(5)
            // RemoteAudioStateDecoding(2) / RemoteAudioStateReasonRemoteUnmuted(6)
            const isOff = state === 0 || reason === 5;
            const isOn = state === 2 || reason === 6;
            if (isOn) {
              setRemoteAudioOff((prev) => ({ ...prev, [remoteUid]: false }));
            } else if (isOff) {
              setRemoteAudioOff((prev) => ({ ...prev, [remoteUid]: true }));
            }
          },
          onRemoteVideoStateChanged: (
            _conn: any,
            remoteUid: number,
            state: number,
            reason: number,
          ) => {
            if (cancelled) return;
            // RemoteVideoStateStopped(0) + RemoteVideoStateReasonRemoteMuted(5)
            // RemoteVideoStateDecoding(2) + RemoteVideoStateReasonRemoteUnmuted(6)
            const isOff =
              state === 0 || reason === 5 || reason === 4 /* RemoteOffline */ || reason === 3 /* NetworkCongestion */;
            const isOn = state === 2 || reason === 6;
            if (isOn) {
              setRemoteVideoOff((prev) => ({ ...prev, [remoteUid]: false }));
            } else if (isOff) {
              setRemoteVideoOff((prev) => ({ ...prev, [remoteUid]: true }));
            }
          },
          onUserMuteVideo: (_conn: any, remoteUid: number, muted: boolean) => {
            if (cancelled) return;
            setRemoteVideoOff((prev) => ({ ...prev, [remoteUid]: Boolean(muted) }));
          },
          onUserOffline: (_conn: any, remoteUid: number) => {
            if (cancelled) return;
            setRemoteUids((prev) => prev.filter((u) => u !== remoteUid));
            setRemoteVideoOff((prev) => {
              const next = { ...prev };
              delete next[remoteUid];
              return next;
            });
            setRemoteAudioOff((prev) => {
              const next = { ...prev };
              delete next[remoteUid];
              return next;
            });
          },
          onLeaveChannel: () => {
            if (cancelled) return;
            setJoined(false);
            setRemoteUids([]);
            setRemoteVideoOff({});
            setRemoteAudioOff({});
          },
        });

        engine.initialize({
          appId,
          channelProfile: Agora.ChannelProfileType.ChannelProfileCommunication,
        });

        engine.enableAudio();
        engine.muteLocalAudioStream(Boolean(isMuted));

        if (!isAudioOnly) {
          engine.enableVideo();
          try {
            engine.setupLocalVideo?.({
              // For RN Agora views, uid `0` is the local preview canvas.
              uid: 0,
              channelId: channelName,
            });
          } catch {
            // ignore
          }
          engine.muteLocalVideoStream(!isVideoOn);
          engine.enableLocalVideo?.(Boolean(isVideoOn));
          if (isVideoOn) engine.startPreview();
        }

        joinWithToken(rtcToken);
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
  }, [channelName, rtcToken, isAudioOnly, localUid]);
  // Do not restart the engine when toggling mic/camera.
  // We control those via `muteLocalAudioStream` / `muteLocalVideoStream`.
  // eslint-disable-next-line react-hooks/exhaustive-deps

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
            const isRemoteCameraOff = remoteUid ? remoteVideoOff[remoteUid] === true : false;
            const isRemoteMicOff = remoteUid ? remoteAudioOff[remoteUid] === true : false;
            return remoteUid ? (
              isRemoteCameraOff ? (
                <View style={styles.remoteOffBox}>
                  <Icons.Vector4Icon width={44} height={44} />
                  <Text style={styles.remoteOffTitle}>Doctor camera is off</Text>
                  <Text style={styles.remoteOffBody}>
                    They can turn it on anytime during the call.
                  </Text>
                </View>
              ) : (
                <>
                  <RemoteView
                    style={styles.rtcFull}
                    canvas={{ uid: remoteUid, channelId: channelName } as any}
                  />
                  {isRemoteMicOff ? (
                    <View style={[styles.remoteMicPill, { top: insets.top + 18 }]}>
                      <Icons.Vector3Icon width={16} height={16} />
                      <Text style={styles.remoteMicPillText}>Doctor mic is off</Text>
                    </View>
                  ) : null}
                </>
              )
            ) : (
              <View style={styles.waitingBox}>
                <Text style={styles.waitingTitle}>
                  Waiting for doctor…
                </Text>

                {joined && remoteUids.length === 0 && waitSeconds >= 20 ? (
                  <View style={styles.waitingActions}>
                    <TouchableOpacity
                      style={styles.waitingBtn}
                      onPress={handleReconnect}
                      activeOpacity={0.85}
                      disabled={refreshing}
                    >
                      <Text style={styles.waitingBtnText}>Reconnect</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.waitingBtn, styles.waitingBtnPrimary]}
                      onPress={handleRefreshToken}
                      activeOpacity={0.85}
                      disabled={refreshing}
                    >
                      <Text style={[styles.waitingBtnText, styles.waitingBtnTextPrimary]}>
                        {refreshing ? 'Refreshing…' : 'Refresh token'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
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
                zOrderMediaOverlay={true}
                canvas={{ uid: 0, channelId: channelName } as any}
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
          onPress={handleOpenChat}
          activeOpacity={0.7}
        >
          <Icons.ChatWhiteIcon width={24} height={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleOpenRx}
          activeOpacity={0.7}
        >
          <Icons.MedicineBottleWhiteIcon width={24} height={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleEndCall}
          activeOpacity={0.7}
        >
          <Icons.EndCallIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={panel != null}
        transparent
        animationType="slide"
        onRequestClose={() => setPanel(null)}
      >
        <View style={styles.panelOverlay}>
          <KeyboardAvoidingView
            style={styles.panelKeyboard}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Math.max(insets.top, 24)}
          >
            <View style={[styles.panelCard, { paddingBottom: insets.bottom + 12 }]}>
              <View style={styles.panelHeader}>
                <Text style={styles.panelTitle}>
                  {panel === 'chat' ? 'Chat' : 'Prescription'}
                </Text>
                <TouchableOpacity
                  onPress={() => setPanel(null)}
                  style={styles.panelClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.panelCloseText}>×</Text>
                </TouchableOpacity>
              </View>

              {panel === 'chat' ? (
                <>
                  <FlatList
                    ref={chatListRef}
                    data={chatUi}
                    keyExtractor={(it) => it.id}
                    style={styles.chatListView}
                    contentContainerStyle={styles.chatList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={item.url ? 0.85 : 1}
                        onPress={() => {
                          if (!item.url) return;
                          if (item.kind === 'image' || item.kind === 'file') {
                            setPreview({
                              visible: true,
                              kind: item.kind,
                              url: item.url,
                              title: item.filename || undefined,
                            });
                            return;
                          }
                          Linking.openURL(item.url);
                        }}
                        disabled={!item.url}
                        style={[
                          styles.chatBubble,
                          item.isSent ? styles.chatBubbleSent : styles.chatBubbleRecv,
                        ]}
                      >
                        {item.kind === 'image' ? (
                          item.url ? (
                            <Image source={{ uri: item.url }} style={styles.chatImage} />
                          ) : (
                            <View style={styles.chatAttachCard}>
                              <View style={styles.chatAttachIcon}>
                                <Icons.Report width={18} height={18} />
                              </View>
                              <View style={styles.chatAttachTextCol}>
                                <Text
                                  style={[
                                    styles.chatAttachTitle,
                                    item.isSent ? styles.chatTextSent : styles.chatTextRecv,
                                  ]}
                                  numberOfLines={2}
                                >
                                  {item.filename || item.text}
                                </Text>
                                <Text
                                  style={[
                                    styles.chatAttachSub,
                                    item.isSent ? styles.chatTimeSent : styles.chatTimeRecv,
                                  ]}
                                  numberOfLines={1}
                                >
                                  Preview unavailable (missing file URL)
                                </Text>
                              </View>
                            </View>
                          )
                        ) : item.kind === 'file' ? (
                          <View
                            style={[
                              styles.chatFilePill,
                              item.isSent
                                ? styles.chatFilePillSent
                                : styles.chatFilePillRecv,
                            ]}
                          >
                            <View
                              style={[
                                styles.chatFilePillIcon,
                                item.isSent
                                  ? styles.chatFilePillIconSent
                                  : styles.chatFilePillIconRecv,
                              ]}
                            >
                              <Icons.Report width={18} height={18} />
                            </View>
                            <Text
                              style={[
                                styles.chatFilePillName,
                                item.isSent ? styles.chatTextSent : styles.chatTextRecv,
                              ]}
                              numberOfLines={1}
                              ellipsizeMode="middle"
                            >
                              {item.filename ||
                                filenameFromUrl(item.url) ||
                                item.text ||
                                'Document'}
                            </Text>
                          </View>
                        ) : (
                          <Text
                            style={[
                              styles.chatText,
                              item.isSent ? styles.chatTextSent : styles.chatTextRecv,
                            ]}
                          >
                            {item.text}
                          </Text>
                        )}
                        <Text
                          style={[
                            styles.chatTime,
                            item.isSent ? styles.chatTimeSent : styles.chatTimeRecv,
                          ]}
                        >
                          {item.time}
                        </Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <Text style={styles.chatEmpty}>
                        {messagesQuery.isFetching ? 'Loading…' : 'No messages yet.'}
                      </Text>
                    }
                  />

                  <View style={styles.chatComposer}>
                    <TouchableOpacity
                      onPress={handleAttachChat}
                      style={styles.chatAttach}
                      activeOpacity={0.85}
                      disabled={sendMutation.isPending}
                    >
                      <Icons.Vector5Icon width={20} height={20} />
                    </TouchableOpacity>
                    <TextInput
                      value={chatDraft}
                      onChangeText={setChatDraft}
                      placeholder="Type a message…"
                      placeholderTextColor="#94A3B8"
                      style={styles.chatInput}
                      multiline
                    />
                    <TouchableOpacity
                      onPress={handleSendChat}
                      style={styles.chatSend}
                      activeOpacity={0.85}
                      disabled={sendMutation.isPending}
                    >
                      <Icons.SentMessageIcon width={20} height={20} />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <ScrollView
                  style={styles.rxScroll}
                  contentContainerStyle={styles.rxWrap}
                  showsVerticalScrollIndicator={false}
                >
                  {rx ? (
                    <>
                      <Text style={styles.rxTitle} numberOfLines={1}>
                        {rx.title || 'Prescription'}
                      </Text>
                      <Text style={styles.rxHint}>Doctor notes</Text>
                      <Text style={styles.rxBody}>
                        {(rx.advise as string) ||
                          (rx.advice as string) ||
                          '—'}
                      </Text>

                      <Text style={[styles.rxHint, { marginTop: 14 }]}>Medicines</Text>
                      {rxMeds.length ? (
                        rxMeds.map((m, idx) => (
                          <View key={idx} style={styles.rxMedRow}>
                            <Text style={styles.rxMedName}>
                              {m.name || 'Medicine'}
                            </Text>
                            <Text style={styles.rxMedMeta}>
                              {[m.dosage, m.frequency, m.duration]
                                .filter(Boolean)
                                .join(' • ') || '—'}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.rxEmpty}>No medicines added yet.</Text>
                      )}
                    </>
                  ) : (
                    <View style={styles.rxEmptyState}>
                      <View style={styles.rxEmptyIcon}>
                        <Icons.MedicineBottleWhiteIcon width={34} height={34} />
                      </View>
                      <Text style={styles.rxEmptyTitle}>No prescription yet</Text>
                      <Text style={styles.rxEmptyBody}>
                        It will appear here when the doctor creates it.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <AttachmentPreviewModal
        visible={preview.visible}
        kind={preview.kind}
        url={preview.url}
        title={preview.title}
        onClose={() => setPreview((p) => ({ ...p, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  remoteMicPill: {
    position: 'absolute',
    top: 18,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
  },
  remoteMicPillText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
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
  remoteOffBox: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 10,
    backgroundColor: '#0B1220',
  },
  remoteOffTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  remoteOffBody: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
  },
  rtcPip: {
    width: '100%',
    height: '100%',
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
  waitingMeta: {
    marginTop: 10,
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '600',
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.95,
  },
  waitingActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  waitingBtn: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.35)',
    minWidth: 120,
    alignItems: 'center',
  },
  waitingBtnPrimary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  waitingBtnText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  waitingBtnTextPrimary: {
    color: '#111827',
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
  panelOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  panelKeyboard: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  panelCard: {
    width: '100%',
    height: '92%',
    maxHeight: '92%',
    backgroundColor: '#0B1220',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  chatListView: {
    flex: 1,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  panelTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  panelClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  panelCloseText: {
    fontSize: 22,
    color: '#FFFFFF',
    marginTop: -2,
  },
  chatList: {
    paddingVertical: 10,
    gap: 10,
  },
  chatEmpty: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#CBD5E1',
    textAlign: 'center',
    paddingVertical: 20,
  },
  chatBubble: {
    maxWidth: '82%',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  chatImage: {
    width: 240,
    height: 170,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginBottom: 8,
  },
  chatAttachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  chatAttachIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  chatAttachTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  chatAttachTitle: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  chatAttachSub: {
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.85,
  },
  chatFilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 8,
  },
  chatFilePillSent: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  chatFilePillRecv: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chatFilePillIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatFilePillIconSent: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  chatFilePillIconRecv: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  chatFilePillName: {
    flex: 1,
    minWidth: 0,
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '700',
  },
  chatBubbleSent: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary ?? '#2563EB',
  },
  chatBubbleRecv: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chatText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    lineHeight: 18,
  },
  chatTextSent: { color: '#FFFFFF', fontWeight: '600' },
  chatTextRecv: { color: '#E5E7EB', fontWeight: '600' },
  chatTime: {
    marginTop: 6,
    fontFamily: Fonts.openSans,
    fontSize: 11,
    fontWeight: '700',
  },
  chatTimeSent: { color: 'rgba(255,255,255,0.85)' },
  chatTimeRecv: { color: '#94A3B8' },
  chatComposer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingTop: 10,
  },
  chatAttach: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chatInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    color: '#FFFFFF',
    fontFamily: Fonts.openSans,
    fontSize: 14,
  },
  chatSend: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary ?? '#2563EB',
  },
  rxScroll: {
    flex: 1,
  },
  rxWrap: {
    paddingVertical: 10,
    paddingBottom: 10,
  },
  rxTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rxHint: {
    marginTop: 10,
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  rxBody: {
    marginTop: 6,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    lineHeight: 20,
  },
  rxMedRow: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  rxMedName: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rxMedMeta: {
    marginTop: 4,
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  rxEmpty: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '700',
    color: '#CBD5E1',
    textAlign: 'center',
    paddingVertical: 24,
    lineHeight: 18,
  },
  rxEmptyState: {
    flex: 1,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  rxEmptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 2,
  },
  rxEmptyTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  rxEmptyBody: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '700',
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SessionJoined;

