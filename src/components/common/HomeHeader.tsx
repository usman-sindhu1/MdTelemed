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
import { useSelector } from 'react-redux';
import Icons from '../../assets/svg';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { RootState } from '../../store';
import { useLocationDisplay } from '../../hooks/useLocationDisplay';
import { usePatientNotifications } from '../../hooks/usePatientNotifications';
import {
  getSavedAddress,
  getUserAvatarUri,
  getUserDisplayName,
} from '../../utils/profileDisplay';

const HEADER_BG = '#ECF2FD';
const ICON_CIRCLE_SIZE = 44;
const EMOJI_CIRCLE_SIZE = 40;
const RED_DOT_SIZE = 10;

interface HomeHeaderProps {
  onProfilePress?: () => void;
  onSearchChange?: (text: string) => void;
  onSearchPress?: () => void;
  onAIChatPress?: () => void;
  onNotificationPress?: () => void;
  showAIChatIcon?: boolean;
  showNotificationIcon?: boolean;
  /** Overrides unread notification count badge. */
  notificationCount?: number;
  onFeelingPress?: (index: number) => void;
  placeholder?: string;
  value?: string;
  searchEditable?: boolean;
  /** Overrides session name from Redux (`auth.user`). */
  userName?: string;
  /** Overrides resolved location (GPS → saved profile address). */
  userAddress?: string;
  /** Overrides avatar URL from session; pass `null` to hide photo. */
  profileImageUri?: string | null;
  showFeelingRow?: boolean;
  /** When provided, shows a "Mood" summary row (submitted today). */
  moodSummary?: {
    moodLabel: string;
    moodEmoji: string;
    resetInMinutes: number;
  } | null;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  onProfilePress,
  onSearchChange,
  onSearchPress,
  onAIChatPress,
  onNotificationPress,
  showAIChatIcon = false,
  showNotificationIcon = true,
  notificationCount,
  onFeelingPress,
  placeholder = 'Search doctor, service',
  value = '',
  searchEditable = true,
  userName: userNameOverride,
  userAddress: userAddressOverride,
  profileImageUri: profileImageOverride,
  showFeelingRow = true,
  moodSummary = null,
}) => {
  const insets = useSafeAreaInsets();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const authUser = useSelector(
    (s: RootState) => s.auth.user,
  ) as Record<string, unknown> | null;
  const { locationLine } = useLocationDisplay(getSavedAddress(authUser));
  const notificationsQuery = usePatientNotifications();

  const userName = userNameOverride ?? getUserDisplayName(authUser);
  const userAddress = userAddressOverride ?? locationLine;
  const profileImageUri =
    profileImageOverride !== undefined
      ? profileImageOverride
      : getUserAvatarUri(authUser);

  const avatarInitial = (userName.trim() || 'U').charAt(0).toUpperCase();

  const unreadCount =
    typeof notificationCount === 'number'
      ? notificationCount
      : isAuthenticated
        ? (notificationsQuery.data ?? []).filter((n) => !n.isRead).length
        : 0;

  const hasMoodSummary = Boolean(moodSummary);

  return (
    <View
      style={[
        styles.container,
        hasMoodSummary ? styles.containerCompact : null,
        { paddingTop: insets.top + 16 },
      ]}
    >
      {/* Top row: Profile + Name + Address | AI Chat + Notification */}
      <View style={[styles.topRow, hasMoodSummary ? styles.topRowCompact : null]}>
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
              <Text style={styles.avatarPlaceholder}>{avatarInitial}</Text>
            )}
          </View>
          <View style={styles.nameAddressWrap}>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
            <View style={styles.addressRow}>
              <View style={styles.locationIconWrap}>
                <Icons.LocationIcon width={14} height={14} />
              </View>
              <Text style={styles.address} numberOfLines={2}>
                {userAddress}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.actionIcons}>
          {showAIChatIcon && (
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={onAIChatPress}
              activeOpacity={onAIChatPress ? 0.7 : 1}
              disabled={!onAIChatPress}
            >
              <Icons.AIChatIcon width={22} height={22} />
            </TouchableOpacity>
          )}
          {showNotificationIcon && (
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={onNotificationPress}
              activeOpacity={onNotificationPress ? 0.7 : 1}
              disabled={!onNotificationPress}
            >
              <Icons.NotificationBingIcon width={22} height={22} />
              {unreadCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText} numberOfLines={1}>
                    {unreadCount > 99 ? '99+' : String(unreadCount)}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Feeling row */}
      {moodSummary ? (
        <View style={styles.moodBlock}>
          <View style={styles.moodRow}>
            <Text style={styles.moodTitle}>Mood</Text>
            <View style={styles.moodPill}>
              <Text style={styles.moodPillText} numberOfLines={1}>
                Today: {moodSummary.moodEmoji} {moodSummary.moodLabel}
              </Text>
              <Text style={styles.moodResetText} numberOfLines={1}>
                Reset in {moodSummary.resetInMinutes} min
              </Text>
            </View>
          </View>
        </View>
      ) : showFeelingRow ? (
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
      ) : null}

      {/* Search bar */}
      <TouchableOpacity
        style={styles.searchWrap}
        activeOpacity={onSearchPress ? 0.85 : 1}
        onPress={onSearchPress}
        disabled={!onSearchPress}
      >
        <Icons.Search width={20} height={20} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onSearchChange}
          editable={searchEditable}
          pointerEvents={onSearchPress && !searchEditable ? 'none' : 'auto'}
        />
      </TouchableOpacity>
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
  containerCompact: {
    paddingBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  topRowCompact: {
    marginBottom: 12,
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
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontFamily: Fonts.raleway,
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 12,
  },
  feelingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moodBlock: {
    marginBottom: 16,
    gap: 6,
  },
  moodTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  moodPill: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  moodPillText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    flexShrink: 1,
  },
  moodResetText: {
    fontFamily: Fonts.openSans,
    fontSize: 12.5,
    fontWeight: '500',
    color: '#94A3B8',
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
