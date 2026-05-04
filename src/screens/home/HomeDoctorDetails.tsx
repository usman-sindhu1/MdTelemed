import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import type { HomeStackParamList } from '../../navigation/HomeStack';
import { usePublicDoctorDetail } from '../../hooks/usePublicDoctorDetail';
import ShimmerBox from '../../components/common/ShimmerBox';
import {
  mapPublicDoctorToBookingParams,
  formatDoctorPlainName,
  getPublicDoctorDisplayDetails,
  resolveDoctorImageUri,
} from '../../utils/publicDoctorDisplay';

type HomeDoctorDetailsNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeDoctorDetails'
>;
type HomeDoctorDetailsRouteProp = RouteProp<
  HomeStackParamList,
  'HomeDoctorDetails'
>;

const SERIF_NAME =
  Platform.OS === 'ios'
    ? 'Georgia'
    : 'serif';

/** Space below the primary button so content clears the tab bar when scrolled to the end. */
function doctorDetailsScrollBottomPadding(bottomInset: number): number {
  return Math.max(bottomInset, 12) + 72;
}

const HomeDoctorDetailsSkeleton: React.FC<{
  contentWidth: number;
  bottomPad: number;
}> = ({ contentWidth, bottomPad }) => {
  const heroH = Math.round((contentWidth * 3) / 4);
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPad },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
      bounces
    >
      <View style={styles.card}>
        <ShimmerBox
          width={contentWidth}
          height={heroH}
          borderRadius={0}
          style={styles.heroShimmer}
        />
        <View style={styles.cardBody}>
          <ShimmerBox height={28} borderRadius={999} width={160} />
          <ShimmerBox
            height={28}
            borderRadius={8}
            style={{ marginTop: 14 }}
          />
          <ShimmerBox
            height={18}
            borderRadius={6}
            width="55%"
            style={{ marginTop: 10 }}
          />
          <ShimmerBox
            height={16}
            borderRadius={6}
            style={{ marginTop: 18 }}
          />
          <ShimmerBox
            height={16}
            borderRadius={6}
            width="90%"
            style={{ marginTop: 8 }}
          />
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <View style={[styles.statCol, { gap: 8 }]}>
              <ShimmerBox height={12} borderRadius={4} width="50%" />
              <ShimmerBox height={18} borderRadius={6} />
            </View>
            <View style={[styles.statCol, { gap: 8 }]}>
              <ShimmerBox height={12} borderRadius={4} width="50%" />
              <ShimmerBox height={18} borderRadius={6} />
            </View>
            <View style={[styles.statCol, { gap: 8 }]}>
              <ShimmerBox height={12} borderRadius={4} width="50%" />
              <ShimmerBox height={18} borderRadius={6} />
            </View>
            <View style={[styles.statCol, { gap: 8 }]}>
              <ShimmerBox height={12} borderRadius={4} width="50%" />
              <ShimmerBox height={18} borderRadius={6} />
            </View>
          </View>
          <View style={styles.divider} />
          <ShimmerBox height={36} borderRadius={999} width="70%" />
        </View>
      </View>
      <ShimmerBox
        height={52}
        borderRadius={12}
        style={{ marginTop: 4 }}
      />
    </ScrollView>
  );
};

