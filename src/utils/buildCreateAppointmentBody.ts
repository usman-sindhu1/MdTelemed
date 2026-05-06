import type {
  AppointmentCallTypeApi,
  AppointmentForApi,
  AppointmentTypeApi,
  CreateAppointmentRequestBody,
  PatientGenderApi,
  PatientPriorityApi,
  PaymentOptionApi,
} from '../types/createAppointment';

export type BookingFlowMode = 'book_later' | 'see_doctor_now';

export function buildCreateAppointmentBody(params: {
  mode: BookingFlowMode;
  doctorUserId?: string;
  timeSlotId?: string;
  appointmentCallType: AppointmentCallTypeApi;
  patientPriority: PatientPriorityApi;
  paymentOption: PaymentOptionApi;
  appointmentFor: AppointmentForApi;
  patientFirstName: string;
  patientLastName: string;
  patientPhone: string;
  patientGender?: PatientGenderApi;
  patientAge?: number;
  reasonForAppointment: string;
  reports?: CreateAppointmentRequestBody['reports'];
}): CreateAppointmentRequestBody {
  const appointmentType: AppointmentTypeApi =
    params.mode === 'see_doctor_now' ? 'URGENT_CARE' : 'PRIMARY_CARE';

  const body: CreateAppointmentRequestBody = {
    appointmentType,
    appointmentCallType: params.appointmentCallType,
    patientPriority: params.patientPriority,
    paymentOption: params.paymentOption,
    appointmentFor: params.appointmentFor,
    medicalInfo: {
      reasonForAppointment: params.reasonForAppointment.trim(),
    },
  };

  if (appointmentType === 'PRIMARY_CARE') {
    if (params.doctorUserId) {
      body.doctorUserId = params.doctorUserId;
    }
    if (params.timeSlotId) {
      body.timeSlotId = params.timeSlotId;
    }
  }

  if (params.appointmentFor === 'SOMEONE_ELSE') {
    body.patientFirstName = params.patientFirstName.trim();
    body.patientLastName = params.patientLastName.trim();
    body.patientPhone = params.patientPhone.trim();
    if (params.patientGender != null) {
      body.patientGender = params.patientGender;
    }
    if (params.patientAge != null && !Number.isNaN(params.patientAge)) {
      body.patientAge = params.patientAge;
    }
  }

  if (params.reports?.length) {
    body.reports = params.reports;
  }

  return body;
}
