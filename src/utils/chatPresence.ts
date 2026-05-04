/**
 * Parse `GET …/online-users` payload — shape may vary by backend.
 */
export function isDoctorUserOnline(
  onlinePayload: unknown,
  doctorUserId: string | undefined,
): boolean {
  if (!doctorUserId || onlinePayload == null) return false;
  if (typeof onlinePayload !== 'object') return false;
  const root = onlinePayload as Record<string, unknown>;
  const list =
    root.users ??
    root.onlineUsers ??
    root.data ??
    (Array.isArray(onlinePayload) ? onlinePayload : null);
  if (!Array.isArray(list)) return false;
  return list.some((row: unknown) => {
    if (!row || typeof row !== 'object') return false;
    const r = row as Record<string, unknown>;
    const uid = r.userId ?? r.id ?? r.user_id;
    return typeof uid === 'string' && uid === doctorUserId;
  });
}