const HomeDoctorDetails: React.FC = () => {
  const navigation = useNavigation<HomeDoctorDetailsNavigationProp>();
  const route = useRoute<HomeDoctorDetailsRouteProp>();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = windowWidth - 30;
  const doctorId = route.params?.doctorId;
  const selectedCategoryId = route.params?.selectedCategoryId;

  const detailQuery = usePublicDoctorDetail(doctorId);
  const profile = detailQuery.data;

  const handleContinue = () => {
    if (!profile) return;
    const doctor = mapPublicDoctorToBookingParams(profile);
    const nav = navigation as unknown as {
      getParent?: () =>
        | { getParent?: () => { navigate: (n: string, p?: object) => void } }
        | undefined;
    };
    const rootNav = nav.getParent?.()?.getParent?.();
    rootNav?.navigate('BookAppt', {
      preselectedCategoryId: selectedCategoryId ?? doctor.specialty,
      selectedDoctor: doctor,
    });
  };

  const headerTitle = 'Doctor Details';

  if (!doctorId) {
    return (
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icons.Back width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.navHeaderTitle}>{headerTitle}</Text>
            <View style={styles.headerRight} />
          </View>
        </View>
        <View style={styles.centerMsg}>
          <Text style={styles.err}>Missing doctor.</Text>
        </View>
      </View>
    );
  }

  if (detailQuery.isPending && !profile) {
    return (
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icons.Back width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.navHeaderTitle}>{headerTitle}</Text>
            <View style={styles.headerRight} />
          </View>
        </View>
        <HomeDoctorDetailsSkeleton
          contentWidth={contentWidth}
          bottomPad={doctorDetailsScrollBottomPadding(insets.bottom)}
        />
      </View>
    );
  }

  if (detailQuery.isError || !profile) {
    return (
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icons.Back width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.navHeaderTitle}>{headerTitle}</Text>
            <View style={styles.headerRight} />
          </View>
        </View>
        <View style={styles.centerMsg}>
          <Text style={styles.err}>
            {(detailQuery.error as Error)?.message ??
              'Doctor could not be loaded.'}
          </Text>
        </View>
      </View>
    );
  }

  const plainName = formatDoctorPlainName(profile);
  const imageUri = resolveDoctorImageUri(profile);
  const d = getPublicDoctorDisplayDetails(profile);
  const scrollBottomPad = doctorDetailsScrollBottomPadding(insets.bottom);

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icons.Back width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.navHeaderTitle}>{headerTitle}</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: scrollBottomPad },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
        bounces
      >
        <View style={styles.card}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.heroPlaceholder} />
          )}

          <View style={styles.cardBody}>
          <View style={styles.tagPill}>
            <Text style={styles.tagText} numberOfLines={2}>
              {d.tagText}
            </Text>
          </View>

          <Text style={styles.serifName}>{plainName}</Text>
          <Text style={styles.regulatory}>{d.regulatory}</Text>

          <View style={styles.contactBlock}>
            <Text style={styles.contactLine}>
              <Text style={styles.contactStrong}>Professional Contact: </Text>
              {d.contact}
            </Text>
            <Text style={styles.contactLine}>
              <Text style={styles.contactStrong}>Professional Email: </Text>
              {d.profEmail}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Specialty</Text>
              <Text style={styles.statValue}>{d.specialty}</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Reviews</Text>
              <Text style={styles.statValue}>{d.reviews}</Text>
            </View>
            <View style={styles.statCol}>
              <View style={styles.ratingRow}>
                <Text style={styles.statValue}>{d.ratingStr}</Text>
                <Text style={styles.yellowStar} accessibilityLabel="rating star">
                  ★
                </Text>
              </View>
              <Text style={styles.statLabel}>Ratings</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{d.patientsDisplay}</Text>
              <Text style={styles.statLabel}>Patients</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.professionsBlock}>
            <Text style={styles.professionsPrefix}>Professions: </Text>
            <View style={styles.professionPill}>
              <Text style={styles.professionPillText} numberOfLines={2}>
                {d.professionPill}
              </Text>
            </View>
          </View>
          </View>
        </View>

        <Button
          title="Continue to Appointment"
          onPress={handleContinue}
          style={styles.primaryBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollView: {
    flex: 1,
  },
  headerBlock: {
    backgroundColor: '#ECF2FD',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navHeaderTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 15.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerRight: {
    width: 36,
    height: 36,
  },
  content: { padding: 15 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#E2E8F0',
  },
  heroPlaceholder: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#E2E8F0',
  },
  heroShimmer: {
    alignSelf: 'stretch',
  },
  cardBody: {
    padding: 18,
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    maxWidth: '100%',
  },
  tagText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  serifName: {
    fontFamily: SERIF_NAME,
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  regulatory: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 16,
  },
  contactBlock: {
    gap: 10,
    marginBottom: 4,
  },
  contactLine: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '400',
    color: '#111827',
    lineHeight: 22,
  },
  contactStrong: {
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D1D5DB',
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  statCol: {
    width: '47%',
    minWidth: 120,
  },
  statLabel: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: Fonts.openSans,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  yellowStar: {
    fontSize: 18,
    color: '#EAB308',
    lineHeight: 22,
    marginTop: -2,
  },
  professionsBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  professionsPrefix: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  professionPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  professionPillText: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  primaryBtn: { backgroundColor: Colors.primary },
  centerMsg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  err: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeDoctorDetails;
