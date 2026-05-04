/** Chat API shapes (`GET /api/chat/appointments/{id}/messages`). */

export interface ChatMessageSender {
  id?: string;
  userId?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
}

export interface ChatMessageRow {
  id: string;
  content?: string;
  messageType?: string;
  createdAt?: string;
  sender?: ChatMessageSender;
}

export interface ChatMessagesPagePayload {
  messages: ChatMessageRow[];
  pagination?: {
    page?: number;
    limit?: number;
    totalItems?: number;
    totalPages?: number;
  };
}
