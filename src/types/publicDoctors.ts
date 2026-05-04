/**
 * Shapes for `GET /api/public/doctors` and `GET /api/public/doctors/{id}`.
 * Backend may add fields — keep extras under index signatures where needed.
 */

export type PublicDoctorUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string | null;
  phone?: string;
  address?: string;
  createdAt?: string;
};

export type PublicDoctorInfo = {
  title?: string;
  professionalContact?: string;
  professionalEmail?: string;
  licenseNo?: string;
  regulatoryBody?: string;
  [key: string]: unknown;
};

export type PublicProfessionalInfoRow = {
  id?: string;
  profession?: string;
  areaOfExpertise?: string;
  expertise?: string[];
};

export type PublicRatingSummary = {
  averageRating?: number;
  totalReviews?: number;
};

export type PublicDoctorProfile = {
  user: PublicDoctorUser;
  doctorInfo?: PublicDoctorInfo | null;
  professionalInfo?: PublicProfessionalInfoRow[] | null;
  documents?: unknown;
  ratingSummary?: PublicRatingSummary | null;
  reviews?: unknown[];
};

export type PublicDoctorsListPayload = {
  items: PublicDoctorProfile[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export type PublicDoctorTimeslotsPayload = {
  timeSlots: Array<{
    id?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
  }>;
};
