import { useInfiniteQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type { PatientPaymentsListPayload } from '../types/patientPayments';

export const PATIENT_PAYMENTS_PAGE_SIZE = 20;

export function usePatientPaymentsList(search: string) {
  const q = search.trim();

  return useInfiniteQuery({
    queryKey: ['patient-payments', 'list', q] as const,
    queryFn: ({ pageParam }) =>
      patientGetData<PatientPaymentsListPayload>(patientPaths.payments, {
        page: pageParam,
        pageSize: PATIENT_PAYMENTS_PAGE_SIZE,
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
      if (items.length < PATIENT_PAYMENTS_PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
    staleTime: 30_000,
  });
}
