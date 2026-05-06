/** Public API routes — no login required. */

export const PUBLIC_API_PREFIX = '/api/public';

export const publicPaths = {
  doctors: `${PUBLIC_API_PREFIX}/doctors`,
  doctorById: (doctorUserId: string) =>
    `${PUBLIC_API_PREFIX}/doctors/${encodeURIComponent(doctorUserId)}`,
  doctorTimeslots: (doctorUserId: string) =>
    `${PUBLIC_API_PREFIX}/doctors/${encodeURIComponent(doctorUserId)}/timeslots`,
  /** Contact form — POST JSON, no `Authorization`. */
  userQueries: '/api/user-queries',
  /** GET — optional pre-check before “See Doctor Now”; `data.hasAvailability`. */
  urgentCareAvailability: `${PUBLIC_API_PREFIX}/urgent-care/availability`,
};
