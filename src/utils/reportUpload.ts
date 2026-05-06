import axios from 'axios';
import { API_URL } from '../constants/BaseUrl';
import { filesPaths } from '../constants/patientPaths';
import { getData } from './storage';
import { S3_SSE_PUT_HEADERS } from '../lib/s3-upload-headers';

export type UploadUrlResponse = {
  uploadUrl: string;
  fileUrl: string;
  key?: string;
  expiresAt?: string;
};

export type PickedLocalFile = {
  uri: string;
  name: string;
  type: string;
  sizeBytes?: number;
};

function putFileToPresignedUrl(
  localUri: string,
  uploadUrl: string,
  contentType: string,
  fileName: string,
  contentLengthBytes: number,
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
          xhr.responseText?.slice(0, 160) ||
            `Upload failed (HTTP ${xhr.status}).`,
        ),
      );
    };
    xhr.onerror = () => {
      reject(new Error('Upload failed. Check your connection and try again.'));
    };
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('x-amz-server-side-encryption', S3_SSE_PUT_HEADERS['x-amz-server-side-encryption']);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.setRequestHeader('Content-Length', String(contentLengthBytes));
    xhr.send({ uri: localUri, type: contentType, name: fileName } as never);
  });
}

export async function uploadPickedReportFile(
  picked: PickedLocalFile,
): Promise<{ fileUrl: string }> {
  const token = await getData<string>('accessToken');
  if (!token?.trim()) {
    throw new Error('Not signed in.');
  }

  const fileName = picked.name || `report-${Date.now()}`;
  const fileType = picked.type || 'application/octet-stream';
  const fileSizeBytes = picked.sizeBytes;
  if (!Number.isFinite(fileSizeBytes) || (fileSizeBytes ?? 0) <= 0) {
    throw new Error('Invalid file size. Please pick the file again.');
  }
  if ((fileSizeBytes ?? 0) > 25 * 1024 * 1024) {
    throw new Error('This file is too large. Maximum upload size is 25 MB.');
  }

  const payload: Record<string, unknown> = {
    fileName,
    fileType,
    fileSizeBytes,
  };

  const res = await axios.post<{ data?: UploadUrlResponse; message?: string }>(
    `${API_URL}${filesPaths.uploadUrl}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 60_000,
      validateStatus: (s) => s >= 200 && s < 300,
    },
  );

  const data = res.data?.data;
  if (!data?.uploadUrl || !data?.fileUrl) {
    throw new Error(res.data?.message || 'Invalid upload URL response.');
  }

  await putFileToPresignedUrl(
    picked.uri,
    data.uploadUrl,
    fileType,
    fileName,
    fileSizeBytes as number,
  );

  return { fileUrl: data.fileUrl };
}

