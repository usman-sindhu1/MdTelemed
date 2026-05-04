import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

const { width: SCREEN_W } = Dimensions.get('window');
const H_PAD = 16;
const TOAST_MAX = Math.min(SCREEN_W - H_PAD * 2, 400);

/** Props passed by react-native-toast-message to custom render functions */
type ToastRenderProps = {
  text1?: string;
  text2?: string;
  hide?: () => void;
  onPress?: () => void;
};

function ErrorToast({ text1, text2, hide, onPress }: ToastRenderProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => {
        onPress?.();
        hide?.();
      }}
      style={[styles.wrap, { marginTop: insets.top + 6 }]}
      accessibilityRole="alert"
    >
      <View style={styles.card} pointerEvents="box-none">
        <View style={styles.accent} />
        <View style={styles.iconBlob}>
          <Text style={styles.iconText}>!</Text>
        </View>
        <View style={styles.textBlock}>
          {text1 ? <Text style={styles.title}>{text1}</Text> : null}
          {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

function SuccessToast({ text1, text2, hide, onPress }: ToastRenderProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => {
        onPress?.();
        hide?.();
      }}
      style={[styles.wrap, { marginTop: insets.top + 6 }]}
      accessibilityRole="alert"
    >
      <View style={[styles.card, styles.cardSuccess]} pointerEvents="box-none">
        <View style={[styles.accent, styles.accentSuccess]} />
        <View style={[styles.iconBlob, styles.iconBlobSuccess]}>
          <Text style={[styles.iconText, styles.iconTextSuccess]}>✓</Text>
        </View>
        <View style={styles.textBlock}>
          {text1 ? <Text style={styles.title}>{text1}</Text> : null}
          {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: TOAST_MAX,
    alignSelf: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.22)',
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  cardSuccess: {
    borderColor: 'rgba(14, 165, 233, 0.25)',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.error,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  accentSuccess: {
    backgroundColor: Colors.success,
  },
  iconBlob: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBlobSuccess: {
    backgroundColor: 'rgba(14, 165, 233, 0.14)',
  },
  iconText: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.error,
  },
  iconTextSuccess: {
    color: Colors.success,
    fontSize: 16,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

export const appToastConfig = {
  error: (props: ToastRenderProps) => <ErrorToast {...props} />,
  success: (props: ToastRenderProps) => <SuccessToast {...props} />,
};
