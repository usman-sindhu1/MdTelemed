import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import PhoneNumberInput from '@perttu/react-native-phone-number-input';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { useSelector } from 'react-redux';
import SimpleBackHeader from '../../components/common/SimpleBackHeader';
import Input from '../../components/Input';
import PhoneInput from '../../components/PhoneInput';
import Button from '../../components/Button';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { DrawerParamList } from '../../navigation/HomeStackRoot';
import { RootState } from '../../store';
import { setUser } from '../../store/slices/authSlice';
import { patientPaths } from '../../constants/patientPaths';
import useApi from '../../hooks/UseApi';
import {
  persistAuthUser,
  sanitizeUser,
} from '../../utils/authSession';
import { nationalDigitsFromStoredPhone } from '../../utils/phoneNationalDigits';
import { uploadLocalProfileImage } from '../../utils/profileImageUpload';
import { showErrorToast, showSuccessToast } from '../../utils/appToast';

type ProfileSettingsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'ProfileDetails'
>;

const GENDERS = ['Male', 'Female', 'Other'] as const;
type Gender = (typeof GENDERS)[number];

function formatDateLabel(d: Date) {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function formatMembershipSince(createdAt: unknown): string {
  if (createdAt == null) return '—';
  const d = new Date(createdAt as string | number);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function parseGenderFromUser(g: unknown): Gender {
  const s = String(g ?? '')
    .trim()
    .toLowerCase();
  if (s === 'female' || s === 'f') return 'Female';
  if (s === 'other' || s === 'o') return 'Other';
  return 'Male';
}

function parseDateOfBirth(u: Record<string, unknown>): Date {
  const raw = u.dateOfBirth ?? u.dob;
  if (typeof raw === 'string' || typeof raw === 'number') {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date(1990, 0, 1);
}

/** PK default calling code — matches SignUp `PhoneInput`. */
const DEFAULT_CC_DIGITS = '92';

type PatchPatientBody = {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  image?: string | null;
};

function imageNeedsUpload(uri: string | null): boolean {
  if (!uri) return false;
  return (
    uri.startsWith('file:') ||
    uri.startsWith('content:') ||
    uri.startsWith('ph://') ||
    uri.startsWith('assets-library:')
  );
}

function mapNetworkErrorMessage(raw?: string): string {
  if (!raw) {
    return 'Could not update profile. Check your connection and try again.';
  }
  const lower = raw.toLowerCase();
  if (
    raw === 'Network request failed' ||
    lower.includes('network request failed') ||
    lower.includes('network error') ||
    lower.includes('timeout') ||
    lower.includes('econnaborted')
  ) {
    return 'Connection failed. Check Wi‑Fi or mobile data, then try again.';
  }
  return raw;
}

const ProfileSettings: React.FC = () => {
  const navigation = useNavigation<ProfileSettingsNavigationProp>();
  const dispatch = useDispatch();
  const authUser = useSelector((s: RootState) => s.auth.user);

  const profileBootstrap = useMemo(() => {
    const u = (authUser ?? {}) as Record<string, unknown>;
    const full =
      typeof u.name === 'string' ? u.name.trim().split(/\s+/) : [];
    const first =
      typeof u.firstName === 'string'
        ? u.firstName
        : full[0] || '';
    const last =
      typeof u.lastName === 'string'
        ? u.lastName
        : full.slice(1).join(' ') || '';
    const avatar =
      typeof u.image === 'string'
        ? u.image
        : typeof u.avatar === 'string'
          ? u.avatar
          : typeof u.profilePhoto === 'string'
            ? u.profilePhoto
            : typeof u.photo === 'string'
              ? u.photo
              : null;
    const storedPhone = typeof u.phone === 'string' ? u.phone : '';
    const nationalPhone = nationalDigitsFromStoredPhone(
      storedPhone || undefined,
      DEFAULT_CC_DIGITS,
    );
    return {
      firstName: first,
      lastName: last,
      avatarUri: avatar,
      email: typeof u.email === 'string' ? u.email : '',
      phoneNational: nationalPhone,
      dateOfBirth: parseDateOfBirth(u),
      gender: parseGenderFromUser(u.gender),
    };
  }, [authUser]);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(profileBootstrap.firstName);
  const [lastName, setLastName] = useState(profileBootstrap.lastName);
  const [email, setEmail] = useState(profileBootstrap.email);
  const [phone, setPhone] = useState(profileBootstrap.phoneNational);
  const [dateOfBirth, setDateOfBirth] = useState(profileBootstrap.dateOfBirth);
  const [gender, setGender] = useState<Gender>(profileBootstrap.gender);
  const [avatarUri, setAvatarUri] = useState<string | null>(
    profileBootstrap.avatarUri,
  );
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const phoneInputRef = useRef<PhoneNumberInput>(null);
  const pendingImageMime = useRef<string | undefined>(undefined);

  const { onRequest: patchPatientProfile, isPending: savePending } =
    useApi<PatchPatientBody>({
      key: 'patient-me-patch',
      method: 'patch',
      isSuccessToast: false,
    });

  useEffect(() => {
    const b = profileBootstrap;
    setFirstName(b.firstName);
    setLastName(b.lastName);
    setEmail(b.email);
    setPhone(b.phoneNational);
    setDateOfBirth(b.dateOfBirth);
    setGender(b.gender);
    setAvatarUri(b.avatarUri);
  }, [profileBootstrap]);

  const displayName = `${firstName} ${lastName}`.trim();
  const membershipLabel = formatMembershipSince(
    (authUser as Record<string, unknown> | null)?.createdAt,
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const openDobPicker = useCallback(() => {
    if (!isEditing) return;
    setDobModalVisible(true);
  }, [isEditing]);

  const onIosDobChange = (_: unknown, selected?: Date) => {
    if (selected) setDateOfBirth(selected);
  };

  const onAndroidDobChange = (
    event: { type?: string },
    selected?: Date,
  ) => {
    if (event.type === 'dismissed') {
      setDobModalVisible(false);
      return;
    }
    if (selected) setDateOfBirth(selected);
    setDobModalVisible(false);
  };

  const handleSave = () => {
    const phoneFormatted =
      phoneInputRef.current
        ?.getNumberAfterPossiblyEliminatingZero()
        ?.formattedNumber?.trim() ?? '';

    if (!phoneFormatted.startsWith('+')) {
      showErrorToast(
        'Invalid phone number',
        'Enter your full number with country code.',
      );
      return;
    }

    void (async () => {
      let uploadedImageUrl: string | undefined;
      try {
        if (imageNeedsUpload(avatarUri)) {
          uploadedImageUrl = await uploadLocalProfileImage(
            avatarUri as string,
            pendingImageMime.current,
          );
        }
      } catch (e: unknown) {
        const msg =
          e instanceof Error
            ? mapNetworkErrorMessage(e.message)
            : 'Could not upload profile photo.';
        showErrorToast(msg);
        return;
      }

      const body: PatchPatientBody = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phoneFormatted,
      };
      if (uploadedImageUrl) {
        body.image = uploadedImageUrl;
      }

      patchPatientProfile({
        path: patientPaths.me,
        data: body,
        onSuccess: async (updatedFromApi: unknown) => {
          setIsEditing(false);
          setGenderDropdownOpen(false);
          if (uploadedImageUrl) {
            setAvatarUri(uploadedImageUrl);
          }
          pendingImageMime.current = undefined;

          const base = (authUser ?? {}) as Record<string, unknown>;
          const serverUser =
            updatedFromApi && typeof updatedFromApi === 'object'
              ? (updatedFromApi as Record<string, unknown>)
              : {};

          const merged = sanitizeUser({
            ...base,
            ...serverUser,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phoneFormatted,
            ...(uploadedImageUrl ? { image: uploadedImageUrl } : {}),
          });

          if (merged) {
            dispatch(setUser(merged));
            await persistAuthUser(merged as Record<string, unknown>);
          }

          showSuccessToast(
            'Profile updated',
            'Your changes have been saved.',
          );
        },
        onError: (err: { message?: string }) => {
          showErrorToast(mapNetworkErrorMessage(err?.message));
        },
      });
    })();
  };

  const toggleEditMode = useCallback(() => {
    setIsEditing((prev) => {
      const next = !prev;
      if (!next) {
        setGenderDropdownOpen(false);
        setDobModalVisible(false);
      }
      return next;
    });
  }, []);

  const handleEditProfilePicture = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.9,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode != null) {
          showErrorToast(
            response.errorMessage ?? 'Could not open your photo library.',
          );
          return;
        }
        const asset = response.assets?.[0];
        const uri = asset?.uri;
        pendingImageMime.current = asset?.type;
        if (uri) setAvatarUri(uri);
      },
    );
  };

  const inputReadonlyStyle = !isEditing ? styles.inputDisabled : undefined;

  const editIcon = (
    <TouchableOpacity
      onPress={toggleEditMode}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole="button"
      accessibilityLabel={isEditing ? 'Done editing' : 'Edit profile'}
    >
      {isEditing ? (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 6l12 12M18 6L6 18"
            stroke={Colors.primary}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </Svg>
      ) : (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
            stroke={Colors.primary}
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SimpleBackHeader
        title="Profile Settings"
        onBackPress={handleBackPress}
        compact
        rightElement={editIcon}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.outerBorderContainer}>
                <View style={styles.borderContainer}>
                  <View style={styles.imageContainer}>
                    {avatarUri ? (
                      <Image
                        source={{ uri: avatarUri }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.placeholderImage} />
                    )}
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={handleEditProfilePicture}
                activeOpacity={0.7}
              >
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11Z"
                    stroke={Colors.primary}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle
                    cx="12"
                    cy="13"
                    r="4"
                    stroke={Colors.primary}
                    strokeWidth="1.5"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.sinceDate}>Since: {membershipLabel}</Text>
          </View>

          <View style={styles.fieldsContainer}>
            <Input
              label="First name"
              value={firstName}
              onChangeText={setFirstName}
              editable={isEditing}
              style={inputReadonlyStyle}
            />
            <Input
              label="Last name"
              value={lastName}
              onChangeText={setLastName}
              editable={isEditing}
              style={inputReadonlyStyle}
            />
            <Input
              label="Email"
              value={email}
              editable={false}
              style={styles.inputDisabled}
            />
            <View style={styles.phoneFieldWrapper}>
              <Text style={styles.fieldLabel}>Phone number</Text>
              <View
                style={[
                  styles.phoneInputWrap,
                  !isEditing && styles.phoneInputWrapDisabled,
                ]}
                pointerEvents={isEditing ? 'auto' : 'none'}
              >
                <PhoneInput
                  ref={phoneInputRef}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Write here"
                  separateInputs
                  editable={isEditing}
                  defaultCode="PK"
                />
              </View>
            </View>

            <View>
              <Text style={styles.fieldLabel}>Date of birth</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={openDobPicker}
                disabled={!isEditing}
                style={[
                  styles.dobRow,
                  !isEditing && styles.dobRowDisabled,
                ]}
              >
                <Text style={styles.dobText}>{formatDateLabel(dateOfBirth)}</Text>
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                    stroke={isEditing ? Colors.primary : Colors.textLight}
                    strokeWidth="1.5"
                  />
                  <Path
                    d="M8 3v4M16 3v4M3 11h18"
                    stroke={isEditing ? Colors.primary : Colors.textLight}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.fieldLabel}>Gender</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  isEditing && setGenderDropdownOpen((open) => !open)
                }
                disabled={!isEditing}
                style={[
                  styles.genderRow,
                  !isEditing && styles.dobRowDisabled,
                  genderDropdownOpen && isEditing && styles.genderRowOpen,
                ]}
              >
                <Text style={styles.dobText}>{gender}</Text>
                <View
                  style={
                    genderDropdownOpen
                      ? styles.chevronRotated
                      : undefined
                  }
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M6 9l6 6 6-6"
                      stroke={isEditing ? Colors.primary : Colors.textLight}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              </TouchableOpacity>
              {genderDropdownOpen && isEditing ? (
                <View style={styles.genderDropdown}>
                  {GENDERS.map((g, i) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderDropdownOption,
                        i === GENDERS.length - 1 &&
                          styles.genderDropdownOptionLast,
                        gender === g && styles.genderDropdownOptionSelected,
                      ]}
                      onPress={() => {
                        setGender(g);
                        setGenderDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.genderDropdownOptionText,
                          gender === g &&
                            styles.genderDropdownOptionTextSelected,
                        ]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>
          </View>

          {isEditing ? (
            <Button
              title="Save Changes"
              onPress={handleSave}
              style={styles.saveChangesBtn}
              loading={savePending}
              disabled={savePending}
            />
          ) : null}
        </View>
      </ScrollView>

      {Platform.OS === 'ios' && dobModalVisible ? (
        <Modal
          transparent
          animationType="slide"
          visible
          onRequestClose={() => setDobModalVisible(false)}
        >
          <View style={styles.iosDobModalRoot}>
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setDobModalVisible(false)}
            />
            <View style={styles.iosPickerSheet}>
              <View style={styles.iosPickerToolbar}>
                <TouchableOpacity onPress={() => setDobModalVisible(false)}>
                  <Text style={styles.iosPickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="spinner"
                themeVariant="light"
                maximumDate={new Date()}
                onChange={onIosDobChange}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      {Platform.OS === 'android' && dobModalVisible ? (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={onAndroidDobChange}
        />
      ) : null}
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 28,
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
    shadowOffset: { width: 0, height: 2 },
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
    backgroundColor: '#87B5E8',
    borderRadius: 57,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 57,
  },
  editImageButton: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
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
  phoneFieldWrapper: {
    width: '100%',
  },
  phoneInputWrap: {
    width: '100%',
  },
  phoneInputWrapDisabled: {
    opacity: 0.85,
  },
  fieldLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  inputDisabled: {
    opacity: 0.85,
    backgroundColor: Colors.inputBackgroundDefault,
  },
  dobRow: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackgroundDefault,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dobRowDisabled: {
    opacity: 0.85,
  },
  dobText: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    color: Colors.inputText,
  },
  genderRow: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackgroundDefault,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  genderRowOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  genderDropdown: {
    marginTop: -1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackgroundDefault,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  genderDropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.inputBorder,
  },
  genderDropdownOptionLast: {
    borderBottomWidth: 0,
  },
  genderDropdownOptionSelected: {
    backgroundColor: Colors.backgroundLight,
  },
  genderDropdownOptionText: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  genderDropdownOptionTextSelected: {
    fontWeight: '600',
    color: Colors.primary,
  },
  saveChangesBtn: {
    marginTop: 28,
    alignSelf: 'center',
    backgroundColor: Colors.buttonPrimary,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  iosDobModalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  iosPickerSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  iosPickerToolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  iosPickerDone: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.primary,
  },
});

export default ProfileSettings;
