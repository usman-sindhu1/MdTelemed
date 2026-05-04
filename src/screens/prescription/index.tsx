import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomeHeader from '../../components/common/HomeHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { PrescriptionStackParamList } from '../../navigation/HomeStack';
import Icons from '../../assets/svg';
import { useScrollContext } from '../../contexts/ScrollContext';
import { usePatientPrescriptionsList } from '../../hooks/usePatientPrescriptionsList';
import type { PatientPrescriptionListItem } from '../../types/patientPrescriptions';
import {
  appointmentTypeToLabel,
  formatDoctorUserName,
  formatPrescriptionListDate,
  truncateText,
} from '../../utils/prescriptionDisplay';
import ShimmerBox from '../../components/common/ShimmerBox';
import ListPaginationFooter from '../../components/common/ListPaginationFooter';
import { patientGetData } from '../../api/patientHttp';
import { patientPaths } from '../../constants/patientPaths';
import type { PatientPrescriptionDetailPayload } from '../../types/patientPrescriptions';
import { generateAndSharePrescriptionPdf } from '../../utils/prescriptionPdfExport';
import { showErrorToast } from '../../utils/appToast';

type PrescriptionNavigationProp = NativeStackNavigationProp<
  PrescriptionStackParamList,
  'PrescriptionMain'
>;

const ADVISE_PREVIEW_LEN = 140;

const Prescription: React.FC = () => {
  const navigation = useNavigation<PrescriptionNavigationProp>();
  const insets = useSafeAreaInsets();
  const { setIsScrollingDown } = useScrollContext();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pdfLoadingId, setPdfLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    return () => {
      setIsScrollingDown(false);
    };
  }, [setIsScrollingDown]);

  const listQuery = usePatientPrescriptionsList(debouncedSearch);

  const items = useMemo(
    () => listQuery.data?.pages.flatMap((p) => p.items ?? []) ?? [],
    [listQuery.data?.pages],
  );

  const listPagination = useMemo(() => {
    const pages = listQuery.data?.pages;
    if (!pages?.length) return null;
    return pages[pages.length - 1]?.pagination ?? null;
  }, [listQuery.data?.pages]);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleAIChatPress = () => {
    const tabNavigation = navigation.getParent();
    if (tabNavigation) {
      tabNavigation.navigate('Chat' as never);
      return;
    }
    navigation.navigate('Chat' as never);
  };

  const handleNotificationPress = () => {
    const tabNavigation = navigation.getParent();
    if (tabNavigation) {
      tabNavigation.navigate('Notifications' as never);
      return;
    }
    navigation.navigate('Notifications' as never);
  };

  const openDetails = useCallback(
    (prescriptionId: string) => {
      navigation.navigate('PrescriptionDetails', { prescriptionId });
    },
    [navigation],
  );

  const handleDownloadPress = useCallback(async (prescriptionId: string) => {
    try {
      setPdfLoadingId(prescriptionId);
      const detail = await patientGetData<PatientPrescriptionDetailPayload>(
        patientPaths.prescriptionById(prescriptionId),
      );
      await generateAndSharePrescriptionPdf(detail, prescriptionId);
    } catch (e) {
      showErrorToast(
        'Could not create PDF',
        (e as Error)?.message ?? 'Try again later.',
      );
    } finally {
      setPdfLoadingId(null);
    }
  }, []);

  const handleScrollStart = () => {
    setIsScrollingDown(true);
  };

  const handleScrollStop = () => {
    setIsScrollingDown(false);
  };

  const loadMore = () => {
    if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) {
      listQuery.fetchNextPage();
    }
  };

  const renderCard = useCallback(
    ({ item }: { item: PatientPrescriptionListItem }) => {
      const downloadBusy = pdfLoadingId === item.id;
      const appt = item.appointment;
      const doctorUser = appt?.doctorUser;
      const serviceLabel = appointmentTypeToLabel(appt?.appointmentType);
      const forLabel = appt?.appointmentFor?.trim() || '—';
      const medCount = item.medicines?.length ?? 0;
      const advisePreview = item.advise?.trim()
        ? truncateText(item.advise, ADVISE_PREVIEW_LEN)
        : '—';
      const imgUri =
        doctorUser?.image && String(doctorUser.image).trim()
          ? String(doctorUser.image).trim()
          : undefined;

      return (
        <TouchableOpacity
          style={styles.prescriptionCard}
          onPress={() => openDetails(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.dateLabel}>
              <Icons.CalendarTodayIcon width={14} height={14} />
              <Text style={styles.dateText}>
                {formatPrescriptionListDate(item.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.prescriptionSection}>
            <Text style={styles.sectionLabel}>Prescription title:</Text>
            <Text style={styles.prescriptionTitle}>
              {item.title?.trim() || 'Prescription'}
            </Text>
          </View>

          <View style={styles.doctorSection}>
            <View style={styles.doctorInfo}>
              <View style={styles.outerBorderContainer}>
                <View style={styles.borderContainer}>
                  <View style={styles.imageContainer}>
                    {imgUri ? (
                      <Image
                        source={{ uri: imgUri }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <View style={styles.placeholderImage} />
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.doctorTextWrap}>
                <Text style={styles.sectionLabel}>Doctor</Text>
                <Text style={styles.doctorName} numberOfLines={2}>
                  {formatDoctorUserName(doctorUser)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>Service: {serviceLabel}</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>For: {forLabel}</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>Meds: {medCount}</Text>
            </View>
          </View>

          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Medication instructions</Text>
            <Text style={styles.detailText}>{advisePreview}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.secondaryPill}
              activeOpacity={0.8}
              disabled={downloadBusy}
              onPress={() => handleDownloadPress(item.id)}
            >
              {downloadBusy ? (
                <ShimmerBox width={72} height={14} borderRadius={7} />
              ) : (
                <Text style={styles.secondaryPillText}>Download</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryPill}
              activeOpacity={0.8}
              onPress={() => openDetails(item.id)}
            >
              <Text style={styles.primaryPillText}>View Prescription</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },
    [handleDownloadPress, openDetails, pdfLoadingId],
  );

  const listHeader = (
    <>
      <View style={styles.headerContainer}>
        <HomeHeader
          onProfilePress={handleMenuPress}
          onSearchChange={setSearchInput}
          onAIChatPress={handleAIChatPress}
          onNotificationPress={handleNotificationPress}
          placeholder="Search prescription, doctor"
          showFeelingRow={false}
          value={searchInput}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.heading}>My Prescriptions</Text>
          <Text style={styles.description}>
            Digital prescriptions from your doctors. View, download, and follow
            medication instructions.
          </Text>
        </View>
      </View>
    </>
  );

  const listEmpty = () => {
    if (listQuery.isPending) {
      return (
        <View style={styles.skeletonList}>
          <PrescriptionCardSkeleton />
          <PrescriptionCardSkeleton />
        </View>
      );
    }
    if (listQuery.isError) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>
            {(listQuery.error as Error)?.message ?? 'Could not load prescriptions.'}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => listQuery.refetch()}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.centerBox}>
        <Text style={styles.emptyTitle}>No prescriptions yet</Text>
        <Text style={styles.emptySub}>
          When your doctor issues a prescription, it will appear here.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.scrollWrapper} edges={['bottom']}>
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderCard}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          ListFooterComponent={
            <ListPaginationFooter
              loadedCount={items.length}
              pagination={listPagination}
              hasNextPage={listQuery.hasNextPage}
              isFetchingNextPage={listQuery.isFetchingNextPage}
              onLoadMore={loadMore}
              itemLabel="prescriptions"
            />
          }
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: Math.max(insets.bottom, 16) + 100,
            },
          ]}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={handleScrollStart}
          onMomentumScrollBegin={handleScrollStart}
          onScrollEndDrag={handleScrollStop}
          onMomentumScrollEnd={handleScrollStop}
          refreshControl={
            <RefreshControl
              refreshing={listQuery.isRefetching && !listQuery.isPending}
              onRefresh={() => listQuery.refetch()}
              tintColor={Colors.primary}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.35}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: '#ECF2FD',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 0,
  },
  content: {
    paddingHorizontal: 15,
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 24,
    gap: 8,
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
  centerBox: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  retryText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  prescriptionCard: {
    marginHorizontal: 15,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  skeletonList: {
    paddingHorizontal: 15,
    paddingBottom: 24,
    gap: 0,
  },
  skeletonDoctorTextCol: {
    flex: 1,
    gap: 8,
  },
  skeletonSecondaryBtn: {
    flex: 1,
    minWidth: 0,
  },
  skeletonPrimaryBtn: {
    flex: 1.2,
    minWidth: 0,
  },
  dateLabel: {
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  avatarImage: {
    width: '100%',
    height: '100%',
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
    color: Colors.textPrimary,
    flex: 1,
  },
  doctorTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  metaChipText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  instructionsCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
  },
  instructionsTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  secondaryPill: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    flex: 1,
    alignItems: 'center',
  },
  secondaryPillText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  primaryPill: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: Colors.primary,
    flex: 1.2,
    alignItems: 'center',
  },
  primaryPillText: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 20,
  },
});

