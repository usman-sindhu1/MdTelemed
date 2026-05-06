import type { ChatMessageRow } from '../types/appointmentChat';

export interface ChatBubbleUi {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
  kind: 'text' | 'image' | 'file';
  url?: string;
  filename?: string;
  sizeBytes?: number;
}

function extFromName(name: string | undefined): string {
  if (!name) return '';
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : '';
}

function guessKind(
  text: string,
): { kind: ChatBubbleUi['kind']; url?: string; filename?: string } {
  const trimmed = text.trim();
  if (!trimmed) return { kind: 'text' };

  const urlMatch = trimmed.match(/https?:\/\/\S+/i);
  const url = urlMatch ? urlMatch[0].replace(/[)\],.]+$/g, '') : undefined;
  const filenameFromUrl = url ? decodeURIComponent(url.split('?')[0].split('/').pop() || '') : '';
  const filename = filenameFromUrl || (trimmed.includes('.') ? trimmed : '');
  const ext = extFromName(filename);

  const imageExts = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif']);
  const docExts = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']);

  if (ext && imageExts.has(ext))
    return { kind: 'image', url: url || undefined, filename: filename || undefined };
  if (ext && docExts.has(ext))
    return { kind: 'file', url: url || undefined, filename: filename || undefined };
  if (url) return { kind: 'file', url, filename: filename || url };
  return { kind: 'text' };
}

export function mapChatRowsToUi(
  rows: ChatMessageRow[],
  currentUserId: string | undefined,
): ChatBubbleUi[] {
  const sorted = [...rows].sort((a, b) => {
    const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (Number.isFinite(at) && Number.isFinite(bt) && at !== bt) return at - bt;
    // stable fallback (keeps original order if timestamps are missing)
    return 0;
  });

  return sorted.map((m) => {
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
    const contentText = typeof m.content === 'string' ? m.content : '';
    const urlFromFileUrl =
      typeof m.fileUrl === 'string' && m.fileUrl.trim() ? m.fileUrl.trim() : '';
    const text = urlFromFileUrl || contentText;
    const kindGuess = guessKind(text);
    const mt = String(m.messageType ?? '').toUpperCase();
    const kindOverride =
      mt === 'IMAGE' || mt === 'IMG' || mt === 'PHOTO'
        ? ('image' as const)
        : mt === 'FILE' || mt === 'DOCUMENT' || mt === 'DOC'
          ? ('file' as const)
          : null;

    return {
      id: m.id,
      text,
      time: t,
      isSent,
      kind: kindOverride ?? kindGuess.kind,
      url: kindGuess.url || (urlFromFileUrl ? urlFromFileUrl : undefined),
      filename:
        (typeof m.fileName === 'string' && m.fileName.trim()
          ? m.fileName.trim()
          : undefined) ?? kindGuess.filename,
      sizeBytes:
        typeof m.fileSize === 'number' && Number.isFinite(m.fileSize)
          ? m.fileSize
          : undefined,
    };
  });
}
