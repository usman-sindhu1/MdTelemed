import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import { Svg, Path } from 'react-native-svg';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

type AssetVideo = {
  id: string;
  title: string;
  androidAssetUri: string;
};

const VideoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const videos: AssetVideo[] = useMemo(
    () => [
      {
        id: 'v1',
        title: 'Video 1',
        // File is located at android/app/src/main/assets/video/<file>.mp4
        // Android asset URIs use `asset:/` and need URL-safe spaces.
        androidAssetUri:
          'asset:/video/WhatsApp%20Video%202026-05-05%20at%2012.33.27.mp4',
      },
      {
        id: 'v2',
        title: 'Video 2',
        androidAssetUri:
          'asset:/video/WhatsApp%20Video%202026-05-06%20at%2018.43.10.mp4',
      },
    ],
    [],
  );

  const [selectedId, setSelectedId] = useState<string>(videos[0]?.id ?? '');
  const selected = videos.find((v) => v.id === selectedId) ?? videos[0];
  const [muted, setMuted] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <SimpleBackHeader title="Videos" onBackPress={() => navigation.goBack()} compact />

      <View style={styles.content}>
        <View style={styles.playerCard}>
          {selected ? (
            <>
              <Video
                key={selected.androidAssetUri}
                source={{ uri: selected.androidAssetUri }}
                style={styles.video}
                controls
                resizeMode="contain"
                muted={muted}
                volume={1.0}
                paused={false}
                onError={(e) => {
                  const details =
                    (e as any)?.error ??
                    (e as any)?.nativeEvent ??
                    e;
                  const msg =
                    typeof details === 'string'
                      ? details
                      : JSON.stringify(details, null, 2);
                  console.warn('Video playback error for', selected.androidAssetUri, msg);
                  setErrorText(msg);
                }}
                onLoadStart={() => setErrorText(null)}
              />
              <TouchableOpacity
                style={styles.volumeBtn}
                activeOpacity={0.85}
                onPress={() => setMuted((v) => !v)}
              >
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4 10v4h3l4 3V7L7 10H4Z"
                    fill="#FFFFFF"
                    opacity={muted ? 0.75 : 1}
                  />
                  {muted ? (
                    <>
                      <Path
                        d="M16 9l5 6"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <Path
                        d="M21 9l-5 6"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </>
                  ) : (
                    <>
                      <Path
                        d="M16.5 9.5c1.3 1.3 1.3 3.7 0 5"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <Path
                        d="M18.8 7.2c2.6 2.6 2.6 7 0 9.6"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </>
                  )}
                </Svg>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No videos found</Text>
              <Text style={styles.emptySub}>
                Add MP4 files under `android/app/src/main/assets/video/`.
              </Text>
            </View>
          )}
        </View>
        {errorText ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Can’t play this video</Text>
            <Text style={styles.errorBody} numberOfLines={6}>
              {errorText}
            </Text>
          </View>
        ) : null}

        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>Available videos</Text>
          {videos.map((v) => {
            const isActive = v.id === selectedId;
            return (
              <TouchableOpacity
                key={v.id}
                activeOpacity={0.85}
                onPress={() => setSelectedId(v.id)}
                style={[styles.row, isActive && styles.rowActive]}
              >
                <View style={[styles.iconBadge, isActive && styles.iconBadgeActive]}>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M10 8.5v7l6-3.5-6-3.5Z"
                      fill={isActive ? '#FFFFFF' : Colors.textSecondary}
                    />
                  </Svg>
                </View>
                <Text style={[styles.rowTitle, isActive && styles.rowTitleActive]} numberOfLines={1}>
                  {v.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 15, paddingTop: 14, gap: 14, flex: 1 },
  playerCard: {
    backgroundColor: '#0B1220',
    borderRadius: 18,
    overflow: 'hidden',
    height: 240,
  },
  video: { width: '100%', height: '100%' },
  volumeBtn: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    padding: 12,
    marginTop: -4,
  },
  errorTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '900',
    color: '#991B1B',
  },
  errorBody: {
    marginTop: 6,
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '600',
    color: '#7F1D1D',
    lineHeight: 16,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 6 },
  emptyTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptySub: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 18,
  },
  listCard: {
    backgroundColor: '#EEEFF3',
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  sectionTitle: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  row: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowActive: {
    backgroundColor: '#E8EEF9',
    borderColor: '#D7E4FF',
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconBadgeActive: {
    backgroundColor: Colors.primary,
  },
  rowTitle: {
    flex: 1,
    minWidth: 0,
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  rowTitleActive: { color: Colors.primary },
});

export default VideoScreen;

