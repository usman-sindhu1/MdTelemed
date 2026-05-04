import type { ChatMessageRow } from '../types/appointmentChat';

export interface ChatBubbleUi {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
}

export function mapChatRowsToUi(
  rows: ChatMessageRow[],
  currentUserId: string | undefined,
): ChatBubbleUi[] {
  return rows.map((m) => {
    const sender = m.sender;
    const sid =
      sender && typeof sender === 'object'
        ? String(
            (sender as { id?: string; userId?: string }).id ??
              (sender as { id?: string; userId?: string }).userId ??
              '',
          )
        : '';
    const role = String(sender?.role ?? '').toUpperCase();
    const isSent =
      Boolean(currentUserId && sid && sid === currentUserId) ||
      role === 'PATIENT' ||
      role === 'PATIENT_USER';
    const t = m.createdAt
      ? new Date(m.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      : '';
    return {
      id: m.id,
      text: typeof m.content === 'string' ? m.content : '',
      time: t,
      isSent,
    };
  });
}
