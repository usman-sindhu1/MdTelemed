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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type HelpAndFaqsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'HelpAndFaqs'
>;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const HelpAndFaqs: React.FC = () => {
  const navigation = useNavigation<HelpAndFaqsNavigationProp>();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I book an appointment?',
      answer: 'To book an appointment, go to the Home screen and tap on "Book Appointment" or navigate to the Appointments tab. Select a service, choose a doctor, pick a date and time, and confirm your booking.',
    },
    {
      id: '2',
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule your appointment. Go to the Appointments screen, select your appointment, and choose the option to cancel or reschedule. Please note that cancellation policies may apply.',
    },
    {
      id: '3',
      question: 'How do I view my prescriptions?',
      answer: 'You can view your prescriptions by navigating to the Prescription tab in the bottom navigation bar. All your prescriptions will be listed there, and you can tap on any prescription to view detailed information.',
    },
    {
      id: '4',
      question: 'How do I join a video consultation?',
      answer: 'When it\'s time for your appointment, go to the Appointments screen, find your appointment, and tap "Join Session". Make sure you have a stable internet connection and allow camera and microphone permissions when prompted.',
    },
    {
      id: '5',
      question: 'How do I access my medical reports?',
      answer: 'Your medical reports can be accessed through the Medical Info section in the drawer menu. You can also find reports in the Reports tab within the Appointment Details screen.',
    },
    {
      id: '6',
      question: 'How do I update my profile information?',
      answer: 'To update your profile, open the drawer menu and select "Profile Settings". From there, you can edit your personal information, contact details, and profile picture.',
    },
    {
      id: '7',
      question: 'How do I change my password?',
      answer: 'To change your password, go to the drawer menu, select "Change Password", enter your old password, and then set your new password. Make sure to confirm your new password.',
    },
    {
      id: '8',
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit cards, debit cards, and digital wallets. Payment can be made through the Invoices section in the drawer menu.',
    },
    {
      id: '9',
      question: 'How do I contact support?',
      answer: 'You can contact our support team through the "Contact Us" section in the drawer menu. There you will find our phone number, email address, and business hours.',
    },
    {
      id: '10',
      question: 'How do I manage my notifications?',
      answer: 'You can manage your notification preferences by going to the drawer menu and selecting "Notification Settings". From there, you can toggle different types of notifications on or off.',
    },
  ];

  const handleBackPress = () => {
    navigation.navigate('ProfileSettings');
  };

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SimpleBackHeader title="Help & Support" onBackPress={handleBackPress} compact />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Help & Support</Text>
            <Text style={styles.description}>
              Find answers to commonly asked questions. Tap on any question to view the answer.
            </Text>
          </View>

          {/* FAQ Items */}
          <View style={styles.faqContainer}>
            {faqItems.map((item) => {
              const isExpanded = expandedItems.has(item.id);
              return (
                <View key={item.id} style={styles.faqCard}>
                  <TouchableOpacity
                    style={styles.faqQuestionContainer}
                    onPress={() => toggleItem(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <View style={styles.iconContainer}>
                      <View
                        style={[
                          styles.chevron,
                          isExpanded && styles.chevronUp,
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={styles.faqAnswer}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
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
    color: Colors.primary,
  },
  description: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  faqContainer: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    overflow: 'hidden',
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    width: 12,
    height: 12,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.primary,
    transform: [{ rotate: '45deg' }],
  },
  chevronUp: {
    transform: [{ rotate: '-135deg' }],
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    marginTop: 8,
  },
  faqAnswer: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 22,
    marginTop: 8,
  },
});

export default HelpAndFaqs;

