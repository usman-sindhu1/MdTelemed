import { useQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type { PatientAppointmentDetailPayload } from '../types/patientAppointments';

/**
 * Single appointment detail for the Appointment Details screen.
 * Uses the same query key prefix as list/detail hydration so cache stays aligned.
 */
export function useAppointmentDetailScreen(appointmentId: string | undefined) {
  const detailQuery = useQuery({
    queryKey: ['patient-appointment-detail', appointmentId] as const,
    queryFn: () =>
      patientGetData<PatientAppointmentDetailPayload>(
        patientPaths.appointmentById(appointmentId!),
      ),
    enabled: Boolean(appointmentId),
    staleTime: 60_000,
  });

  const doctorId = detailQuery.data?.doctor?.id;

  const therapistQuery = useQuery({
    queryKey: ['patient-therapist', doctorId] as const,
    queryFn: () =>
      patientGetData<unknown>(patientPaths.therapistById(doctorId!)),
    enabled: Boolean(doctorId) && detailQuery.isSuccess,
    staleTime: 30 * 60_000,
  });

  return {
    detail: detailQuery.data,
    isLoading: detailQuery.isPending,
    isFetching: detailQuery.isFetching,
    isError: detailQuery.isError,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
    therapistLoading: therapistQuery.isPending,
    therapistData: therapistQuery.data,
  };
}
