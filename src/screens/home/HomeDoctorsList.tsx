import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import type { HomeStackParamList } from '../../navigation/HomeStack';
import { usePublicDoctorsInfinite } from '../../hooks/usePublicDoctorsInfinite';
import type { PublicDoctorProfile } from '../../types/publicDoctors';
import TopDoctorCard, {
  TopDoctorCardSkeleton,
} from '../../components/homecomponents/TopDoctorCard';
import ListPaginationFooter from '../../components/common/ListPaginationFooter';

type HomeDoctorsListNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeDoctorsList'
>;

const SEARCH_DEBOUNCE_MS = 400;
const LIST_SKELETON_COUNT = 3;

const HomeDoctorsList: React.FC = () => {
  const navigation = useNavigation<HomeDoctorsListNavigationProp>();
  const insets = useSafeAreaInsets();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(t);
  }, [searchInput]);

  const listQuery = usePublicDoctorsInfinite(debouncedSearch);

  const rows = useMemo(
    () =>
      listQuery.data?.pages.flatMap((p) => p.items ?? []) ??
      ([] as PublicDoctorProfile[]),
    [listQuery.data?.pages],
  );

  const listPagination = useMemo(() => {
    const pages = listQuery.data?.pages;
    if (!pages?.length) return null;
    return pages[pages.length - 1]?.pagination ?? null;
  }, [listQuery.data?.pages]);

  const onRefresh = useCallback(() => {
    listQuery.refetch();
  }, [listQuery]);

  const loadMore = useCallback(() => {
    if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) {
      listQuery.fetchNextPage();
    }
  }, [listQuery]);

  const renderItem = useCallback(
    ({ item }: { item: PublicDoctorProfile }) => {
      const doctorId = item.user?.id;
      if (!doctorId) return null;
      return (
        <TopDoctorCard
          profile={item}
          onPress={() =>
            navigation.navigate('HomeDoctorDetails', { doctorId })
          }
        />
      );
    },
    [navigation],
  );

  const emptyComponent = () => {
    if (listQuery.isPending) {
      return (
        <View style={styles.skeletonStack}>
          {Array.from({ length: LIST_SKELETON_COUNT }).map((_, i) => (
            <TopDoctorCardSkeleton key={`doc-sk-${i}`} />
          ))}
        </View>
      );
    }
    if (listQuery.isError) {
      return (
        <Text style={styles.emptyText}>
          {(listQuery.error as Error)?.message ?? 'Could not load doctors.'}
        </Text>
      );
    }
    return (
      <Text style={styles.emptyText}>No doctors match your search.</Text>
    );
  };

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
          <Text style={styles.headerTitle}>Top Doctors</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item, index) => item.user?.id ?? `row-${index}`}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 24 },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={styles.titleSection}>
            <Text style={styles.pageHeading}>Book Appointment</Text>
            <Text style={styles.pageDescription}>
              Search by doctor name or email. Select a doctor to view profile
              and book.
            </Text>
            <View style={styles.searchField}>
              <Icons.Search width={18} height={18} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search doctors…"
                placeholderTextColor="#9CA3AF"
                value={searchInput}
                onChangeText={setSearchInput}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>
          </View>
        }
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={
          <ListPaginationFooter
            loadedCount={rows.length}
            pagination={listPagination}
            hasNextPage={listQuery.hasNextPage}
            isFetchingNextPage={listQuery.isFetchingNextPage}
            onLoadMore={loadMore}
            itemLabel="doctors"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={listQuery.isRefetching && !listQuery.isPending}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  headerTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 15.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerRight: {
    width: 36,
    height: 36,
  },
  titleSection: {
    marginBottom: 12,
  },
  pageHeading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  pageDescription: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
    marginBottom: 12,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.openSans,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  listContent: { padding: 15 },
  skeletonStack: {
    gap: 12,
    paddingBottom: 8,
  },
  emptyText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
});

export default HomeDoctorsList;
