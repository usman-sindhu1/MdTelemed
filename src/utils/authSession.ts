import { storeData, removeData, getData } from './storage';

const AUTH_USER_KEY = 'authUser';

export function sanitizeUser<T extends Record<string, unknown>>(user: T | null | undefined) {
  if (!user || typeof user !== 'object') {
    return null;
  }
  const { password: _p, ...rest } = user;
  return rest;
}

export async function persistAuthToken(token: string) {
  await storeData('accessToken', token);
}

/** Persist profile for cold-start session restore (never store password). */
export async function persistAuthUser(user: Record<string, unknown> | null | undefined) {
  if (!user || typeof user !== 'object') {
    return;
  }
  const clean = sanitizeUser(user);
  if (clean && Object.keys(clean).length > 0) {
    await storeData(AUTH_USER_KEY, clean);
  }
}

export async function clearAuthSession() {
  await removeData('accessToken');
  await removeData(AUTH_USER_KEY);
}

export async function getStoredAuthSnapshot(): Promise<{
  token: string | null;
  user: Record<string, unknown> | null;
}> {
  const token = await getData<string>('accessToken');
  const user = await getData<Record<string, unknown>>(AUTH_USER_KEY);
  return {
    token: token ?? null,
    user: user && typeof user === 'object' ? user : null,
  };
}

const ONBOARDING_KEY = 'hasCompletedOnboarding';

export async function markOnboardingComplete(): Promise<void> {
  await storeData(ONBOARDING_KEY, true);
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const v = await getData<boolean>(ONBOARDING_KEY);
  return v === true;
}

export function getDeviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}
