import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Input from '../components/Input';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

const CONTENT_PADDING = 16;
const PROGRESS_PERCENT = 88;
const LABEL_COLOR = '#424242';

const PAYMENT_TYPES = [
  { id: 'onetime', label: 'One Time Pay', Icon: Icons.LocalAtmIcon },
  { id: 'subscription', label: 'Get Subscription', Icon: Icons.CardMembershipIcon },
] as const;

const BookApptPaymentInfo: React.FC = () => {
  const navigation = useNavigation();
  const [paymentType, setPaymentType] = useState<'onetime' | 'subscription'>('onetime');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');

  const handleBackPress = () => {
    (navigation as any).navigate('BookApptPatientSummary');
  };

  const handleContinue = () => {
    // Next step or submit can be added later
  };

  const handleCancelProcess = () => {
    (navigation as any).navigate('BookApptPatientSummary');
  };

  return (
    <View style={styles.container}>
      <SimpleBackHeader
        title="Book Appt."
        onBackPress={handleBackPress}
        backgroundColor="#ECF2FD"
        bottomRadius={24}
      />

      <View style={styles.progressCardWrap}>
        <View style={styles.progressCardShadowWrap}>
          <View style={[styles.card, styles.progressCard]}>
            <Text style={styles.cardSubtitle}>Appointment Booking progress</Text>
            <View style={styles.cardRow}>
              <Text style={styles.percentText}>{PROGRESS_PERCENT}% completed</Text>
              <View style={styles.timeRow}>
                <Icons.NestClockFarsightAnalogIcon width={14} height={14} />
                <Text style={styles.timeText}>10min</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${PROGRESS_PERCENT}%` }]} />
              <View style={styles.progressDots}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <View key={i} style={styles.dot} />
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Select Payment Type</Text>
        <Text style={styles.sectionDescription}>
          Lorem ipsum dolor sit amet consectetur adipiscin elit Ut et massa mi.
        </Text>

        <View style={styles.paymentTypeRow}>
          {PAYMENT_TYPES.map((item) => {
            const isSelected = paymentType === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.paymentTypeCard, isSelected && styles.paymentTypeCardSelected]}
                onPress={() => setPaymentType(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.paymentTypeIconWrap}>
                  <item.Icon width={32} height={32} />
                </View>
                <Text style={[styles.paymentTypeLabel, isSelected && styles.paymentTypeLabelSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Payment information</Text>
        <Text style={styles.sectionDescription}>
          Lorem ipsum dolor sit amet consectetur adipiscin elit Ut et massa mi.
        </Text>

        <Input
          label="Name on Card"
          placeholder="Enter name on card"
          value={nameOnCard}
          onChangeText={setNameOnCard}
          labelStyle={styles.inputLabel}
        />
        <View style={styles.inputSpacer} />
        <Input
          label="Card Number"
          placeholder="Enter card number"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
          labelStyle={styles.inputLabel}
        />
        <View style={styles.inputSpacer} />
        <Input
          label="Expiry Date"
          placeholder="MM/YY"
          value={expiryDate}
          onChangeText={setExpiryDate}
          labelStyle={styles.inputLabel}
        />
        <View style={styles.inputSpacer} />
        <Input
          label="Security Code"
          placeholder="CVV"
          value={securityCode}
          onChangeText={setSecurityCode}
          keyboardType="numeric"
          labelStyle={styles.inputLabel}
        />

        <View style={styles.actionButtons}>
          <Button
            variant="primary"
            title="Continue to Process"
            onPress={handleContinue}
            style={styles.continueButtonPrimary}
          />
          <Button
            variant="half-outlined"
            title="Cancel Process"
            onPress={handleCancelProcess}
            style={styles.cancelButtonPrimary}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const CARD_GAP = 12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressCardWrap: {
    marginTop: -40,
    paddingHorizontal: CONTENT_PADDING,
    marginBottom: 16,
    alignItems: 'center',
  },
  progressCardShadowWrap: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  progressCard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
  },
  cardSubtitle: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '400',
    color: '#757575',
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentText: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary || '#2563EB',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '500',
    color: '#757575',
    marginLeft: 4,
  },
  progressBar: {
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'visible',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary || '#2563EB',
    borderRadius: 3,
  },
  progressDots: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.primary || '#2563EB',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: CONTENT_PADDING,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
    lineHeight: 20,
    marginBottom: 16,
  },
  paymentTypeRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: CARD_GAP,
  },
  paymentTypeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
  },
  paymentTypeCardSelected: {
    borderColor: Colors.primary || '#2563EB',
    borderWidth: 2,
    backgroundColor: '#ECF2FD',
  },
  paymentTypeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentTypeLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    textAlign: 'center',
  },
  paymentTypeLabelSelected: {
    color: Colors.primary || '#2563EB',
  },
  inputLabel: {
    color: LABEL_COLOR,
  },
  inputSpacer: {
    height: 16,
  },
  actionButtons: {
    marginTop: 24,
  },
  continueButtonPrimary: {
    marginBottom: 12,
    backgroundColor: Colors.primary || '#2563EB',
  },
  cancelButtonPrimary: {
    width: '100%',
    height: 52,
    backgroundColor: '#EEEEEE',
    borderWidth: 0,
  },
  cancelButtonText: {
    color: '#1F2937',
  },
});

export default BookApptPaymentInfo;
