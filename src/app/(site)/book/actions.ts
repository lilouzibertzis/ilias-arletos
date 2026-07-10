"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type BookingState = {
  ok: boolean;
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

const schema = z.object({
  serviceType: z.string().trim().min(1, "Επιλέξτε υπηρεσία."),
  scheduledDate: z.string().min(1, "Επιλέξτε ημερομηνία."),
  scheduledTime: z.string().min(1, "Επιλέξτε ώρα."),
  contactName: z.string().trim().min(2, "Συμπληρώστε το ονοματεπώνυμό σας."),
  contactPhone: z
    .string()
    .trim()
    .min(10, "Συμπληρώστε έγκυρο τηλέφωνο (τουλάχιστον 10 ψηφία)."),
  contactEmail: z.union([z.literal(""), z.email("Μη έγκυρο email.")]).optional(),
  vehicleInfo: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export async function createBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const d = parsed.data;
  const scheduledAt = new Date(`${d.scheduledDate}T${d.scheduledTime}`);

  if (Number.isNaN(scheduledAt.getTime())) {
    return { ok: false, errors: { scheduledDate: ["Μη έγκυρη ημερομηνία ή ώρα."] } };
  }
  if (scheduledAt.getTime() < Date.now()) {
    return { ok: false, errors: { scheduledDate: ["Επιλέξτε μελλοντική ημερομηνία."] } };
  }

  try {
    await prisma.appointment.create({
      data: {
        contactName: d.contactName,
        contactPhone: d.contactPhone,
        contactEmail: d.contactEmail || null,
        vehicleInfo: d.vehicleInfo || null,
        serviceType: d.serviceType,
        notes: d.notes || null,
        scheduledAt,
        status: "PENDING",
        source: "WEB",
      },
    });
  } catch (error) {
    console.error("Booking failed:", error);
    return {
      ok: false,
      message: "Κάτι πήγε στραβά. Παρακαλούμε δοκιμάστε ξανά ή καλέστε μας.",
    };
  }

  return { ok: true };
}
