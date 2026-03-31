import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import type { DrawerParamList } from '../navigation/HomeStackRoot';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_PADDING = 16;
const GRID_GAP = 12;
const CARD_SIZE = (SCREEN_WIDTH - CONTENT_PADDING * 2 - GRID_GAP * 2) / 3;

const SERVICE_CATEGORIES = [
  { id: '1', name: 'Allergies', Icon: Icons.AllergyIcon },
  { id: '2', name: 'Dentistry', Icon: Icons.DentistryIcon },
  { id: '3', name: 'Dermatology', Icon: Icons.DermatologyIcon },
  { id: '4', name: 'Endocrinology', Icon: Icons.EndocrinologyIcon },
  { id: '5', name: 'Gastroenterology', Icon: Icons.GastroenterologyIcon },
  { id: '6', name: 'Immunology', Icon: Icons.ImmunologyIcon },
  { id: '7', name: 'Nephrology', Icon: Icons.NephrologyIcon },
  { id: '8', name: 'Hematology', Icon: Icons.HematologyIcon },
  { id: '9', name: 'Neurology', Icon: Icons.NeurologyServiceIcon },
];

const CONSULTATION_DURATIONS = [
  { id: 'standard', label: 'Standard Consultation (15 Minutes)' },
  { id: 'extended', label: 'Extended Consultation (30 Minutes)' },
  { id: 'quick', label: 'Quick Script Repeat' },
];

type BookApptRouteProp = RouteProp<DrawerParamList, 'BookAppt'>;

const BookAppt: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<BookApptRouteProp>();
  const [searchText, setSearchText] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDurationId, setSelectedDurationId] = useState<string | null>(null);
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const preselectedCategoryId = route.params?.preselectedCategoryId;
  const selectedDoctor = route.params?.selectedDoctor;

  const progressPercent = selectedServiceId ? 16 : 0;

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: selectedDurationId ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedDurationId, buttonAnim]);

  // Reset selection each time screen gains focus
  useFocusEffect(
    useCallback(() => {
      setSelectedServiceId(null);
      setSelectedDurationId(null);

      if (preselectedCategoryId) {
        const matchedService = SERVICE_CATEGORIES.find(
          (service) => service.name.toLowerCase() === preselectedCategoryId.toLowerCase(),
        );
        if (matchedService) {
          setSelectedServiceId(matchedService.id);
        }
      }
    }, [preselectedCategoryId]),
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleServicePress = (id: string) => {
    if (selectedServiceId === id) {
      setSelectedServiceId(null);
      setSelectedDurationId(null);
    } else {
      setSelectedServiceId(id);
    }
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleContinue = () => {
    (navigation as any).navigate('BookApptSelectDoctor', {
      selectedDoctor,
      preselectedCategoryId,
    });
  };

  const handleCancelProcess = () => {
    setSelectedServiceId(null);
    setSelectedDurationId(null);
  };

  const handleDurationPress = (id: string) => {
    setSelectedDurationId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <SimpleBackHeader
        title="Book Appt."
        onBackPress={handleBackPress}
        backgroundColor="#ECF2FD"
        bottomRadius={24}
      />

      {/* Progress card straddles header bottom: half up (header), half down (content) */}
      <View style={styles.progressCardWrap}>
        <View style={styles.progressCardShadowWrap}>
          <View style={[styles.card, styles.progressCard]}>
          <Text style={styles.cardSubtitle}>Appointment Booking progress</Text>
          <View style={styles.cardRow}>
            <Text style={styles.percentText}>{progressPercent}% completed</Text>
            <View style={styles.timeRow}>
              <Icons.NestClockFarsightAnalogIcon width={14} height={14} />
              <Text style={styles.timeText}>10min</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progressPercent, 100)}%` }]} />
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
        {/* What do you need help with? */}
        <Text style={styles.sectionTitle}>What do you need help with?</Text>
        <Text style={styles.sectionDescription}>
          Lorem ipsum dolor sit amet consectetur adipiscin elit Ut et massa mi.
        </Text>

        {/* Search bar */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your service"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <Icons.PageInfoIcon width={22} height={22} />
          </TouchableOpacity>
        </View>

        {/* Service grid */}
        <View style={styles.grid}>
          {SERVICE_CATEGORIES.map((item) => {
            const isSelected = selectedServiceId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                onPress={() => handleServicePress(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.serviceIconWrap}>
                  <item.Icon width={28} height={28} />
                </View>
                <Text style={styles.serviceName} numberOfLines={2}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Select Consultation Duration - shown when a service is selected */}
        {selectedServiceId ? (
          <>
            <Text style={styles.sectionTitle}>Select Consultation Duration</Text>
            <View style={styles.durationColumn}>
              {CONSULTATION_DURATIONS.map((opt) => {
                const isSelected = selectedDurationId === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.durationChip, isSelected && styles.durationChipSelected]}
                    onPress={() => handleDurationPress(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[styles.durationChipText, isSelected && styles.durationChipTextSelected]}
                      numberOfLines={2}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedServiceId ? (
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
                pointerEvents={selectedDurationId ? 'auto' : 'none'}
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
            ) : null}
          </>
        ) : null}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: CONTENT_PADDING,
    paddingBottom: 120,
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
    width: '0%',
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
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionDescription: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
    lineHeight: 20,
    marginBottom: 16,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -GRID_GAP / 2,
  },
  serviceCard: {
    width: CARD_SIZE,
    marginHorizontal: GRID_GAP / 2,
    marginBottom: GRID_GAP,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  serviceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECF2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 16,
  },
  serviceCardSelected: {
    borderColor: Colors.primary || '#2563EB',
    borderWidth: 2,
    backgroundColor: '#ECF2FD',
  },
  durationColumn: {
    marginTop: 8,
    marginBottom: 24,
  },
  durationChip: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  durationChipSelected: {
    borderColor: Colors.primary || '#2563EB',
    borderWidth: 2,
    backgroundColor: '#ECF2FD',
  },
  durationChipText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    textAlign: 'left',
  },
  durationChipTextSelected: {
    color: '#1F2937',
  },
  actionButtons: {
    marginTop: 8,
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

export default BookAppt;
