export type AppointmentApiStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'MISSED'
  | 'CANCELLED';

export interface PatientAppointmentDoctorSummary {
  id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string | null;
}

export interface PatientAppointmentListItem {
  id: string;
  doctor: PatientAppointmentDoctorSummary | null;
  status: AppointmentApiStatus;
}

export interface PatientAppointmentsListPayload {
  items: PatientAppointmentListItem[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

/** Shape returned by `GET /api/patient/appointments/{id}` (fields vary by backend). */
export interface PatientAppointmentDetailAppointment {
  id?: string;
  status?: string;
  service?: string;
  /** Visit type label from API (e.g. Primary Care). */
  appointmentType?: string;
  appointmentCallType?: string;
  callType?: string;
  appointmentFor?: string;
  location?: string;
  reason?: string;
  amount?: number;
}

/** Single prescription object on appointment detail (`data.prescription`). */
export interface PatientAppointmentPrescription {
  id?: string;
  title?: string;
  advise?: string;
  advice?: string;
  [key: string]: unknown;
}

export interface PatientAppointmentMedicine {
  name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  [key: string]: unknown;
}

export interface PatientAppointmentDetailPayload {
  appointment?: PatientAppointmentDetailAppointment;
  doctor?: PatientAppointmentDoctorSummary;
  patient?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  timeSlot?: {
    id?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
  };
  medicalInfo?: unknown;
  reports?: unknown[];
  payments?: unknown[];
  /** Existing rating — hide Leave Review when set. */
  rating?: unknown;
  prescription?: PatientAppointmentPrescription | null;
  medicines?: PatientAppointmentMedicine[];
  /** Legacy/alternate field name */
  prescriptions?: unknown[];
}
