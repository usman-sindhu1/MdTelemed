import { authorizedPostJson } from './patientHttp';
import { agoraPaths } from '../constants/agoraPaths';
import type { AgoraTokenRequestBody, AgoraTokenResponse } from '../types/agora';

export async function createAgoraToken(body: AgoraTokenRequestBody) {
  return authorizedPostJson<AgoraTokenResponse, AgoraTokenRequestBody>(
    agoraPaths.token,
    body,
  );
}

