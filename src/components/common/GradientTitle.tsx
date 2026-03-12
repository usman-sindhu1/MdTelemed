import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientTitleProps {
  title: string;
}

export const GradientTitle: React.FC<GradientTitleProps> = ({ title }) => {
  return (
    <LinearGradient
      colors={['#10B4D4', '#00BCD4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <Text style={styles.text}>{title}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  } as TextStyle,
});

export default GradientTitle;

