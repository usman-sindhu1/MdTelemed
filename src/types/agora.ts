export type AgoraRole = 'PUBLISHER' | 'SUBSCRIBER';

export interface AgoraTokenRequestBody {
  appointmentId: string;
  channelName?: string;
  uid?: string;
  role?: AgoraRole;
  expireSeconds?: number;
}

export interface AgoraTokenResponse {
  appointmentId?: string;
  channelName?: string;
  uid?: string;
  role?: AgoraRole | string;
  /**
   * Optional: backend may choose to return Agora App ID to avoid hardcoding it
   * in the mobile client. Client should still treat it as non-secret.
   */
  appId?: string;
  token: string;
  expiresAt?: string;
}

