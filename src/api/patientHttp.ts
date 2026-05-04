import axios from 'axios';
import { API_URL } from '../constants/BaseUrl';
import { getData } from '../utils/storage';

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function patientGetData<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
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
}

export async function patientPatchJson<T, B = unknown>(
  path: string,
  body: B,
): Promise<T> {
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
}

export async function authorizedPostJson<T, B = unknown>(
  path: string,
  body: B,
): Promise<T> {
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
}
