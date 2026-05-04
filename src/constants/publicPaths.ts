/** Public API routes — no login required. */

export const PUBLIC_API_PREFIX = '/api/public';

export const publicPaths = {
  doctors: `${PUBLIC_API_PREFIX}/doctors`,
  doctorById: (doctorUserId: string) =>
    `${PUBLIC_API_PREFIX}/doctors/${encodeURIComponent(doctorUserId)}`,
  doctorTimeslots: (doctorUserId: string) =>
    `${PUBLIC_API_PREFIX}/doctors/${encodeURIComponent(doctorUserId)}/time-slots`,
  /** Contact form — POST JSON, no `Authorization`. */
  userQueries: '/api/user-queries',
};
