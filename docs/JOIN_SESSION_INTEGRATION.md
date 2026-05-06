# Patient app — Join session (VIDEO / AUDIO / CHAT) integration

This document explains how the mobile app should decide what to show on the **Join Appointment** area based on the backend field **`appointmentCallType`**, and which APIs to call for:

- **VIDEO** session (Agora RTC)
- **AUDIO** session (Agora RTC)
- **CHAT** session (appointment chat)

It also includes the relevant backend route files so you can trace the implementation.

---

## Source of truth: `appointmentCallType`

You must read `appointmentCallType` from the appointment data.

You can get it from either:

- **List**: `GET /api/patient/appointments` → each item includes `appointmentCallType`
- **Detail**: `GET /api/patient/appointments/{id}` → appointment includes `appointmentCallType`

Allowed values:

- `CHAT`
- `AUDIO`
- `VIDEO`

---

## UI rules (what to show)

Use `appointmentCallType` to control the UI:

- **VIDEO**
  - Show: **Join Video** (Agora) + Messages tab
  - Do NOT show: “Audio only” UI
- **AUDIO**
  - Show: **Join Audio** (Agora) + Messages tab
  - Do NOT show: Video join UI
- **CHAT**
  - Show: **Messages only** (chat tab / chat screen)
  - Do NOT show: Any “Join call” button

Notes:

- Backend currently **does not** block token generation by call type, so the frontend must enforce the above UI gating.
- Chat is generally available for appointment participants; sending is blocked only when the appointment is **CANCELLED** (see chat service).

---

## Auth

All endpoints below require:

```http
Authorization: Bearer <jwt>
```

---

## 1) Load appointment call type

### A) Appointment list (optional)

```http
GET /api/patient/appointments?page=1&pageSize=20&sortBy=startDate&sortOrder=asc
Authorization: Bearer <jwt>
```

Use `items[].appointmentCallType` to render call-type chips/badges and to decide which join UI to show when opening details.

Backend route file:

- `src/routes/patient/patient.routes.ts` (`getMyAppointments`)

### B) Appointment details (recommended before join)

```http
GET /api/patient/appointments/{appointmentId}
Authorization: Bearer <jwt>
```

This is the best source when user is on the details screen. Use `data.appointment.appointmentCallType`.

Backend route file:

- `src/routes/patient/patient.routes.ts` (`getMyAppointmentById`)

---

## 2) VIDEO / AUDIO: Agora token (Join Call)

When `appointmentCallType` is **`VIDEO`** or **`AUDIO`**, generate an Agora RTC token and then join with your Agora SDK.

### Endpoint

```http
POST /api/agora/token
Authorization: Bearer <jwt>
Content-Type: application/json
```

### Body

```json
{
  "appointmentId": "<appointmentId>",
  "channelName": "<optional; default is appointmentId>",
  "uid": "<string numeric user id for Agora>",
  "role": "PUBLISHER",
  "expireSeconds": 3600
}
```

### Success (`200`)

```json
{
  "success": true,
  "message": "Agora token generated successfully.",
  "data": {
    "appointmentId": "...",
    "channelName": "...",
    "uid": "123",
    "role": "PUBLISHER",
    "token": "<agora_token>",
    "expiresAt": "2026-05-05T10:00:00.000Z"
  }
}
```

### Frontend join logic

- If `appointmentCallType === 'VIDEO'`:
  - join Agora with **audio + video enabled**
- If `appointmentCallType === 'AUDIO'`:
  - join Agora with **audio enabled** and **video disabled** (hide camera toggle / switch UI)

### Common errors

- `401 Unauthorized` (missing/invalid token)
- `400 Appointment not found`
- `400 You are not allowed to create token for this appointment` (user is not patient/doctor participant)
- `400 Agora credentials are not configured` (server env missing)

### Backend files (Agora)

- Routes: `src/routes/agora/agora.routes.ts`
- Handler: `src/routes/agora/agora.handler.ts`
- Token service: `src/services/agora.service.ts`
- Mounted at: `src/app.ts` (`app.route('/api/agora', agoraRouter)`)

### Optional: validate token status

```http
GET /api/agora/appointments/{appointmentId}/token
```

Use this only if your client needs to check whether an existing token is still valid.

---

## 3) CHAT: Messages (appointment chat)

When `appointmentCallType` is **`CHAT`**, you should navigate to the chat UI and use the chat endpoints.

### 3.1 Get messages

```http
GET /api/chat/appointments/{appointmentId}/messages?page=1&limit=50
Authorization: Bearer <jwt>
```

### 3.2 Send message

```http
POST /api/chat/appointments/{appointmentId}/messages
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "content": "Hello doctor",
  "messageType": "TEXT"
}
```

### 3.3 Mark read / unread count / online users (optional)

- `PATCH /api/chat/appointments/{appointmentId}/messages/read`
- `GET /api/chat/appointments/{appointmentId}/messages/unread-count`
- `GET /api/chat/appointments/{appointmentId}/online-users`
- `GET /api/chat/appointments/{appointmentId}/status`

### Chat “active” rule

Chat sending is blocked only when the appointment status is **CANCELLED**. The server uses:

- `src/services/chat.ts` → `isAppointmentChatActive()`: returns `appointment.status !== 'CANCELLED'`

### Backend files (Chat)

- Routes: `src/routes/chat/chat.routes.ts`
- Handler: `src/routes/chat/chat.handler.ts`
- Service: `src/services/chat.ts`
- Mounted at: `src/app.ts` (`app.route('/api/chat', chatRouter)`)

---

## 4) Recommended “Join” button behavior

On the appointment details screen:

1. Call `GET /api/patient/appointments/{appointmentId}` and read `appointmentCallType`.
2. Render:
   - VIDEO → show **Join Video** button
   - AUDIO → show **Join Audio** button
   - CHAT → hide join call button (or replace with “Open chat”)
3. On Join button press (VIDEO/AUDIO):
   - `POST /api/agora/token`
   - join Agora with the correct media settings
4. Always allow the **Messages** tab (except you may disable sending when chat status says inactive).

