import { useQuery } from '@tanstack/react-query';
import { publicGetData } from '../api/publicHttp';
import { publicPaths } from '../constants/publicPaths';
import type { PublicDoctorProfile } from '../types/publicDoctors';

export function usePublicDoctorDetail(doctorUserId: string | undefined) {
  return useQuery({
    queryKey: ['public-doctor', doctorUserId],
    queryFn: () =>
      publicGetData<PublicDoctorProfile>(
        publicPaths.doctorById(doctorUserId!),
      ),
    enabled: Boolean(doctorUserId),
    staleTime: 60_000,
    retry: (failureCount, err: unknown) => {
      const msg = err instanceof Error ? err.message : '';
      if (/404|not found/i.test(msg)) return false;
      return failureCount < 2;
    },
  });
}
