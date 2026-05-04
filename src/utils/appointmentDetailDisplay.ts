import type { PatientAppointmentDetailPayload } from '../types/patientAppointments';
import { formatSlot } from './appointmentEnrichment';

export function formatAppointmentFor(value: unknown): string {
  if (value === undefined || value === null) return '—';
  const s = String(value).trim();
  if (!s) return '—';
  const upper = s.toUpperCase();
  if (upper === 'SELF' || upper === 'ME' || s === 'Me') return 'Me';
  return s;
}

export function pickCallType(
  appointment: PatientAppointmentDetailPayload['appointment'],
): string {
  if (!appointment || typeof appointment !== 'object') return '—';
  const a = appointment as Record<string, unknown>;
  const raw = a.appointmentCallType ?? a.callType ?? a.call_type;
  if (typeof raw === 'string' && raw.trim()) {
    const t = raw.trim();
    const lower = t.toLowerCase();
    if (lower === 'video' || lower === 'audio' || lower === 'phone') {
      return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
    }
    return t;
  }
  return '—';
}

export function pickService(
  appointment: PatientAppointmentDetailPayload['appointment'],
): string {
  if (!appointment || typeof appointment !== 'object') return '—';
  const a = appointment as Record<string, unknown>;
  const raw =
    a.service ?? a.appointmentType ?? a.appointment_type ?? a.visitType;
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim();
  }
  return '—';
}

function firstNonEmptyString(...candidates: unknown[]): string {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) {
      return c.trim();
    }
  }
  return '';
}

/**
 * Address may live under different keys on `GET /api/patient/appointments/{id}`.
 * If still empty and the visit is video/phone, the backend often omits a physical address.
 */
export function pickLocation(
  detail: PatientAppointmentDetailPayload | undefined,
): string {
  if (!detail) return '—';

  const appt = detail.appointment;
  const apptRec =
    appt && typeof appt === 'object' ? (appt as Record<string, unknown>) : undefined;

  const fromAppointment = apptRec
    ? firstNonEmptyString(
        apptRec.location,
        apptRec.address,
        apptRec.clinicAddress,
        apptRec.venue,
        apptRec.meetingAddress,
        apptRec.fullAddress,
        apptRec.siteLocation,
        apptRec.consultationLocation,
      )
    : '';
  if (fromAppointment) return fromAppointment;

  const patient = detail.patient;
  const patRec =
    patient && typeof patient === 'object'
      ? (patient as Record<string, unknown>)
      : undefined;
  if (patRec) {
    const line = firstNonEmptyString(
      patRec.address,
      patRec.homeAddress,
      patRec.location,
      patRec.streetAddress,
    );
    if (line) return line;
  }

  const doctor = detail.doctor;
  const docRec =
    doctor && typeof doctor === 'object'
      ? (doctor as Record<string, unknown>)
      : undefined;
  if (docRec) {
    const line = firstNonEmptyString(
      docRec.clinicAddress,
      docRec.address,
      docRec.location,
      docRec.practiceAddress,
    );
    if (line) return line;
  }

  const ts = detail.timeSlot;
  const tsRec =
    ts && typeof ts === 'object' ? (ts as Record<string, unknown>) : undefined;
  if (tsRec) {
    const line = firstNonEmptyString(
      tsRec.location,
      tsRec.address,
      tsRec.venue,
    );
    if (line) return line;
  }

  const mi = detail.medicalInfo;
  if (mi && typeof mi === 'object') {
    const m = mi as Record<string, unknown>;
    const line = firstNonEmptyString(m.location, m.address, m.visitLocation);
    if (line) return line;
  }

  const callRaw =
    apptRec?.appointmentCallType ??
    apptRec?.callType ??
    apptRec?.call_type;
  const callLower =
    typeof callRaw === 'string' ? callRaw.trim().toLowerCase() : '';
  const isVirtual =
    callLower === 'video' ||
    callLower === 'audio' ||
    callLower === 'phone' ||
    callLower.includes('tele');

  if (isVirtual) {
    return 'Virtual visit';
  }

  return '—';
}

export function buildAppointmentInfoRows(
  detail: PatientAppointmentDetailPayload | undefined,
  fallbackAppointmentId: string | undefined,
): {
  apptId: string;
  service: string;
  apptFor: string;
  callType: string;
  apptDate: string;
  apptTime: string;
  location: string;
} {
  const appt = detail?.appointment;
  const start = detail?.timeSlot?.startDate;
  let apptDate = '—';
  let apptTime = '—';
  if (start) {
    const { date, time } = formatSlot(start);
    apptDate = date;
    apptTime = time;
  }

  const apptId =
    (appt && typeof appt.id === 'string' && appt.id) ||
    fallbackAppointmentId ||
    '—';

  const service = pickService(appt);

  const apptFor = formatAppointmentFor(appt?.appointmentFor);

  const location = pickLocation(detail);

  return {
    apptId,
    service,
    apptFor,
    callType: pickCallType(appt),
    apptDate,
    apptTime,
    location,
  };
}
