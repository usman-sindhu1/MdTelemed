import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icons from '../../assets/svg';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

const HEADER_BG = '#ECF2FD';
const ICON_CIRCLE_SIZE = 44;
const EMOJI_CIRCLE_SIZE = 40;
const RED_DOT_SIZE = 10;

interface HomeHeaderProps {
  onProfilePress?: () => void;
  onSearchChange?: (text: string) => void;
  onAIChatPress?: () => void;
  onNotificationPress?: () => void;
  onFeelingPress?: (index: number) => void;
  placeholder?: string;
  value?: string;
  userName?: string;
  userAddress?: string;
  profileImageUri?: string | null;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  onProfilePress,
  onSearchChange,
  onAIChatPress,
  onNotificationPress,
  onFeelingPress,
  placeholder = 'Search doctor, service',
  value = '',
  userName = 'John Doe',
  userAddress = '1901 Thornridge Cir. Shiloh, Hawaii 81063',
  profileImageUri,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Top row: Profile + Name + Address | AI Chat + Notification */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.profileSection}
          onPress={onProfilePress}
          activeOpacity={onProfilePress ? 0.7 : 1}
          disabled={!onProfilePress}
        >
          <View style={styles.avatarWrapper}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarPlaceholder}>{userName.charAt(0)}</Text>
            )}
          </View>
          <View style={styles.nameAddressWrap}>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
            <View style={styles.addressRow}>
              <View style={styles.locationIconWrap}>
                <Icons.LocationIcon width={14} height={14} />
              </View>
              <Text style={styles.address} numberOfLines={1}>{userAddress}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.actionIcons}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={onAIChatPress}
            activeOpacity={0.7}
          >
            <Icons.AIChatIcon width={22} height={22} />
            <View style={styles.redDot} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Icons.NotificationBingIcon width={22} height={22} />
            <View style={styles.redDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feeling row */}
      <View style={styles.feelingRow}>
        <Text style={styles.feelingText}>How are you feeling today?</Text>
        <View style={styles.emojiRow}>
          <TouchableOpacity
            style={styles.emojiCircle}
            onPress={() => onFeelingPress?.(0)}
            activeOpacity={0.7}
          >
            <Icons.RelievedFaceIcon width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emojiCircle}
            onPress={() => onFeelingPress?.(1)}
            activeOpacity={0.7}
          >
            <Icons.SmilingFaceWithHeartEyesIcon width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emojiCircle}
            onPress={() => onFeelingPress?.(2)}
            activeOpacity={0.7}
          >
            <Icons.SmilingFaceWithSmilingEyesIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Icons.Search width={20} height={20} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onSearchChange}
          editable={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: HEADER_BG,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Fonts.raleway,
    color: Colors.primary,
  },
  nameAddressWrap: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationIconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  address: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
    flex: 1,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: RED_DOT_SIZE,
    height: RED_DOT_SIZE,
    borderRadius: RED_DOT_SIZE / 2,
    backgroundColor: '#EF4444',
  },
  feelingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  feelingText: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emojiCircle: {
    width: EMOJI_CIRCLE_SIZE,
    height: EMOJI_CIRCLE_SIZE,
    borderRadius: EMOJI_CIRCLE_SIZE / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
  },
});

export default HomeHeader;
