import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';
import PasswordInput from '../../components/PasswordInput';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';
import useApi from '../../hooks/UseApi';
import { authPaths } from '../../constants/authPaths';
import { showErrorToast, showSuccessToast } from '../../utils/appToast';

type ChangePasswordNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'ChangePassword'
>;

const ChangePassword: React.FC = () => {
  const navigation = useNavigation<ChangePasswordNavigationProp>();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordPolicyError = useMemo(() => {
    const n = newPassword.trim();
    if (!n) return '';
    if (n.length < 10) return 'Password must be at least 10 characters';
    if (!/[A-Z]/.test(n)) return 'Password must include at least one uppercase letter';
    if (!/[a-z]/.test(n)) return 'Password must include at least one lowercase letter';
    return '';
  }, [newPassword]);

  const { onRequest, isPending } = useApi<{ oldPassword: string; newPassword: string }>({
    key: 'change-password-logged-in',
    isSuccessToast: false,
  });

  const isFormValid = useMemo(() => {
    const o = oldPassword.trim();
    const n = newPassword.trim();
    const c = confirmPassword.trim();
    if (!o || !n || !c) return false;
    if (passwordPolicyError) return false;
    if (n !== c) return false;
    if (o === n) return false;
    return true;
  }, [oldPassword, newPassword, confirmPassword, passwordPolicyError]);

  const handleBackPress = () => {
    // This screen is mounted under the Drawer navigator. If it was opened via
    // `navigate('ChangePassword')` (no stack history), `goBack()` can fall back
    // to drawer behavior on some setups. Prefer returning to Settings tab.
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.dispatch(DrawerActions.closeDrawer());
    (navigation as any).navigate('MainTabs', {
      screen: 'Settings',
      params: { screen: 'SettingsMain' },
    });
  };

  const handleUpdatePassword = async () => {
    const o = oldPassword.trim();
    const n = newPassword.trim();
    const c = confirmPassword.trim();

    if (!o) {
      showErrorToast('Please enter your current password.');
      return;
    }
    if (!n) {
      showErrorToast('Please enter a new password.');
      return;
    }
    if (passwordPolicyError) {
      showErrorToast(passwordPolicyError);
      return;
    }
    if (n !== c) {
      showErrorToast('New password and confirmation do not match.');
      return;
    }
    if (o === n) {
      showErrorToast('New password must be different from the current password.');
      return;
    }

    onRequest({
      path: authPaths.changePassword,
      data: { oldPassword: o, newPassword: n },
      onSuccess: () => {
        showSuccessToast('Password changed successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      },
      onError: (err: any) => {
        showErrorToast(err?.message || 'Could not change password. Try again.');
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SimpleBackHeader title="Change Password" onBackPress={handleBackPress} compact />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          {/* Title */}
          <Text style={styles.heading}>Change Password</Text>

          {/* Input Fields */}
          <View style={styles.inputsContainer}>
            <PasswordInput
              placeholder="Old password"
              value={oldPassword}
              onChangeText={setOldPassword}
              style={styles.input}
            />

            <PasswordInput
              placeholder="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
            />

            <PasswordInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
          </View>

          {/* Update Password Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.updateButton,
                (!isFormValid || isPending) && styles.updateButtonDisabled,
              ]}
              onPress={handleUpdatePassword}
              activeOpacity={0.7}
              disabled={!isFormValid || isPending}
            >
              {isPending ? (
                <ActivityIndicator color={Colors.buttonText} />
              ) : (
                <Text style={styles.updateButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: 15,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 28,
  },
  inputsContainer: {
    gap: 20,
    marginBottom: 32,
  },
  input: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: 8,
  },
  updateButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonDisabled: {
    opacity: 0.55,
  },
  updateButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ChangePassword;

