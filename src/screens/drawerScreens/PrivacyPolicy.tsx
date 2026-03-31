import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type PrivacyPolicyNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'PrivacyPolicy'
>;

const PrivacyPolicy: React.FC = () => {
  const navigation = useNavigation<PrivacyPolicyNavigationProp>();

  const handleBackPress = () => {
    navigation.navigate('ProfileSettings');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SimpleBackHeader title="Privacy & Security" onBackPress={handleBackPress} compact />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Privacy & Security</Text>
            <Text style={styles.lastUpdated}>Last updated: January 17, 2025</Text>
          </View>

          {/* Content Sections */}
          <View style={styles.sectionsContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
              <Text style={styles.sectionText}>
                We collect information that you provide directly to us, including when you create an account, make an appointment, use our services, or contact us for support. This may include:
              </Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• Personal information (name, email, phone number)</Text>
                <Text style={styles.listItem}>• Medical information (appointments, prescriptions, reports)</Text>
                <Text style={styles.listItem}>• Payment information (processed securely through third-party providers)</Text>
                <Text style={styles.listItem}>• Device information and usage data</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
              <Text style={styles.sectionText}>
                We use the information we collect to:
              </Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• Provide, maintain, and improve our services</Text>
                <Text style={styles.listItem}>• Process your appointments and medical requests</Text>
                <Text style={styles.listItem}>• Send you notifications and updates</Text>
                <Text style={styles.listItem}>• Respond to your inquiries and provide customer support</Text>
                <Text style={styles.listItem}>• Detect, prevent, and address technical issues</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Information Sharing</Text>
              <Text style={styles.sectionText}>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• With healthcare providers for appointment and treatment purposes</Text>
                <Text style={styles.listItem}>• With service providers who assist us in operating our application</Text>
                <Text style={styles.listItem}>• When required by law or to protect our rights</Text>
                <Text style={styles.listItem}>• With your explicit consent</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Data Security</Text>
              <Text style={styles.sectionText}>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Your Rights</Text>
              <Text style={styles.sectionText}>
                You have the right to:
              </Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• Access and receive a copy of your personal data</Text>
                <Text style={styles.listItem}>• Request correction of inaccurate information</Text>
                <Text style={styles.listItem}>• Request deletion of your personal data</Text>
                <Text style={styles.listItem}>• Object to processing of your personal data</Text>
                <Text style={styles.listItem}>• Request restriction of processing</Text>
                <Text style={styles.listItem}>• Data portability</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Cookies and Tracking</Text>
              <Text style={styles.sectionText}>
                We use cookies and similar tracking technologies to track activity on our application and hold certain information. You can instruct your device to refuse all cookies or to indicate when a cookie is being sent.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
              <Text style={styles.sectionText}>
                Our services are not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
              <Text style={styles.sectionText}>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Contact Us</Text>
              <Text style={styles.sectionText}>
                If you have any questions about this Privacy Policy, please contact us through the Contact Us section in the application.
              </Text>
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
    gap: 8,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  lastUpdated: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  sectionsContainer: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  sectionText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  listContainer: {
    marginTop: 8,
    gap: 8,
    paddingLeft: 8,
  },
  listItem: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});

export default PrivacyPolicy;

