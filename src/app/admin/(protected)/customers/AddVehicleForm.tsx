"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { addVehicle, type FormResult } from "./actions";

const initial: FormResult = {};
const input =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200";
const label = "mb-1 block text-xs font-medium text-slate-500";

export function AddVehicleForm({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(addVehicle, initial);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      ref.current?.reset();
      setOpen(false);
    }
  }, [state]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-brand-400 hover:text-brand-700"
      >
        <PlusIcon className="h-4 w-4" />
        Προσθήκη οχήματος
      </button>
    );
  }

  return (
    <form ref={ref} action={action} className="rounded-2xl border border-slate-200 bg-white p-5">
      <input type="hidden" name="customerId" value={customerId} />
      <h3 className="mb-3 font-semibold text-slate-900">Νέο όχημα</h3>
      {state.error && <p className="mb-3 text-sm text-accent">{state.error}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Μάρκα *</label>
          <input name="make" className={input} placeholder="π.χ. Volkswagen" />
        </div>
        <div>
          <label className={label}>Μοντέλο *</label>
          <input name="model" className={input} placeholder="π.χ. Golf 1.6 TDI" />
        </div>
        <div>
          <label className={label}>Έτος</label>
          <input name="year" inputMode="numeric" className={input} placeholder="2015" />
        </div>
        <div>
          <label className={label}>Πινακίδα</label>
          <input name="plate" className={input} placeholder="ΙΝΑ-1234" />
        </div>
        <div>
          <label className={label}>Χιλιόμετρα</label>
          <input name="mileage" inputMode="numeric" className={input} placeholder="140000" />
        </div>
        <div>
          <label className={label}>VIN (προαιρετικό)</label>
          <input name="vin" className={input} />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Αποθήκευση…" : "Αποθήκευση"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Άκυρο
        </button>
      </div>
    </form>
  );
}
