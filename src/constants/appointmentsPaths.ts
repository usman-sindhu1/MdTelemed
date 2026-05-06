/** Top-level appointment booking (Bearer JWT required; patient-only). */

export const appointmentsPaths = {
  /** POST create appointment (+ checkout session when applicable). */
  root: '/api/appointments',
  paymentCheckout: (appointmentId: string) =>
    `/api/appointments/${encodeURIComponent(appointmentId)}/payment/checkout`,
};
