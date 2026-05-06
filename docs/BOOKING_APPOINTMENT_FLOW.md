# Booking Appointment Flow (Patient App)

This document describes the patient-facing **Book Appt.** experience for:

- **See Doctor Now** (immediate consultation)
- **Book Later** (scheduled visit)

It also covers the **Personal / Medical / Payment** steps, the **subscription** option, and **joining the session** with **Chat / Audio / Video** rules.

---

## Entry Points (Home)

- **See Doctor Now**: Fast path to availability / queue and immediate telehealth session after checkout.
- **Book Later**: Full scheduling: choose clinician → confirm → pick date/time → then personal/medical/payment.

---

## Shared UI Patterns

- **Header**: Back chevron, title **Book Appt.**
- **Progress card**: label + **% completed** + bar + **~N min** or **10min** estimate.
- **Step label (3-step leg)**: **STEP 1 OF 3** → **STEP 2 OF 3** → **STEP 3 OF 3** (personal → medical → payment).
- **Footer actions**: **Cancel** (secondary) + primary (e.g. **Save draft & continue**, **Next**, **Save draft & Continue to Payment**).

---

## Flow A: Book Later (Scheduled Visit)

### A1 — Choose your doctor

- **Progress**: e.g. **0% completed**, **10min**
- **Search**: “Search doctors…”
- **List**: Cards with avatar, name, specialty, **Rating / Experience / Patients**, fee line, **Book** button
- **Next**: Tap **Book** → clinician review

### A2 — Review clinician

- **Progress**: e.g. **45% completed**, **10min**
- **Card**: doctor details + **Selected**
- **Actions**: **Next**; link **Choose a different doctor**

### A3 — Select date & time

- **Progress**: e.g. **50% completed**, **10min**
- **Calendar**: month navigation + day chips
- **Times**: “Online Appt.” rows + radio select
- **Next**: confirmed slot → proceed to checkout steps

### A4 — Step 1 of 3: Personal information

- **Progress**: **33% completed**, **~15 min**
- **Fields**: First name, last name, phone, email, booking-for, priority, address (and any others in build)
- **Actions**: **Cancel** · **Save draft & continue** → Step 2

### A5 — Step 2 of 3: Medical information

- **Progress**: **67% completed**, **~15 min**
- **Upload**: **Medical report upload (optional)**
- **Appointment call type**: **Chat** | **Audio** | **Video**
- **Reason**: “Reason for this appointment” multiline
- **Actions**: **Cancel** · **Save draft & continue** → Step 3

### A6 — Step 3 of 3: Payment information

- **Progress**: **100% completed**, **~15 min**
- **Payment summary**: subscription checked automatically if available (badge state may say **No usable subscription**)
- **Choose how to pay**:
  - **One-time payment**: pay for this visit only
  - **Get subscription**: ongoing visits & perks
- **Actions**: **Cancel** · **Save draft & Continue to Payment** → payment completion

### A7 — After payment (scheduled)

- **Outcome**: Appointment is confirmed for the selected slot.
- **Next screen (recommended)**: Appointment details with a **Join** button that is:
  - **Disabled** until the join window opens (e.g. “Available 10 min before start”), or
  - **Enabled** when within the join window.

---

## Flow B: See Doctor Now (Immediate Consultation)

Mocks don’t show the dedicated “See Doctor Now” funnel screens; below is the recommended flow using the same components.

### B1 — From home

- User taps **See Doctor Now**

### B2 — Recommended sequence

1. **Match clinician now** (either “next available” or a short list similar to **A1**).
2. **Personal information** (same as **A4**).
3. **Medical information** (same as **A5**; call type selection is critical here).
4. **Payment information** (same as **A6**; one-time vs subscription).
5. **Post-payment**: join a waiting room / session immediately.

---

## Appointment Type Rules (Chat / Audio / Video)

The **Appointment call type** selected in **Medical information (Step 2 of 3)** controls what the user can access when joining.

### If appointment type = Video

- **Join experience**: video session UI is enabled.
- **Allowed media**: camera + mic controls available.
- **Fallback**: allow switching camera off (video off) while staying in the same video-capable room (optional), but **do not hide video UI**.

### If appointment type = Audio

- **Join experience**: audio-only session.
- **Allowed media**: mic controls available; **camera/video option is not available**.
- **UI behavior**: hide or disable the camera toggle entirely (preferred: hide to avoid confusion).

### If appointment type = Chat only

- **Join experience**: chat-only session.
- **Allowed media**: **no** mic/camera controls; **only chat UI** is shown.
- **UI behavior**: hide video/audio join buttons; show a single **Open Chat** / **Join Chat** CTA.

### Cross-cutting constraints

- **The join CTA must respect type**: never show a video join CTA for **Audio** or **Chat** appointments.
- **Prevent upgrades on client**: user should not be able to “turn on video” in an **Audio** appointment or start a call in **Chat** appointment (unless the clinician explicitly upgrades the visit and the backend updates the appointment type).

---

## Join Session Flow (All Appointment Types)

### Preconditions (common)

- Appointment exists and is in a joinable state:
  - **See Doctor Now**: joinable immediately after successful payment.
  - **Book Later**: joinable only when within the allowed join window (or at start time).

### Join entry points

- **Upcoming Appointment card** → “View details” → **Join**
- **Appointment details screen** → **Join**
- Optional: push notification reminder → deep link → details → **Join**

### Join decision logic

1. Fetch appointment details (status, start time, call type, clinician availability).
2. If payment required and not completed → route to **Payment information** (or a “Complete payment” step).
3. If too early (scheduled) → show “Join available at …” and keep CTA disabled.
4. If joinable → route based on appointment type:
   - **Video** → Video session
   - **Audio** → Audio session (no video controls)
   - **Chat** → Chat session only

### In-session UI expectations (high level)

- **Video session**: local/remote video surfaces; mic + camera toggles; end call; network indicators (optional).
- **Audio session**: no video surfaces; mic toggle; end call.
- **Chat-only**: message list + composer; attachments optional; no call controls.

### Exit outcomes

- User ends session → show visit summary / feedback (recommended), and appointment status updates.
- Network drop → show reconnecting UI; respect modality (never reveal video controls for audio/chat).

---

## Payment vs Subscription (Both Flows)

- **One-time payment**: Pay for this visit only (default selected in mock).
- **Get subscription**: Ongoing visits & perks. If subscription is usable, it should be applied automatically in **Payment summary**.

---

## Flow Comparison (Summary)

- **Book Later**: doctor selection ✅, date/time ✅, steps ✅, payment ✅, join **at slot / within join window**
- **See Doctor Now**: doctor selection ✅ (or “next available”), date/time ❌, steps ✅, payment ✅, join **immediately after payment**

