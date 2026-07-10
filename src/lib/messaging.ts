import "server-only";
import type { ReminderType } from "@/generated/prisma/enums";

export type MsgChannel = "SMS" | "VIBER";

export type SendResult = {
  ok: boolean;
  provider: string;
  channel: MsgChannel;
  to: string;
  id?: string;
  error?: string;
  dryRun?: boolean;
};

const PROVIDER = (
  process.env.SMS_PROVIDER || (process.env.YUBOTO_API_KEY ? "yuboto" : "mock")
).toLowerCase();
const SMS_SENDER = process.env.SMS_SENDER || "Arletos";

/**
 * Normalize a Greek phone number to international format without the '+'.
 * e.g. "698 656 6003" / "+306986566003" / "6986566003" -> "306986566003".
 */
export function normalizeGreekPhone(input: string): string {
  let d = (input || "").replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("30")) return d;
  if (d.length === 10) return "30" + d;
  return d;
}

export async function sendMessage(
  to: string,
  text: string,
  channel: MsgChannel = "SMS",
): Promise<SendResult> {
  const num = normalizeGreekPhone(to);
  if (PROVIDER === "yuboto") return sendViaYuboto(num, text, channel);
  return sendViaMock(num, text, channel);
}

/** Default provider: logs the message instead of sending. Fully functional for demos. */
async function sendViaMock(
  to: string,
  text: string,
  channel: MsgChannel,
): Promise<SendResult> {
  console.log(`[messaging:mock] (${channel}) → ${to}: ${text}`);
  return { ok: true, provider: "mock", channel, to, dryRun: true, id: `mock-${Date.now()}` };
}

/**
 * Yuboto Omnichannel (SMS + Viber) — Greek gateway.
 * Requires YUBOTO_API_KEY. The exact payload should be verified against your
 * account's live API on the first real send; the shape below follows Yuboto's
 * Omni /Send endpoint. Viber additionally needs an approved sender id.
 */
async function sendViaYuboto(
  to: string,
  text: string,
  channel: MsgChannel,
): Promise<SendResult> {
  const apiKey = process.env.YUBOTO_API_KEY;
  if (!apiKey) {
    return { ok: false, provider: "yuboto", channel, to, error: "YUBOTO_API_KEY is not set" };
  }

  const body =
    channel === "VIBER"
      ? {
          phonenumbers: to,
          // Try Viber first, fall back to SMS if undelivered.
          channel: [
            {
              viber: {
                sender: process.env.VIBER_SENDER || SMS_SENDER,
                text,
                fallbackOnFailedDelivery: true,
              },
            },
            { sms: { sender: SMS_SENDER, text } },
          ],
        }
      : { phonenumbers: to, channel: [{ sms: { sender: SMS_SENDER, text } }] };

  try {
    const res = await fetch("https://services.yuboto.com/omni/v1/Send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: apiKey },
      body: JSON.stringify(body),
    });
    const data: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        provider: "yuboto",
        channel,
        to,
        error: `HTTP ${res.status}: ${JSON.stringify(data)}`,
      };
    }
    const id =
      (data as { id?: string; messageId?: string })?.id ??
      (data as { messageId?: string })?.messageId;
    return { ok: true, provider: "yuboto", channel, to, id: id ? String(id) : undefined };
  } catch (error) {
    return { ok: false, provider: "yuboto", channel, to, error: (error as Error).message };
  }
}

// ── Greek message templates per reminder type ─────────────────

export function reminderText(
  type: ReminderType,
  ctx: { vehicle?: string | null; due: Date; shop: string; url: string },
): string {
  const d = new Intl.DateTimeFormat("el-GR", { dateStyle: "short" }).format(new Date(ctx.due));
  const v = ctx.vehicle ? ` (${ctx.vehicle})` : "";
  switch (type) {
    case "KTEO":
      return `Υπενθύμιση: το ΚΤΕΟ του οχήματός σας${v} λήγει στις ${d}. Κλείστε ραντεβού: ${ctx.url} — ${ctx.shop}`;
    case "SERVICE_DUE":
      return `Υπενθύμιση: πλησιάζει το service στο όχημά σας${v}. Κλείστε ραντεβού: ${ctx.url} — ${ctx.shop}`;
    case "ROAD_TAX":
      return `Υπενθύμιση: τα τέλη κυκλοφορίας λήγουν στις ${d}. — ${ctx.shop}`;
    case "TYRE_CHANGE":
      return `Υπενθύμιση: ώρα για αλλαγή ελαστικών${v}. Κλείστε ραντεβού: ${ctx.url} — ${ctx.shop}`;
    default:
      return `Υπενθύμιση από ${ctx.shop}${v}. Λήξη: ${d}.`;
  }
}

export const messagingProvider = PROVIDER;
