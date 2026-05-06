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
  token: string;
  expiresAt?: string;
}

