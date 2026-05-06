import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPatientNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../api/notificationsApi';
import type { PatientNotification } from '../types/notifications';

const QK = ['patient-notifications'] as const;

export function usePatientNotifications() {
  return useQuery({
    queryKey: QK,
    queryFn: getPatientNotifications,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: QK });
      const prev = qc.getQueryData<PatientNotification[]>(QK);
      if (prev) {
        qc.setQueryData<PatientNotification[]>(
          QK,
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      }
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK, ctx.prev);
    },
    onSuccess: (updated) => {
      const prev = qc.getQueryData<PatientNotification[]>(QK);
      if (!prev) return;
      qc.setQueryData<PatientNotification[]>(
        QK,
        prev.map((n) => (n.id === updated.id ? updated : n)),
      );
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: QK });
      const prev = qc.getQueryData<PatientNotification[]>(QK);
      if (prev) {
        qc.setQueryData<PatientNotification[]>(
          QK,
          prev.map((n) => ({ ...n, isRead: true })),
        );
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(QK, ctx.prev);
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: QK });
    },
  });
}

