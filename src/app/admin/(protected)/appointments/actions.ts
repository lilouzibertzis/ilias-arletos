"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import type { AppointmentStatus } from "@/generated/prisma/enums";

const STATUSES: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "WAITING_PARTS",
  "DONE",
  "PICKED_UP",
  "CANCELLED",
];

export async function setAppointmentStatus(formData: FormData) {
  await verifySession();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !STATUSES.includes(status as AppointmentStatus)) return;

  await prisma.appointment.update({
    where: { id },
    data: { status: status as AppointmentStatus },
  });

  revalidatePath(`/admin/appointments/${id}`);
  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
}

/** Turns a walk-in/web booking into a saved customer record and links it. */
export async function convertToCustomer(formData: FormData) {
  await verifySession();

  const id = String(formData.get("id") ?? "");
  const appt = await prisma.appointment.findUnique({ where: { id } });
  if (!appt || appt.customerId) return;

  const customer = await prisma.customer.create({
    data: {
      name: appt.contactName,
      phone: appt.contactPhone,
      email: appt.contactEmail,
      notes: appt.vehicleInfo ? `Όχημα από κράτηση: ${appt.vehicleInfo}` : null,
    },
  });

  await prisma.appointment.update({
    where: { id },
    data: {
      customerId: customer.id,
      status: appt.status === "PENDING" ? "CONFIRMED" : appt.status,
    },
  });

  revalidatePath(`/admin/appointments/${id}`);
  redirect(`/admin/customers/${customer.id}`);
}
