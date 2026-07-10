"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { createBooking, type BookingState } from "./actions";
import { SERVICES } from "@/lib/services";

const initialState: BookingState = { ok: false };

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

// Business-hour slots, every 30 minutes from 08:30 to 16:30.
const TIME_SLOTS: string[] = [];
for (let m = 8 * 60 + 30; m <= 16 * 60 + 30; m += 30) {
  TIME_SLOTS.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs text-accent">{messages[0]}</p>;
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export function BookingForm() {
  const [state, action, pending] = useActionState(createBooking, initialState);
  const today = new Date().toISOString().slice(0, 10);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircleIcon className="mx-auto h-14 w-14 text-emerald-500" />
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Το αίτημά σας καταχωρήθηκε!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          Ευχαριστούμε! Θα επικοινωνήσουμε μαζί σας τηλεφωνικά για να επιβεβαιώσουμε
          την ημέρα και την ώρα του ραντεβού σας.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Επιστροφή στην αρχική
          </Link>
          <a
            href="/book"
            className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Νέο ραντεβού
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state.message && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent-dark">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="serviceType" className={labelClass}>
          Υπηρεσία <span className="text-accent">*</span>
        </label>
        <select id="serviceType" name="serviceType" defaultValue="" className={inputClass}>
          <option value="" disabled>
            Επιλέξτε υπηρεσία…
          </option>
          {SERVICES.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value="Άλλο / Δεν είμαι σίγουρος/η">Άλλο / Δεν είμαι σίγουρος/η</option>
        </select>
        <FieldError messages={state.errors?.serviceType} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="scheduledDate" className={labelClass}>
            Ημερομηνία <span className="text-accent">*</span>
          </label>
          <input
            id="scheduledDate"
            name="scheduledDate"
            type="date"
            min={today}
            defaultValue={today}
            className={inputClass}
          />
          <FieldError messages={state.errors?.scheduledDate} />
        </div>
        <div>
          <label htmlFor="scheduledTime" className={labelClass}>
            Ώρα <span className="text-accent">*</span>
          </label>
          <select id="scheduledTime" name="scheduledTime" defaultValue="" className={inputClass}>
            <option value="" disabled>
              Επιλέξτε ώρα…
            </option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <FieldError messages={state.errors?.scheduledTime} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contactName" className={labelClass}>
            Ονοματεπώνυμο <span className="text-accent">*</span>
          </label>
          <input id="contactName" name="contactName" type="text" className={inputClass} />
          <FieldError messages={state.errors?.contactName} />
        </div>
        <div>
          <label htmlFor="contactPhone" className={labelClass}>
            Τηλέφωνο <span className="text-accent">*</span>
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            inputMode="tel"
            className={inputClass}
          />
          <FieldError messages={state.errors?.contactPhone} />
        </div>
      </div>

      <div>
        <label htmlFor="contactEmail" className={labelClass}>
          Email <span className="text-slate-400">(προαιρετικό)</span>
        </label>
        <input id="contactEmail" name="contactEmail" type="email" className={inputClass} />
        <FieldError messages={state.errors?.contactEmail} />
      </div>

      <div>
        <label htmlFor="vehicleInfo" className={labelClass}>
          Όχημα <span className="text-slate-400">(μάρκα, μοντέλο, έτος, πινακίδα)</span>
        </label>
        <input
          id="vehicleInfo"
          name="vehicleInfo"
          type="text"
          placeholder="π.χ. VW Golf 2015, ΙΝΑ-1234"
          className={inputClass}
        />
        <FieldError messages={state.errors?.vehicleInfo} />
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Σχόλια / περιγραφή προβλήματος{" "}
          <span className="text-slate-400">(προαιρετικό)</span>
        </label>
        <textarea id="notes" name="notes" rows={3} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Αποστολή…" : "Στείλτε το αίτημα ραντεβού"}
      </button>
      <p className="text-center text-xs text-slate-500">
        Θα σας καλέσουμε για επιβεβαίωση. Το ραντεβού οριστικοποιείται μετά την
        τηλεφωνική επικοινωνία.
      </p>
    </form>
  );
}
