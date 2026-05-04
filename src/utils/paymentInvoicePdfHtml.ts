import type { PatientPaymentDetailPayload } from '../types/patientPayments';
import {
  formatPaymentMoney,
  formatPaymentInvoiceDate,
  formatPaymentServiceLabel,
  patientFullName,
  patientPaymentDoctorName,
} from './paymentDisplay';

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeText(value: unknown): string {
  if (value == null) return '—';
  const s = String(value).trim();
  return s ? escapeHtml(s) : '—';
}

function doctorAddress(
  d: PatientPaymentDetailPayload['doctor'],
): string {
  if (!d?.address || !String(d.address).trim()) return '—';
  return escapeHtml(String(d.address).trim());
}

function patientAddress(
  p: PatientPaymentDetailPayload['patient'],
): string {
  if (!p?.address || !String(p.address).trim()) return '—';
  return escapeHtml(String(p.address).trim());
}

/**
 * Client-side invoice HTML for PDF (matches portal copy; no server PDF).
 */
export function buildPaymentInvoicePdfHtml(
  data: PatientPaymentDetailPayload,
  logoDataUri: string,
): string {
  const { payment, appointment, patient, doctor } = data;
  const service = formatPaymentServiceLabel(appointment?.appointmentType);
  const amountStr = formatPaymentMoney(payment.amount, payment.currency);
  const taxStr = formatPaymentMoney(0, payment.currency);
  const totalStr = amountStr;
  const paidOn = formatPaymentInvoiceDate(payment.createdAt);
  const providerName = patientPaymentDoctorName(doctor, appointment?.doctorUser);
  const providerLoc = doctorAddress(doctor);
  const billToName = patientFullName(patient ?? undefined);
  const billToAddr = patientAddress(patient ?? undefined);

  const logo =
    logoDataUri && logoDataUri.startsWith('data:')
      ? `<img src="${escapeHtml(logoDataUri)}" alt="Md Telemed" style="height:40px;width:auto;" />`
      : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${safeText(payment.id)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #111827; margin: 0; padding: 24px; font-size: 14px; line-height: 1.5; }
    h1 { font-size: 22px; margin: 0 0 8px 0; font-weight: 700; }
    .muted { color: #64748b; font-size: 13px; margin-bottom: 20px; }
    .header-blue { background: #2563eb; color: #fff; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; }
    .header-blue .brand { font-size: 18px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
    .header-blue .row { margin: 6px 0; font-size: 13px; opacity: 0.95; }
    .billto { margin-bottom: 20px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; }
    .billto-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; margin-bottom: 6px; }
    table.line-items { width: 100%; border-collapse: collapse; margin: 16px 0; }
    table.line-items th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #e5e7eb; color: #64748b; font-size: 12px; }
    table.line-items td { padding: 12px 8px; border-bottom: 1px solid #f1f5f9; }
    table.line-items td.num { text-align: right; }
    .totals { margin-top: 16px; text-align: right; }
    .totals div { margin: 4px 0; }
    .grand { font-weight: 700; font-size: 16px; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>Invoice</h1>
  <p class="muted">Here are the details of your invoice.</p>

  <div class="header-blue">
    <div class="brand">${logo}<span>Md Telemed</span></div>
    <div class="row"><strong>Invoice Id:</strong> ${safeText(payment.id)}</div>
    <div class="row"><strong>Date:</strong> ${escapeHtml(paidOn)}</div>
    <div class="row"><strong>Paid To:</strong> ${escapeHtml(providerName)}</div>
    <div class="row"><strong>Location:</strong> ${providerLoc}</div>
  </div>

  <div class="billto">
    <div class="billto-label">Bill to</div>
    <div style="font-weight:700;font-size:15px;">${escapeHtml(billToName)}</div>
    <div style="color:#64748b;margin-top:6px;">${billToAddr}</div>
  </div>

  <table class="line-items">
    <thead>
      <tr>
        <th>#No.</th>
        <th>Service</th>
        <th class="num">Amount</th>
        <th class="num">Tax</th>
        <th class="num">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>01</td>
        <td>${escapeHtml(service)}</td>
        <td class="num">${escapeHtml(amountStr)}</td>
        <td class="num">${escapeHtml(taxStr)}</td>
        <td class="num">${escapeHtml(totalStr)}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div>Sub total: ${escapeHtml(amountStr)}</div>
    <div>Tax: ${escapeHtml(taxStr)}</div>
    <div class="grand">Grand total: ${escapeHtml(totalStr)}</div>
  </div>
</body>
</html>`;
}
