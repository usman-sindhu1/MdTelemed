import { patientGetData, patientPatchJson } from './patientHttp';
import { patientPaths } from '../constants/patientPaths';
import type { PatientNotification } from '../types/notifications';

export function getPatientNotifications() {
  return patientGetData<PatientNotification[]>(patientPaths.notifications);
}

export function markNotificationRead(id: string) {
  return patientPatchJson<PatientNotification, Record<string, never>>(
    patientPaths.notificationReadById(id),
    {},
  );
}

export function markAllNotificationsRead() {
  return patientPatchJson<{ updatedCount: number }, Record<string, never>>(
    patientPaths.notificationsReadAll,
    {},
  );
}

