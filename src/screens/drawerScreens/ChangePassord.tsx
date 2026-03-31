import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

type ChangePasswordNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'ChangePassword'
>;

const ChangePassword: React.FC = () => {
  const navigation = useNavigation<ChangePasswordNavigationProp>();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleUpdatePassword = () => {
    console.log('Update password pressed');
    // TODO: Implement password update logic
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
              style={styles.updateButton}
              onPress={handleUpdatePassword}
              activeOpacity={0.7}
            >
              <Text style={styles.updateButtonText}>Update Password</Text>
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
    paddingBottom: 100,
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
  updateButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ChangePassword;

