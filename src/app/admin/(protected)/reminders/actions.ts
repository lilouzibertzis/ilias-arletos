"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { sendMessage, reminderText } from "@/lib/messaging";
import { SHOP } from "@/lib/site";

/** Send a specific scheduled reminder immediately and mark it SENT. */
export async function sendReminderNow(formData: FormData) {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  const r = await prisma.reminder.findUnique({
    where: { id },
    include: { customer: true, vehicle: true },
  });
  if (!r?.customer?.phone) return;

  const vehicle = r.vehicle ? `${r.vehicle.make} ${r.vehicle.model}` : null;
  const text =
    r.message ||
    reminderText(r.type, {
      vehicle,
      due: r.dueDate,
      shop: SHOP.name,
      url: process.env.NEXT_PUBLIC_SITE_URL || "",
    });

  const res = await sendMessage(r.customer.phone, text, r.channel === "VIBER" ? "VIBER" : "SMS");
  if (res.ok) {
    await prisma.reminder.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date() },
    });
  }
  revalidatePath("/admin/reminders");
}

export type TestState = { ok?: boolean; result?: string };

/** Fire a one-off test message to any number (used to validate the gateway). */
export async function sendTestMessage(
  _prev: TestState,
  formData: FormData,
): Promise<TestState> {
  await verifySession();
  const to = String(formData.get("to") ?? "").trim();
  const channel = String(formData.get("channel") ?? "SMS") === "VIBER" ? "VIBER" : "SMS";
  if (!to) return { ok: false, result: "Συμπληρώστε αριθμό." };

  const res = await sendMessage(
    to,
    `Δοκιμαστικό μήνυμα από ${SHOP.name}. Το σύστημα υπενθυμίσεων λειτουργεί!`,
    channel,
  );

  return {
    ok: res.ok,
    result: res.ok
      ? `Στάλθηκε μέσω ${res.provider}${res.dryRun ? " (mock — δεν εστάλη πραγματικά)" : ""} στο ${res.to}.`
      : `Σφάλμα (${res.provider}): ${res.error}`,
  };
}
