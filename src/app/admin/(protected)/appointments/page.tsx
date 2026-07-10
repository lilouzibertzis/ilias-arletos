import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  formatDateTime,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_BADGE,
  cn,
} from "@/lib/format";
import type { AppointmentStatus } from "@/generated/prisma/enums";

export const metadata = { title: "Ραντεβού" };

const STATUS_KEYS = Object.keys(APPOINTMENT_STATUS_LABELS) as AppointmentStatus[];

const SOURCE_LABELS: Record<string, string> = {
  WEB: "Online",
  PHONE: "Τηλέφωνο",
  WALK_IN: "Επίσκεψη",
};

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = STATUS_KEYS.includes(status as AppointmentStatus)
    ? (status as AppointmentStatus)
    : undefined;

  const appointments = await prisma.appointment.findMany({
    where: active ? { status: active } : undefined,
    orderBy: { scheduledAt: "asc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ραντεβού</h1>
        <p className="mt-1 text-sm text-slate-500">
          Διαχειριστείτε αιτήματα και προγραμματισμένα ραντεβού.
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip href="/admin/appointments" label="Όλα" active={!active} />
        {STATUS_KEYS.map((k) => (
          <FilterChip
            key={k}
            href={`/admin/appointments?status=${k}`}
            label={APPOINTMENT_STATUS_LABELS[k]}
            active={active === k}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {appointments.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            Δεν υπάρχουν ραντεβού{active ? " σε αυτή την κατάσταση" : ""}.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {appointments.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/appointments/${a.id}`}
                  className="flex flex-col gap-2 px-5 py-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{a.contactName}</p>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                        {SOURCE_LABELS[a.source] ?? a.source}
                      </span>
                    </div>
                    <p className="truncate text-sm text-slate-500">{a.serviceType}</p>
                  </div>
                  <div className="flex items-center gap-4 sm:justify-end">
                    <span className="text-sm text-slate-500">
                      {formatDateTime(a.scheduledAt)}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                        APPOINTMENT_STATUS_BADGE[a.status],
                      )}
                    >
                      {APPOINTMENT_STATUS_LABELS[a.status]}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-brand-600 text-white"
          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
      )}
    >
      {label}
    </Link>
  );
}
