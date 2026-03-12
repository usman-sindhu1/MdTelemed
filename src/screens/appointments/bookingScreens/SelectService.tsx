import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../../components/common/BackHeader';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';

type SelectServiceNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'SelectService'
>;

interface ServiceData {
  id: string;
  name: string;
  doctorCount: string;
}

const SelectService: React.FC = () => {
  const navigation = useNavigation<SelectServiceNavigationProp>();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    navigation.goBack();
  };

  const handleCardPress = (service: ServiceData) => {
    setSelectedServiceId(service.id === selectedServiceId ? null : service.id);
  };

  const handleContinue = () => {
    if (selectedServiceId) {
      navigation.navigate('SelectDoctor');
    }
  };

  const isContinueDisabled = !selectedServiceId;

  const handleCancel = () => {
    navigation.goBack();
  };

  const buttonContainerHeight = 140; // Approximate height of button container

  useEffect(() => {
    if (isScrolling || isAtBottom || selectedServiceId) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isScrolling, isAtBottom, selectedServiceId]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <BackHeader onBackPress={handleBackPress} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: buttonContainerHeight + (Platform.OS === 'ios' ? insets.bottom : 0) }
        ]}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollBegin={() => setIsScrolling(true)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const scrollY = contentOffset.y;
          const contentHeight = contentSize.height;
          const scrollViewHeight = layoutMeasurement.height;
          const isNearBottom = scrollY + scrollViewHeight >= contentHeight - 50; // 50px threshold
          
          if (isNearBottom) {
            setIsAtBottom(true);
          } else if (scrollY < 100) {
            // Near top
            setIsAtBottom(false);
          }
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Book Your Appointment</Text>
            <Text style={styles.subtitle}>
              Complete the following steps to schedule appointment.
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <Icons.Search width={20} height={20} fill={Colors.textPlaceholder} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search here..."
              placeholderTextColor={Colors.textPlaceholder}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Select Service Section */}
          <View style={styles.serviceSection}>
            <Text style={styles.sectionTitle}>Select Your Required Service</Text>
            <View style={styles.gridContainer}>
              {services.map((service, index) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.serviceCard,
                      isSelected && styles.serviceCardSelected
                    ]}
                    onPress={() => handleCardPress(service)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.doctorCount}>{service.doctorCount}</Text>
                    <Text style={styles.serviceName}>{service.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 20,
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
            pointerEvents: (isScrolling || isAtBottom || selectedServiceId) ? 'auto' : 'none',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            isContinueDisabled && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          activeOpacity={0.7}
          disabled={isContinueDisabled}
        >
          <Text style={[
            styles.continueButtonText,
            isContinueDisabled && styles.continueButtonTextDisabled
          ]}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 150,
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
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackgroundDefault,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.inputText,
    padding: 0,
  },
  serviceSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceCardSelected: {
    backgroundColor: '#F0E8FB',
    borderColor: Colors.primary,
  },
  doctorCount: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
    marginBottom: 4,
  },
  serviceName: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: 'transparent',
    gap: 12,
  },
  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#CBCACE',
  },
  continueButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#9E9E9E',
  },
  cancelButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default SelectService;

