import { useInfiniteQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type { PatientPrescriptionsListPayload } from '../types/patientPrescriptions';

export const PRESCRIPTIONS_PAGE_SIZE = 20;

export function usePatientPrescriptionsList(search: string) {
  const q = search.trim();

  return useInfiniteQuery({
    queryKey: ['patient-prescriptions', 'list', q] as const,
    queryFn: ({ pageParam }) =>
      patientGetData<PatientPrescriptionsListPayload>(
        patientPaths.prescriptions,
        {
          page: pageParam,
          pageSize: PRESCRIPTIONS_PAGE_SIZE,
          ...(q ? { search: q } : {}),
        },
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const pag = lastPage.pagination;
      const items = lastPage.items ?? [];
      if (pag) {
        if (pag.page >= pag.totalPages) return undefined;
        return pag.page + 1;
      }
      if (items.length < PRESCRIPTIONS_PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
    staleTime: 30_000,
  });
}
