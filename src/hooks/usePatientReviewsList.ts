import { useInfiniteQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type { PatientReviewsListPayload } from '../types/patientReviews';

export const PATIENT_REVIEWS_PAGE_SIZE = 20;

export function usePatientReviewsList(search: string) {
  const q = search.trim();

  return useInfiniteQuery({
    queryKey: ['patient-reviews', 'list', q] as const,
    queryFn: ({ pageParam }) =>
      patientGetData<PatientReviewsListPayload>(patientPaths.reviews, {
        page: pageParam,
        pageSize: PATIENT_REVIEWS_PAGE_SIZE,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...(q ? { search: q } : {}),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const pag = lastPage.pagination;
      const items = lastPage.items ?? [];
      if (pag) {
        if (pag.page >= pag.totalPages) return undefined;
        return pag.page + 1;
      }
      if (items.length < PATIENT_REVIEWS_PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
    staleTime: 30_000,
  });
}
