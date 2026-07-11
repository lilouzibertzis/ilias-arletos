import type { Metadata } from "next";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";
import { SHOP } from "@/lib/site";
import { formatDate, formatDateTime, formatEuro } from "@/lib/format";
import type { AppointmentStatus } from "@/generated/prisma/enums";

export const metadata: Metadata = {
  title: "Το όχημά μου",
  description:
    "Δείτε online το ιστορικό service και την κατάσταση του οχήματός σας στο συνεργείο Άρλετος Ηλίας — απλά με την πινακίδα σας.",
};

// Greek plate letters share glyphs with Latin ones — normalize both to Latin
// so "ΙΝΑ-1234", "INA 1234" and "ινα1234" all match.
const GREEK_TO_LATIN: Record<string, string> = {
  Α: "A", Β: "B", Ε: "E", Ζ: "Z", Η: "H", Ι: "I", Κ: "K",
  Μ: "M", Ν: "N", Ο: "O", Ρ: "P", Τ: "T", Υ: "Y", Χ: "X",
};

function normalizePlate(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^0-9\p{L}]/gu, "")
    .split("")
    .map((ch) => GREEK_TO_LATIN[ch] ?? ch)
    .join("");
}

function statusBanner(status: AppointmentStatus, scheduledAt: Date) {
  switch (status) {
    case "PENDING":
      return { tone: "amber", text: `Αίτημα ραντεβού για ${formatDateTime(scheduledAt)} — αναμονή επιβεβαίωσης.` };
    case "CONFIRMED":
      return { tone: "sky", text: `Έχετε επιβεβαιωμένο ραντεβού στις ${formatDateTime(scheduledAt)}.` };
    case "IN_PROGRESS":
      return { tone: "indigo", text: "Το όχημά σας βρίσκεται αυτή τη στιγμή στο συνεργείο — εργασία σε εξέλιξη." };
    case "WAITING_PARTS":
      return { tone: "orange", text: "Το όχημά σας είναι στο συνεργείο — αναμονή ανταλλακτικών." };
    case "DONE":
      return { tone: "emerald", text: "Η εργασία ολοκληρώθηκε — το όχημά σας είναι έτοιμο για παραλαβή!" };
    default:
      return { tone: "slate", text: "Δεν υπάρχει ενεργό ραντεβού αυτή τη στιγμή." };
  }
}

const TONES: Record<string, string> = {
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  sky: "bg-sky-50 text-sky-800 ring-sky-200",
  indigo: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  orange: "bg-orange-50 text-orange-800 ring-orange-200",
  emerald: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  slate: "bg-slate-50 text-slate-700 ring-slate-200",
};

export default async function ServiceBookPage({
  searchParams,
}: {
  searchParams: Promise<{ plate?: string }>;
}) {
  const { plate } = await searchParams;
  const query = (plate ?? "").trim();

  let vehicle:
    | Awaited<ReturnType<typeof lookupVehicle>>
    | null = null;
  if (query) vehicle = await lookupVehicle(query);

  return (
    <>
      <div className="bg-gradient-to-br from-brand-800 to-brand-600 text-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Το βιβλίο service του οχήματός σας
          </h1>
          <p className="mt-3 text-brand-50/90">
            Πληκτρολογήστε την πινακίδα σας για να δείτε την κατάσταση της επισκευής
            και το ιστορικό εργασιών — online, οποιαδήποτε στιγμή.
          </p>

          <form action="/service-book" method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              name="plate"
              defaultValue={query}
              placeholder="π.χ. ΙΝΑ-1234"
              className="flex-1 rounded-lg border-0 px-4 py-3 text-slate-900 outline-none ring-2 ring-white/20 focus:ring-white/60"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Αναζήτηση
            </button>
          </form>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {!query ? (
          <p className="text-center text-slate-500">
            Εισάγετε την πινακίδα σας παραπάνω.
          </p>
        ) : !vehicle ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-semibold text-slate-900">
              Δεν βρέθηκε όχημα με πινακίδα «{query}».
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Ελέγξτε την πινακίδα ή επικοινωνήστε μαζί μας.
            </p>
            <a
              href={`tel:${SHOP.phoneIntl}`}
              className="mt-4 inline-flex items-center gap-2 font-semibold text-brand-700"
            >
              <PhoneIcon className="h-5 w-5" />
              {SHOP.phoneDisplay}
            </a>
          </div>
        ) : (
          <VehicleResult vehicle={vehicle} />
        )}
      </section>
    </>
  );
}

async function lookupVehicle(query: string) {
  const target = normalizePlate(query);
  if (!target) return null;
  const vehicles = await prisma.vehicle.findMany({
    where: { plate: { not: null } },
    include: {
      serviceRecords: { orderBy: { performedAt: "desc" } },
      photos: { select: { id: true }, orderBy: { createdAt: "desc" } },
      appointments: { orderBy: { scheduledAt: "desc" } },
    },
    take: 500,
  });
  return vehicles.find((v) => v.plate && normalizePlate(v.plate) === target) ?? null;
}

function VehicleResult({
  vehicle,
}: {
  vehicle: NonNullable<Awaited<ReturnType<typeof lookupVehicle>>>;
}) {
  const active = vehicle.appointments.find(
    (a) => a.status !== "PICKED_UP" && a.status !== "CANCELLED",
  );
  const banner = active
    ? statusBanner(active.status, active.scheduledAt)
    : statusBanner("PICKED_UP", new Date());

  return (
    <div className="space-y-6">
      {/* Vehicle + status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <TruckIcon className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {vehicle.make} {vehicle.model}
              {vehicle.year ? ` (${vehicle.year})` : ""}
            </h2>
            <p className="text-sm text-slate-500">{vehicle.plate}</p>
          </div>
        </div>
        <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ring-1 ${TONES[banner.tone]}`}>
          {banner.text}
        </div>
      </div>

      {/* Photos of the physical book */}
      {vehicle.photos.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">Βιβλίο service</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {vehicle.photos.map((p) => (
              <a key={p.id} href={`/api/vehicle-photo/${p.id}`} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/vehicle-photo/${p.id}`}
                  alt="Βιβλίο service"
                  className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Online service history */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
          <WrenchScrewdriverIcon className="h-5 w-5 text-brand-600" />
          Ιστορικό εργασιών
        </h3>
        {vehicle.serviceRecords.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            Δεν υπάρχουν καταχωρημένες εργασίες ακόμη.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {vehicle.serviceRecords.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{r.description}</p>
                  {r.parts && <p className="text-xs text-slate-500">{r.parts}</p>}
                  <p className="mt-0.5 text-xs text-slate-400">
                    {formatDate(r.performedAt)}
                    {r.mileage != null ? ` · ${r.mileage.toLocaleString("el-GR")} χλμ` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-slate-700">
                  {formatEuro(r.cost)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-center text-sm text-slate-500">
        Χρειάζεστε service;{" "}
        <Link href="/book" className="font-semibold text-brand-700 hover:underline">
          Κλείστε ραντεβού →
        </Link>
      </p>
    </div>
  );
}