function PrescriptionCardSkeleton() {
  return (
    <View style={styles.prescriptionCard}>
      <View style={styles.cardHeader}>
        <ShimmerBox width={120} height={28} borderRadius={14} />
      </View>
      <View style={styles.prescriptionSection}>
        <ShimmerBox height={12} borderRadius={6} width="40%" />
        <ShimmerBox height={22} borderRadius={8} width="85%" />
      </View>
          <View style={styles.doctorSection}>
        <View style={styles.doctorInfo}>
          <ShimmerBox width={50} height={50} borderRadius={25} />
          <View style={styles.skeletonDoctorTextCol}>
            <ShimmerBox height={12} borderRadius={6} width={48} />
            <ShimmerBox height={18} borderRadius={8} width="70%" />
          </View>
        </View>
      </View>
      <View style={styles.metaRow}>
        <ShimmerBox width={100} height={28} borderRadius={14} />
        <ShimmerBox width={72} height={28} borderRadius={14} />
        <ShimmerBox width={64} height={28} borderRadius={14} />
      </View>
      <View style={styles.instructionsCard}>
        <ShimmerBox height={14} borderRadius={6} width={140} />
        <ShimmerBox height={14} borderRadius={6} width="100%" />
        <ShimmerBox height={14} borderRadius={6} width="90%" />
      </View>
      <View style={styles.actionRow}>
        <ShimmerBox
          height={36}
          borderRadius={18}
          width="100%"
          style={styles.skeletonSecondaryBtn}
        />
        <ShimmerBox
          height={36}
          borderRadius={18}
          width="100%"
          style={styles.skeletonPrimaryBtn}
        />
      </View>
    </View>
  );
}

export default Prescription;
