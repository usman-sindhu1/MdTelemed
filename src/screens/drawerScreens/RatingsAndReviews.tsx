import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { DrawerParamList } from '../../navigation/HomeStackRoot';
import { usePatientReviewsList } from '../../hooks/usePatientReviewsList';
import type { PatientRatingRow } from '../../types/patientReviews';
import ReviewListCard, {
  ReviewListCardSkeleton,
} from '../../components/reviews/ReviewListCard';
import ReviewDetailsModal from '../../components/reviews/ReviewDetailsModal';
import ListPaginationFooter from '../../components/common/ListPaginationFooter';

type RatingsAndReviewsNavigationProp = NativeStackNavigationProp<
  DrawerParamList,
  'RatingsAndReviews'
>;

const SEARCH_DEBOUNCE_MS = 400;
const LIST_SKELETON_COUNT = 4;

const RatingsAndReviews: React.FC = () => {
  const navigation = useNavigation<RatingsAndReviewsNavigationProp>();
  const insets = useSafeAreaInsets();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [detailRatingId, setDetailRatingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(t);
  }, [searchInput]);

  const listQuery = usePatientReviewsList(debouncedSearch);

  const rows = useMemo(
    () =>
      listQuery.data?.pages.flatMap((p) => p.items ?? []) ??
      ([] as PatientRatingRow[]),
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

  const handleBackPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const openDetail = useCallback((id: string) => {
    setDetailRatingId(id);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailRatingId(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: PatientRatingRow }) => (
      <ReviewListCard
        row={item}
        onPress={() => openDetail(item.rating.id)}
      />
    ),
    [openDetail],
  );

  const emptyComponent = () => {
    if (listQuery.isPending) {
      return (
        <View style={styles.skeletonStack}>
          {Array.from({ length: LIST_SKELETON_COUNT }).map((_, i) => (
            <ReviewListCardSkeleton key={`rev-sk-${i}`} />
          ))}
        </View>
      );
    }
    if (listQuery.isError) {
      return (
        <Text style={styles.emptyText}>
          {(listQuery.error as Error)?.message ?? 'Could not load reviews.'}
        </Text>
      );
    }
    return (
      <Text style={styles.emptyText}>
        {debouncedSearch
          ? 'No reviews match your search.'
          : 'No reviews yet.'}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerBlock}>
        <View style={[styles.headerRow, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Icons.Back width={22} height={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ratings & Reviews</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.rating.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 24 },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={styles.titleSection}>
            <Text style={styles.pageHeading}>Your reviews</Text>
            <Text style={styles.pageDescription}>
              See feedback you’ve left for your visits. Tap a card for full
              details.
            </Text>
            <View style={styles.searchField}>
              <Icons.Search width={18} height={18} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by comment or doctor…"
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
            itemLabel="reviews"
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

      <ReviewDetailsModal
        visible={detailRatingId != null}
        ratingId={detailRatingId}
        onClose={closeDetail}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  headerTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerRight: {
    width: 36,
    height: 36,
  },
  listContent: {
    padding: 15,
  },
  titleSection: {
    marginBottom: 12,
  },
  pageHeading: {
    fontFamily: Fonts.raleway,
    fontSize: 22,
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

export default RatingsAndReviews;
