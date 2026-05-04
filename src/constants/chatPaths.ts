/** Patient appointment chat — Bearer JWT (`/api/chat`). */
export const chatPaths = {
  appointmentMessages: (appointmentId: string) =>
    `/api/chat/appointments/${encodeURIComponent(appointmentId)}/messages`,
  appointmentMessagesRead: (appointmentId: string) =>
    `/api/chat/appointments/${encodeURIComponent(appointmentId)}/messages/read`,
  appointmentOnlineUsers: (appointmentId: string) =>
    `/api/chat/appointments/${encodeURIComponent(appointmentId)}/online-users`,
  appointmentChatStatus: (appointmentId: string) =>
    `/api/chat/appointments/${encodeURIComponent(appointmentId)}/status`,
};
