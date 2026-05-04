import { useQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type { PatientMedicalHistoryPayload } from '../types/patientMedicalHistory';

export function usePatientMedicalHistory() {
  return useQuery({
    queryKey: ['patient-medical-history'] as const,
    queryFn: () =>
      patientGetData<PatientMedicalHistoryPayload>(patientPaths.medicalHistory),
    staleTime: 30_000,
  });
}
