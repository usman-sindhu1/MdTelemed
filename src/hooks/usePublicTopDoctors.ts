import { useQuery } from '@tanstack/react-query';
import { publicGetData } from '../api/publicHttp';
import { publicPaths } from '../constants/publicPaths';
import type { PublicDoctorsListPayload } from '../types/publicDoctors';

export function usePublicTopDoctors() {
  return useQuery({
    queryKey: ['public-doctors', 'top', { sortBy: 'averageRating', pageSize: 5 }],
    queryFn: () =>
      publicGetData<PublicDoctorsListPayload>(publicPaths.doctors, {
        page: 1,
        pageSize: 5,
        sortBy: 'averageRating',
        sortOrder: 'desc',
      }),
    staleTime: 60_000,
  });
}
