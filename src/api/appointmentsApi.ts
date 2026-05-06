import { authorizedPostJson } from './patientHttp';
import { appointmentsPaths } from '../constants/appointmentsPaths';
import type {
  CreateAppointmentRequestBody,
  CreateAppointmentResponseData,
} from '../types/createAppointment';

export function postCreateAppointment(body: CreateAppointmentRequestBody) {
  return authorizedPostJson<
    CreateAppointmentResponseData,
    CreateAppointmentRequestBody
  >(appointmentsPaths.root, body);
}
