import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorizedPostJson, patientGetData } from '../api/patientHttp';
import { patientPaths } from '../constants/patientPaths';

export type PatientMoodValue = 'GREAT' | 'GOOD' | 'OKAY' | 'BAD' | 'AWFUL';

export type PatientMoodEntry = {
  id: string;
  mood: PatientMoodValue;
  note: string | null;
  createdAt: string;
};

export type PatientMoodListPayload = {
  latest: PatientMoodEntry | null;
  items: PatientMoodEntry[];
};

export function usePatientMoodEntries(enabled: boolean, days: number = 14) {
  return useQuery({
    queryKey: ['patient-mood', days],
    queryFn: () =>
      patientGetData<PatientMoodListPayload>(patientPaths.mood, { days }),
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateTodayMood() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { mood: PatientMoodValue; note?: string }) => {
      const note = (payload.note ?? '').trim();
      return authorizedPostJson<PatientMoodEntry, { mood: PatientMoodValue; note?: string | null }>(
        patientPaths.mood,
        { mood: payload.mood, note: note ? note : null },
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['patient-mood'] });
    },
  });
}

