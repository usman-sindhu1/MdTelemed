import type { PatientAppointmentDetailPayload } from '../types/patientAppointments';
import { buildAppointmentPdfHtml } from './appointmentPdfHtml';
import { saveHtmlAsDevicePdf } from './htmlToDevicePdf';

function safeFileName(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  return cleaned || 'appointment';
}

/**
 * Renders appointment HTML → PDF and saves to device (same flow as prescription PDF).
 */
export async function generateAndSaveAppointmentPdf(
  detail: PatientAppointmentDetailPayload,
  appointmentId: string,
): Promise<string> {
  const { PRESCRIPTION_PDF_LOGO_DATA_URI } = await import(
    './prescriptionPdfLogoDataUri'
  );
  const html = buildAppointmentPdfHtml(
    detail,
    appointmentId,
    PRESCRIPTION_PDF_LOGO_DATA_URI,
  );
  const baseName = `MDTelemed_Appointment_${safeFileName(appointmentId)}`;
  const pdfFileName = `${baseName}.pdf`;

  return saveHtmlAsDevicePdf(html, baseName, pdfFileName, {
    title: 'Appointment saved',
    detailAndroid: 'Open Files → Downloads → MDTelemed',
    detailIos: 'Open the Files app to view or share your PDF.',
  });
}
