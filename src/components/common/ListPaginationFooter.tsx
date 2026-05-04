import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

export type ListPaginationMeta = {
  page: number;
  totalPages: number;
  totalItems: number;
};

type ListPaginationFooterProps = {
  loadedCount: number;
  pagination?: ListPaginationMeta | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  /** Plural noun for counts, e.g. "doctors" or "prescriptions". */
  itemLabel: string;
};

const ListPaginationFooter: React.FC<ListPaginationFooterProps> = ({
  loadedCount,
  pagination,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  itemLabel,
}) => {
  if (loadedCount === 0) {
    return null;
  }

  const showEnd =
    pagination &&
    pagination.totalPages > 0 &&
    pagination.page >= pagination.totalPages;

  return (
    <View style={styles.wrap}>
      {pagination ? (
        <Text style={styles.meta}>
          Page {pagination.page} of {pagination.totalPages} · {loadedCount} of{' '}
          {pagination.totalItems} {itemLabel}
        </Text>
      ) : (
        <Text style={styles.meta}>
          Showing {loadedCount} {itemLabel}
        </Text>
      )}

      {hasNextPage ? (
        <TouchableOpacity
          style={styles.btn}
          onPress={onLoadMore}
          disabled={isFetchingNextPage}
          activeOpacity={0.8}
        >
          {isFetchingNextPage ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={styles.btnText}>Load more</Text>
          )}
        </TouchableOpacity>
      ) : showEnd ? (
        <Text style={styles.end}>End of list</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 12,
  },
  meta: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
  },
  btn: {
    minWidth: 160,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  end: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: '#94A3B8',
  },
});

export default ListPaginationFooter;
