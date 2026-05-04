import { useCallback, useMemo } from 'react';
import {
  useQueries,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type {
  PatientAppointmentDetailPayload,
  PatientAppointmentsListPayload,
} from '../types/patientAppointments';
import { apiStatusToBadge } from '../utils/appointmentStatusUi';
import {
  extractSpecialty,
  formatDoctorName,
  formatSlot,
} from '../utils/appointmentEnrichment';

const CAROUSEL_PAGE_SIZE = 10;
const DETAIL_CONCURRENCY = 10;

export interface HomeUpcomingAppointmentCard {
  id: string;
  doctorName: string;
  doctorImageUri?: string;
  specialty: string;
  date: string;
  time: string;
  badgeLabel: string;
}

export function invalidatePatientAppointmentCaches(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
  void queryClient.invalidateQueries({ queryKey: ['patient-appointment-detail'] });
  void queryClient.invalidateQueries({ queryKey: ['patient-therapist'] });
}

export function useHomeUpcomingAppointments() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: [
      'patient-appointments',
      'carousel',
      'CONFIRMED',
      CAROUSEL_PAGE_SIZE,
    ] as const,
    queryFn: () =>
      patientGetData<PatientAppointmentsListPayload>(patientPaths.appointments, {
        status: 'CONFIRMED',
        sortBy: 'startDate',
        sortOrder: 'asc',
        page: 1,
        pageSize: CAROUSEL_PAGE_SIZE,
      }),
  });

  const slice = useMemo(() => {
    const items = listQuery.data?.items ?? [];
    return items.slice(0, DETAIL_CONCURRENCY);
  }, [listQuery.data?.items]);

  const sliceIds = useMemo(() => slice.map((i) => i.id), [slice]);

  const doctorIds = useMemo(() => {
    const set = new Set<string>();
    slice.forEach((it) => {
      if (it.doctor?.id) {
        set.add(it.doctor.id);
      }
    });
    return [...set];
  }, [slice]);

  const detailQueries = useQueries({
    queries: sliceIds.map((id) => ({
      queryKey: ['patient-appointment-detail', id] as const,
      queryFn: () =>
        patientGetData<PatientAppointmentDetailPayload>(
          patientPaths.appointmentById(id),
        ),
      enabled: listQuery.isSuccess && sliceIds.length > 0,
      staleTime: 60_000,
    })),
  });

  const therapistQueries = useQueries({
    queries: doctorIds.map((doctorId) => ({
      queryKey: ['patient-therapist', doctorId] as const,
      queryFn: () => patientGetData<unknown>(patientPaths.therapistById(doctorId)),
      enabled: listQuery.isSuccess && doctorIds.length > 0,
      staleTime: 30 * 60_000,
    })),
  });

  const therapistMap = new Map<string, string>();
  doctorIds.forEach((id, idx) => {
    const q = therapistQueries[idx];
    if (q?.data) {
      therapistMap.set(id, extractSpecialty(q.data));
    }
  });

  const cards: HomeUpcomingAppointmentCard[] = (() => {
    if (!listQuery.isSuccess || slice.length === 0) {
      return [];
    }
    const now = Date.now();
    const out: HomeUpcomingAppointmentCard[] = [];
    for (let i = 0; i < slice.length; i++) {
      const item = slice[i];
      const dq = detailQueries[i];
      const start = dq?.data?.timeSlot?.startDate;
      if (!start) {
        continue;
      }
      if (new Date(start).getTime() < now) {
        continue;
      }
      const { date, time } = formatSlot(start);
      const docId = item.doctor?.id;
      const specialty = docId ? therapistMap.get(docId) ?? '—' : '—';
      out.push({
        id: item.id,
        doctorName: formatDoctorName(item.doctor),
        doctorImageUri: item.doctor?.image ?? undefined,
        specialty,
        date,
        time,
        badgeLabel: apiStatusToBadge(item.status).label,
      });
    }
    return out;
  })();

  const hasRowsToResolve = slice.length > 0;
  const detailsPending =
    hasRowsToResolve &&
    detailQueries.some((q) => q.isPending);
  const therapistsPending =
    doctorIds.length > 0 &&
    therapistQueries.some((q) => q.isPending);

  const isLoading =
    listQuery.isPending ||
    (listQuery.isSuccess && hasRowsToResolve && (detailsPending || therapistsPending));

  const invalidateUpcoming = useCallback(() => {
    invalidatePatientAppointmentCaches(queryClient);
  }, [queryClient]);

  const isEmpty =
    listQuery.isSuccess &&
    cards.length === 0 &&
    !isLoading;

  return {
    cards,
    isLoading,
    isError: listQuery.isError,
    isEmpty,
    refetch: invalidateUpcoming,
  };
}
