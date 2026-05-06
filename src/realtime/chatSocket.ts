import { io, type Socket } from 'socket.io-client';

export type ChatSocketServerToClientEvents = {
  connected: (payload: unknown) => void;
  'online-users': (payload: unknown) => void;
  'user-joined': (payload: unknown) => void;
  'user-left': (payload: unknown) => void;
  'new-message': (payload: unknown) => void;
  'message-sent': (payload: unknown) => void;
  'messages-history': (payload: unknown) => void;
  'unread-count': (payload: unknown) => void;
  'user-typing': (payload: unknown) => void;
  'user-stopped-typing': (payload: unknown) => void;
  'messages-read': (payload: unknown) => void;
  error: (payload: { message?: string } | unknown) => void;
};

export type ChatSocketClientToServerEvents = {
  'join-appointment': (payload: { appointmentId: string }) => void;
  'send-message': (payload: {
    content?: string;
    messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM' | string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }) => void;
  'typing-start': () => void;
  'typing-stop': () => void;
  'mark-read': (payload: { messageIds: string[] }) => void;
  'get-messages': (payload: { page?: number; limit?: number; before?: string }) => void;
  'get-unread-count': () => void;
  ping: () => void;
};

export function createChatSocket(
  baseUrl: string,
  accessToken: string,
): Socket<ChatSocketServerToClientEvents, ChatSocketClientToServerEvents> {
  return io(baseUrl, {
    path: '/socket.io',
    transports: ['websocket'],
    auth: { token: accessToken },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 500,
    reconnectionDelayMax: 4000,
  });
}

