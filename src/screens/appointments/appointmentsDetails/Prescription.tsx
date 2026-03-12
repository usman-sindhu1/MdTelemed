import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import Conversation from './Conversation';

type PrescriptionSubTabType = 'Prescription' | 'Conversations' | 'Notes';

const Prescription: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<PrescriptionSubTabType>('Prescription');

  const subTabs: PrescriptionSubTabType[] = ['Prescription', 'Conversations', 'Notes'];

  const prescriptionData = {
    id: '5646543',
    date: 'Jan 12, 2025',
    title: 'Prescription Title Here',
    doctorName: 'Cody Fisher',
    service: 'Skin Care',
    appointmentFor: 'My Self',
    medPrescribed: '2',
  };

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'Prescription':
        return (
          <View style={styles.prescriptionCard}>
            <View style={styles.cardHeader}>
              <View style={styles.idLabel}>
                <Text style={styles.idText}>ID: {prescriptionData.id}</Text>
              </View>
              <Text style={styles.dateText}>{prescriptionData.date}</Text>
            </View>

            <View style={styles.prescriptionSection}>
              <Text style={styles.sectionLabel}>Prescription title:</Text>
              <Text style={styles.prescriptionTitle}>{prescriptionData.title}</Text>
            </View>

            <View style={styles.doctorSection}>
              <Text style={styles.sectionLabel}>Doctor name</Text>
              <View style={styles.doctorInfo}>
                <View style={styles.outerBorderContainer}>
                  <View style={styles.borderContainer}>
                    <View style={styles.imageContainer}>
                      <View style={styles.placeholderImage} />
                    </View>
                  </View>
                </View>
                <Text style={styles.doctorName}>{prescriptionData.doctorName}</Text>
              </View>
            </View>

            <View style={styles.detailsSection}>
              <Text style={styles.detailText}>Service: {prescriptionData.service}</Text>
              <Text style={styles.detailText}>Appointment for: {prescriptionData.appointmentFor}</Text>
              <Text style={styles.detailText}>Med. Prescribed: {prescriptionData.medPrescribed}</Text>
            </View>
          </View>
        );
      case 'Conversations':
        return <Conversation />;
      case 'Notes':
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Notes content</Text>
          </View>
        );
      default:
        return null;
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
  prescriptionCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idLabel: {
    backgroundColor: '#A473E5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  idText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  prescriptionSection: {
    gap: 8,
  },
  sectionLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  prescriptionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  doctorSection: {
    gap: 8,
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    padding: 12,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  outerBorderContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  borderContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: Colors.backgroundLight,
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 22,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
    flex: 1,
  },
  detailsSection: {
    gap: 8,
  },
  detailText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
  },
  placeholderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textLight,
  },
});

export default Prescription;

