import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';
import Button from '../../components/Button';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';
import Icons from '../../assets/svg';

type ServicesNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'Services'
>;

interface ServiceData {
  id: string;
  name: string;
  key: string;
  doctorCount?: string;
  Icon: React.ComponentType<any>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_PADDING = 15;
const GRID_GAP = 12;
const CARD_SIZE = (SCREEN_WIDTH - CONTENT_PADDING * 2 - GRID_GAP * 2) / 3;

const Services: React.FC = () => {
  const navigation = useNavigation<ServicesNavigationProp>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubservice, setSelectedSubservice] = useState<string | null>(null);

  const services: ServiceData[] = [
    {
      id: '1',
      name: 'Allergies',
      key: 'allergies',
      doctorCount: '23 Doctors',
      Icon: Icons.AllergyIcon,
    },
    {
      id: '2',
      name: 'Dentistry',
      key: 'dentistry',
      doctorCount: '23 Doctors',
      Icon: Icons.DentistryIcon,
    },
    {
      id: '3',
      name: 'Dermatology',
      key: 'dermatology',
      doctorCount: '23 Doctors',
      Icon: Icons.DermatologyIcon,
    },
    {
      id: '4',
      name: 'Endocrinology',
      key: 'endocrinology',
      doctorCount: '23 Doctors',
      Icon: Icons.EndocrinologyIcon,
    },
    {
      id: '5',
      name: 'Gastroenterology',
      key: 'gastroenterology',
      doctorCount: '23 Doctors',
      Icon: Icons.GastroenterologyIcon,
    },
    {
      id: '6',
      name: 'Immunology',
      key: 'immunology',
      doctorCount: '23 Doctors',
      Icon: Icons.ImmunologyIcon,
    },
    {
      id: '7',
      name: 'Nephrology',
      key: 'nephrology',
      doctorCount: '23 Doctors',
      Icon: Icons.NephrologyIcon,
    },
    {
      id: '8',
      name: 'Hematology',
      key: 'hematology',
      doctorCount: '23 Doctors',
      Icon: Icons.HematologyIcon,
    },
    {
      id: '9',
      name: 'Neurology',
      key: 'neurology',
      doctorCount: '23 Doctors',
      Icon: Icons.NeurologyServiceIcon,
    },
  ];

  const subserviceMap: Record<string, string[]> = {
    allergies: ['Skin allergy', 'Seasonal allergy', 'Food allergy'],
    dentistry: ['Tooth pain', 'Cleaning', 'Root canal'],
    dermatology: ['Acne care', 'Rash treatment', 'Hair loss'],
    endocrinology: ['Diabetes care', 'Thyroid check', 'Hormone balance'],
    gastroenterology: ['Acid reflux', 'Stomach pain', 'Digestive health'],
    immunology: ['Autoimmune check', 'Immune profile', 'Allergy immunity'],
    nephrology: ['Kidney care', 'Urine report review', 'BP related kidney check'],
    hematology: ['Anemia care', 'Blood disorder review', 'CBC follow-up'],
    neurology: ['Headache consult', 'Migraine care', 'Nerve pain review'],
  };

  const selectedCategory = useMemo(
    () => services.find((item) => item.id === selectedCategoryId) ?? null,
    [selectedCategoryId, services],
  );

  const subservices = selectedCategory ? subserviceMap[selectedCategory.key] ?? [] : [];

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCardPress = (service: ServiceData) => {
    setSelectedCategoryId(service.id);
    setSelectedSubservice(null);
  };

  const handleContinue = () => {
    if (!selectedCategory || !selectedSubservice) {
      return;
    }
    navigation.navigate('BookApptSelectDoctor');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <SimpleBackHeader
          title="Categories"
          onBackPress={handleBackPress}
          backgroundColor="#ECF2FD"
          compact
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Categories</Text>
            <Text style={styles.description}>
              Select from all available healthcare categories.
            </Text>
          </View>

          <View style={styles.gridContainer}>
            {services.map((service) => {
              const isSelected = selectedCategoryId === service.id;
              return (
              <TouchableOpacity
                key={service.id}
                style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                onPress={() => handleCardPress(service)}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrap}>
                  <service.Icon width={26} height={26} />
                </View>
                <Text style={styles.serviceName} numberOfLines={2}>
                  {service.name}
                </Text>
              </TouchableOpacity>
            );
            })}
          </View>

          {selectedCategory ? (
            <View style={styles.subserviceSection}>
              <Text style={styles.subserviceHeading}>Select Subservice</Text>
              <View style={styles.subserviceWrap}>
                {subservices.map((sub) => {
                  const isSubSelected = selectedSubservice === sub;
                  return (
                    <TouchableOpacity
                      key={sub}
                      style={[styles.subserviceChip, isSubSelected && styles.subserviceChipSelected]}
                      onPress={() => setSelectedSubservice(sub)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[styles.subserviceText, isSubSelected && styles.subserviceTextSelected]}
                      >
                        {sub}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Button
                title="Continue to Appointment"
                onPress={handleContinue}
                style={selectedSubservice ? styles.continueBtn : styles.continueBtnDisabled}
              />
            </View>
          ) : null}
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
    backgroundColor: Colors.background,
    zIndex: 10,
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
    marginBottom: 24,
    gap: 8,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -GRID_GAP / 2,
  },
  categoryCard: {
    width: CARD_SIZE,
    marginHorizontal: GRID_GAP / 2,
    marginBottom: GRID_GAP,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    minHeight: 116,
  },
  categoryCardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: '#ECF2FD',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ECF2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 17,
    textAlign: 'center',
  },
  subserviceSection: {
    marginTop: 10,
    paddingBottom: 20,
  },
  subserviceHeading: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  subserviceWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  subserviceChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  subserviceChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#ECF2FD',
  },
  subserviceText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  subserviceTextSelected: {
    color: Colors.primary,
  },
  doctorCount: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 4,
  },
  continueBtn: {
    marginTop: 6,
    backgroundColor: Colors.primary,
  },
  continueBtnDisabled: {
    marginTop: 6,
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
});

export default Services;

