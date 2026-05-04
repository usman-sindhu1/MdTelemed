import type { PatientAppointmentDetailPayload } from '../types/patientAppointments';
import { buildAppointmentInfoRows } from './appointmentDetailDisplay';

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

function patientLine(detail: PatientAppointmentDetailPayload): string {
  const p = detail.patient;
  if (!p) return '—';
  const fn = p.firstName?.trim() ?? '';
  const ln = p.lastName?.trim() ?? '';
  const full = [fn, ln].filter(Boolean).join(' ');
  return full ? escapeHtml(full) : '—';
}

function doctorLine(detail: PatientAppointmentDetailPayload): string {
  const d = detail.doctor;
  if (!d) return '—';
  const full = [d.firstName?.trim(), d.lastName?.trim()]
    .filter(Boolean)
    .join(' ');
  return full ? escapeHtml(full) : '—';
}

/**
 * Printable HTML for MD Telemed–style appointment summary (client-side PDF).
 */
export function buildAppointmentPdfHtml(
  detail: PatientAppointmentDetailPayload,
  appointmentId: string,
  logoDataUri?: string,
): string {
  const rows = buildAppointmentInfoRows(detail, appointmentId);
  const status = detail.appointment?.status
    ? escapeHtml(String(detail.appointment.status).trim())
    : '—';
  const patientName = patientLine(detail);
  const doctorName = doctorLine(detail);
  const doctorEmail =
    detail.doctor?.email && String(detail.doctor.email).trim()
      ? escapeHtml(String(detail.doctor.email).trim())
      : '—';

  const presc = detail.prescription;
  const adviseRaw = presc
    ? (presc as { advise?: string; advice?: string }).advise ??
      (presc as { advice?: string }).advice
    : undefined;
  const advise =
    typeof adviseRaw === 'string' && adviseRaw.trim()
      ? escapeHtml(adviseRaw.trim())
      : '';

  const medicines = detail.medicines ?? [];
  const medRows =
    medicines.length > 0
      ? medicines
          .map((m, idx) => {
            const n = String(idx + 1).padStart(2, '0');
            return `<tr>
            <td>${n}</td>
            <td>${safeText(m.name)}</td>
            <td>${safeText(m.dosage)}</td>
            <td>${safeText(m.frequency)}</td>
            <td>${safeText(m.duration)}</td>
          </tr>`;
          })
          .join('')
      : `<tr><td colspan="5" style="text-align:center;color:#64748b;">No medicines listed</td></tr>`;

  const prescTitle =
    presc && typeof (presc as { title?: string }).title === 'string'
      ? escapeHtml(String((presc as { title?: string }).title).trim())
      : '';

  const generatedAt = escapeHtml(
    new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
  );

  const showPrescriptionBlock =
    Boolean(prescTitle || advise || medicines.length > 0);
  let prescriptionSectionHtml = '';
  if (showPrescriptionBlock) {
    prescriptionSectionHtml += '<h2>Prescription summary</h2>';
    if (prescTitle || advise) {
      prescriptionSectionHtml += '<div class="card">';
      if (prescTitle) {
        prescriptionSectionHtml += `<div class="field"><strong>Title</strong> ${prescTitle}</div>`;
      }
      if (advise) {
        prescriptionSectionHtml += `<div class="field"><strong>Instructions</strong> ${advise}</div>`;
      }
      prescriptionSectionHtml += '</div>';
    }
    if (medicines.length > 0) {
      prescriptionSectionHtml += `<table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Medicine</th>
        <th>Dosage</th>
        <th>Frequency</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody>${medRows}</tbody>
  </table>`;
    }
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 11px;
      color: #0f172a;
      margin: 0;
      padding: 20px;
      line-height: 1.45;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      border-radius: 12px;
      padding: 20px 22px;
      margin-bottom: 18px;
    }
    .header-brand {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
    }
    .header-logo {
      width: 56px;
      height: 56px;
      object-fit: contain;
      flex-shrink: 0;
    }
    .header h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.02em;
      flex: 1;
    }
    .header-row { margin: 4px 0; font-size: 12px; opacity: 0.95; }
    .header-row strong { font-weight: 600; margin-right: 6px; }
    h2 {
      font-size: 13px;
      font-weight: 700;
      margin: 16px 0 10px 0;
      color: #0f172a;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;
      background: #ffffff;
      margin-bottom: 14px;
    }
    .field { margin: 6px 0; font-size: 11px; }
    .field strong { color: #64748b; font-weight: 600; display: inline-block; min-width: 120px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
    }
    th {
      background: #f1f5f9;
      text-align: left;
      padding: 8px 6px;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 700;
      color: #334155;
    }
    td {
      padding: 8px 6px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
    }
    tr:last-child td { border-bottom: none; }
    .footer-note {
      margin-top: 18px;
      font-size: 10px;
      color: #94a3b8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-brand">
      ${
        logoDataUri
          ? `<img class="header-logo" src="${logoDataUri}" alt="" />`
          : ''
      }
      <h1>MD Telemed Appointment</h1>
    </div>
    <div class="header-row"><strong>Patient:</strong> ${patientName}</div>
    <div class="header-row"><strong>Doctor:</strong> ${doctorName}</div>
    <div class="header-row"><strong>Status:</strong> ${status}</div>
  </div>

  <h2>Appointment details</h2>
  <div class="card">
    <div class="field"><strong>Appointment ID</strong> ${escapeHtml(rows.apptId)}</div>
    <div class="field"><strong>Service</strong> ${escapeHtml(rows.service)}</div>
    <div class="field"><strong>Appointment for</strong> ${escapeHtml(rows.apptFor)}</div>
    <div class="field"><strong>Call type</strong> ${escapeHtml(rows.callType)}</div>
    <div class="field"><strong>Date</strong> ${escapeHtml(rows.apptDate)}</div>
    <div class="field"><strong>Time</strong> ${escapeHtml(rows.apptTime)}</div>
    <div class="field"><strong>Location</strong> ${escapeHtml(rows.location)}</div>
  </div>

  <h2>Doctor contact</h2>
  <div class="card">
    <div class="field"><strong>Name</strong> ${doctorName}</div>
    <div class="field"><strong>Email</strong> ${doctorEmail}</div>
  </div>

  ${prescriptionSectionHtml}

  <p class="footer-note">Generated: ${generatedAt}</p>
</body>
</html>`;
}
