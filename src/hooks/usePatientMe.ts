import { useQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';

export type PatientMePayload = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export function usePatientMe(enabled: boolean) {
  return useQuery({
    queryKey: ['patient-me'],
    queryFn: () => patientGetData<PatientMePayload>(patientPaths.me),
    enabled,
    staleTime: 60_000,
    retry: 1,
  });
}

