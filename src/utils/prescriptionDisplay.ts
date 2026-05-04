import type { PatientPrescriptionMedicine } from '../types/patientPrescriptions';

/** Maps DB enums to short UI labels (see patient-app prescriptions doc §5). */
export function appointmentTypeToLabel(type: string | undefined | null): string {
  if (type == null || String(type).trim() === '') return '—';
  const u = String(type).toUpperCase().replace(/-/g, '_');
  if (u === 'PRIMARY_CARE') return 'Primary care';
  if (u === 'URGENT_CARE') return 'Urgent care';
  return String(type)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatPrescriptionListDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatPrescriptionDetailDateTime(iso?: string): {
  date: string;
  time: string;
} {
  if (!iso) {
    return { date: '—', time: '' };
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { date: '—', time: '' };
  }
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

export function formatDoctorUserName(
  u: { firstName?: string; lastName?: string } | null | undefined,
): string {
  if (!u) return 'Doctor';
  const fn = u.firstName?.trim() ?? '';
  const ln = u.lastName?.trim() ?? '';
  const full = [fn, ln].filter(Boolean).join(' ');
  return full ? `Dr. ${full}` : 'Doctor';
}

export function formatDoctorNameDetail(
  d: { firstName?: string; lastName?: string } | null | undefined,
): string {
  if (!d) return 'Doctor';
  const fn = d.firstName?.trim() ?? '';
  const ln = d.lastName?.trim() ?? '';
  const full = [fn, ln].filter(Boolean).join(' ');
  return full ? `Dr. ${full}` : 'Doctor';
}

export function truncateText(text: string, maxLen: number): string {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1)}…`;
}

export function buildMedicineScheduleLine(
  m: PatientPrescriptionMedicine,
): string {
  const parts: string[] = [];
  if (m.takenTime && String(m.takenTime).trim()) {
    parts.push(`Taken times: ${String(m.takenTime).trim()}`);
  }
  if (m.takenBefore && String(m.takenBefore).trim()) {
    parts.push(String(m.takenBefore).trim());
  }
  if (m.units && String(m.units).trim()) {
    parts.push(String(m.units).trim());
  }
  return parts.join(' · ');
}

export function displayPrescriptionId(id: string, short = true): string {
  if (!short || id.length <= 12) return id;
  return `${id.slice(0, 8)}…`;
}
