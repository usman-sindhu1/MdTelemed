import type { PatientPrescriptionDetailPayload } from '../types/patientPrescriptions';
import { buildPrescriptionPdfHtml } from './prescriptionPdfHtml';
import { saveHtmlAsDevicePdf } from './htmlToDevicePdf';

function safeFileName(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  return cleaned || 'prescription';
}

/**
 * Renders HTML → PDF, then saves it on the device:
 * - Android: copies into the public Downloads collection (Files → Downloads → MDTelemed).
 * - iOS: leaves the file in app Documents (visible via Files app → On My iPhone → app).
 */
export async function generateAndSharePrescriptionPdf(
  detail: PatientPrescriptionDetailPayload,
  prescriptionId: string,
): Promise<string> {
  const { PRESCRIPTION_PDF_LOGO_DATA_URI } = await import(
    './prescriptionPdfLogoDataUri'
  );
  const html = buildPrescriptionPdfHtml(detail, PRESCRIPTION_PDF_LOGO_DATA_URI);
  const baseName = `MDTelemed_Prescription_${safeFileName(prescriptionId)}`;
  const pdfFileName = `${baseName}.pdf`;

  return saveHtmlAsDevicePdf(html, baseName, pdfFileName, {
    title: 'Prescription saved',
    detailAndroid: 'Open Files → Downloads → MDTelemed',
    detailIos: 'Open the Files app to view or share your PDF.',
  });
}
