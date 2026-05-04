import type {
  PublicDoctorProfile,
  PublicDoctorUser,
} from '../types/publicDoctors';

/** Card + booking flow shape used across Home / Drawer / BookAppt */
export type BookingDoctorParams = {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  years: string;
  patients: string;
  fee: string;
  imageUri: string;
};

export function pickSpecialty(p: PublicDoctorProfile): string {
  const rows = p.professionalInfo;
  if (rows?.length) {
    const first = rows[0];
    const line =
      first.areaOfExpertise?.trim() ||
      first.profession?.trim() ||
      '';
    if (line) return line;
  }
  return 'General practice';
}

export function formatRating(p: PublicDoctorProfile): string {
  const r = p.ratingSummary?.averageRating;
  if (typeof r !== 'number' || Number.isNaN(r)) return '—';
  return r.toFixed(1);
}

/** Honest “tenure” from account age (not clinical years). */
export function formatPlatformTenure(user: PublicDoctorUser | undefined): string {
  if (!user?.createdAt) return '—';
  const d = new Date(user.createdAt);
  if (Number.isNaN(d.getTime())) return '—';
  const years = Math.max(
    0,
    Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
  );
  if (years <= 0) return '< 1 yr';
  return `${years} yr${years === 1 ? '' : 's'}`;
}

export function formatReviewsLine(p: PublicDoctorProfile): string {
  const n = p.ratingSummary?.totalReviews;
  if (typeof n !== 'number' || n < 0) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k reviews`;
  return `${n} reviews`;
}

/** Numeric review count for compact labeled rows (e.g. “Reviews: 3”). */
export function formatTotalReviewsCount(p: PublicDoctorProfile): string {
  const n = p.ratingSummary?.totalReviews;
  if (typeof n !== 'number' || n < 0) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/** Product placeholder until pricing API exists. */
export function placeholderConsultationFee(): string {
  return '—';
}

/** Plain “First Last” for profile headings (matches web without honorific). */
export function formatDoctorPlainName(p: PublicDoctorProfile): string {
  const fn = p.user?.firstName?.trim() ?? '';
  const ln = p.user?.lastName?.trim() ?? '';
  const rest = [fn, ln].filter(Boolean).join(' ');
  return rest || formatDoctorDisplayName(p);
}

export function formatDoctorDisplayName(p: PublicDoctorProfile): string {
  const title =
    typeof p.doctorInfo?.title === 'string' && p.doctorInfo.title.trim()
      ? p.doctorInfo.title.trim()
      : 'Dr.';
  const u = p.user;
  const fn = u.firstName?.trim() ?? '';
  const ln = u.lastName?.trim() ?? '';
  const rest = [fn, ln].filter(Boolean).join(' ');
  if (!rest) return title.endsWith('.') ? title : `${title}.`;
  if (/^dr\.?$/i.test(title)) {
    return `Dr. ${rest}`;
  }
  return `${title} ${rest}`.trim();
}

export function resolveDoctorImageUri(p: PublicDoctorProfile): string {
  const uri = p.user?.image?.trim();
  if (uri && (uri.startsWith('http://') || uri.startsWith('https://'))) {
    return uri;
  }
  return '';
}

/** Shared label + field lines for doctor detail & top-doctor cards (no fee). */
export type PublicDoctorDisplayDetails = {
  contact: string;
  profEmail: string;
  regulatory: string;
  specialty: string;
  reviews: string;
  ratingStr: string;
  patientsDisplay: string;
  professionPill: string;
  tagText: string;
};

function pickTopTagText(p: PublicDoctorProfile): string {
  const rows = p.professionalInfo;
  const first = rows?.[0];
  const line =
    first?.areaOfExpertise?.trim() ||
    first?.profession?.trim() ||
    '';
  return line || pickSpecialty(p);
}

export function getPublicDoctorDisplayDetails(
  p: PublicDoctorProfile,
): PublicDoctorDisplayDetails {
  const di = p.doctorInfo;
  const contact =
    (typeof di?.professionalContact === 'string' && di.professionalContact.trim()) ||
    p.user?.phone?.trim() ||
    '—';
  const profEmail =
    (typeof di?.professionalEmail === 'string' && di.professionalEmail.trim()) ||
    p.user?.email?.trim() ||
    '—';
  const regulatory =
    (typeof di?.regulatoryBody === 'string' && di.regulatoryBody.trim()) ||
    '—';
  const specialty = pickSpecialty(p);
  const reviews =
    typeof p.ratingSummary?.totalReviews === 'number'
      ? String(p.ratingSummary.totalReviews)
      : '0';
  const ratingStr = formatRating(p);
  const professionPill =
    p.professionalInfo?.[0]?.profession?.trim() ||
    p.professionalInfo?.[0]?.areaOfExpertise?.trim() ||
    specialty;

  return {
    contact,
    profEmail,
    regulatory,
    specialty,
    reviews,
    ratingStr,
    patientsDisplay: '0+',
    professionPill,
    tagText: pickTopTagText(p),
  };
}

/**
 * Maps API profile → params expected by `BookAppt` / `BookApptSelectDoctor`.
 */
export function mapPublicDoctorToBookingParams(
  p: PublicDoctorProfile,
): BookingDoctorParams {
  const imageUri = resolveDoctorImageUri(p);
  return {
    id: p.user?.id ?? '',
    name: formatDoctorDisplayName(p),
    specialty: pickSpecialty(p),
    rating: formatRating(p),
    years: formatPlatformTenure(p.user),
    patients: formatReviewsLine(p),
    fee: placeholderConsultationFee(),
    imageUri:
      imageUri ||
      'https://via.placeholder.com/200x200/E2E8F0/64748B?text=Doctor',
  };
}

/** Bio paragraph composed from `professionalInfo` / expertise when present. */
export function buildDoctorAboutText(p: PublicDoctorProfile): string {
  const pi = p.professionalInfo?.[0];
  const chunks: string[] = [];
  if (pi?.areaOfExpertise?.trim()) {
    chunks.push(`Clinical focus: ${pi.areaOfExpertise.trim()}.`);
  } else if (pi?.profession?.trim()) {
    chunks.push(`${pi.profession.trim()}.`);
  }
  const exp = pi?.expertise;
  if (Array.isArray(exp) && exp.length > 0) {
    const slice = exp.filter((x) => typeof x === 'string' && x.trim()).slice(0, 6);
    if (slice.length > 0) {
      chunks.push(`Expertise includes ${slice.join(', ')}.`);
    }
  }
  if (chunks.length > 0) {
    return chunks.join(' ');
  }
  return 'Experienced specialist available for quick and scheduled consultations. Continue to appointment flow with this doctor pre-selected.';
}

export function mapPublicDoctorToCardFields(p: PublicDoctorProfile): {
  doctorId: string;
  name: string;
  specialty: string;
  rating: string;
  years: string;
  patients: string;
  fee: string;
  imageUri: string;
} {
  const booking = mapPublicDoctorToBookingParams(p);
  return {
    doctorId: booking.id,
    ...booking,
  };
}
