export const AGORA_API_PREFIX = '/api/agora';

export const agoraPaths = {
  token: `${AGORA_API_PREFIX}/token`,
  tokenStatus: (appointmentId: string) =>
    `${AGORA_API_PREFIX}/appointments/${encodeURIComponent(appointmentId)}/token`,
};

