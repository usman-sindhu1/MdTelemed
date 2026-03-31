import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

const CONTENT_PADDING = 16;
const PROGRESS_PERCENT = 52;

const ImmediateCareAutoAssign: React.FC = () => {
  const navigation = useNavigation();
  const cardPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cardPulse, { toValue: 1.02, duration: 700, useNativeDriver: true }),
        Animated.timing(cardPulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [cardPulse]);

  const handleBackPress = () => {
    // Always go back one logical step in Immediate Care flow
    (navigation as any).navigate('ImmediateCareUrgentBooking');
  };

  const handleContinue = () => {
    (navigation as any).navigate('ImmediateCarePriorityConfirm');
  };

  return (
    <View style={styles.container}>
      <SimpleBackHeader
        title="Immediate Care"
        onBackPress={handleBackPress}
        backgroundColor="#ECF2FD"
        bottomRadius={24}
      />

      <View style={styles.progressCardWrap}>
        <View style={styles.progressCardShadowWrap}>
          <View style={[styles.card, styles.progressCard]}>
            <Text style={styles.cardSubtitle}>Urgent Booking Progress</Text>
            <View style={styles.cardRow}>
              <Text style={styles.percentText}>{PROGRESS_PERCENT}% completed</Text>
              <View style={styles.timeRow}>
                <Icons.NestClockFarsightAnalogIcon width={14} height={14} />
                <Text style={styles.timeText}>~1 min</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${PROGRESS_PERCENT}%` }]} />
              <View style={styles.progressDots}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View key={i} style={styles.dot} />
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Auto-assign available doctor</Text>
        <Text style={styles.sectionDescription}>
          We found the next available doctor based on your urgent request and priority queue.
        </Text>

        <Animated.View style={[styles.assignedCard, { transform: [{ scale: cardPulse }] }]}>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Doctor ready now</Text>
          </View>
          <View style={styles.docRow}>
            <View style={styles.docAvatarWrap}>
              <Icons.Doctor1Icon width={46} height={46} />
            </View>
            <View style={styles.docInfo}>
              <Text style={styles.docName}>Dr. Jordan Paul</Text>
              <Text style={styles.docSpec}>MD, DNB (Neuro)</Text>
              <Text style={styles.docMeta}>ETA: within 5 minutes</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Priority booking system</Text>
          <Text style={styles.noteText}>
            Your request is marked urgent and moved ahead in queue for faster consultation.
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <Button variant="primary" title="Continue to Confirmation" onPress={handleContinue} style={styles.continueButton} />
          <Button
            variant="half-outlined"
            title="Back"
            onPress={handleBackPress}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  progressCardWrap: { marginTop: -40, paddingHorizontal: CONTENT_PADDING, marginBottom: 16, alignItems: 'center' },
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14 },
  cardSubtitle: { fontFamily: Fonts.raleway, fontSize: 12, fontWeight: '400', color: '#757575', marginBottom: 4 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  percentText: { fontFamily: Fonts.raleway, fontSize: 18, fontWeight: '700', color: Colors.primary },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontFamily: Fonts.raleway, fontSize: 12, fontWeight: '500', color: '#757575', marginLeft: 4 },
  progressBar: { height: 5, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'visible' },
  progressFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: Colors.primary, borderRadius: 3 },
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
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.primary },
  scroll: { flex: 1 },
  scrollContent: { padding: CONTENT_PADDING, paddingBottom: 120 },
  sectionTitle: { fontFamily: Fonts.raleway, fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  sectionDescription: { fontFamily: Fonts.raleway, fontSize: 14, fontWeight: '400', color: '#757575', lineHeight: 20, marginBottom: 16 },
  assignedCard: {
    borderRadius: 16,
    backgroundColor: '#ECF2FD',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 14,
    marginBottom: 14,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 8 },
  statusText: { fontFamily: Fonts.raleway, fontSize: 13, fontWeight: '700', color: '#166534' },
  docRow: { flexDirection: 'row', alignItems: 'center' },
  docAvatarWrap: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  docInfo: { flex: 1 },
  docName: { fontFamily: Fonts.raleway, fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  docSpec: { fontFamily: Fonts.openSans, fontSize: 13, fontWeight: '400', color: '#64748B', marginBottom: 2 },
  docMeta: { fontFamily: Fonts.openSans, fontSize: 12, fontWeight: '600', color: Colors.primary },
  noteCard: { borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 14, marginBottom: 18 },
  noteTitle: { fontFamily: Fonts.raleway, fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  noteText: { fontFamily: Fonts.openSans, fontSize: 13, fontWeight: '400', color: '#64748B', lineHeight: 18 },
  actionButtons: { marginTop: 4 },
  continueButton: { marginBottom: 12, backgroundColor: Colors.primary },
  cancelButton: { width: '100%', height: 52, backgroundColor: '#EEEEEE', borderWidth: 0 },
  cancelButtonText: { color: '#1F2937' },
});

export default ImmediateCareAutoAssign;
