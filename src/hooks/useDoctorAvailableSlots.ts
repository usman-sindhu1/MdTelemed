import { useQuery } from '@tanstack/react-query';
import { publicGetData } from '../api/publicHttp';
import { patientGetData } from '../api/patientHttp';
import { publicPaths } from '../constants/publicPaths';
import { patientPaths } from '../constants/patientPaths';
import { getData } from '../utils/storage';
import type { PublicDoctorTimeslotsPayload } from '../types/publicDoctors';

async function fetchSlotsForDoctor(
  doctorUserId: string,
): Promise<PublicDoctorTimeslotsPayload> {
  const token = await getData<string>('accessToken');
  if (token?.trim()) {
    return patientGetData<PublicDoctorTimeslotsPayload>(
      patientPaths.therapistSlots(doctorUserId),
    );
  }
  return publicGetData<PublicDoctorTimeslotsPayload>(
    publicPaths.doctorTimeslots(doctorUserId),
  );
}

/**
 * All future bookable slots for a doctor (public if logged out, patient path if JWT).
 * Client filters by selected calendar day.
 */
export function useDoctorAvailableSlots(doctorUserId: string | undefined) {
  const id = doctorUserId?.trim();
  return useQuery({
    queryKey: ['doctor-available-slots', id] as const,
    queryFn: () => fetchSlotsForDoctor(id!),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
