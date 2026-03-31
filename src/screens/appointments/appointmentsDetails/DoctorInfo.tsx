import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';

type SubTabType = 'Other Details' | 'Available Hours' | 'Reviews';

const DoctorInfo: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('Other Details');

  const subTabs: SubTabType[] = ['Other Details', 'Available Hours', 'Reviews'];

  const doctorData = {
    name: 'Dr. Ayesha Noor',
    specialty: 'Allergist',
    about: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna.',
    profession: 'Allergist Specialist',
    ageGroup: '8-16 years',
    language: 'English, Spanish',
    fundingOptions: 'Cash & Card',
    serviceDelivery: 'Immidiate',
  };

  const availableHours = [
    { day: 'Monday', hours: '9:00 AM - 5:00 PM', status: 'Available' },
    { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', status: 'Available' },
    { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', status: 'Available' },
    { day: 'Thursday', hours: '9:00 AM - 5:00 PM', status: 'Available' },
    { day: 'Friday', hours: '9:00 AM - 2:00 PM', status: 'Available' },
    { day: 'Saturday', hours: '10:00 AM - 1:00 PM', status: 'Available' },
    { day: 'Sunday', hours: 'Closed', status: 'Unavailable' },
  ];

  const reviews = [
    {
      id: '1',
      patientName: 'John Doe',
      rating: 5,
      date: 'Jan 15, 2025',
      comment: 'Excellent doctor! Very professional and caring. Highly recommended.',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      rating: 4,
      date: 'Jan 10, 2025',
      comment: 'Great experience. The doctor was very thorough and explained everything clearly.',
    },
    {
      id: '3',
      patientName: 'Mike Johnson',
      rating: 5,
      date: 'Jan 5, 2025',
      comment: 'Best allergist I have ever visited. Very knowledgeable and patient.',
    },
  ];

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderSubTabContent = () => {
    if (activeSubTab === 'Other Details') {
      return (
        <View style={styles.subTabContent}>
          <InfoRow label="Profession:" value={doctorData.profession} />
          <InfoRow label="Age group:" value={doctorData.ageGroup} />
          <InfoRow label="Language:" value={doctorData.language} />
          <InfoRow label="Funding options:" value={doctorData.fundingOptions} />
          <InfoRow label="Service delivery:" value={doctorData.serviceDelivery} />
        </View>
      );
    }

    if (activeSubTab === 'Available Hours') {
      return (
        <View style={styles.subTabContent}>
          {availableHours.map((schedule, index) => (
            <View key={index} style={styles.hoursRow}>
              <View style={styles.hoursLeft}>
                <Text style={styles.dayText}>{schedule.day}</Text>
                <Text style={styles.hoursText}>{schedule.hours}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                schedule.status === 'Available' ? styles.statusAvailable : styles.statusUnavailable
              ]}>
                <Text style={[
                  styles.statusText,
                  schedule.status === 'Available' ? styles.statusTextAvailable : styles.statusTextUnavailable
                ]}>
                  {schedule.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (activeSubTab === 'Reviews') {
      return (
        <View style={styles.subTabContent}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewHeaderLeft}>
                  <Text style={styles.reviewPatientName}>{review.patientName}</Text>
                  <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} style={styles.star}>
                        {i < review.rating ? '★' : '☆'}
                      </Text>
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Doctor Header */}
      <View style={styles.doctorHeader}>
        <View style={styles.outerBorderContainer}>
          <View style={styles.borderContainer}>
            <View style={styles.imageContainer}>
              <View style={styles.placeholderImage} />
            </View>
          </View>
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.specialty}>{doctorData.specialty}</Text>
          <Text style={styles.doctorName}>{doctorData.name}</Text>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>{doctorData.about}</Text>
      </View>

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
      {renderSubTabContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  outerBorderContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
    backgroundColor: Colors.backgroundLight,
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 37,
  },
  doctorInfo: {
    flex: 1,
  },
  specialty: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
    marginBottom: 4,
  },
  doctorName: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  aboutSection: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  aboutText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
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
    backgroundColor: Colors.primary,
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
    marginTop: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  infoLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
  },
  infoValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginLeft: 4,
  },
  placeholderText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    paddingVertical: 40,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    marginBottom: 8,
  },
  hoursLeft: {
    flex: 1,
  },
  dayText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  hoursText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: '#E8F5E9',
  },
  statusUnavailable: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextAvailable: {
    color: '#4CAF50',
  },
  statusTextUnavailable: {
    color: '#F44336',
  },
  reviewCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewHeaderLeft: {
    flex: 1,
  },
  reviewPatientName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 16,
    color: '#FFD700',
  },
  reviewDate: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  reviewComment: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default DoctorInfo;

