import { useQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type { PatientPaymentDetailPayload } from '../types/patientPayments';

export function usePatientPaymentDetail(paymentId: string | undefined) {
  return useQuery({
    queryKey: ['patient-payment', 'detail', paymentId] as const,
    queryFn: () =>
      patientGetData<PatientPaymentDetailPayload>(
        patientPaths.paymentById(paymentId!),
      ),
    enabled: Boolean(paymentId && String(paymentId).trim()),
    staleTime: 30_000,
  });
}
