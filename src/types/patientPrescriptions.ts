/** Patient prescriptions API (`GET /api/patient/prescriptions`, `GET …/prescriptions/{id}`). */

export interface PatientPrescriptionDoctorUser {
  firstName?: string;
  lastName?: string;
  image?: string | null;
}

export interface PatientPrescriptionListAppointment {
  appointmentType?: string;
  appointmentFor?: string;
  doctorUser?: PatientPrescriptionDoctorUser | null;
}

export interface PatientPrescriptionMedicine {
  id?: string;
  medicineType?: string | null;
  name?: string;
  dosage?: string | null;
  duration?: string | null;
  units?: string | null;
  takenBefore?: string | null;
  takenTime?: string | null;
}

/** Flat list row from `GET /api/patient/prescriptions` → `items[]`. */
export interface PatientPrescriptionListItem {
  id: string;
  title?: string;
  advise?: string | null;
  appointmentId?: string;
  createdAt?: string;
  visibleToPatient?: boolean;
  medicines?: PatientPrescriptionMedicine[];
  appointment?: PatientPrescriptionListAppointment | null;
}

export interface PatientPrescriptionsListPayload {
  items: PatientPrescriptionListItem[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface PatientPrescriptionDetailRow {
  id?: string;
  title?: string;
  advise?: string | null;
  createdAt?: string;
  appointmentId?: string;
}

export interface PatientPrescriptionDetailPayload {
  prescription?: PatientPrescriptionDetailRow | null;
  medicines?: PatientPrescriptionMedicine[];
  appointment?: PatientPrescriptionListAppointment | null;
  patient?: Record<string, unknown>;
  doctor?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    image?: string | null;
  } | null;
  timeSlot?: { startDate?: string };
  medicalInfo?: unknown;
  reports?: unknown[];
}
