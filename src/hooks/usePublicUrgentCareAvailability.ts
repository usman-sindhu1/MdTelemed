import { useQuery } from '@tanstack/react-query';
import { publicGetData } from '../api/publicHttp';
import { publicPaths } from '../constants/publicPaths';

type UrgentCareAvailabilityPayload = {
  hasAvailability?: boolean;
};

/**
 * GET `/api/public/urgent-care/availability` — no auth.
 */
export function usePublicUrgentCareAvailability(enabled = false) {
  return useQuery({
    queryKey: ['urgent-care-availability'] as const,
    queryFn: () =>
      publicGetData<UrgentCareAvailabilityPayload>(
        publicPaths.urgentCareAvailability,
      ),
    enabled,
    staleTime: 30_000,
  });
}
