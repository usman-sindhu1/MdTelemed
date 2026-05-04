import type { PatientPaymentDoctorLike } from '../types/patientPayments';
import type { PatientRatingRow as ReviewRow } from '../types/patientReviews';
import { appointmentTypeToLabel } from './prescriptionDisplay';

/** Title-case service label (matches payments UI). */
export function formatReviewServiceLabel(type: string | undefined | null): string {
  const base = appointmentTypeToLabel(type);
  if (base === '—') return '—';
  return base
    .split(' ')
    .map((w) =>
      w.length ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w,
    )
    .join(' ');
}

export function patientReviewDoctorName(
  doctor?: PatientPaymentDoctorLike | null,
  fallbackUser?: PatientPaymentDoctorLike | null,
): string {
  const d = doctor ?? fallbackUser;
  if (!d) return '—';
  const fn = d.firstName?.trim() ?? '';
  const ln = d.lastName?.trim() ?? '';
  const full = [fn, ln].filter(Boolean).join(' ');
  return full || '—';
}

export function resolveDoctorForReviewRow(row: ReviewRow): {
  name: string;
  imageUri: string | undefined;
} {
  const name = patientReviewDoctorName(row.doctor, row.appointment?.doctorUser);
  const img =
    row.doctor?.image?.trim() ||
    row.appointment?.doctorUser?.image?.trim() ||
    '';
  const imageUri =
    img && (img.startsWith('http://') || img.startsWith('https://'))
      ? img
      : undefined;
  return { name, imageUri };
}

/** Integer 1–5 → display like `3.0`. */
export function formatReviewScore(score: number | undefined | null): string {
  if (typeof score !== 'number' || Number.isNaN(score)) return '—';
  const s = Math.min(5, Math.max(1, Math.round(score)));
  return `${s.toFixed(1)}`;
}
