export type AppointmentTypeApi = 'URGENT_CARE' | 'PRIMARY_CARE';
export type AppointmentCallTypeApi = 'CHAT' | 'AUDIO' | 'VIDEO';
export type PatientPriorityApi = 'LOW' | 'MEDIUM' | 'HIGH';
export type PaymentOptionApi = 'SINGLE_APPOINTMENT' | 'SUBSCRIPTION';
export type AppointmentForApi = 'ME' | 'SOMEONE_ELSE';
/** Align with common backend enums; extend if API differs. */
export type PatientGenderApi = 'MALE' | 'FEMALE' | 'OTHER';

export type CreateAppointmentRequestBody = {
  appointmentType: AppointmentTypeApi;
  /** PRIMARY_CARE (Book Later): required together with `timeSlotId`. */
  doctorUserId?: string;
  timeSlotId?: string;
  appointmentCallType: AppointmentCallTypeApi;
  patientPriority: PatientPriorityApi;
  paymentOption: PaymentOptionApi;
  appointmentFor: AppointmentForApi;
  /** Required when `appointmentFor === 'SOMEONE_ELSE'`. */
  patientFirstName?: string;
  patientLastName?: string;
  patientPhone?: string;
  patientGender?: PatientGenderApi;
  patientAge?: number;
  medicalInfo?: { reasonForAppointment: string };
  reports?: Array<{
    title: string;
    description?: string;
    fileUrl: string;
  }>;
};

export type CheckoutSessionApi = {
  checkoutSessionId?: string;
  checkoutSessionUrl?: string | null;
  amount?: number;
  currency?: string;
};

/** `POST /api/appointments` success — `data` envelope content. */
export type CreateAppointmentResponseData = {
  appointment?: Record<string, unknown>;
  checkoutSession?: CheckoutSessionApi | null;
};

/** Loosely typed subscription payload — map fields defensively in UI. */
export type PatientSubscriptionApi = {
  hasSubscription?: boolean;
  hasUsableSubscription?: boolean;
  remainingAppointments?: number | null;
  /** Other keys allowed per backend. */
  [key: string]: unknown;
};
