import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import HomeHeader from '../../components/common/HomeHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { clearAuthSession } from '../../utils/authSession';
import { getUserAvatarUri, getUserDisplayName, getUserEmail } from '../../utils/profileDisplay';
import { usePatientMe } from '../../hooks/usePatientMe';

type Row = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
};

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const authUser = useSelector((s: RootState) => s.auth.user) as Record<string, unknown> | null;

  const [loggingOut, setLoggingOut] = useState(false);

  const meQuery = usePatientMe(Boolean(isAuthenticated));

  const displayName = useMemo(() => {
    const fn = String(meQuery.data?.firstName ?? '').trim();
    const ln = String(meQuery.data?.lastName ?? '').trim();
    const full = [fn, ln].filter(Boolean).join(' ');
    return full || getUserDisplayName(authUser);
  }, [authUser, meQuery.data?.firstName, meQuery.data?.lastName]);

  const email = useMemo(() => {
    const e = String(meQuery.data?.email ?? '').trim();
    return e || getUserEmail(authUser);
  }, [authUser, meQuery.data?.email]);

  const avatarUri = useMemo(() => getUserAvatarUri(authUser), [authUser]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const navigateDrawerScreen = (drawerRouteName: string) => {
    // BottomTab -> Drawer is parent of parent.
    const drawerNav = navigation.getParent?.()?.getParent?.();
    if (drawerNav) {
      drawerNav.navigate(drawerRouteName);
      return;
    }
    // Fallback (shouldn't happen)
    navigation.navigate(drawerRouteName);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await clearAuthSession();
      dispatch(logout());
    } finally {
      setLoggingOut(false);
    }
  };

  const sections: { title: string; rows: Row[] }[] = [
    {
      title: 'Profile',
      rows: [
        {
          title: 'Personal Information',
          subtitle: 'Update your personal details',
          icon: <Icons.Vector5Icon width={20} height={20} />,
          onPress: () => navigateDrawerScreen('ProfileDetails'),
        },
        {
          title: 'Change Password',
          subtitle: 'Update your password',
          icon: <Icons.PasswordIcon width={20} height={20} />,
          onPress: () => navigateDrawerScreen('ChangePassword'),
        },
      ],
    },
    {
      title: 'Support',
      rows: [
        {
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          icon: <Icons.PageInfoIcon width={20} height={20} />,
          onPress: () => navigateDrawerScreen('HelpAndFaqs'),
        },
        {
          title: 'Terms & Conditions',
          subtitle: 'View terms and conditions',
          icon: <Icons.ClipboardListSolidBlackIcon width={20} height={20} />,
          onPress: () => navigateDrawerScreen('TermsAndConditions'),
        },
        {
          title: 'Privacy Policy',
          subtitle: 'View privacy policy',
          icon: <Icons.Vector7Icon width={20} height={20} />,
          onPress: () => navigateDrawerScreen('PrivacyPolicy'),
        },
      ],
    },
  ];

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <HomeHeader
              onProfilePress={openDrawer}
              showAIChatIcon={false}
              showNotificationIcon={false}
              showFeelingRow={false}
              placeholder="Search settings"
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your account and preferences</Text>

            <View style={styles.profileCard}>
              <View style={styles.profileLeft}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarInitial}>
                      {(displayName.trim() || 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.profileTextCol}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {displayName}
                  </Text>
                  <Text style={styles.profileEmail} numberOfLines={1}>
                    {email || '—'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.editBtn}
                activeOpacity={0.8}
                onPress={() => navigateDrawerScreen('ProfileDetails')}
              >
                <Icons.Vector8Icon width={18} height={18} />
              </TouchableOpacity>
            </View>

            {sections.map((sec) => (
              <View key={sec.title} style={styles.section}>
                <Text style={styles.sectionTitle}>{sec.title}</Text>
                <View style={styles.sectionCard}>
                  {sec.rows.map((row, idx) => (
                    <TouchableOpacity
                      key={row.title}
                      style={[
                        styles.row,
                        idx !== sec.rows.length - 1 && styles.rowDivider,
                      ]}
                      activeOpacity={0.8}
                      onPress={row.onPress}
                      disabled={!row.onPress}
                    >
                      <View style={styles.rowIconBadge}>{row.icon}</View>
                      <View style={styles.rowTextCol}>
                        <Text
                          style={[styles.rowTitle, row.destructive && styles.rowTitleDanger]}
                          numberOfLines={1}
                        >
                          {row.title}
                        </Text>
                        {row.subtitle ? (
                          <Text style={styles.rowSubtitle} numberOfLines={1}>
                            {row.subtitle}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.logoutRow}
              activeOpacity={0.85}
              onPress={handleLogout}
            >
              <View style={[styles.rowIconBadge, styles.logoutIconBadge]}>
                <Icons.Vector2Icon width={18} height={18} />
              </View>
              <Text style={styles.logoutText}>Logout</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={loggingOut} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.modalText}>Logging out…</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 110 },
  headerContainer: {
    backgroundColor: '#ECF2FD',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginHorizontal: -15,
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  content: { paddingHorizontal: 15, paddingTop: 16, gap: 14 },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: Colors.textLight,
    marginTop: -6,
  },
  profileCard: {
    backgroundColor: '#EEEFF3',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { width: 54, height: 54, borderRadius: 16, backgroundColor: '#E8EEF9' },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  avatarInitial: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  profileTextCol: { minWidth: 0, flex: 1 },
  profileName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  profileEmail: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { gap: 10 },
  sectionTitle: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 6,
  },
  sectionCard: {
    backgroundColor: '#EEEFF3',
    borderRadius: 18,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextCol: { flex: 1, minWidth: 0 },
  rowTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  rowTitleDanger: { color: '#EF4444' },
  rowSubtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  chevron: { fontSize: 22, color: '#CBD5E1', paddingLeft: 6 },
  logoutRow: {
    backgroundColor: '#FEF2F2',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    marginTop: 6,
  },
  logoutIconBadge: { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' },
  logoutText: {
    flex: 1,
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    gap: 12,
  },
  modalText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default SettingsScreen;

