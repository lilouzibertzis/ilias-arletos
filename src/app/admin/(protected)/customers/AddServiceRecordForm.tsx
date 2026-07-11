"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { addServiceRecord, type FormResult } from "./actions";

const initial: FormResult = {};
const input =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200";
const label = "mb-1 block text-xs font-medium text-slate-500";

export function AddServiceRecordForm({
  vehicleId,
  customerId,
}: {
  vehicleId: string;
  customerId: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(addServiceRecord, initial);
  const ref = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);

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
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
      >
        <PlusIcon className="h-4 w-4" />
        Προσθήκη εργασίας
      </button>
    );
  }

  return (
    <form ref={ref} action={action} className="mt-3 rounded-xl bg-slate-50 p-4">
      <input type="hidden" name="vehicleId" value={vehicleId} />
      <input type="hidden" name="customerId" value={customerId} />
      {state.error && <p className="mb-3 text-sm text-accent">{state.error}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>Περιγραφή εργασίας *</label>
          <input
            name="description"
            className={input}
            placeholder="π.χ. Αλλαγή λαδιών & φίλτρων"
          />
        </div>
        <div>
          <label className={label}>Ημερομηνία</label>
          <input name="performedAt" type="date" defaultValue={today} className={input} />
        </div>
        <div>
          <label className={label}>Ανταλλακτικά</label>
          <input name="parts" className={input} placeholder="π.χ. Castrol 5W-30" />
        </div>
        <div>
          <label className={label}>Κόστος (€)</label>
          <input name="cost" inputMode="numeric" className={input} placeholder="65" />
        </div>
        <div>
          <label className={label}>Χιλιόμετρα</label>
          <input name="mileage" inputMode="numeric" className={input} placeholder="140000" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Αποθήκευση…" : "Καταχώρηση"}
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
