import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icons from '../../assets/svg';
import Fonts from '../../constants/fonts';

interface SimpleBackHeaderProps {
  title: string;
  onBackPress: () => void;
  rightElement?: React.ReactNode;
  backgroundColor?: string;
  /** Renders below the title row (e.g. progress card). */
  children?: React.ReactNode;
  /** Bottom corner radius for the header container. */
  bottomRadius?: number;
}

const SimpleBackHeader: React.FC<SimpleBackHeaderProps> = ({
  title,
  onBackPress,
  rightElement,
  backgroundColor = '#ECF2FD',
  children,
  bottomRadius = 0,
}) => {
  const insets = useSafeAreaInsets();

  const paddingBottom = bottomRadius > 0 ? 44 : 16;

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor,
          paddingTop: insets.top + 12,
          paddingBottom,
          borderBottomLeftRadius: bottomRadius,
          borderBottomRightRadius: bottomRadius,
          overflow: 'hidden',
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Icons.Back width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerRight}>{rightElement ?? null}</View>
      </View>
      {children ? <View style={styles.bottomContent}>{children}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  bottomContent: {},
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SimpleBackHeader;
