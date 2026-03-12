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
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import BackHeader from '../../components/common/BackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';

type ProfileSettingsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'ProfileSettings'
>;

const ProfileSettings: React.FC = () => {
  const navigation = useNavigation<ProfileSettingsNavigationProp>();

  const profileData = {
    name: 'Guy Hawkins',
    sinceDate: 'January 17, 2025',
    email: 'guyhawkins56@gmail.com',
    contactNo: '+1 (234) 567-8900',
    address: '4517 Washington Ave. Ma...',
    dateOfBirth: 'Sep 01, 2024',
    sex: 'Male',
  };

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleEditPress = () => {
    console.log('Edit pressed');
  };

  const handleSharePress = () => {
    console.log('Share pressed');
  };

  const handleCopyPress = (text: string) => {
    console.log('Copy pressed:', text);
    // TODO: Implement copy to clipboard
  };

  const handleEditProfilePicture = () => {
    console.log('Edit profile picture pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <BackHeader
            onBackPress={handleBackPress}
            onVector2Press={handleEditPress}
            onVectorPngPress={handleSharePress}
            showVector2Icon={true}
            showVectorPngIcon={true}
          />

          {/* Title */}
          <Text style={styles.heading}>Profile Settings</Text>

          {/* Profile Picture Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.outerBorderContainer}>
                <View style={styles.borderContainer}>
                  <View style={styles.imageContainer}>
                    <View style={styles.placeholderImage} />
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={handleEditProfilePicture}
                activeOpacity={0.7}
              >
                {/* Camera Icon */}
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <Rect x="2" y="5" width="12" height="8" rx="1" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                  <Circle cx="8" cy="9" r="2" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                  <Circle cx="11" cy="6" r="0.75" fill="#FFFFFF" />
                  <Path d="M5 5V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V5" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                </Svg>
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{profileData.name}</Text>
            <Text style={styles.sinceDate}>Since: {profileData.sinceDate}</Text>
          </View>

          {/* Information Fields */}
          <View style={styles.fieldsContainer}>
            {/* Email */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Email:</Text>
                <Text style={styles.fieldValue}>{profileData.email}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEditPress()}
                activeOpacity={0.7}
              >
                {/* Pencil/Edit Icon */}
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <Path d="M14.1667 2.5C14.4408 2.22589 14.7899 2.08333 15.2083 2.08333C15.6268 2.08333 15.9759 2.22589 16.25 2.5C16.5241 2.77411 16.6667 3.12319 16.6667 3.54167C16.6667 3.96014 16.5241 4.30922 16.25 4.58333L15.4167 5.41667L12.9167 2.91667L13.75 2.08333C14.0241 1.80922 14.3732 1.66667 14.7917 1.66667C15.2101 1.66667 15.5592 1.80922 15.8333 2.08333L14.1667 2.5Z" stroke={Colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <Path d="M11.25 5.41667L14.5833 8.75L6.25 17.0833H2.91667V13.75L11.25 5.41667Z" stroke={Colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Contact no */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Contact no:</Text>
                <Text style={styles.fieldValue}>{profileData.contactNo}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEditPress()}
                activeOpacity={0.7}
              >
                {/* Pencil/Edit Icon */}
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <Path d="M14.1667 2.5C14.4408 2.22589 14.7899 2.08333 15.2083 2.08333C15.6268 2.08333 15.9759 2.22589 16.25 2.5C16.5241 2.77411 16.6667 3.12319 16.6667 3.54167C16.6667 3.96014 16.5241 4.30922 16.25 4.58333L15.4167 5.41667L12.9167 2.91667L13.75 2.08333C14.0241 1.80922 14.3732 1.66667 14.7917 1.66667C15.2101 1.66667 15.5592 1.80922 15.8333 2.08333L14.1667 2.5Z" stroke={Colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <Path d="M11.25 5.41667L14.5833 8.75L6.25 17.0833H2.91667V13.75L11.25 5.41667Z" stroke={Colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Address */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Address:</Text>
                <Text style={styles.fieldValue}>{profileData.address}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEditPress()}
                activeOpacity={0.7}
              >
                {/* Pencil/Edit Icon */}
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <Path d="M14.1667 2.5C14.4408 2.22589 14.7899 2.08333 15.2083 2.08333C15.6268 2.08333 15.9759 2.22589 16.25 2.5C16.5241 2.77411 16.6667 3.12319 16.6667 3.54167C16.6667 3.96014 16.5241 4.30922 16.25 4.58333L15.4167 5.41667L12.9167 2.91667L13.75 2.08333C14.0241 1.80922 14.3732 1.66667 14.7917 1.66667C15.2101 1.66667 15.5592 1.80922 15.8333 2.08333L14.1667 2.5Z" stroke={Colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <Path d="M11.25 5.41667L14.5833 8.75L6.25 17.0833H2.91667V13.75L11.25 5.41667Z" stroke={Colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Date of birth */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Date of birth:</Text>
                <Text style={styles.fieldValue}>{profileData.dateOfBirth}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEditPress()}
                activeOpacity={0.7}
              >
                {/* Pencil/Edit Icon */}
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <Path d="M14.1667 2.5C14.4408 2.22589 14.7899 2.08333 15.2083 2.08333C15.6268 2.08333 15.9759 2.22589 16.25 2.5C16.5241 2.77411 16.6667 3.12319 16.6667 3.54167C16.6667 3.96014 16.5241 4.30922 16.25 4.58333L15.4167 5.41667L12.9167 2.91667L13.75 2.08333C14.0241 1.80922 14.3732 1.66667 14.7917 1.66667C15.2101 1.66667 15.5592 1.80922 15.8333 2.08333L14.1667 2.5Z" stroke={Colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <Path d="M11.25 5.41667L14.5833 8.75L6.25 17.0833H2.91667V13.75L11.25 5.41667Z" stroke={Colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Sex */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Sex:</Text>
                <Text style={styles.fieldValue}>{profileData.sex}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEditPress()}
                activeOpacity={0.7}
              >
                {/* Pencil/Edit Icon */}
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <Path d="M14.1667 2.5C14.4408 2.22589 14.7899 2.08333 15.2083 2.08333C15.6268 2.08333 15.9759 2.22589 16.25 2.5C16.5241 2.77411 16.6667 3.12319 16.6667 3.54167C16.6667 3.96014 16.5241 4.30922 16.25 4.58333L15.4167 5.41667L12.9167 2.91667L13.75 2.08333C14.0241 1.80922 14.3732 1.66667 14.7917 1.66667C15.2101 1.66667 15.5592 1.80922 15.8333 2.08333L14.1667 2.5Z" stroke={Colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <Path d="M11.25 5.41667L14.5833 8.75L6.25 17.0833H2.91667V13.75L11.25 5.41667Z" stroke={Colors.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </Svg>
              </TouchableOpacity>
            </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 15,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  outerBorderContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 57,
    backgroundColor: Colors.backgroundLight,
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 57,
  },
  editImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#A473E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sinceDate: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  fieldsContainer: {
    gap: 16,
  },
  fieldContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldContent: {
    flex: 1,
    gap: 4,
  },
  fieldLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  fieldValue: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
});

export default ProfileSettings;

