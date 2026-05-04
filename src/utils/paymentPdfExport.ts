import type { PatientPaymentDetailPayload } from '../types/patientPayments';
import { buildPaymentInvoicePdfHtml } from './paymentInvoicePdfHtml';
import { saveHtmlAsDevicePdf } from './htmlToDevicePdf';

function safeFileName(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
  return cleaned || 'invoice';
}

export async function generateAndSharePaymentInvoicePdf(
  detail: PatientPaymentDetailPayload,
  paymentId: string,
): Promise<string> {
  const { PRESCRIPTION_PDF_LOGO_DATA_URI } = await import(
    './prescriptionPdfLogoDataUri'
  );
  const html = buildPaymentInvoicePdfHtml(detail, PRESCRIPTION_PDF_LOGO_DATA_URI);
  const baseName = `MDTelemed_Invoice_${safeFileName(paymentId)}`;
  const pdfFileName = `${baseName}.pdf`;

  return saveHtmlAsDevicePdf(html, baseName, pdfFileName, {
    title: 'Invoice saved',
    detailAndroid: 'Open Files → Downloads → MDTelemed',
    detailIos: 'Open the Files app to view or share your PDF.',
  });
}
