import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  TruckIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";
import {
  formatDateTime,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_BADGE,
  cn,
} from "@/lib/format";
import type { AppointmentStatus } from "@/generated/prisma/enums";
import { setAppointmentStatus, convertToCustomer, setAppointmentVehicle } from "../actions";

const STATUS_KEYS = Object.keys(APPOINTMENT_STATUS_LABELS) as AppointmentStatus[];

const SOURCE_LABELS: Record<string, string> = {
  WEB: "Online κράτηση",
  PHONE: "Τηλέφωνο",
  WALK_IN: "Επίσκεψη",
};

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: { customer: true, vehicle: true },
  });

  if (!appt) notFound();

  const allVehicles = await prisma.vehicle.findMany({
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return (
    <div className="space-y-6">
      <Link
        href="/admin/appointments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Πίσω στα ραντεβού
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{appt.contactName}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {SOURCE_LABELS[appt.source] ?? appt.source} · καταχωρήθηκε{" "}
            {formatDateTime(appt.createdAt)}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium",
            APPOINTMENT_STATUS_BADGE[appt.status],
          )}
        >
          {APPOINTMENT_STATUS_LABELS[appt.status]}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-slate-900">Στοιχεία ραντεβού</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Υπηρεσία">{appt.serviceType}</Detail>
              <Detail label="Ημερομηνία & ώρα">{formatDateTime(appt.scheduledAt)}</Detail>
              <Detail label="Τηλέφωνο">
                <a href={`tel:${appt.contactPhone}`} className="inline-flex items-center gap-1.5 text-brand-700">
                  <PhoneIcon className="h-4 w-4" />
                  {appt.contactPhone}
                </a>
              </Detail>
              <Detail label="Email">
                {appt.contactEmail ? (
                  <a href={`mailto:${appt.contactEmail}`} className="inline-flex items-center gap-1.5 text-brand-700">
                    <EnvelopeIcon className="h-4 w-4" />
                    {appt.contactEmail}
                  </a>
                ) : (
                  "—"
                )}
              </Detail>
              <Detail label="Όχημα">
                <span className="inline-flex items-center gap-1.5">
                  <TruckIcon className="h-4 w-4 text-slate-400" />
                  {appt.vehicleInfo || "—"}
                </span>
              </Detail>
            </dl>
            {appt.notes && (
              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Σχόλια πελάτη
                </p>
                <p className="mt-1 text-sm text-slate-700">{appt.notes}</p>
              </div>
            )}
          </section>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-slate-900">Κατάσταση</h2>
            <form action={setAppointmentStatus} className="space-y-3">
              <input type="hidden" name="id" value={appt.id} />
              <select
                name="status"
                defaultValue={appt.status}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              >
                {STATUS_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {APPOINTMENT_STATUS_LABELS[k]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Ενημέρωση κατάστασης
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-3 font-semibold text-slate-900">Όχημα</h2>
            {appt.vehicle && (
              <p className="mb-3 text-sm text-slate-600">
                Συνδεδεμένο:{" "}
                <span className="font-medium text-slate-900">
                  {appt.vehicle.make} {appt.vehicle.model}
                  {appt.vehicle.plate ? ` (${appt.vehicle.plate})` : ""}
                </span>
              </p>
            )}
            {allVehicles.length === 0 ? (
              <p className="text-sm text-slate-500">
                Δεν υπάρχουν καταχωρημένα οχήματα. Καταχωρήστε πρώτα τον πελάτη και το όχημά του.
              </p>
            ) : (
              <form action={setAppointmentVehicle} className="space-y-3">
                <input type="hidden" name="id" value={appt.id} />
                <select
                  name="vehicleId"
                  defaultValue={appt.vehicleId ?? ""}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                >
                  <option value="">— Χωρίς όχημα —</option>
                  {allVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate ? `${v.plate} · ` : ""}
                      {v.make} {v.model} — {v.customer.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Σύνδεση με όχημα
                </button>
              </form>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Συνδέστε το ραντεβού με το όχημα ώστε ο πελάτης να βλέπει online την
              κατάσταση.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-3 font-semibold text-slate-900">Πελάτης</h2>
            {appt.customer ? (
              <div>
                <p className="text-sm text-slate-600">Συνδεδεμένος πελάτης:</p>
                <Link
                  href={`/admin/customers/${appt.customer.id}`}
                  className="mt-1 inline-block font-medium text-brand-700 hover:underline"
                >
                  {appt.customer.name} →
                </Link>
              </div>
            ) : (
              <form action={convertToCustomer}>
                <input type="hidden" name="id" value={appt.id} />
                <p className="mb-3 text-sm text-slate-500">
                  Καταχωρήστε τον πελάτη στο μητρώο για να κρατάτε ιστορικό.
                </p>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-600 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                >
                  <UserPlusIcon className="h-4 w-4" />
                  Καταχώρηση ως πελάτη
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-800">{children}</dd>
    </div>
  );
}
