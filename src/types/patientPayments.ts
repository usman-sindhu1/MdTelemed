/** Patient payments API (`GET /api/patient/payments`, `GET …/payments/{id}`). */

export type PatientPaymentStatus =
  | 'PAID'
  | 'PENDING'
  | 'CANCELLED'
  | 'REFUNDED';

export interface PatientPaymentDoctorLike {
  id?: string;
  firstName?: string;
  lastName?: string;
  image?: string | null;
  address?: string | null;
  email?: string | null;
}

export interface PatientPaymentRowPayment {
  id: string;
  userId?: string;
  appointmentId?: string | null;
  amount: number;
  currency: string;
  status: PatientPaymentStatus;
  createdAt: string;
  stripePaymentId?: string | null;
  stripeIntentId?: string | null;
  paymentType?: string;
  patientSubscriptionId?: string | null;
  appointmentsLeft?: number | null;
}

export interface PatientPaymentRowAppointment {
  id?: string;
  appointmentType?: string;
  fixedFee?: number;
  doctorUser?: PatientPaymentDoctorLike | null;
}

/** One list row from `GET /api/patient/payments` → `items[]`. */
export interface PatientPaymentListRow {
  payment: PatientPaymentRowPayment;
  appointment?: PatientPaymentRowAppointment | null;
  doctor?: PatientPaymentDoctorLike | null;
}

export interface PatientPaymentsListPayload {
  items: PatientPaymentListRow[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface PatientPaymentDetailPatient {
  id?: string;
  firstName?: string;
  lastName?: string;
  address?: string | null;
  email?: string | null;
}

/** Payload from `GET /api/patient/payments/{id}`. */
export interface PatientPaymentDetailPayload {
  payment: PatientPaymentRowPayment;
  appointment?: PatientPaymentRowAppointment | null;
  patient?: PatientPaymentDetailPatient | null;
  doctor?: PatientPaymentDoctorLike | null;
}
