import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type ContactUsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'ContactUs'
>;

interface ContactInfo {
  id: string;
  type: 'phone' | 'email' | 'address';
  label: string;
  value: string;
  action?: () => void;
}

const ContactUs: React.FC = () => {
  const navigation = useNavigation<ContactUsNavigationProp>();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const contactInfo: ContactInfo[] = [
    {
      id: '1',
      type: 'phone',
      label: 'Phone Number',
      value: '+1 (234) 567-8900',
      action: () => Linking.openURL('tel:+12345678900'),
    },
    {
      id: '2',
      type: 'email',
      label: 'Email Address',
      value: 'support@mdtelemed.com',
      action: () => Linking.openURL('mailto:support@mdtelemed.com'),
    },
    {
      id: '3',
      type: 'address',
      label: 'Office Address',
      value: '4517 Washington Ave. Manchester, Kentucky 39495',
      action: () => {
        // Open maps
        const address = encodeURIComponent('4517 Washington Ave. Manchester, Kentucky 39495');
        Linking.openURL(`https://maps.google.com/?q=${address}`);
      },
    },
  ];

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCopyPress = (text: string) => {
    console.log('Copy pressed:', text);
    // TODO: Implement copy to clipboard
  };

  const handleSendMessage = () => {
    console.log('Send message', { name, email, phone, reason, description });
  };

  const renderContactIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Icons.Vector2Icon width={28} height={28} fill="#FFFFFF" />;
      case 'email':
        return <Icons.Vector5Icon width={28} height={28} fill="#FFFFFF" />;
      case 'address':
        return <Icons.VectorIcon width={28} height={28} fill="#FFFFFF" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerContainer}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity style={styles.headerIconButton} onPress={handleBackPress} activeOpacity={0.7}>
            <Icons.Back width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
            <Image source={Icons.SearchPngIcon} style={styles.headerSearchIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Get in Touch</Text>
            </View>
            <Text style={styles.heading}>Contact Us</Text>
            <Text style={styles.description}>
              Have questions? We are here to help. Reach out to our team and we will get back to you.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Write here"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Write here"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone No.</Text>
              <TextInput
                style={styles.input}
                placeholder="Write here"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reason of Contacting</Text>
              <View style={styles.selectWrap}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Write here"
                  placeholderTextColor="#9CA3AF"
                  value={reason}
                  onChangeText={setReason}
                />
                <Text style={styles.selectArrow}>▾</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write here"
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <Text style={styles.termsText}>I agree to the privacy policy and terms of service.</Text>

            <TouchableOpacity style={styles.sendButton} activeOpacity={0.8} onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
            <Text style={styles.responseText}>We typically respond within 24 hours</Text>
          </View>

          <View style={styles.contactCardsContainer}>
            {contactInfo.map((info) => (
              <TouchableOpacity
                key={info.id}
                style={styles.contactCard}
                onPress={info.action}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconContainer,
                  info.type === 'phone' && styles.iconContainerPhone,
                  info.type === 'email' && styles.iconContainerEmail,
                  info.type === 'address' && styles.iconContainerAddress,
                ]}>
                  {renderContactIcon(info.type)}
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>{info.label}</Text>
                  <Text style={styles.infoValue}>{info.value}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleCopyPress(info.value)}
                  activeOpacity={0.7}
                  style={styles.copyButton}
                >
                  <Text style={styles.copyText}>↗</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.additionalInfoSection}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            <View style={styles.hoursContainer}>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Monday - Friday</Text>
                <Text style={styles.hoursTime}>9:00 AM - 6:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Saturday</Text>
                <Text style={styles.hoursTime}>10:00 AM - 4:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Sunday</Text>
                <Text style={styles.hoursTime}>Closed</Text>
              </View>
            </View>
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
  headerContainer: {
    backgroundColor: '#ECF2FD',
    zIndex: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerSearchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 15,
  },
  titleSection: {
    marginTop: 16,
    marginBottom: 18,
    gap: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 36 / 2 * 2,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  description: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  formCard: {
    backgroundColor: '#ECF2FD',
    borderRadius: 18,
    padding: 14,
    marginBottom: 22,
    gap: 10,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    color: Colors.textPrimary,
    fontFamily: Fonts.openSans,
    fontSize: 14,
  },
  selectWrap: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    paddingVertical: 0,
  },
  selectArrow: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  textArea: {
    height: 90,
    paddingTop: 12,
  },
  termsText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: '#6B7280',
  },
  sendButton: {
    height: 46,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  sendButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  responseText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  contactCardsContainer: {
    gap: 12,
    marginBottom: 22,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainerPhone: {
    backgroundColor: '#4CAF50',
  },
  iconContainerEmail: {
    backgroundColor: '#2196F3',
  },
  iconContainerAddress: {
    backgroundColor: '#FF9800',
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
  },
  copyText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#6B7280',
  },
  additionalInfoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  hoursContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  hoursDay: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  hoursTime: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default ContactUs;

