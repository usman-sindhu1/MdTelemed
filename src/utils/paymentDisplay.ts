import type {
  PatientPaymentDoctorLike,
  PatientPaymentListRow,
  PatientPaymentStatus,
} from '../types/patientPayments';
import { appointmentTypeToLabel } from './prescriptionDisplay';

/** e.g. `usd` → `$30.00` */
export function formatPaymentMoney(
  amount: number | undefined | null,
  currency: string | undefined | null,
): string {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '—';
  const c = (currency ?? 'usd').toUpperCase();
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: c === 'USD' ? 'USD' : c,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

/** e.g. "04 May 2026" */
export function formatPaymentInvoiceDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Title-case service label from appointment type enum. */
export function formatPaymentServiceLabel(type: string | undefined | null): string {
  const base = appointmentTypeToLabel(type);
  if (base === '—') return '—';
  return base
    .split(' ')
    .map((w) =>
      w.length ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w,
    )
    .join(' ');
}

export function patientPaymentDoctorName(
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

export function patientFullName(p?: {
  firstName?: string;
  lastName?: string;
} | null): string {
  if (!p) return '—';
  const fn = p.firstName?.trim() ?? '';
  const ln = p.lastName?.trim() ?? '';
  const full = [fn, ln].filter(Boolean).join(' ');
  return full || '—';
}

export const PAYMENT_STATUS_UI: Record<
  PatientPaymentStatus,
  { label: string; bg: string; text: string }
> = {
  PAID: { label: 'Paid', bg: '#ECFDF5', text: '#059669' },
  PENDING: { label: 'Pending', bg: '#FFFBEB', text: '#D97706' },
  CANCELLED: { label: 'Cancelled', bg: '#F3F4F6', text: '#6B7280' },
  REFUNDED: { label: 'Refunded', bg: '#EEF2FF', text: '#4F46E5' },
};

export function paymentStatusStyle(status: string | undefined): {
  label: string;
  bg: string;
  text: string;
} {
  const u = String(status ?? '').toUpperCase() as PatientPaymentStatus;
  return PAYMENT_STATUS_UI[u] ?? {
    label: status ?? '—',
    bg: '#F3F4F6',
    text: '#374151',
  };
}

export function resolveDoctorForPaymentRow(row: PatientPaymentListRow): {
  name: string;
  imageUri: string | undefined;
} {
  const name = patientPaymentDoctorName(row.doctor, row.appointment?.doctorUser);
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
