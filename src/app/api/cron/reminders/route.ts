import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMessage, reminderText } from "@/lib/messaging";
import { SHOP } from "@/lib/site";

export const dynamic = "force-dynamic";

// Send reminders this many days before their due date.
const WINDOW_DAYS = 7;

export async function GET(request: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const until = new Date(Date.now() + WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const due = await prisma.reminder.findMany({
    where: { status: "SCHEDULED", dueDate: { lte: until } },
    include: { customer: true, vehicle: true },
    take: 200,
  });

  const url = process.env.NEXT_PUBLIC_SITE_URL || "";
  const results: Array<{ id: string; ok: boolean; provider?: string; error?: string }> = [];

  for (const r of due) {
    const phone = r.customer?.phone;
    if (!phone) continue;
    const vehicle = r.vehicle ? `${r.vehicle.make} ${r.vehicle.model}` : null;
    const text = r.message || reminderText(r.type, { vehicle, due: r.dueDate, shop: SHOP.name, url });
    const res = await sendMessage(phone, text, r.channel === "VIBER" ? "VIBER" : "SMS");
    if (res.ok) {
      await prisma.reminder.update({
        where: { id: r.id },
        data: { status: "SENT", sentAt: new Date() },
      });
    }
    results.push({ id: r.id, ok: res.ok, provider: res.provider, error: res.error });
  }

  return NextResponse.json({
    processed: due.length,
    sent: results.filter((r) => r.ok).length,
    results,
  });
}
