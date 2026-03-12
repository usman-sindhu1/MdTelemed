import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../components/common/BackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type TermsAndConditionsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'TermsAndConditions'
>;

const TermsAndConditions: React.FC = () => {
  const navigation = useNavigation<TermsAndConditionsNavigationProp>();

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
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
            <Text style={styles.heading}>Terms & Conditions</Text>
            <Text style={styles.lastUpdated}>Last updated: January 17, 2025</Text>
          </View>

          {/* Content Sections */}
          <View style={styles.sectionsContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.sectionText}>
                By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Use License</Text>
              <Text style={styles.sectionText}>
                Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• Modify or copy the materials</Text>
                <Text style={styles.listItem}>• Use the materials for any commercial purpose</Text>
                <Text style={styles.listItem}>• Attempt to decompile or reverse engineer any software</Text>
                <Text style={styles.listItem}>• Remove any copyright or other proprietary notations</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Medical Disclaimer</Text>
              <Text style={styles.sectionText}>
                The information provided through this application is for general informational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. User Account</Text>
              <Text style={styles.sectionText}>
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Privacy</Text>
              <Text style={styles.sectionText}>
                Your use of this application is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
              <Text style={styles.sectionText}>
                In no event shall the application or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the application.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Revisions</Text>
              <Text style={styles.sectionText}>
                The materials appearing on the application could include technical, typographical, or photographic errors. We may make changes to the materials contained on the application at any time without notice.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Contact Information</Text>
              <Text style={styles.sectionText}>
                If you have any questions about these Terms & Conditions, please contact us through the Contact Us section in the application.
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
    gap: 8,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
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

export default TermsAndConditions;

