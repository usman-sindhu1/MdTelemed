import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icons from '../../assets/svg';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

const LOOKING_FOR_ITEMS = [
  { id: '1', label: 'Get Your Medication', Icon: Icons.MedicineBottleIcon },
  { id: '2', label: 'Get Medical Certificate', Icon: Icons.CertificateSolidIcon },
  { id: '3', label: 'Book a Service', Icon: Icons.BxTestTubeIcon },
  { id: '4', label: 'Test Results', Icon: Icons.ClipboardListSolidIcon },
];

const IAmLookingFor: React.FC = () => {
  const handleViewAll = () => {
    // Navigate or expand - add as needed
  };

  const handleCardPress = (id: string) => {
    console.log('Looking for card pressed:', id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>I am Looking for</Text>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {LOOKING_FOR_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleCardPress(item.id)}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrap}>
              <item.Icon width={28} height={28} />
            </View>
            <Text style={styles.cardLabel} numberOfLines={2}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary || '#1F2937',
  },
  viewAllText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary || '#2563EB',
  },
  scrollView: {
    marginHorizontal: -15,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingRight: 27,
  },
  card: {
    width: 110,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECF2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '600',
    color: '#757575',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default IAmLookingFor;
