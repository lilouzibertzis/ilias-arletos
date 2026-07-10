"use client";

import { useActionState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { sendTestMessage, type TestState } from "./actions";
import { cn } from "@/lib/format";

const initial: TestState = {};

export function ReminderTester() {
  const [state, action, pending] = useActionState(sendTestMessage, initial);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">Δοκιμαστική αποστολή</h2>
      <p className="mt-1 text-sm text-slate-500">
        Στείλτε ένα δοκιμαστικό μήνυμα για να ελέγξετε την πύλη SMS/Viber.
      </p>
      <form action={action} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          name="to"
          defaultValue="6986566003"
          placeholder="Αριθμός"
          className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
        <select
          name="channel"
          defaultValue="SMS"
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        >
          <option value="SMS">SMS</option>
          <option value="VIBER">Viber</option>
        </select>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
          {pending ? "Αποστολή…" : "Αποστολή"}
        </button>
      </form>
      {state.result && (
        <p className={cn("mt-3 text-sm", state.ok ? "text-emerald-600" : "text-accent")}>
          {state.result}
        </p>
      )}
    </div>
  );
}
