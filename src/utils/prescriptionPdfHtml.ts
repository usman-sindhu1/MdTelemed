import type { PatientPrescriptionDetailPayload } from '../types/patientPrescriptions';
import {
  formatDoctorNameDetail,
  buildMedicineScheduleLine,
} from './prescriptionDisplay';

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

function patientFullName(patient: Record<string, unknown> | undefined): string {
  if (!patient) return '—';
  const fn = String(patient.firstName ?? '').trim();
  const ln = String(patient.lastName ?? '').trim();
  const full = [fn, ln].filter(Boolean).join(' ');
  return full ? escapeHtml(full) : '—';
}

function patientLocation(patient: Record<string, unknown> | undefined): string {
  if (!patient) return '—';
  const keys = [
    'address',
    'homeAddress',
    'location',
    'streetAddress',
    'city',
  ] as const;
  for (const k of keys) {
    const v = patient[k];
    if (typeof v === 'string' && v.trim()) return escapeHtml(v.trim());
  }
  return '—';
}

function practitionerAddress(
  doctor: PatientPrescriptionDetailPayload['doctor'],
): string {
  if (!doctor || typeof doctor !== 'object') return '—';
  const d = doctor as Record<string, unknown>;
  const raw =
    d.clinicAddress ??
    d.address ??
    d.practiceAddress ??
    d.practitionerAddress;
  if (typeof raw === 'string' && raw.trim()) return escapeHtml(raw.trim());
  return '—';
}

/**
 * Printable HTML for MD Telemed–style prescription (client-side PDF).
 * @param logoDataUri Optional data URI for header logo (from `prescriptionPdfLogoDataUri`).
 */
export function buildPrescriptionPdfHtml(
  detail: PatientPrescriptionDetailPayload,
  logoDataUri?: string,
): string {
  const prescription = detail.prescription;
  const medicines = detail.medicines ?? [];
  const patient = detail.patient as Record<string, unknown> | undefined;
  const doctor = detail.doctor;

  const patientName = patientFullName(patient);
  const doctorPlain = doctor
    ? [doctor.firstName?.trim(), doctor.lastName?.trim()].filter(Boolean).join(' ')
    : '';
  const doctorName = escapeHtml(doctorPlain || '—');
  const doctorDisplay = escapeHtml(formatDoctorNameDetail(doctor ?? undefined));

  const doctorPhoneRaw =
    doctor?.phone && String(doctor.phone).trim()
      ? String(doctor.phone).trim()
      : '';
  const headerPhone = doctorPhoneRaw || '—';

  const locationLine = patientLocation(patient);
  const practPhone = doctorPhoneRaw ? escapeHtml(doctorPhoneRaw) : '—';
  const practAddr = practitionerAddress(doctor);

  const advise = prescription?.advise && String(prescription.advise).trim()
    ? escapeHtml(String(prescription.advise).trim())
    : '—';

  const rowsHtml = medicines.length
    ? medicines
        .map((m, idx) => {
          const no = String(idx + 1).padStart(2, '0');
          const item = safeText(m.name ?? '—');
          const form = safeText(m.medicineType ?? '—');
          const directions = escapeHtml(
            [
              m.dosage ? String(m.dosage) : '',
              buildMedicineScheduleLine(m),
            ]
              .filter(Boolean)
              .join(' · ') || '—',
          );
          const qty = safeText(m.units ?? m.duration ?? '—');
          return `<tr>
            <td>${no}</td>
            <td>${item}</td>
            <td>${form}</td>
            <td>${directions}</td>
            <td>${qty}</td>
          </tr>`;
        })
        .join('')
    : `<tr><td colspan="5" style="text-align:center;color:#64748b;">No medicines listed</td></tr>`;

  const generatedAt = escapeHtml(
    new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
  );

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
    .field strong { color: #64748b; font-weight: 600; display: inline-block; min-width: 140px; }
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
      <h1>MD Telemed Prescription</h1>
    </div>
    <div class="header-row"><strong>Patient:</strong> ${patientName}</div>
    <div class="header-row"><strong>Doctor:</strong> ${doctorName}</div>
    <div class="header-row"><strong>Phone:</strong> ${escapeHtml(headerPhone)}</div>
  </div>

  <h2>Patient &amp; Practitioner Details</h2>
  <div class="card">
    <div class="field"><strong>Patient location</strong> ${locationLine}</div>
    <div class="field"><strong>Practitioner phone</strong> ${practPhone}</div>
    <div class="field"><strong>Practitioner address</strong> ${practAddr}</div>
    <div class="field"><strong>Prescribing physician</strong> ${doctorDisplay}</div>
  </div>

  <h2>Medicines</h2>
  <table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Item</th>
        <th>Form</th>
        <th>Directions</th>
        <th>Qty</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <h2>Additional Information</h2>
  <div class="card">
    <div class="field">${advise}</div>
  </div>

  <p class="footer-note">Generated: ${generatedAt}</p>
</body>
</html>`;
}
