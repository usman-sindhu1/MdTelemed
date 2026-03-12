import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../components/common/BackHeader';
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

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleCopyPress = (text: string) => {
    console.log('Copy pressed:', text);
    // TODO: Implement copy to clipboard
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <BackHeader
          onBackPress={handleBackPress}
          onSearchPress={handleSearchPress}
          onSearchChange={handleSearchChange}
          showSearchIcon={true}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Contact Us</Text>
            <Text style={styles.description}>
              Get in touch with us. We're here to help you with any questions or concerns.
            </Text>
          </View>

          {/* Contact Information Cards */}
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
                  <Icons.Vector5Icon width={20} height={20} fill={Colors.textLight} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Information */}
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

          {/* Support Message */}
          <View style={styles.supportSection}>
            <Text style={styles.supportTitle}>Need Immediate Assistance?</Text>
            <Text style={styles.supportText}>
              Our support team is available 24/7 for urgent matters. Please call our emergency line or send us an email.
            </Text>
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
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
    zIndex: 10,
    paddingBottom: 8,
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
    alignItems: 'center',
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  contactCardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 16,
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
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: Fonts.raleway,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  copyButton: {
    padding: 8,
  },
  additionalInfoSection: {
    marginBottom: 32,
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
    padding: 20,
    gap: 16,
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
    paddingVertical: 8,
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
  supportSection: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    gap: 12,
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  supportTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  supportText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 22,
    opacity: 0.95,
  },
});

export default ContactUs;

