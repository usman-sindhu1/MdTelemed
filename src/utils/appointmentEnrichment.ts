import type { PatientAppointmentListItem } from '../types/patientAppointments';

export function formatDoctorName(
  doctor: PatientAppointmentListItem['doctor'],
): string {
  if (!doctor) return 'Doctor';
  const fn = doctor.firstName?.trim() ?? '';
  const ln = doctor.lastName?.trim() ?? '';
  const full = [fn, ln].filter(Boolean).join(' ');
  return full ? `Dr. ${full}` : 'Doctor';
}

export function formatSlot(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  };
}

export function extractSpecialty(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return 'Specialist';
  }
  const o = data as Record<string, unknown>;
  const pi = o.professionalInfo;
  if (pi && typeof pi === 'object') {
    const p = pi as Record<string, unknown>;
    const s = p.specialization ?? p.specialty ?? p.title ?? p.field;
    if (typeof s === 'string' && s.trim()) {
      return s.trim();
    }
  }
  if (typeof o.specialty === 'string' && o.specialty.trim()) {
    return o.specialty.trim();
  }
  return 'Specialist';
}
