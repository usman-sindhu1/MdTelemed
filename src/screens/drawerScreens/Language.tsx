import React, { useState } from 'react';
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

type LanguageNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'Language'
>;

interface LanguageOption {
  id: string;
  name: string;
  code: string;
}

const Language: React.FC = () => {
  const navigation = useNavigation<LanguageNavigationProp>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('1');

  const languages: LanguageOption[] = [
    {
      id: '1',
      name: 'English',
      code: 'en',
    },
    {
      id: '2',
      name: 'Arabic',
      code: 'ar',
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

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
    // TODO: Implement language change logic
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
            <Text style={styles.heading}>Language</Text>
            <Text style={styles.description}>
              Select your preferred language for the application.
            </Text>
          </View>

          {/* Language Options */}
          <View style={styles.optionsContainer}>
            {languages.map((language) => {
              const isSelected = selectedLanguage === language.id;
              return (
                <TouchableOpacity
                  key={language.id}
                  style={[
                    styles.languageCard,
                    isSelected && styles.languageCardSelected,
                  ]}
                  onPress={() => handleLanguageSelect(language.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.languageName,
                      isSelected && styles.languageNameSelected,
                    ]}
                  >
                    {language.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmarkContainer}>
                      <View style={styles.checkmark} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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
    marginBottom: 32,
    gap: 12,
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
  optionsContainer: {
    gap: 12,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  languageCardSelected: {
    backgroundColor: '#F0E8FB',
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  languageName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  languageNameSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});

export default Language;

