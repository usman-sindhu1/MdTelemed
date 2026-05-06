import axios from 'axios';
import { API_URL } from '../constants/BaseUrl';
import { getData } from '../utils/storage';

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

function mapAxiosError(err: unknown): Error {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error ? err : new Error('Request failed');
  }

  const status = err.response?.status;
  const data = err.response?.data as unknown;
  const messageFromEnvelope =
    data && typeof data === 'object' && 'message' in data
      ? String((data as { message?: unknown }).message ?? '')
      : '';
  const messageFromRaw =
    !messageFromEnvelope.trim() && typeof data === 'string' ? data : '';
  const messageFromJson =
    !messageFromEnvelope.trim() &&
    !messageFromRaw.trim() &&
    data &&
    typeof data === 'object'
      ? (() => {
          try {
            return JSON.stringify(data);
          } catch {
            return '';
          }
        })()
      : '';
  const messageFromAxios = typeof err.message === 'string' ? err.message : '';

  const base =
    messageFromEnvelope.trim() ||
    messageFromRaw.trim() ||
    messageFromJson.trim() ||
    (status === 401 ? 'Unauthorized (please sign in again).' : '') ||
    (status === 403 ? 'Forbidden.' : '') ||
    (status === 404 ? 'Not found.' : '') ||
    messageFromAxios ||
    'Request failed';

  return new Error(status ? `${base} (HTTP ${status})` : base);
}

export async function patientGetData<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  try {
    const token = await getData<string>('accessToken');
    const { data } = await axios.get<ApiEnvelope<T>>(`${API_URL}${path}`, {
      params,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      timeout: 30_000,
    });

    if (!data.success) {
      throw new Error(data.message || 'Request failed');
    }

    return data.data;
  } catch (err: unknown) {
    throw mapAxiosError(err);
  }
}

export async function patientPatchJson<T, B = unknown>(
  path: string,
  body: B,
): Promise<T> {
  try {
    const token = await getData<string>('accessToken');
    const { data } = await axios.patch<ApiEnvelope<T>>(`${API_URL}${path}`, body, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      timeout: 30_000,
    });

    if (!data.success) {
      throw new Error(data.message || 'Request failed');
    }

    return data.data;
  } catch (err: unknown) {
    throw mapAxiosError(err);
  }
}

export async function authorizedPostJson<T, B = unknown>(
  path: string,
  body: B,
): Promise<T> {
  try {
    const token = await getData<string>('accessToken');
    const { data } = await axios.post<ApiEnvelope<T>>(`${API_URL}${path}`, body, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      timeout: 30_000,
    });

    if (!data.success) {
      throw new Error(data.message || 'Request failed');
    }

    return data.data;
  } catch (err: unknown) {
    throw mapAxiosError(err);
  }
}
