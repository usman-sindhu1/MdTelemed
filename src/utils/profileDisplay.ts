/**
 * Display helpers for patient session / profile (Redux `auth.user`).
 */

export function getUserDisplayName(
  u: Record<string, unknown> | null | undefined,
): string {
  if (!u || typeof u !== 'object') {
    return 'User';
  }
  const fn = typeof u.firstName === 'string' ? u.firstName.trim() : '';
  const ln = typeof u.lastName === 'string' ? u.lastName.trim() : '';
  const combined = `${fn} ${ln}`.trim();
  if (combined) return combined;
  if (typeof u.name === 'string' && u.name.trim()) {
    return u.name.trim();
  }
  if (typeof u.email === 'string' && u.email.includes('@')) {
    return u.email.split('@')[0] ?? 'User';
  }
  return 'User';
}

export function getUserAvatarUri(
  u: Record<string, unknown> | null | undefined,
): string | null {
  if (!u || typeof u !== 'object') {
    return null;
  }
  const uri =
    typeof u.image === 'string'
      ? u.image
      : typeof u.avatar === 'string'
        ? u.avatar
        : typeof u.profilePhoto === 'string'
          ? u.profilePhoto
          : typeof u.photo === 'string'
            ? u.photo
            : null;
  if (uri && (uri.startsWith('http://') || uri.startsWith('https://'))) {
    return uri;
  }
  return null;
}

export function getUserEmail(
  u: Record<string, unknown> | null | undefined,
): string {
  if (u && typeof u === 'object' && typeof u.email === 'string') {
    return u.email;
  }
  return '';
}

export function getSavedAddress(
  u: Record<string, unknown> | null | undefined,
): string {
  if (!u || typeof u !== 'object') return '';
  const a = u.address;
  return typeof a === 'string' && a.trim() ? a.trim() : '';
}
