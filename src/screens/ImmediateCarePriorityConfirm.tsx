import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

const CONTENT_PADDING = 16;
const PROGRESS_PERCENT = 100;

const ImmediateCarePriorityConfirm: React.FC = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    // Always step back to the auto-assign screen in the Immediate Care flow
    (navigation as any).navigate('ImmediateCareAutoAssign');
  };

  const handleJoinNow = () => {
    (navigation as any).navigate('MainTabs', {
      screen: 'Calendar',
      params: {
        screen: 'JoinSession',
        params: { source: 'immediateCare' },
      },
    });
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
                <Text style={styles.timeText}>Session ready</Text>
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
        <View style={styles.successCard}>
          <View style={styles.successIconWrap}>
            <Icons.VerifyBoldIcon width={30} height={30} />
          </View>
          <Text style={styles.successTitle}>Priority Booking Confirmed</Text>
          <Text style={styles.successSubtitle}>
            Your urgent consultation is confirmed. You have been moved to priority queue.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Session Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Doctor:</Text>
            <Text style={styles.value}>Dr. Jordan Paul</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mode:</Text>
            <Text style={styles.value}>Online quick consultation</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ETA:</Text>
            <Text style={styles.value}>within 5 minutes</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Priority:</Text>
            <Text style={styles.valuePrimary}>High</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button variant="primary" title="Join Session Now" onPress={handleJoinNow} style={styles.continueButton} />
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
  successCard: {
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  successIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  successTitle: { fontFamily: Fonts.raleway, fontSize: 18, fontWeight: '700', color: '#166534', marginBottom: 6 },
  successSubtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: '#166534',
    textAlign: 'center',
    lineHeight: 19,
  },
  summaryCard: { borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 14, marginBottom: 18 },
  summaryTitle: { fontFamily: Fonts.raleway, fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  row: { flexDirection: 'row', marginBottom: 8 },
  label: { fontFamily: Fonts.openSans, fontSize: 14, fontWeight: '400', color: '#64748B', width: 74 },
  value: { fontFamily: Fonts.raleway, fontSize: 14, fontWeight: '600', color: '#1F2937', flex: 1 },
  valuePrimary: { fontFamily: Fonts.raleway, fontSize: 14, fontWeight: '700', color: Colors.primary, flex: 1 },
  actionButtons: { marginTop: 4 },
  continueButton: { marginBottom: 12, backgroundColor: Colors.primary },
  cancelButton: { width: '100%', height: 52, backgroundColor: '#EEEEEE', borderWidth: 0 },
  cancelButtonText: { color: '#1F2937' },
});

export default ImmediateCarePriorityConfirm;
