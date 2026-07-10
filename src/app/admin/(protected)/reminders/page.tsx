import Link from "next/link";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  REMINDER_TYPE_LABELS,
  REMINDER_CHANNEL_LABELS,
  REMINDER_STATUS_LABELS,
  cn,
} from "@/lib/format";
import { ReminderTester } from "./ReminderTester";
import { sendReminderNow } from "./actions";

export const metadata = { title: "Υπενθυμίσεις" };

function daysUntil(date: Date) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

export default async function RemindersPage() {
  const reminders = await prisma.reminder.findMany({
    orderBy: { dueDate: "asc" },
    include: { customer: true, vehicle: true },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Υπενθυμίσεις</h1>
        <p className="mt-1 text-sm text-slate-500">
          ΚΤΕΟ, service, τέλη κυκλοφορίας και ελαστικά — αυτόματες ειδοποιήσεις μέσω
          SMS/Viber προς τους πελάτες.
        </p>
      </div>

      <ReminderTester />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {reminders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            Δεν υπάρχουν υπενθυμίσεις.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {reminders.map((r) => {
              const days = daysUntil(r.dueDate);
              const urgent = days <= 14 && r.status === "SCHEDULED";
              return (
                <li key={r.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        urgent ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500",
                      )}
                    >
                      <BellAlertIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">
                        {REMINDER_TYPE_LABELS[r.type]}
                      </p>
                      {r.customer && (
                        <Link
                          href={`/admin/customers/${r.customer.id}`}
                          className="text-sm text-brand-700 hover:underline"
                        >
                          {r.customer.name}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-800">
                      Λήξη {formatDate(r.dueDate)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {r.status === "SCHEDULED"
                        ? days >= 0
                          ? `σε ${days} ημέρες · ${REMINDER_CHANNEL_LABELS[r.channel]}`
                          : `εκπρόθεσμο · ${REMINDER_CHANNEL_LABELS[r.channel]}`
                        : REMINDER_STATUS_LABELS[r.status]}
                    </p>
                    {r.status === "SCHEDULED" && r.customer?.phone ? (
                      <form action={sendReminderNow} className="mt-1">
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-brand-700 hover:underline"
                        >
                          Αποστολή τώρα →
                        </button>
                      </form>
                    ) : r.status === "SENT" ? (
                      <p className="mt-1 text-xs font-medium text-emerald-600">Στάλθηκε ✓</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
