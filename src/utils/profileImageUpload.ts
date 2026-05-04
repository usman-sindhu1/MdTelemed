import axios from 'axios';
import { getData } from './storage';
import { API_URL } from '../constants/BaseUrl';
import { filesPaths } from '../constants/patientPaths';

export type UploadUrlResponse = {
  uploadUrl: string;
  fileUrl: string;
  key?: string;
  expiresAt?: string;
};

function guessMimeType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic') || lower.endsWith('.heif')) return 'image/heic';
  return 'image/jpeg';
}

/**
 * PUT file bytes to S3 (or compatible) using RN's XMLHttpRequest file payload.
 * Avoids `fetch(localUri)` which often throws "Network request failed" on Android (content://).
 */
function putFileToPresignedUrl(
  localUri: string,
  uploadUrl: string,
  contentType: string,
  fileName: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      reject(
        new Error(
          xhr.responseText?.slice(0, 120) ||
            `Upload failed (HTTP ${xhr.status}).`,
        ),
      );
    };
    xhr.onerror = () => {
      reject(
        new Error(
          'Could not upload the image. Check your connection and try again.',
        ),
      );
    };
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    // React Native: send local file without reading via fetch(blob)
    xhr.send({
      uri: localUri,
      type: contentType,
      name: fileName,
    } as never);
  });
}

/**
 * Requests a pre-signed URL, uploads the local file bytes, returns persistent `fileUrl` for PATCH profile.
 */
export async function uploadLocalProfileImage(
  localUri: string,
  mimeType?: string,
): Promise<string> {
  const fileType = mimeType ?? guessMimeType(localUri);
  const ext =
    fileType === 'image/png'
      ? 'png'
      : fileType === 'image/webp'
        ? 'webp'
        : 'jpg';
  const fileName = `profile-${Date.now()}.${ext}`;

  const token = await getData<string>('accessToken');
  if (!token) {
    throw new Error('Not signed in.');
  }

  let data: UploadUrlResponse | undefined;
  try {
    const res = await axios.post<{ data?: UploadUrlResponse; message?: string }>(
      `${API_URL}${filesPaths.uploadUrl}`,
      { fileName, fileType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
        validateStatus: (s) => s >= 200 && s < 300,
      },
    );
    data = res.data?.data;
    if (!data?.uploadUrl || !data?.fileUrl) {
      throw new Error('Invalid upload URL response from server.');
    }
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (!e.response) {
        throw new Error(
          'Cannot reach the server to start upload. Check your internet connection.',
        );
      }
      const msg =
        (e.response.data as { message?: string })?.message ||
        `Upload URL request failed (${e.response.status}).`;
      throw new Error(msg);
    }
    throw e;
  }

  await putFileToPresignedUrl(localUri, data.uploadUrl, fileType, fileName);

  return data.fileUrl;
}
