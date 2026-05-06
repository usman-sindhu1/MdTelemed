import { useQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type { PatientSubscriptionApi } from '../types/createAppointment';

/**
 * Patient subscription snapshot for booking payment summary (Step 3).
 */
export function usePatientSubscription(enabled: boolean) {
  return useQuery({
    queryKey: ['patient-subscription'] as const,
    queryFn: () =>
      patientGetData<PatientSubscriptionApi>(patientPaths.subscription),
    enabled,
    staleTime: 60_000,
  });
}
