import Link from "next/link";
import {
  InboxArrowDownIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  BellAlertIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";
import {
  formatDateTime,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_BADGE,
  cn,
} from "@/lib/format";

export default async function DashboardPage() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [pendingCount, todayCount, inShopCount, reminderCount, pending, upcoming] =
    await Promise.all([
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.count({
        where: {
          scheduledAt: { gte: startOfDay, lt: endOfDay },
          status: { notIn: ["CANCELLED"] },
        },
      }),
      prisma.appointment.count({
        where: { status: { in: ["IN_PROGRESS", "WAITING_PARTS"] } },
      }),
      prisma.reminder.count({
        where: { status: "SCHEDULED", dueDate: { lte: in30Days } },
      }),
      prisma.appointment.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.appointment.findMany({
        where: {
          status: { in: ["CONFIRMED", "IN_PROGRESS", "WAITING_PARTS"] },
          scheduledAt: { gte: startOfDay },
        },
        orderBy: { scheduledAt: "asc" },
        take: 6,
      }),
    ]);

  const stats = [
    { label: "Νέα αιτήματα", value: pendingCount, icon: InboxArrowDownIcon, tint: "bg-amber-50 text-amber-600" },
    { label: "Ραντεβού σήμερα", value: todayCount, icon: CalendarDaysIcon, tint: "bg-sky-50 text-sky-600" },
    { label: "Στο συνεργείο", value: inShopCount, icon: WrenchScrewdriverIcon, tint: "bg-indigo-50 text-indigo-600" },
    { label: "Υπενθυμίσεις (30 ημ.)", value: reminderCount, icon: BellAlertIcon, tint: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Πίνακας ελέγχου</h1>
        <p className="mt-1 text-sm text-slate-500">
          Επισκόπηση της ημέρας και των νέων αιτημάτων.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", s.tint)}>
                <s.icon className="h-5 w-5" />
              </span>
              <span className="text-3xl font-bold text-slate-900">{s.value}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending web bookings */}
        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Νέα αιτήματα ραντεβού</h2>
            <Link
              href="/admin/appointments?status=PENDING"
              className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
            >
              Όλα <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {pending.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-slate-400">
                Δεν υπάρχουν νέα αιτήματα.
              </li>
            )}
            {pending.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/appointments/${a.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{a.contactName}</p>
                    <p className="truncate text-sm text-slate-500">{a.serviceType}</p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-slate-500">
                    {formatDateTime(a.scheduledAt)}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Upcoming confirmed */}
        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Επόμενα ραντεβού</h2>
            <Link
              href="/admin/appointments"
              className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
            >
              Όλα <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {upcoming.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-slate-400">
                Δεν υπάρχουν προγραμματισμένα ραντεβού.
              </li>
            )}
            {upcoming.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/appointments/${a.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{a.contactName}</p>
                    <p className="truncate text-sm text-slate-500">
                      {formatDateTime(a.scheduledAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                      APPOINTMENT_STATUS_BADGE[a.status],
                    )}
                  >
                    {APPOINTMENT_STATUS_LABELS[a.status]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
