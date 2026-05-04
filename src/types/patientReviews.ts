/**
 * Patient reviews — `GET /api/patient/reviews`, `GET /api/patient/ratings/{id}`.
 */

import type { PatientPaymentDoctorLike } from './patientPayments';

export interface PatientRatingEntity {
  id: string;
  appointmentId?: string | null;
  score: number;
  comment?: string | null;
  createdAt: string;
}

export interface PatientRatingAppointment {
  appointmentType?: string;
  appointmentCallType?: string;
  doctorUser?: PatientPaymentDoctorLike | null;
}

/** One row from list or detail payload. */
export interface PatientRatingRow {
  rating: PatientRatingEntity;
  appointment?: PatientRatingAppointment | null;
  doctor?: PatientPaymentDoctorLike | null;
  patient?: unknown;
}

export interface PatientReviewsListPayload {
  items: PatientRatingRow[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
