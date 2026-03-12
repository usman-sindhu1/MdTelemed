import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PatientInfoTab from './PatientInfo';
import MedicalInfo from './MedicalInfo';
import Reports from './Reports';
import Prescription from './Prescription';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';

type PatientSubTabType = 'Patient Info' | 'Medical Info' | 'Reports' | 'Prescription';

const PatientInfoWrapper: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<PatientSubTabType>('Patient Info');

  const subTabs: PatientSubTabType[] = ['Patient Info', 'Medical Info', 'Reports', 'Prescription'];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'Patient Info':
        return <PatientInfoTab />;
      case 'Medical Info':
        return <MedicalInfo />;
      case 'Reports':
        return <Reports />;
      case 'Prescription':
        return <Prescription />;
      default:
        return <PatientInfoTab />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Sub Tabs */}
      <View style={styles.subTabsContainer}>
        {subTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.subTab,
              activeSubTab === tab && styles.subTabActive,
            ]}
            onPress={() => setActiveSubTab(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.subTabText,
                activeSubTab === tab && styles.subTabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sub Tab Content */}
      <View style={styles.subTabContent}>
        {renderSubTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  subTabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  subTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
  },
  subTabActive: {
    backgroundColor: '#A473E5',
  },
  subTabText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  subTabTextActive: {
    color: '#FFFFFF',
  },
  subTabContent: {
    flex: 1,
  },
});

export default PatientInfoWrapper;

