import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useSelector } from 'react-redux';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';
import Icons from '../../assets/svg';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';
import { RootState } from '../../store';
import { useLocationDisplay } from '../../hooks/useLocationDisplay';
import {
  getSavedAddress,
  getUserAvatarUri,
  getUserDisplayName,
  getUserEmail,
} from '../../utils/profileDisplay';

type SettingsNavigationProp = NativeStackNavigationProp<DrawerParamList>;

const Settings: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const authUser = useSelector(
    (s: RootState) => s.auth.user,
  ) as Record<string, unknown> | null;

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const displayName = getUserDisplayName(authUser);
  const email = getUserEmail(authUser);
  const avatarUri = getUserAvatarUri(authUser);
  const { locationLine } = useLocationDisplay(getSavedAddress(authUser));

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const menuItems = useMemo(() => {
    return [
      {
        key: 'ProfileDetails',
        label: 'Profile Settings',
        onPress: () => navigation.navigate('ProfileDetails'),
        icon: (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle
              cx="12"
              cy="8"
              r="3.5"
              stroke={Colors.textSecondary}
              strokeWidth="1.8"
            />
            <Path
              d="M5 20c.9-3.1 3.2-4.8 7-4.8s6.1 1.7 7 4.8"
              stroke={Colors.textSecondary}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </Svg>
        ),
      },
      {
        key: 'NotificationSettings',
        label: 'Notification Settings',
        onPress: () => navigation.navigate('NotificationSettings'),
        icon: (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 9a6 6 0 0 0-12 0c0 7-3 8.5-3 8.5h18S18 16 18 9Z"
              stroke={Colors.textSecondary}
              strokeWidth="1.8"
            />
          </Svg>
        ),
      },
      {
        key: 'PrivacyPolicy',
        label: 'Privacy Policy',
        onPress: () => navigation.navigate('PrivacyPolicy'),
        icon: (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Rect
              x="6"
              y="10"
              width="12"
              height="9"
              rx="2"
              stroke={Colors.textSecondary}
              strokeWidth="1.8"
            />
            <Path
              d="M8.5 10V8a3.5 3.5 0 1 1 7 0v2"
              stroke={Colors.textSecondary}
              strokeWidth="1.8"
            />
          </Svg>
        ),
      },
      {
        key: 'HelpAndFaqs',
        label: 'Help & FAQs',
        onPress: () => navigation.navigate('HelpAndFaqs'),
        icon: (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle
              cx="12"
              cy="12"
              r="9"
              stroke={Colors.textSecondary}
              strokeWidth="1.8"
            />
            <Path
              d="M9.5 9.5a2.5 2.5 0 1 1 4.2 1.8c-.8.7-1.2 1.1-1.2 2.2"
              stroke={Colors.textSecondary}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <Circle cx="12" cy="17" r="1" fill={Colors.textSecondary} />
          </Svg>
        ),
      },
      {
        key: 'TermsAndConditions',
        label: 'Terms & Conditions',
        onPress: () => navigation.navigate('TermsAndConditions'),
        icon: (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Rect
              x="5"
              y="4"
              width="14"
              height="16"
              rx="2"
              stroke={Colors.textSecondary}
              strokeWidth="1.8"
            />
            <Path
              d="M8 9h8M8 13h8M8 17h6"
              stroke={Colors.textSecondary}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </Svg>
        ),
      },
    ] as const;
  }, [navigation]);

  const filteredMenuItems = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return menuItems;
    return menuItems.filter((it) => it.label.toLowerCase().includes(q));
  }, [debouncedSearch, menuItems]);

  const isSearchEmpty =
    debouncedSearch.trim().length > 0 && filteredMenuItems.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SimpleBackHeader title="Settings" onBackPress={handleBackPress} compact />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.profileBlock}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{email || '—'}</Text>
            <View style={styles.locationRow}>
              <Icons.LocationIcon width={16} height={16} />
              <Text style={styles.userLocation} numberOfLines={3}>
                {locationLine}
              </Text>
            </View>
          </View>

          <View style={styles.searchWrap}>
            <Icons.Search width={18} height={18} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search settings..."
              placeholderTextColor="#9CA3AF"
              value={searchInput}
              onChangeText={setSearchInput}
            />
            {searchInput.trim().length > 0 ? (
              <TouchableOpacity
                onPress={() => setSearchInput('')}
                activeOpacity={0.7}
                style={styles.clearBtn}
              >
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.menuGroup}>
            {isSearchEmpty ? (
              <View style={styles.searchEmptyWrap}>
                <Text style={styles.searchEmptyTitle}>No results</Text>
                <Text style={styles.searchEmptyText}>Try a different keyword.</Text>
              </View>
            ) : (
              filteredMenuItems.map((it) => (
                <TouchableOpacity
                  key={it.key}
                  style={styles.menuCard}
                  activeOpacity={0.8}
                  onPress={it.onPress}
                >
                  <View style={styles.menuLeft}>
                    <View style={styles.iconBadge}>{it.icon}</View>
                    <Text style={styles.menuText}>{it.label}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          <TouchableOpacity style={styles.logoutCard} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  content: { paddingHorizontal: 16, paddingTop: 14 },
  profileBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 14,
    backgroundColor: Colors.backgroundLight,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
  },
  avatarInitial: {
    fontFamily: Fonts.raleway,
    fontSize: 44,
    fontWeight: '700',
    color: Colors.primary,
  },
  userName: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    maxWidth: '100%',
  },
  userLocation: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  searchWrap: {
    marginTop: 2,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  clearText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  menuGroup: { gap: 10 },
  searchEmptyWrap: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  searchEmptyTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  searchEmptyText: {
    fontFamily: Fonts.openSans,
    fontSize: 13.5,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    minHeight: 62,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  chevron: { fontSize: 30, color: Colors.textSecondary, marginTop: -2 },
  logoutCard: {
    marginTop: 24,
    backgroundColor: '#FCEBEE',
    borderRadius: 80,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
});

export default Settings;
