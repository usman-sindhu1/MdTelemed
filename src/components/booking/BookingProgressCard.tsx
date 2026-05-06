import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';

type Props = {
  subtitle: string;
  percent: number;
  timeLabel?: string;
  /** Total step markers along the bar (default 5). */
  dotCount?: number;
  /** 0-based index of active step (dims other dots optionally). */
  activeDotIndex?: number;
};

/**
 * Floating progress card (used under booking stack headers).
 */
const BookingProgressCard: React.FC<Props> = ({
  subtitle,
  percent,
  timeLabel = '10min',
  dotCount = 5,
  activeDotIndex = 0,
}) => {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View style={styles.shadowWrap}>
      <View style={styles.card}>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
        <View style={styles.cardRow}>
          <Text style={styles.percentText}>{Math.round(clamped)}% completed</Text>
          <View style={styles.timeRow}>
            <Icons.NestClockFarsightAnalogIcon width={14} height={14} />
            <Text style={styles.timeText}>{timeLabel}</Text>
          </View>
        </View>
        <View style={styles.progressTrackInset}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${clamped}%` }]} />
            <View style={styles.progressDots}>
              {Array.from({ length: dotCount }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === activeDotIndex && styles.dotActive,
                    i > activeDotIndex && styles.dotDim,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrap: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  cardSubtitle: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '400',
    color: '#757575',
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentText: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary ?? '#2563EB',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '500',
    color: '#757575',
    marginLeft: 4,
  },
  /** Extra inset so the track and fill do not touch the card sides. */
  progressTrackInset: {
    marginHorizontal: 10,
  },
  progressBar: {
    height: 7,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'visible',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary ?? '#2563EB',
    borderRadius: 4,
  },
  progressDots: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary ?? '#2563EB',
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotDim: {
    opacity: 0.35,
  },
});

export default BookingProgressCard;
