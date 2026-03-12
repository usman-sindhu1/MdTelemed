import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';

interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

const OurServices: React.FC = () => {
  const navigation = useNavigation<any>();
  
  const services: Service[] = [
    {
      id: '1',
      name: 'Cardio',
      icon: Icons.CardiologyIcon,
    },
    {
      id: '2',
      name: 'Neuro',
      icon: Icons.NeurologyIcon,
    },
    {
      id: '3',
      name: 'Physical',
      icon: Icons.PhysicalTherapyIcon,
    },
    {
      id: '4',
      name: 'Ortho',
      icon: Icons.GynaecologyIcon,
    },
    {
      id: '5',
      name: 'Eyesight',
      icon: Icons.OphthalmologyIcon,
    },
    {
      id: '6',
      name: 'Psychiatry',
      icon: Icons.PsychiatryIcon,
    },
  ];

  const handleViewAll = () => {
    navigation.navigate('Calendar', { screen: 'SelectService' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Our Services</Text>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Services Grid */}
      <View style={styles.grid}>
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <View key={service.id} style={styles.card}>
              <View style={styles.iconContainer}>
                <IconComponent width={40} height={40} />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
    marginBottom: 12,
    minHeight: 120,
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});

export default OurServices;

