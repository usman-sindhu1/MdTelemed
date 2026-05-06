import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  type RouteProp,
} from '@react-navigation/native';
import type {
  BookingDoctorParams,
  DrawerParamList,
} from '../navigation/HomeStackRoot';
import SimpleBackHeader from '../components/common/SimpleBackHeader';
import Button from '../components/Button';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import BookingProgressCard from '../components/booking/BookingProgressCard';
import BookingFlowDoctorCard from '../components/booking/BookingFlowDoctorCard';
import ShimmerBox from '../components/common/ShimmerBox';
import { usePublicDoctorsInfinite } from '../hooks/usePublicDoctorsInfinite';
import {
  mapPublicDoctorToBookingParams,
} from '../utils/publicDoctorDisplay';
import { showErrorToast } from '../utils/appToast';

const CONTENT_PADDING = 16;
const DOCTOR_PAGE_SIZE = 5;

const DOCTOR_SKELETON_CARDS = 5;

type BookApptRoute = RouteProp<DrawerParamList, 'BookAppt'>;

const BookAppt: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<BookApptRoute>();
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState('');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [doctorPageIndex, setDoctorPageIndex] = useState(0);
  const actionAnim = useRef(new Animated.Value(0)).current;

  const paramDoctor = route.params?.selectedDoctor;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePublicDoctorsInfinite(searchText);

  const apiDoctors = useMemo((): BookingDoctorParams[] => {
    const pages = data?.pages ?? [];
    const list: BookingDoctorParams[] = [];
    for (const page of pages) {
      for (const item of page.items ?? []) {
        const mapped = mapPublicDoctorToBookingParams(item);
        if (mapped.id) {
          list.push({
            ...mapped,
            id: mapped.id,
          } as BookingDoctorParams);
        }
      }
    }
    return list;
  }, [data]);

  const doctors = useMemo(() => {
    if (!paramDoctor?.id) return apiDoctors;
    const idStr = String(paramDoctor.id);
    const inList = apiDoctors.some((d) => String(d.id) === idStr);
    if (inList) return apiDoctors;
    return [paramDoctor as BookingDoctorParams, ...apiDoctors];
  }, [apiDoctors, paramDoctor]);

  const selectedDoctor =
    doctors.find((d) => String(d.id) === String(selectedId)) ?? null;

  const totalDoctorPages = Math.max(
    1,
    Math.ceil(doctors.length / DOCTOR_PAGE_SIZE),
  );
  const showDoctorPagination = doctors.length > DOCTOR_PAGE_SIZE;

  const pagedDoctors = useMemo(() => {
    const start = doctorPageIndex * DOCTOR_PAGE_SIZE;
    return doctors.slice(start, start + DOCTOR_PAGE_SIZE);
  }, [doctors, doctorPageIndex]);

  useEffect(() => {
    setDoctorPageIndex((p) => Math.min(p, Math.max(0, totalDoctorPages - 1)));
  }, [doctors.length, totalDoctorPages]);

  useFocusEffect(
    useCallback(() => {
      // If a doctor is explicitly passed in, select it; otherwise reset screen state
      // so re-entering the screen starts fresh.
      if (route.params?.selectedDoctor?.id != null) {
        setSelectedId(route.params!.selectedDoctor!.id);
      } else {
        setSelectedId(null);
        // Keep search + cached list so the screen doesn't refetch/show shimmer on every revisit.
      }
    }, [route.params?.selectedDoctor?.id]),
  );

  useEffect(() => {
    if (isError && error instanceof Error) {
      showErrorToast('Could not load doctors', error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (!selectedDoctor) {
      actionAnim.setValue(0);
      return;
    }
    actionAnim.setValue(0);
    Animated.timing(actionAnim, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [selectedDoctor, actionAnim]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    if (!selectedDoctor) return;
    (navigation as unknown as { navigate: (name: keyof DrawerParamList, p?: object) => void }).navigate(
      'BookApptDoctorDetail',
      { selectedDoctor },
    );
  };

  const handleCancelProcess = () => {
    setSelectedId(null);
    setSearchText('');
  };

  const progressPercent = selectedDoctor ? 22 : 0;

  const DoctorCardSkeleton = () => (
    <View style={styles.skelCard}>
      <View style={styles.skelTopRow}>
        <ShimmerBox width={64} height={64} borderRadius={16} />
        <View style={styles.skelTextCol}>
          <ShimmerBox height={18} borderRadius={8} />
          <ShimmerBox height={14} borderRadius={6} width="70%" />
        </View>
      </View>
      <View style={styles.skelStatsRow}>
        <ShimmerBox height={38} borderRadius={12} style={{ flex: 1 }} />
        <ShimmerBox height={38} borderRadius={12} style={{ flex: 1 }} />
        <ShimmerBox height={38} borderRadius={12} style={{ flex: 1 }} />
      </View>
      <View style={styles.skelFooterRow}>
        <ShimmerBox height={14} borderRadius={6} width="55%" />
        <ShimmerBox height={32} borderRadius={999} width={84} />
      </View>
    </View>
  );

  const listHeader = (
    <>
      <Text style={styles.sectionTitle}>Choose your doctor</Text>
      <Text style={styles.sectionDescription}>
        Select a clinician for your upcoming visit. You’ll confirm details,
        choose a slot, then complete your booking in three steps.
      </Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity activeOpacity={0.7} onPress={() => refetch()}>
          <Icons.Search width={20} height={20} />
        </TouchableOpacity>
      </View>
      {isLoading && doctors.length === 0 ? (
        <View style={styles.skelList}>
          {Array.from({ length: DOCTOR_SKELETON_CARDS }).map((_, i) => (
            <DoctorCardSkeleton key={`sk-${i}`} />
          ))}
        </View>
      ) : null}
      {!isLoading && !isError && doctors.length === 0 ? (
        <Text style={styles.emptyText}>No doctors match your search.</Text>
      ) : null}
    </>
  );

  const listFooter = (
    <View>
      {isFetchingNextPage ? (
        <View style={styles.footerShimmer}>
          <ShimmerBox height={14} borderRadius={999} width={160} />
        </View>
      ) : null}
    </View>
  );

  const canPrevDoctorPage = doctorPageIndex > 0;
  const canNextDoctorPage = doctorPageIndex < totalDoctorPages - 1;

  return (
    <View style={styles.container}>
      <SimpleBackHeader
        title="Book Appt."
        onBackPress={handleBackPress}
        backgroundColor="#ECF2FD"
        bottomRadius={24}
      />

      <View style={styles.progressWrap}>
        <BookingProgressCard
          subtitle="Appointment Booking progress"
          percent={progressPercent}
          dotCount={4}
          activeDotIndex={0}
        />
      </View>

      <FlatList
        style={styles.listFlex}
        data={pagedDoctors}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isFetchingNextPage} onRefresh={refetch} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && !isLoading) {
            void fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.35}
        renderItem={({ item: doc }) => (
          <BookingFlowDoctorCard
            doctor={doc}
            selected={String(selectedId) === String(doc.id)}
            onPress={() =>
              setSelectedId((prev) =>
                prev != null && String(prev) === String(doc.id) ? null : doc.id,
              )
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.cardGap} />}
      />

      {selectedDoctor || showDoctorPagination ? (
        <View
          style={[
            styles.bottomChrome,
            { paddingBottom: Math.max(insets.bottom, 10) },
          ]}
        >
          {showDoctorPagination ? (
            <View style={styles.paginationBar}>
              <TouchableOpacity
                style={[styles.pageNavBtn, !canPrevDoctorPage && styles.pageNavBtnDisabled]}
                disabled={!canPrevDoctorPage}
                onPress={() => setDoctorPageIndex((i) => Math.max(0, i - 1))}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Previous page of doctors"
              >
                <Icons.ArrowLeftIcon width={18} height={18} />
                <Text style={styles.pageNavLabel}>Prev</Text>
              </TouchableOpacity>
              <Text style={styles.pageIndicator}>
                Page {doctorPageIndex + 1} of {totalDoctorPages}
              </Text>
              <TouchableOpacity
                style={[styles.pageNavBtn, !canNextDoctorPage && styles.pageNavBtnDisabled]}
                disabled={!canNextDoctorPage}
                onPress={() =>
                  setDoctorPageIndex((i) => Math.min(totalDoctorPages - 1, i + 1))
                }
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Next page of doctors"
              >
                <Text style={styles.pageNavLabel}>Next</Text>
                <Icons.ArrowRight width={18} height={18} />
              </TouchableOpacity>
            </View>
          ) : null}

          {selectedDoctor ? (
            <Animated.View
              style={[
                styles.actions,
                showDoctorPagination && styles.actionsAfterPagination,
                {
                  opacity: actionAnim,
                  transform: [
                    {
                      translateY: actionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
              pointerEvents="box-none"
            >
              <Button
                variant="primary"
                title="Next"
                onPress={handleContinue}
                style={styles.btnPrimary}
              />
              <Button
                variant="half-outlined"
                title="Cancel"
                onPress={handleCancelProcess}
                style={styles.btnGhost}
                textStyle={styles.btnGhostText}
              />
            </Animated.View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressWrap: {
    marginTop: -40,
    paddingHorizontal: CONTENT_PADDING,
    marginBottom: 12,
    alignItems: 'stretch',
    width: '100%',
  },
  listFlex: {
    flex: 1,
  },
  listContent: {
    padding: CONTENT_PADDING,
    paddingBottom: 20,
    flexGrow: 1,
  },
  cardGap: {
    height: 12,
  },
  centerPad: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerSpinner: {
    marginVertical: 16,
  },
  footerShimmer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  hint: {
    marginTop: 8,
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#64748B',
  },
  skelList: {
    gap: 12,
    paddingBottom: 4,
  },
  skelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skelTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skelTextCol: {
    flex: 1,
    marginLeft: 14,
    gap: 10,
    minWidth: 0,
  },
  skelStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  skelFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  emptyText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 14,
  },
  bottomChrome: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  actions: {
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 12,
    gap: 12,
  },
  actionsAfterPagination: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8EEF5',
  },
  btnPrimary: {
    backgroundColor: Colors.primary ?? '#2563EB',
  },
  btnGhost: {
    width: '100%',
    height: 52,
    backgroundColor: '#F1F5F9',
    borderWidth: 0,
  },
  btnGhostText: {
    color: '#1F2937',
    fontFamily: Fonts.raleway,
    fontWeight: '700',
  },
  paginationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  pageNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  pageNavBtnDisabled: {
    opacity: 0.35,
  },
  pageNavLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary ?? '#2563EB',
  },
  pageIndicator: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});

export default BookAppt;
