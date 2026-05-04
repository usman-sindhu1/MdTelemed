import { useQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type { PatientPrescriptionDetailPayload } from '../types/patientPrescriptions';

export function usePrescriptionDetail(prescriptionId: string | undefined) {
  return useQuery({
    queryKey: ['patient-prescription-detail', prescriptionId] as const,
    queryFn: () =>
      patientGetData<PatientPrescriptionDetailPayload>(
        patientPaths.prescriptionById(prescriptionId!),
      ),
    enabled: Boolean(prescriptionId),
    staleTime: 60_000,
  });
}
