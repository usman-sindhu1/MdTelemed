import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import {
  DoctorProfileDetailCard,
  DoctorProfileDetailSkeleton,
} from '../../components/doctor/DoctorProfileDetailCard';
import {
  mapPublicDoctorToBookingParams,
} from '../../utils/publicDoctorDisplay';

type HomeDoctorDetailsNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeDoctorDetails'
>;
type HomeDoctorDetailsRouteProp = RouteProp<
  HomeStackParamList,
  'HomeDoctorDetails'
>;

function doctorDetailsScrollBottomPadding(bottomInset: number): number {
  return Math.max(bottomInset, 12) + 72;
}

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
    rootNav?.navigate('BookApptDoctorDetail', {
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
        <DoctorProfileDetailSkeleton
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
        <DoctorProfileDetailCard profile={profile} />

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
