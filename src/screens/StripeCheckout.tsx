import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import type { DrawerParamList } from '../navigation/HomeStackRoot';

type ScreenRoute = RouteProp<DrawerParamList, 'StripeCheckout'>;

const StripeCheckout: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ScreenRoute>();
  const url = (route.params?.checkoutUrl ?? '').trim();
  const [loading, setLoading] = useState(true);
  const didFinishRef = useRef(false);

  const WebViewImpl = useMemo(() => {
    try {
      // If the native module isn't installed in this build, this require will throw.
      // We handle that gracefully and offer an in-app fallback message.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('react-native-webview').WebView as
        | React.ComponentType<any>
        | undefined;
    } catch {
      return undefined;
    }
  }, []);

  const finishToAppointments = () => {
    if (didFinishRef.current) return;
    didFinishRef.current = true;
    (navigation as any).dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'Calendar' } }],
      }),
    );
  };

  const isStripeUrl = (nextUrl: string): boolean => {
    const m = nextUrl.match(/^https?:\/\/([^/]+)/i);
    const host = (m?.[1] ?? '').toLowerCase();
    if (!host) {
      return nextUrl.includes('checkout.stripe.com') || nextUrl.includes('stripe.com');
    }
    return (
      host === 'checkout.stripe.com' ||
      host.endsWith('.stripe.com') ||
      host === 'hooks.stripe.com'
    );
  };

  return (
    <View style={styles.container}>
      <SimpleBackHeader
        title="Checkout"
        onBackPress={() => navigation.goBack()}
        backgroundColor="#ECF2FD"
        bottomRadius={24}
      />

      {!url ? (
        <View style={styles.center}>
          <Text style={styles.errTitle}>Missing checkout URL</Text>
          <Text style={styles.errBody}>
            Please go back and try again.
          </Text>
        </View>
      ) : !WebViewImpl ? (
        <View style={styles.center}>
          <Text style={styles.errTitle}>WebView not installed</Text>
          <Text style={styles.errBody}>
            Your current app build doesn’t include the WebView native module
            (`RNCWebViewModule`). Rebuild the app, or tap below to open checkout
            in your browser.
          </Text>
          <Text
            style={styles.link}
            onPress={() => {
              void Linking.openURL(url);
            }}
          >
            Open checkout in browser
          </Text>
        </View>
      ) : (
        <View style={styles.webWrap}>
          <WebViewImpl
            source={{ uri: url }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
            incognito
            onShouldStartLoadWithRequest={(req: { url?: string }) => {
              const nextUrl = (req?.url ?? '').trim();
              if (!nextUrl) return true;
              // Stripe redirects to your `success_url` / `cancel_url` (often your web app).
              // When we detect leaving Stripe, close and route to Appointments tab.
              if (!isStripeUrl(nextUrl)) {
                finishToAppointments();
                return false;
              }
              return true;
            }}
          />
          {loading ? (
            <View style={styles.loadingOverlay} pointerEvents="none">
              <ActivityIndicator size="large" color={Colors.primary ?? '#2563EB'} />
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  webWrap: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  errBody: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  link: {
    marginTop: 14,
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary ?? '#2563EB',
  },
});

export default StripeCheckout;

