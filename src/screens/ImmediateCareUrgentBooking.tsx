import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

const CONTENT_PADDING = 16;
const PROGRESS_PERCENT = 16;

const URGENT_REASONS = [
  { id: '1', label: 'Fever and infection' },
  { id: '2', label: 'Skin rash/allergy' },
  { id: '3', label: 'Severe headache' },
  { id: '4', label: 'General urgent consult' },
];

const ImmediateCareUrgentBooking: React.FC = () => {
  const navigation = useNavigation();
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
  const [priorityEnabled, setPriorityEnabled] = useState(true);
  const buttonAnim = useRef(new Animated.Value(0)).current;

  // Reset screen state each time this route is focused
  useFocusEffect(
    useCallback(() => {
      setSelectedReasonId(null);
      setPriorityEnabled(true);
      return () => {};
    }, []),
  );

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: selectedReasonId ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [selectedReasonId, buttonAnim]);

  const handleBackPress = () => {
    (navigation as any).navigate('MainTabs', { screen: 'Home' });
  };

  const handleContinue = () => {
    (navigation as any).navigate('ImmediateCareAutoAssign');
  };

  const handleCancelProcess = () => {
    (navigation as any).navigate('MainTabs', { screen: 'Home' });
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
                <Text style={styles.timeText}>~2 min</Text>
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
        <Text style={styles.sectionTitle}>Quick consultation for urgent cases</Text>
        <Text style={styles.sectionDescription}>
          Tell us what you need help with. We will prioritize your request and assign the next available doctor.
        </Text>

        <Text style={styles.subTitle}>Select urgent reason</Text>
        <View style={styles.reasonWrap}>
          {URGENT_REASONS.map((reason) => {
            const isSelected = selectedReasonId === reason.id;
            return (
              <TouchableOpacity
                key={reason.id}
                style={[styles.reasonChip, isSelected && styles.reasonChipSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedReasonId(reason.id)}
              >
                <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                  {reason.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.priorityCard}>
          <View style={styles.priorityTop}>
            <Text style={styles.priorityTitle}>Priority booking system</Text>
            <TouchableOpacity
              style={[styles.togglePill, priorityEnabled && styles.togglePillEnabled]}
              onPress={() => setPriorityEnabled((prev) => !prev)}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleDot, priorityEnabled && styles.toggleDotEnabled]} />
            </TouchableOpacity>
          </View>
          <Text style={styles.priorityText}>
            Priority mode places your request higher in queue and connects you to an available doctor faster.
          </Text>
        </View>

        <Animated.View
          style={[
            styles.actionButtons,
            {
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents={selectedReasonId ? 'auto' : 'none'}
        >
          <Button variant="primary" title="Find Available Doctor" onPress={handleContinue} style={styles.continueButton} />
          <Button
            variant="half-outlined"
            title="Cancel Process"
            onPress={handleCancelProcess}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </Animated.View>
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
  subTitle: { fontFamily: Fonts.raleway, fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  reasonWrap: { marginBottom: 20 },
  reasonChip: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  reasonChipSelected: { borderColor: Colors.primary, borderWidth: 2, backgroundColor: '#ECF2FD' },
  reasonText: { fontFamily: Fonts.raleway, fontSize: 14, fontWeight: '600', color: '#6B7280' },
  reasonTextSelected: { color: '#1F2937' },
  priorityCard: {
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 20,
  },
  priorityTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  priorityTitle: { fontFamily: Fonts.raleway, fontSize: 14, fontWeight: '700', color: '#1F2937' },
  priorityText: { fontFamily: Fonts.openSans, fontSize: 13, fontWeight: '400', color: '#64748B', lineHeight: 18 },
  togglePill: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CBD5E1',
    paddingHorizontal: 3,
    justifyContent: 'center',
  },
  togglePillEnabled: { backgroundColor: Colors.primary },
  toggleDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF' },
  toggleDotEnabled: { alignSelf: 'flex-end' },
  actionButtons: { marginTop: 8 },
  continueButton: { marginBottom: 12, backgroundColor: Colors.primary },
  cancelButton: { width: '100%', height: 52, backgroundColor: '#EEEEEE', borderWidth: 0 },
  cancelButtonText: { color: '#1F2937' },
});

export default ImmediateCareUrgentBooking;
