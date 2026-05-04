import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icons from '../../assets/svg';

const OUTLINE = '#FACC15';

type Props = {
  score: number;
  size?: number;
  gap?: number;
};

/**
 * 1–5 integer score: filled gold stars, remainder outline (gold wire style).
 */
const RatingStars: React.FC<Props> = ({ score, size = 18, gap = 3 }) => {
  const s = Math.max(1, Math.min(5, Math.round(Number(score) || 0)));
  return (
    <View style={[styles.row, { gap }]}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= s ? (
          <Icons.StarFill1Icon key={i} width={size} height={size} />
        ) : (
          <Icons.Star1Icon key={i} width={size} height={size} fill={OUTLINE} />
        ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RatingStars;
