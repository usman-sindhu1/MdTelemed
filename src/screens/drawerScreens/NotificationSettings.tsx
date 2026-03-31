import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type NotificationSettingsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'NotificationSettings'
>;

interface NotificationOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const NotificationSettings: React.FC = () => {
  const navigation = useNavigation<NotificationSettingsNavigationProp>();

  const [notifications, setNotifications] = useState<NotificationOption[]>([
    {
      id: '1',
      label: 'Push Notifications',
      description: 'Receive push notifications on your device',
      enabled: true,
    },
    {
      id: '2',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      enabled: true,
    },
    {
      id: '3',
      label: 'SMS Notifications',
      description: 'Receive notifications via SMS',
      enabled: false,
    },
    {
      id: '4',
      label: 'Appointment Reminders',
      description: 'Get reminders for upcoming appointments',
      enabled: true,
    },
    {
      id: '5',
      label: 'Prescription Updates',
      description: 'Notifications when prescriptions are updated',
      enabled: true,
    },
    {
      id: '6',
      label: 'Report Ready',
      description: 'Get notified when reports are ready',
      enabled: true,
    },
    {
      id: '7',
      label: 'Payment Reminders',
      description: 'Reminders for pending payments',
      enabled: false,
    },
    {
      id: '8',
      label: 'Promotional Notifications',
      description: 'Receive promotional offers and updates',
      enabled: false,
    },
  ]);

  const handleBackPress = () => {
    navigation.navigate('ProfileSettings');
  };

  const handleToggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SimpleBackHeader title="Notifications" onBackPress={handleBackPress} compact />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Notifications</Text>
            <Text style={styles.description}>
              Manage your notification preferences. Choose what notifications you want to receive.
            </Text>
          </View>

          {/* Notification Options */}
          <View style={styles.optionsContainer}>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.optionCard}>
                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{notification.label}</Text>
                  <Text style={styles.optionDescription}>
                    {notification.description}
                  </Text>
                </View>
                <Switch
                  value={notification.enabled}
                  onValueChange={() => handleToggle(notification.id)}
                  trackColor={{
                    false: Colors.backgroundLight,
                    true: Colors.primary,
                  }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor={Colors.backgroundLight}
                />
              </View>
            ))}
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
  titleSection: {
    marginTop: 24,
    marginBottom: 32,
    gap: 12,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  description: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E8EF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  optionContent: {
    flex: 1,
    gap: 4,
    marginRight: 16,
  },
  optionLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  optionDescription: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

export default NotificationSettings;

