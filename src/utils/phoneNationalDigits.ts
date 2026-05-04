/** Strip leading country calling code digits when the stored value is E.164 (`+<cc><national>`). */
export function nationalDigitsFromStoredPhone(
  stored: string | undefined,
  countryCallingCodeDigits: string,
): string {
  if (!stored) return '';
  const digits = stored.replace(/\D/g, '');
  const cc = countryCallingCodeDigits.replace(/\D/g, '');
  if (stored.trim().startsWith('+') && cc.length > 0 && digits.startsWith(cc)) {
    return digits.slice(cc.length);
  }
  return digits;
}
