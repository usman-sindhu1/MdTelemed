import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Icons from '../../assets/svg';
import Fonts from '../../constants/fonts';
import { hasCompletedOnboarding } from '../../utils/authSession';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOADING_BAR_WIDTH = SCREEN_WIDTH * 0.75;
const SPLASH_DURATION = 3000;

type SplashScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate loading bar from 0 to ~85% over splash duration
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SPLASH_DURATION - 200,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  useEffect(() => {
    const timer = setTimeout(() => {
      (async () => {
        const done = await hasCompletedOnboarding();
        navigation.replace(done ? 'SignIn' : 'Onboarding');
      })();
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [navigation]);

  const loadingBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, LOADING_BAR_WIDTH * 0.85],
  });

  return (
    <LinearGradient
      colors={['#2563EB', '#153885']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Logo area */}
          <View style={styles.logoSection}>
            <View style={styles.logoWrapper}>
              <Icons.Logo width={120} height={120} />
            </View>
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>Real Doctors. Real Meds. Right Now</Text>

          {/* Loading indicator */}
          <View style={styles.loadingSection}>
            <View style={styles.loadingBarTrack}>
              <Animated.View style={[styles.loadingBarFill, { width: loadingBarWidth }]} />
            </View>
            <Text style={styles.loadingText}>Loading your experience...</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerFeatures}>Easy Access • Expert Doctors • Secure & Safe</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoWrapper: {
    marginBottom: 16,
  },
  appName: {
    fontFamily: Fonts.raleway,
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subTagline: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  tagline: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  loadingSection: {
    alignItems: 'center',
    width: '100%',
  },
  loadingBarTrack: {
    width: LOADING_BAR_WIDTH,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  loadingText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  footerFeatures: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 8,
  },
  version: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default SplashScreen;
