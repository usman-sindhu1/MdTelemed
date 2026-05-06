export type PatientNotification = {
  id: string;
  userId?: string;
  title: string;
  type: string;
  description: string;
  url?: string | null;
  isRead: boolean;
  createdAt: string;
};

