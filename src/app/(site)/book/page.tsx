import type { Metadata } from "next";
import { PhoneIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { BookingForm } from "./BookingForm";
import { SHOP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Κλείστε ραντεβού",
  description:
    "Κλείστε online ραντεβού στο συνεργείο Άρλετος Ηλίας στα Ιωάννινα — service, φρένα, λάδια, ΚΤΕΟ και διάγνωση βλαβών.",
};

export default function BookPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-brand-800 to-brand-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Κλείστε το ραντεβού σας
          </h1>
          <p className="mt-3 max-w-xl text-brand-50/90">
            Συμπληρώστε τα στοιχεία σας και θα σας καλέσουμε για επιβεβαίωση. Γρήγορα,
            εύκολα και χωρίς αναμονή.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <BookingForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <h2 className="font-semibold text-slate-900">Προτιμάτε τηλέφωνο;</h2>
              <p className="mt-2 text-sm text-slate-600">
                Καλέστε μας και θα σας εξυπηρετήσουμε άμεσα.
              </p>
              <a
                href={`tel:${SHOP.phoneIntl}`}
                className="mt-4 flex items-center gap-2 text-lg font-bold text-brand-700"
              >
                <PhoneIcon className="h-5 w-5" />
                {SHOP.phoneDisplay}
              </a>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                <MapPinIcon className="h-5 w-5 text-brand-600" />
                Διεύθυνση
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {SHOP.address}
                <br />
                {SHOP.area}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                <ClockIcon className="h-5 w-5 text-brand-600" />
                Ωράριο
              </h2>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                {SHOP.hours.map((h) => (
                  <li key={h.label} className="flex justify-between gap-4">
                    <span>{h.label}</span>
                    <span className="font-medium text-slate-800">{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
