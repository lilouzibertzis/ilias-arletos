import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  formatDateTime,
  formatEuro,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_BADGE,
  REMINDER_TYPE_LABELS,
  REMINDER_CHANNEL_LABELS,
  cn,
} from "@/lib/format";
import { AddVehicleForm } from "../AddVehicleForm";
import { AddServiceRecordForm } from "../AddServiceRecordForm";
import { ServiceBookPhotos } from "../ServiceBookPhotos";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      vehicles: {
        orderBy: { createdAt: "desc" },
        include: {
          serviceRecords: { orderBy: { performedAt: "desc" } },
          photos: { select: { id: true, caption: true }, orderBy: { createdAt: "desc" } },
        },
      },
      appointments: { orderBy: { scheduledAt: "desc" }, take: 10 },
      reminders: { orderBy: { dueDate: "asc" } },
    },
  });

  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Πίσω στους πελάτες
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={`tel:${customer.phone}`} className="inline-flex items-center gap-1.5 text-brand-700">
            <PhoneIcon className="h-4 w-4" />
            {customer.phone}
          </a>
          {customer.email && (
            <a href={`mailto:${customer.email}`} className="inline-flex items-center gap-1.5 text-brand-700">
              <EnvelopeIcon className="h-4 w-4" />
              {customer.email}
            </a>
          )}
        </div>
        {customer.notes && <p className="mt-3 text-sm text-slate-600">{customer.notes}</p>}
      </div>

      {/* Vehicles + service history */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
          <TruckIcon className="h-5 w-5 text-brand-600" />
          Οχήματα ({customer.vehicles.length})
        </h2>
        <div className="space-y-4">
          {customer.vehicles.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-300 px-5 py-6 text-center text-sm text-slate-400">
              Δεν υπάρχουν καταχωρημένα οχήματα ακόμη.
            </p>
          )}

          {customer.vehicles.map((v) => (
            <div key={v.id} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900">
                  {v.make} {v.model}
                  {v.year ? ` (${v.year})` : ""}
                </h3>
                <div className="flex gap-2 text-xs">
                  {v.plate && (
                    <span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-700">
                      {v.plate}
                    </span>
                  )}
                  {v.mileage != null && (
                    <span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-700">
                      {v.mileage.toLocaleString("el-GR")} χλμ
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                  <WrenchScrewdriverIcon className="h-4 w-4" />
                  Ιστορικό εργασιών
                </p>
                {v.serviceRecords.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-400">Καμία καταχώρηση ακόμη.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-slate-100">
                    {v.serviceRecords.map((r) => (
                      <li key={r.id} className="flex items-start justify-between gap-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{r.description}</p>
                          {r.parts && <p className="text-xs text-slate-500">{r.parts}</p>}
                          <p className="mt-0.5 text-xs text-slate-400">
                            {formatDate(r.performedAt)}
                            {r.mileage != null
                              ? ` · ${r.mileage.toLocaleString("el-GR")} χλμ`
                              : ""}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-slate-700">
                          {formatEuro(r.cost)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <AddServiceRecordForm vehicleId={v.id} customerId={customer.id} />
              </div>

              <ServiceBookPhotos
                vehicleId={v.id}
                customerId={customer.id}
                photos={v.photos}
              />
            </div>
          ))}

          <AddVehicleForm customerId={customer.id} />
        </div>
      </section>

      {/* Reminders */}
      {customer.reminders.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
            <BellAlertIcon className="h-5 w-5 text-brand-600" />
            Υπενθυμίσεις
          </h2>
          <ul className="space-y-2">
            {customer.reminders.map((rem) => (
              <li
                key={rem.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {REMINDER_TYPE_LABELS[rem.type]}
                  </p>
                  <p className="text-xs text-slate-500">
                    Λήξη {formatDate(rem.dueDate)} · {REMINDER_CHANNEL_LABELS[rem.channel]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Appointment history */}
      <section>
        <h2 className="mb-3 font-semibold text-slate-900">Ιστορικό ραντεβού</h2>
        {customer.appointments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-400">
            Δεν υπάρχουν ραντεβού.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {customer.appointments.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/appointments/${a.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{a.serviceType}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(a.scheduledAt)}</p>
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
        )}
      </section>
    </div>
  );
}
