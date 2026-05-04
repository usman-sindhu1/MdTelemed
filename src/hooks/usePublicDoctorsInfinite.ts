import { useInfiniteQuery } from '@tanstack/react-query';
import { publicGetData } from '../api/publicHttp';
import { publicPaths } from '../constants/publicPaths';
import type { PublicDoctorsListPayload } from '../types/publicDoctors';

const PAGE_SIZE = 20;

export function usePublicDoctorsInfinite(search: string) {
  const q = search.trim();

  return useInfiniteQuery({
    queryKey: ['public-doctors', 'list', { search: q }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const data = await publicGetData<PublicDoctorsListPayload>(
        publicPaths.doctors,
        {
          page: pageParam,
          pageSize: PAGE_SIZE,
          sortBy: 'averageRating',
          sortOrder: 'desc',
          ...(q ? { search: q } : {}),
        },
      );
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const pag = lastPage.pagination;
      const items = lastPage.items ?? [];
      if (pag) {
        if (pag.page >= pag.totalPages) return undefined;
        return pag.page + 1;
      }
      if (items.length < PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
    staleTime: 30_000,
  });
}
