import { useEffect, useMemo, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type {
  PatientAppointmentDetailPayload,
  PatientAppointmentListItem,
  PatientAppointmentsListPayload,
} from '../types/patientAppointments';
import {
  appointmentsListParams,
  apiStatusToBadge,
  type AppointmentsTab,
  type BadgeTone,
} from '../utils/appointmentStatusUi';
import {
  extractSpecialty,
  formatDoctorName,
  formatSlot,
} from '../utils/appointmentEnrichment';

export const APPOINTMENTS_LIST_PAGE_SIZE = 5;

export interface AppointmentListRow {
  id: string;
  doctorName: string;
  doctorImageUri?: string;
  specialty: string;
  date: string;
  time: string;
  badgeLabel: string;
  badgeTone: BadgeTone;
}

export function usePatientAppointmentsList(selectedTab: AppointmentsTab) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [selectedTab]);

  const listQuery = useQuery({
    queryKey: [
      'patient-appointments',
      'list',
      selectedTab,
      page,
      APPOINTMENTS_LIST_PAGE_SIZE,
    ] as const,
    queryFn: () =>
      patientGetData<PatientAppointmentsListPayload>(
        patientPaths.appointments,
        appointmentsListParams(selectedTab, page, APPOINTMENTS_LIST_PAGE_SIZE),
      ),
  });

  const flatItems: PatientAppointmentListItem[] =
    listQuery.data?.items ?? [];

  const flatIds = useMemo(() => flatItems.map((i) => i.id), [flatItems]);

  const doctorIds = useMemo(() => {
    const set = new Set<string>();
    flatItems.forEach((it) => {
      if (it.doctor?.id) {
        set.add(it.doctor.id);
      }
    });
    return [...set];
  }, [flatItems]);

  const detailQueries = useQueries({
    queries: flatIds.map((id) => ({
      queryKey: ['patient-appointment-detail', id] as const,
      queryFn: () =>
        patientGetData<PatientAppointmentDetailPayload>(
          patientPaths.appointmentById(id),
        ),
      enabled: listQuery.isSuccess && flatIds.length > 0,
      staleTime: 60_000,
    })),
  });

  const therapistQueries = useQueries({
    queries: doctorIds.map((doctorId) => ({
      queryKey: ['patient-therapist', doctorId] as const,
      queryFn: () =>
        patientGetData<unknown>(patientPaths.therapistById(doctorId)),
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

  const rows: AppointmentListRow[] = (() => {
    const now = Date.now();
    const out: AppointmentListRow[] = [];
    for (let i = 0; i < flatItems.length; i++) {
      const item = flatItems[i];
      const dq = detailQueries[i];
      const start = dq?.data?.timeSlot?.startDate;
      let date = '—';
      let time = '—';
      if (start) {
        const slotTime = new Date(start).getTime();
        if (selectedTab === 'upcoming' && slotTime < now) {
          continue;
        }
        const f = formatSlot(start);
        date = f.date;
        time = f.time;
      }
      const docId = item.doctor?.id;
      const specialty = docId ? therapistMap.get(docId) ?? '—' : '—';
      const { label, tone } = apiStatusToBadge(item.status);
      out.push({
        id: item.id,
        doctorName: formatDoctorName(item.doctor),
        doctorImageUri: item.doctor?.image ?? undefined,
        specialty,
        date,
        time,
        badgeLabel: label,
        badgeTone: tone,
      });
    }
    return out;
  })();

  const hasRows = flatItems.length > 0;
  const detailsPending =
    hasRows && detailQueries.some((q) => q.isPending);
  const therapistsPending =
    doctorIds.length > 0 &&
    therapistQueries.some((q) => q.isPending);

  const isLoading =
    listQuery.isPending ||
    (listQuery.isSuccess && hasRows && (detailsPending || therapistsPending));

  const isEmpty =
    listQuery.isSuccess &&
    rows.length === 0 &&
    !isLoading;

  const pagination = listQuery.data?.pagination;
  const totalPages = Math.max(
    1,
    pagination?.totalPages ?? 1,
  );

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const goToPrev = () => {
    if (canGoPrev) {
      setPage((p) => p - 1);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      setPage((p) => p + 1);
    }
  };

  return {
    rows,
    page,
    totalPages,
    totalItems: pagination?.totalItems ?? 0,
    canGoPrev,
    canGoNext,
    goToPrev,
    goToNext,
    isLoading,
    isError: listQuery.isError,
    isEmpty,
    refetch: listQuery.refetch,
  };
}
