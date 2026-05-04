/** Patient portal — authenticated as `PATIENT` (Bearer JWT). */
export const PATIENT_API_PREFIX = '/api/patient';

export const patientPaths = {
  me: `${PATIENT_API_PREFIX}/me`,
  appointments: `${PATIENT_API_PREFIX}/appointments`,
  appointmentById: (id: string) =>
    `${PATIENT_API_PREFIX}/appointments/${encodeURIComponent(id)}`,
  therapistById: (doctorId: string) =>
    `${PATIENT_API_PREFIX}/therapists/${encodeURIComponent(doctorId)}`,
  reviews: `${PATIENT_API_PREFIX}/reviews`,
  ratingById: (ratingId: string) =>
    `${PATIENT_API_PREFIX}/ratings/${encodeURIComponent(ratingId)}`,
  prescriptions: `${PATIENT_API_PREFIX}/prescriptions`,
  prescriptionById: (id: string) =>
    `${PATIENT_API_PREFIX}/prescriptions/${encodeURIComponent(id)}`,
  payments: `${PATIENT_API_PREFIX}/payments`,
  paymentById: (id: string) =>
    `${PATIENT_API_PREFIX}/payments/${encodeURIComponent(id)}`,
  medicalHistory: `${PATIENT_API_PREFIX}/medical-history`,
};

export const filesPaths = {
  uploadUrl: '/api/files/upload-url',
};
