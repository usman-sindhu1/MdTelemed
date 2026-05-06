/** Client-side grouping / labels for GET .../timeslots responses (local timezone). */

export type DoctorTimeSlotLite = {
  id: string;
  startDate: string;
  endDate?: string;
  userId?: string;
};

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** True if ISO `startDate` falls on the same calendar day as `day` in local time. */
export function isSlotOnLocalCalendarDay(
  slotStartIso: string,
  day: Date,
): boolean {
  const slot = new Date(slotStartIso);
  if (Number.isNaN(slot.getTime())) return false;
  return (
    startOfLocalDay(slot).getTime() === startOfLocalDay(day).getTime()
  );
}

export function sortSlotsByStartAscending(slots: DoctorTimeSlotLite[]) {
  return [...slots].sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
}

export function slotsForLocalDay(
  slots: DoctorTimeSlotLite[],
  day: Date,
): DoctorTimeSlotLite[] {
  const onDay = slots.filter(
    (s) => s.startDate && isSlotOnLocalCalendarDay(s.startDate, day),
  );
  return sortSlotsByStartAscending(onDay);
}

/** e.g. "8:00 AM – 8:30 AM" in device locale. */
export function formatSlotTimeRange(startIso: string, endIso?: string): string {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return '—';
  const opts: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  const a = start.toLocaleTimeString(undefined, opts);
  if (!endIso) return a;
  const end = new Date(endIso);
  if (Number.isNaN(end.getTime())) return a;
  const b = end.toLocaleTimeString(undefined, opts);
  return `${a} – ${b}`;
}

/** `yyyy-mm-dd` in local time — for quick “has availability” checks. */
export function localDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function buildLocalDayKeysWithSlots(
  slots: DoctorTimeSlotLite[],
): Set<string> {
  const keys = new Set<string>();
  for (const s of slots) {
    if (!s.startDate) continue;
    const t = new Date(s.startDate);
    if (Number.isNaN(t.getTime())) continue;
    keys.add(localDayKey(t));
  }
  return keys;
}
