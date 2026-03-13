import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_PADDING = 16;

const PROGRESS_PERCENT = 28;

const DOCTORS = [
  {
    id: '1',
    name: 'DR. Jordan Paul',
    qualification: 'MD, DNB (Neuro)',
    rating: 4.7,
    bookings: 103,
    nextAvailable: 'In 10 Minutes',
  },
  {
    id: '2',
    name: 'DR. Jordan Paul',
    qualification: 'MD, DNB (Neuro)',
    rating: 4.7,
    bookings: 103,
    nextAvailable: 'In 10 Minutes',
  },
];

const PHARMACIES = [
  {
    id: 'abc',
    label: 'My Pharmacy',
    name: 'ABC Pharmacy',
    address: '43rd Street, Auckland, NZ',
    isMyPharmacy: true,
  },
  {
    id: 'ruth',
    label: 'Nearest Available',
    name: 'Ruth Pharmacy',
    address: '23rd Street, Auckland, NZ',
    isMyPharmacy: false,
  },
];

const BookApptSelectDoctor: React.FC = () => {
  const navigation = useNavigation();
  const [apptType, setApptType] = useState<'immediate' | 'later'>('immediate');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);
  const buttonAnim = useRef(new Animated.Value(0)).current;

  const bothSelected = Boolean(selectedDoctorId && selectedPharmacyId);

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: bothSelected ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [bothSelected, buttonAnim]);

  const handleBackPress = () => {
    (navigation as any).navigate('BookAppt');
  };

  const handleContinue = () => {
    (navigation as any).navigate('BookApptSelectTimeslot');
  };

  const handleCancelProcess = () => {
    (navigation as any).navigate('BookAppt');
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
                {[0, 1, 2, 3, 4].map((i) => (
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
        {/* Select doctor */}
        <Text style={styles.sectionTitle}>Select doctor</Text>
        <Text style={styles.sectionDescription}>
          Lorem ipsum dolor sit amet consectetur adipiscin elit Ut et massa mi.
        </Text>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, apptType === 'immediate' && styles.tabSelected]}
            onPress={() => setApptType('immediate')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, apptType === 'immediate' && styles.tabTextSelected]}>
              Immediate Appt.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, apptType === 'later' && styles.tabSelected]}
            onPress={() => setApptType('later')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, apptType === 'later' && styles.tabTextSelected]}>
              Setup for Later
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search doctor */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your doctor"
            placeholderTextColor="#9CA3AF"
            value={doctorSearch}
            onChangeText={setDoctorSearch}
          />
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Icons.PageInfoIcon width={22} height={22} />
          </TouchableOpacity>
        </View>

        {/* Doctor cards */}
        {DOCTORS.map((doc) => {
          const isSelected = selectedDoctorId === doc.id;
          return (
            <TouchableOpacity
              key={doc.id}
              style={[styles.doctorCard, isSelected && styles.doctorCardSelected]}
              onPress={() => setSelectedDoctorId(doc.id)}
              activeOpacity={0.8}
            >
              <View style={styles.doctorIconWrap}>
                <Icons.Doctor1Icon width={48} height={48} />
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doc.name}</Text>
                <Text style={styles.doctorQualification}>{doc.qualification}</Text>
                <View style={styles.ratingRow}>
                  <Icons.StarFill1Icon width={14} height={14} />
                  <Text style={styles.ratingValue}>{doc.rating}</Text>
                  <Text style={styles.ratingBookings}> {doc.bookings} bookings</Text>
                </View>
                <Text style={styles.nextAvailable}>Next Available: {doc.nextAvailable}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Select Pharmacy */}
        <Text style={styles.sectionTitle}>Select Pharmacy</Text>
        {PHARMACIES.map((ph) => {
          const isSelected = selectedPharmacyId === ph.id;
          const PlusIcon = isSelected ? Icons.BxPlusMedicalIcon : Icons.BxPlusMedical1Icon;
          const VerifyIcon = ph.isMyPharmacy ? Icons.VerifyBoldIcon : Icons.VerifyBoldGreyIcon;
          return (
            <TouchableOpacity
              key={ph.id}
              style={[styles.pharmacyCard, isSelected && styles.pharmacyCardSelected]}
              onPress={() => setSelectedPharmacyId(ph.id)}
              activeOpacity={0.8}
            >
              <View style={styles.pharmacyIconWrap}>
                <PlusIcon width={32} height={32} />
              </View>
              <View style={styles.pharmacyInfo}>
                <View style={styles.pharmacyLabelRow}>
                  <VerifyIcon width={10} height={10} />
                  <Text style={[styles.pharmacyLabel, !ph.isMyPharmacy && styles.pharmacyLabelGrey]}>
                    {ph.label}
                  </Text>
                </View>
                <Text style={styles.pharmacyName}>{ph.name}</Text>
                <Text style={styles.pharmacyAddress}>{ph.address}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Action buttons - show only when both doctor and pharmacy selected */}
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
          pointerEvents={bothSelected ? 'auto' : 'none'}
        >
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
        </Animated.View>
      </ScrollView>
    </View>
  );
};

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
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabSelected: {
    backgroundColor: Colors.primary || '#2563EB',
    borderColor: Colors.primary || '#2563EB',
  },
  tabText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  tabTextSelected: {
    color: '#FFFFFF',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.raleway,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 14,
  },
  filterButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  doctorCardSelected: {
    borderColor: Colors.primary || '#2563EB',
    borderWidth: 2,
    backgroundColor: '#ECF2FD',
  },
  doctorIconWrap: {
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  doctorQualification: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingValue: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '500',
    color: '#F57C00',
    marginLeft: 6,
  },
  ratingBookings: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  nextAvailable: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '500',
    color: '#757575',
  },
  pharmacyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  pharmacyCardSelected: {
    borderColor: Colors.primary || '#2563EB',
    borderWidth: 2,
    backgroundColor: '#ECF2FD',
  },
  pharmacyIconWrap: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pharmacyLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary || '#2563EB',
    marginLeft: 6,
  },
  pharmacyLabelGrey: {
    color: '#757575',
  },
  pharmacyName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  pharmacyAddress: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
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

export default BookApptSelectDoctor;
