import type {
  AppointmentStatus,
  ReminderType,
  ReminderChannel,
  ReminderStatus,
} from "@/generated/prisma/enums";

/** Tiny className joiner (avoids a clsx dependency). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const dateTimeFmt = new Intl.DateTimeFormat("el-GR", {
  dateStyle: "medium",
  timeStyle: "short",
});
const dateFmt = new Intl.DateTimeFormat("el-GR", { dateStyle: "medium" });
const timeFmt = new Intl.DateTimeFormat("el-GR", { timeStyle: "short" });

export const formatDateTime = (d: Date | string) => dateTimeFmt.format(new Date(d));
export const formatDate = (d: Date | string) => dateFmt.format(new Date(d));
export const formatTime = (d: Date | string) => timeFmt.format(new Date(d));

export function formatEuro(amount?: number | null) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Appointment status ────────────────────────────────────────

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: "Σε αναμονή",
  CONFIRMED: "Επιβεβαιωμένο",
  IN_PROGRESS: "Σε εξέλιξη",
  WAITING_PARTS: "Αναμονή ανταλλακτικών",
  DONE: "Ολοκληρώθηκε",
  PICKED_UP: "Παραλήφθηκε",
  CANCELLED: "Ακυρώθηκε",
};

/** Tailwind badge classes per status (light + dark). */
export const APPOINTMENT_STATUS_BADGE: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  CONFIRMED: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  IN_PROGRESS: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300",
  WAITING_PARTS: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300",
  DONE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  PICKED_UP: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

/** Ordered statuses that make up the shop's workflow (excludes CANCELLED). */
export const APPOINTMENT_WORKFLOW: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "WAITING_PARTS",
  "DONE",
  "PICKED_UP",
];

// ── Reminders ─────────────────────────────────────────────────

export const REMINDER_TYPE_LABELS: Record<ReminderType, string> = {
  SERVICE_DUE: "Service",
  KTEO: "ΚΤΕΟ",
  ROAD_TAX: "Τέλη κυκλοφορίας",
  TYRE_CHANGE: "Αλλαγή ελαστικών",
  CUSTOM: "Άλλο",
};

export const REMINDER_CHANNEL_LABELS: Record<ReminderChannel, string> = {
  SMS: "SMS",
  VIBER: "Viber",
  EMAIL: "Email",
};

export const REMINDER_STATUS_LABELS: Record<ReminderStatus, string> = {
  SCHEDULED: "Προγραμματισμένο",
  SENT: "Στάλθηκε",
  DISMISSED: "Απορρίφθηκε",
};
