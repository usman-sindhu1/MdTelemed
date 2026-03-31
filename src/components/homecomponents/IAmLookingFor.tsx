import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

export const HOME_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'allergies', label: 'Allergies' },
  { id: 'dermatology', label: 'Dermatology' },
  { id: 'neurology', label: 'Neurology' },
  { id: 'gastroenterology', label: 'Gastroenterology' },
];

interface IAmLookingForProps {
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;
  onSeeAllPress?: () => void;
}

const IAmLookingFor: React.FC<IAmLookingForProps> = ({
  selectedCategoryId,
  onCategoryChange,
  onSeeAllPress,
}) => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onSeeAllPress}>
          <Text style={styles.viewAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {HOME_CATEGORIES.map((item) => {
          const isSelected = selectedCategoryId === item.id;
          return (
          <TouchableOpacity
            key={item.id}
            style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
            onPress={() => onCategoryChange(item.id)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 38 / 2,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  scrollView: {
    marginHorizontal: -15,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingRight: 16,
  },
  categoryChip: {
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryLabelSelected: {
    color: '#FFFFFF',
  },
});

export default IAmLookingFor;
