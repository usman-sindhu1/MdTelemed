import type { AppointmentApiStatus } from '../types/patientAppointments';

/** Filter tabs + All. */
export type AppointmentsTab =
  | 'all'
  | 'upcoming'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'missed';

export type BadgeTone =
  | 'upcoming'
  | 'completed'
  | 'cancelled'
  | 'pending'
  | 'missed';

/** Query params for GET /api/patient/appointments (status omitted for All). */
export function appointmentsListParams(
  tab: AppointmentsTab,
  page: number,
  pageSize = 20,
): Record<string, string | number> {
  const base: Record<string, string | number> = {
    page,
    pageSize,
  };

  switch (tab) {
    case 'all':
      return {
        ...base,
        sortBy: 'startDate',
        sortOrder: 'desc',
      };
    case 'upcoming':
      return {
        ...base,
        status: 'CONFIRMED',
        sortBy: 'startDate',
        sortOrder: 'asc',
      };
    case 'pending':
      return {
        ...base,
        status: 'PENDING',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    case 'completed':
      return {
        ...base,
        status: 'COMPLETED',
        sortBy: 'startDate',
        sortOrder: 'desc',
      };
    case 'cancelled':
      return {
        ...base,
        status: 'CANCELLED',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    case 'missed':
      return {
        ...base,
        status: 'MISSED',
        sortBy: 'startDate',
        sortOrder: 'desc',
      };
    default:
      return base;
  }
}

export function apiStatusToBadge(status: AppointmentApiStatus | string): {
  label: string;
  tone: BadgeTone;
} {
  const s = status as AppointmentApiStatus;
  switch (s) {
    case 'CONFIRMED':
      return { label: 'upcoming', tone: 'upcoming' };
    case 'COMPLETED':
      return { label: 'completed', tone: 'completed' };
    case 'CANCELLED':
      return { label: 'cancelled', tone: 'cancelled' };
    case 'PENDING':
      return { label: 'pending', tone: 'pending' };
    case 'MISSED':
      return { label: 'missed', tone: 'missed' };
    default:
      return { label: status.toLowerCase(), tone: 'missed' };
  }
}
