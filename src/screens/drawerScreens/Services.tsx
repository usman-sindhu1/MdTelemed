import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../components/common/BackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type ServicesNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'Services'
>;

interface ServiceData {
  id: string;
  name: string;
  doctorCount: string;
}

const Services: React.FC = () => {
  const navigation = useNavigation<ServicesNavigationProp>();

  const services: ServiceData[] = [
    {
      id: '1',
      name: 'Life Coaching Therapy Services',
      doctorCount: '23 Doctors',
    },
    {
      id: '2',
      name: 'Mental Health Therapy',
      doctorCount: '23 Doctors',
    },
    {
      id: '3',
      name: 'Support Group Therapy',
      doctorCount: '23 Doctors',
    },
    {
      id: '4',
      name: 'Mindfulness & Stress Reduction',
      doctorCount: '23 Doctors',
    },
    {
      id: '5',
      name: 'Life Coaching Therapy Services',
      doctorCount: '23 Doctors',
    },
    {
      id: '6',
      name: 'Support Group Therapy',
      doctorCount: '23 Doctors',
    },
  ];

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleCardPress = (service: ServiceData) => {
    console.log('Service pressed:', service);
    // TODO: Navigate to service details if needed
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
            <Text style={styles.heading}>Services</Text>
            <Text style={styles.description}>
              All of the prescriptions received by the doctors from the start you've registered till date.
            </Text>
          </View>

          {/* Services Grid */}
          <View style={styles.gridContainer}>
            {services.map((service, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceCard}
                onPress={() => handleCardPress(service)}
                activeOpacity={0.7}
              >
                <Text style={styles.doctorCount}>{service.doctorCount}</Text>
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
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
    gap: 16,
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '47%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  doctorCount: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: '#9E9E9E',
  },
  serviceName: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});

export default Services;

