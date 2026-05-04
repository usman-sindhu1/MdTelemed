/** `GET /api/patient/medical-history` — full medical history + report files. */

export interface PatientMedicalInfo {
  id: string;
  userId?: string;
  reasonForAppointment?: string | null;
}

export interface PatientMedicalReport {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  createdAt: string;
  userId?: string;
  appointmentId?: string | null;
}

export interface PatientMedicalHistoryPayload {
  medicalInfo: PatientMedicalInfo | null;
  reports: PatientMedicalReport[];
}
