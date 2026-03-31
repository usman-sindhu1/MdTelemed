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
  /** Reduces top/bottom spacing for compact headers. */
  compact?: boolean;
}

const SimpleBackHeader: React.FC<SimpleBackHeaderProps> = ({
  title,
  onBackPress,
  rightElement,
  backgroundColor = '#ECF2FD',
  children,
  bottomRadius,
  compact = false,
}) => {
  const insets = useSafeAreaInsets();
  const resolvedBottomRadius = bottomRadius ?? 24;
  const hasExplicitBottomRadius = bottomRadius !== undefined;

  const paddingBottom = hasExplicitBottomRadius && resolvedBottomRadius > 0 ? 44 : compact ? 8 : 16;
  const topOffset = compact ? 6 : 12;

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor,
          paddingTop: insets.top + topOffset,
          paddingBottom,
          borderBottomLeftRadius: resolvedBottomRadius,
          borderBottomRightRadius: resolvedBottomRadius,
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
    paddingBottom: 8,
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
