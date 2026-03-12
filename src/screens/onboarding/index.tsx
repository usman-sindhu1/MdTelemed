import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';

const { width } = Dimensions.get('window');
const PRIMARY = '#2563EB';
const DOT_INACTIVE = '#D1D5DB';

type OnboardingScreensNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

const OnboardingScreens: React.FC = () => {
  const navigation = useNavigation<OnboardingScreensNavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const screens = [
    { id: '1', component: Screen1 },
    { id: '2', component: Screen2 },
    { id: '3', component: Screen3 },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleButtonPress = () => {
    if (currentIndex < screens.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.replace('SignIn');
    }
  };

  const handleSkip = () => {
    navigation.replace('SignIn');
  };

  const handleDotPress = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const onScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    }, 100);
  };

  const renderItem = ({ item, index }: { item: typeof screens[0]; index: number }) => {
    const ScreenComponent = item.component;
    return (
      <View style={styles.screenContainer}>
        <ScreenComponent />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Skip - top right */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={screens}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="start"
        onScrollToIndexFailed={onScrollToIndexFailed}
      />

      {/* Footer: pagination dots + button */}
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDotPress(index)}
              style={styles.dotTouchable}
            >
              <View
                style={[
                  styles.dot,
                  currentIndex === index ? styles.dotActive : styles.dotInactive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleButtonPress} activeOpacity={0.85}>
          <Text style={styles.buttonText}>
            {currentIndex < screens.length - 1 ? 'Next' : 'Get Started'}
          </Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerSpacer: {
    width: 40,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Fonts.openSans,
    color: PRIMARY,
  },
  screenContainer: {
    width: width,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: Colors.background,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dotTouchable: {
    padding: 2,
  },
  dot: {
    borderRadius: 4,
  },
  dotActive: {
    width: 20,
    height: 8,
    backgroundColor: PRIMARY,
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: DOT_INACTIVE,
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.raleway,
    color: Colors.buttonText,
  },
  buttonArrow: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.buttonText,
  },
});

export default OnboardingScreens;
