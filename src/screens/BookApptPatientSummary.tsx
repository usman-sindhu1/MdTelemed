import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Input from '../components/Input';
import PhoneInput from '../components/PhoneInput';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

const CONTENT_PADDING = 16;
const PROGRESS_PERCENT = 72;
const LABEL_COLOR = '#424242';
const PLACEHOLDER_COLOR = '#BDBDBD';

const RELATION_OPTIONS = ['Self', 'Spouse', 'Child', 'Parent', 'Sibling', 'Other'];
const FIRST_VISIT_OPTIONS = ['Yes', 'No'];
const TAKING_MEDICINE_OPTIONS = ['Yes', 'No'];

function getLastVisitDateOptions(): { label: string; value: string }[] {
  const options: { label: string; value: string }[] = [];
  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const value = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    options.push({ label, value });
  }
  return options;
}

type OpenDropdown = 'relation' | 'firstVisit' | 'takingMedicine' | 'lastVisit' | null;

const BookApptPatientSummary: React.FC = () => {
  const navigation = useNavigation();
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [relation, setRelation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstVisit, setFirstVisit] = useState('');
  const [takingMedicine, setTakingMedicine] = useState('');
  const [lastVisitDate, setLastVisitDate] = useState('');
  const [preCondition, setPreCondition] = useState('');
  const [currentCondition, setCurrentCondition] = useState('');
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [uploadedImage, setUploadedImage] = useState<{ uri: string; name: string } | null>(null);

  const lastVisitDateOptions = useMemo(() => getLastVisitDateOptions(), []);

  const handleBackPress = () => {
    (navigation as any).navigate('BookApptSelectTimeslot');
  };

  const handleContinue = () => {
    (navigation as any).navigate('BookApptPaymentInfo');
  };

  const handleCancelProcess = () => {
    (navigation as any).navigate('BookApptSelectTimeslot');
  };

  const handleUploadPress = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });
      if (result && result.length > 0) {
        const file = result[0];
        setUploadedImage({ uri: file.uri, name: file.name ?? 'Image' });
      }
    } catch (err: unknown) {
      if (DocumentPicker.isCancel(err)) {
        return;
      }
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('RNDocumentPicker') || message.includes('could not be found')) {
        Alert.alert(
          'Error',
          'Image picker is not available. Please rebuild the app.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to pick image. Please try again.', [{ text: 'OK' }]);
      }
    }
  };

  const toggleDropdown = (key: OpenDropdown) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const selectRelation = (value: string) => {
    setRelation(value);
    setOpenDropdown(null);
  };

  const selectFirstVisit = (value: string) => {
    setFirstVisit(value);
    if (value === 'Yes') setLastVisitDate('');
    setOpenDropdown(null);
  };

  const selectTakingMedicine = (value: string) => {
    setTakingMedicine(value);
    setOpenDropdown(null);
  };

  const selectLastVisitDate = (label: string) => {
    setLastVisitDate(label);
    setOpenDropdown(null);
  };

  const showLastVisitField = firstVisit === 'No';

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
        {/* Patient summary */}
        <Text style={styles.sectionTitle}>Patient summary</Text>
        <Text style={styles.sectionDescription}>
          Lorem ipsum dolor sit amet consectetur adipiscin elit Ut et massa mi.
        </Text>

        <Input
          label="Patient Name"
          placeholder="Enter your first name"
          value={patientName}
          onChangeText={setPatientName}
          labelStyle={styles.inputLabel}
        />
        <View style={styles.inputSpacer} />
        <Input
          label="Patient Age"
          placeholder="Enter your age"
          value={patientAge}
          onChangeText={setPatientAge}
          keyboardType="numeric"
          labelStyle={styles.inputLabel}
        />
        <View style={styles.inputSpacer} />

        <Text style={styles.fieldLabel}>Relation with Patient</Text>
        <TouchableOpacity
          style={[styles.selectRow, openDropdown === 'relation' && styles.selectRowOpen]}
          onPress={() => toggleDropdown('relation')}
          activeOpacity={0.7}
        >
          <Text style={[styles.selectPlaceholder, relation && styles.selectValue]}>
            {relation || 'Select relation'}
          </Text>
          <Icons.ChevronDownIcon width={20} height={20} />
        </TouchableOpacity>
        {openDropdown === 'relation' && (
          <View style={[styles.dropdownList, styles.dropdownListShort]}>
            {RELATION_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownItem}
                onPress={() => selectRelation(opt)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownItemText, relation === opt && styles.dropdownItemTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.inputSpacer} />

        <Text style={styles.fieldLabel}>Phone Number</Text>
        <View style={styles.phoneWrapper}>
          <PhoneInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="(000) 000-0000"
            separateInputs
          />
        </View>

        {/* Medical summary */}
        <Text style={styles.sectionTitle}>Medical summary</Text>
        <Text style={styles.sectionDescription}>
          Lorem ipsum dolor sit amet consectetur adipiscin elit Ut et massa mi.
        </Text>

        <Text style={styles.fieldLabel}>Medical Report (optional)</Text>
        <TouchableOpacity style={styles.uploadCard} onPress={handleUploadPress} activeOpacity={0.8}>
          {uploadedImage ? (
            <>
              <Image source={{ uri: uploadedImage.uri }} style={styles.uploadedImage} resizeMode="cover" />
              <Text style={styles.uploadText} numberOfLines={1}>{uploadedImage.name}</Text>
            </>
          ) : (
            <>
              <Icons.IconUpload24px width={40} height={40} />
              <Text style={styles.uploadText}>Upload file</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Medical History */}
        <Text style={styles.sectionTitle}>Medical History</Text>
        <Text style={styles.sectionDescription}>
          Lorem ipsum dolor sit amet consectetur adipiscin elit Ut et massa mi.
        </Text>

        <Text style={styles.fieldLabel}>Is This Your First Visit</Text>
        <TouchableOpacity
          style={[styles.selectRow, openDropdown === 'firstVisit' && styles.selectRowOpen]}
          onPress={() => toggleDropdown('firstVisit')}
          activeOpacity={0.7}
        >
          <Text style={[styles.selectPlaceholder, firstVisit && styles.selectValue]}>
            {firstVisit || 'Select option'}
          </Text>
          <Icons.ChevronDownIcon width={20} height={20} />
        </TouchableOpacity>
        {openDropdown === 'firstVisit' && (
          <View style={[styles.dropdownList, styles.dropdownListShort]}>
            {FIRST_VISIT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownItem}
                onPress={() => selectFirstVisit(opt)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownItemText, firstVisit === opt && styles.dropdownItemTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.inputSpacer} />

        <Text style={styles.fieldLabel}>Are You Taking Any Medicine</Text>
        <TouchableOpacity
          style={[styles.selectRow, openDropdown === 'takingMedicine' && styles.selectRowOpen]}
          onPress={() => toggleDropdown('takingMedicine')}
          activeOpacity={0.7}
        >
          <Text style={[styles.selectPlaceholder, takingMedicine && styles.selectValue]}>
            {takingMedicine || 'Select option'}
          </Text>
          <Icons.ChevronDownIcon width={20} height={20} />
        </TouchableOpacity>
        {openDropdown === 'takingMedicine' && (
          <View style={[styles.dropdownList, styles.dropdownListShort]}>
            {TAKING_MEDICINE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownItem}
                onPress={() => selectTakingMedicine(opt)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownItemText, takingMedicine === opt && styles.dropdownItemTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.inputSpacer} />

        {showLastVisitField && (
          <>
            <Text style={styles.fieldLabel}>Your Last Visit Date</Text>
            <TouchableOpacity
              style={[styles.selectRow, openDropdown === 'lastVisit' && styles.selectRowOpen]}
              onPress={() => toggleDropdown('lastVisit')}
              activeOpacity={0.7}
            >
              <Text style={[styles.selectPlaceholder, lastVisitDate && styles.selectValue]}>
                {lastVisitDate || 'Select date'}
              </Text>
              <Icons.CalendarTodayIcon width={20} height={20} />
            </TouchableOpacity>
            {openDropdown === 'lastVisit' && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {lastVisitDateOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={styles.dropdownItem}
                      onPress={() => selectLastVisitDate(opt.label)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.dropdownItemText}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            <View style={styles.inputSpacer} />
          </>
        )}

        <Input
          label="Pre Condition"
          placeholder="Enter condition"
          value={preCondition}
          onChangeText={setPreCondition}
          labelStyle={styles.inputLabel}
        />
        <View style={styles.inputSpacer} />
        <Input
          label="Current Condition"
          placeholder="Enter condition"
          value={currentCondition}
          onChangeText={setCurrentCondition}
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
    marginTop: 10,
  },
  sectionDescription: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
    lineHeight: 20,
    marginBottom: 16,
  },
  inputLabel: {
    color: LABEL_COLOR,
  },
  inputSpacer: {
    height: 16,
  },
  fieldLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '400',
    color: LABEL_COLOR,
    marginBottom: 8,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  selectRowOpen: {
    borderColor: Colors.primary || '#2563EB',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E5E7EB',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  dropdownListShort: {
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    color: '#1F2937',
  },
  dropdownItemTextSelected: {
    color: Colors.primary || '#2563EB',
    fontWeight: '600',
  },
  selectPlaceholder: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    color: PLACEHOLDER_COLOR,
  },
  selectValue: {
    color: '#1F2937',
  },
  phoneWrapper: {
    marginBottom: 4,
  },
  uploadCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  uploadText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
    marginTop: 12,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
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

export default BookApptPatientSummary;
