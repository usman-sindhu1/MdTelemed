import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';

const { width } = Dimensions.get('window');
const ILLUSTRATION_SIZE = Math.min(width * 0.45, 160);

const Screen2: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationWrapper}>
          <Icons.On2
            width={ILLUSTRATION_SIZE}
            height={ILLUSTRATION_SIZE * 1.1}
            preserveAspectRatio="xMidYMid meet"
          />
        </View>
        <Text style={styles.title}>Book Appointments</Text>
        <Text style={styles.description}>
          Schedule video consultations at your convenience with easy appointment booking.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  illustrationWrapper: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
});

export default Screen2;
