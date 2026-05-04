import { useQuery } from '@tanstack/react-query';
import { patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type { PatientRatingRow } from '../types/patientReviews';

export function usePatientReviewDetail(ratingId: string | undefined) {
  return useQuery({
    queryKey: ['patient-review', 'detail', ratingId] as const,
    queryFn: () =>
      patientGetData<PatientRatingRow>(patientPaths.ratingById(ratingId!)),
    enabled: Boolean(ratingId && String(ratingId).trim()),
    staleTime: 30_000,
  });
}
