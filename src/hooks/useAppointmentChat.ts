import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorizedPostJson, patientGetData } from '../api/patientHttp';
import { chatPaths } from '../constants/chatPaths';
import type { ChatMessagesPagePayload } from '../types/appointmentChat';

export function useAppointmentChat(
  appointmentId: string | undefined,
  options: { enabled: boolean },
) {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ['chat-messages', appointmentId] as const,
    queryFn: () =>
      patientGetData<ChatMessagesPagePayload>(
        chatPaths.appointmentMessages(appointmentId!),
        { page: 1, limit: 50 },
      ),
    enabled: Boolean(appointmentId) && options.enabled,
    staleTime: 15_000,
  });

  const onlineQuery = useQuery({
    queryKey: ['chat-online-users', appointmentId] as const,
    queryFn: () =>
      patientGetData<unknown>(chatPaths.appointmentOnlineUsers(appointmentId!)),
    enabled: Boolean(appointmentId) && options.enabled,
    staleTime: 20_000,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      authorizedPostJson<unknown, { content: string; messageType: string }>(
        chatPaths.appointmentMessages(appointmentId!),
        { content: content.trim(), messageType: 'TEXT' },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat-messages', appointmentId],
      });
    },
  });

  return {
    messagesQuery,
    onlineQuery,
    sendMutation,
  };
}
