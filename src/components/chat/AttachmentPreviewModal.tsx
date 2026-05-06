import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

type Props = {
  visible: boolean;
  kind: 'image' | 'file';
  url?: string;
  title?: string;
  onClose: () => void;
};

export function AttachmentPreviewModal({
  visible,
  kind,
  url,
  title,
  onClose,
}: Props) {
  const displayTitle = useMemo(() => title?.trim() || (kind === 'image' ? 'Image' : 'File'), [title, kind]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {displayTitle}
          </Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {!url ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Preview unavailable</Text>
              <Text style={styles.emptyBody}>Missing file URL.</Text>
            </View>
          ) : kind === 'image' ? (
            <View style={styles.imageWrap}>
              <Image source={{ uri: url }} style={styles.image} resizeMode="contain" />
            </View>
          ) : (
            <WebView
              source={{ uri: url }}
              style={styles.web}
              originWhitelist={['*']}
              javaScriptEnabled
              domStorageEnabled
              // Android PDF rendering depends on WebView; this is best-effort.
              setSupportMultipleWindows={false}
              startInLoadingState
              allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B1220' },
  header: {
    height: 56,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.10)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    marginRight: 10,
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  closeText: { color: '#FFFFFF', fontSize: 26, lineHeight: 28, fontWeight: '700' },
  body: { flex: 1 },
  imageWrap: { flex: 1, backgroundColor: '#000000' },
  image: { width: '100%', height: '100%' },
  web: { flex: 1, backgroundColor: '#0B1220' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: {
    fontFamily: Fonts.openSans,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptyBody: { fontFamily: Fonts.openSans, fontSize: 13, fontWeight: '700', color: '#94A3B8' },
});

