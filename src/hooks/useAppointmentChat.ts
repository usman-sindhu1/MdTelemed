import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorizedPostJson, patientGetData } from '../api/patientHttp';
import { chatPaths } from '../constants/chatPaths';
import type { ChatMessagesPagePayload } from '../types/appointmentChat';
import type { ChatMessageRow } from '../types/appointmentChat';
import { BASE_URL } from '../constants/BaseUrl';
import { getData } from '../utils/storage';
import { createChatSocket } from '../realtime/chatSocket';
import { showErrorToast } from '../utils/appToast';
import React from 'react';

export function useAppointmentChat(
  appointmentId: string | undefined,
  options: { enabled: boolean },
) {
  const queryClient = useQueryClient();
  const socketRef = React.useRef<ReturnType<typeof createChatSocket> | null>(null);
  const joinedRef = React.useRef(false);

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

  React.useEffect(() => {
    let cancelled = false;
    async function start() {
      if (!appointmentId || !options.enabled) return;

      const token = await getData<string>('accessToken');
      if (cancelled) return;
      if (!token?.trim()) return;

      // Recreate socket per appointment to keep behavior simple and predictable.
      try {
        socketRef.current?.disconnect();
      } catch {
        // ignore
      }
      joinedRef.current = false;

      const s = createChatSocket(BASE_URL, token.trim());
      socketRef.current = s;

      const pushMessageToCache = (msg: ChatMessageRow) => {
        queryClient.setQueryData<ChatMessagesPagePayload | undefined>(
          ['chat-messages', appointmentId],
          (prev) => {
            const old = prev?.messages ?? [];
            if (old.some((m) => m.id === msg.id)) return prev;
            const merged = [...old, msg].sort((a, b) => {
              const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return at - bt;
            });
            return { ...(prev ?? {}), messages: merged };
          },
        );
      };

      s.on('connect', () => {
        try {
          s.emit('join-appointment', { appointmentId });
        } catch {
          // ignore
        }
      });

      s.on('connected', () => {
        joinedRef.current = true;
      });

      s.on('online-users', (payload) => {
        queryClient.setQueryData(['chat-online-users', appointmentId], payload);
      });

      s.on('new-message', (payload) => {
        // Server emits saved message object from DB.
        const msg = payload as ChatMessageRow;
        if (!msg?.id) return;
        pushMessageToCache(msg);
      });

      s.on('messages-history', (payload) => {
        // Expect { messages: [...] } (pagination optional).
        const data = payload as ChatMessagesPagePayload;
        if (!data || !Array.isArray((data as any).messages)) return;
        queryClient.setQueryData(['chat-messages', appointmentId], data);
      });

      s.on('error', (payload) => {
        const message =
          typeof payload === 'object' && payload != null
            ? String((payload as any).message ?? 'Chat error')
            : 'Chat error';
        showErrorToast('Chat', message);
      });

      s.on('connect_error', (err: any) => {
        showErrorToast('Chat', err?.message ?? 'Socket connection failed');
      });
    }

    start();
    return () => {
      cancelled = true;
      joinedRef.current = false;
      try {
        socketRef.current?.disconnect();
      } catch {
        // ignore
      }
      socketRef.current = null;
    };
  }, [appointmentId, options.enabled, queryClient]);

  const sendMutation = useMutation({
    mutationFn: async (args: {
      content?: string;
      messageType?: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
    }) => {
      const messageType = (args.messageType || 'TEXT').trim();
      const content = (args.content || '').trim();
      const fileUrl = (args.fileUrl || '').trim();

      const s = socketRef.current;
      if (s && s.connected && joinedRef.current) {
        await new Promise<void>((resolve, reject) => {
          const t = setTimeout(() => {
            cleanup();
            reject(new Error('Message send timeout'));
          }, 10_000);

          const onSent = () => {
            cleanup();
            resolve();
          };
          const onErr = (p: any) => {
            const msg = String(p?.message ?? 'Message failed');
            cleanup();
            reject(new Error(msg));
          };
          const cleanup = () => {
            clearTimeout(t);
            s.off('message-sent', onSent);
            s.off('error', onErr);
          };

          s.on('message-sent', onSent);
          s.on('error', onErr);
          s.emit('send-message', {
            content: content || undefined,
            messageType,
            fileUrl: fileUrl || undefined,
            fileName: args.fileName,
            fileSize: args.fileSize,
          });
        });
        return;
      }

      // Fallback to REST (works even if socket not available).
      return authorizedPostJson<unknown, { content?: string; messageType: string; fileUrl?: string }>(
        chatPaths.appointmentMessages(appointmentId!),
        {
          content: content || undefined,
          messageType,
          fileUrl: fileUrl || undefined,
        },
      );
    },
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
