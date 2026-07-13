"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export type FormResult = { ok?: boolean; error?: string };

const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const strOrNull = (v: FormDataEntryValue | null) => str(v) || null;
function intOrNull(v: FormDataEntryValue | null): number | null {
  const digits = str(v).replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : null;
}

export async function addVehicle(_prev: FormResult, formData: FormData): Promise<FormResult> {
  await verifySession();
  const customerId = str(formData.get("customerId"));
  const make = str(formData.get("make"));
  const model = str(formData.get("model"));
  if (!customerId) return { ok: false, error: "Λείπει ο πελάτης." };
  if (!make || !model) return { ok: false, error: "Συμπληρώστε μάρκα και μοντέλο." };

  const vehicle = await prisma.vehicle.create({
    data: {
      customerId,
      make,
      model,
      year: intOrNull(formData.get("year")),
      plate: strOrNull(formData.get("plate")),
      vin: strOrNull(formData.get("vin")),
      mileage: intOrNull(formData.get("mileage")),
    },
  });

  // If this is the customer's only car, auto-link their open appointments to it
  // so the status shows on the customer's online service book.
  const vehicleCount = await prisma.vehicle.count({ where: { customerId } });
  if (vehicleCount === 1) {
    await prisma.appointment.updateMany({
      where: {
        customerId,
        vehicleId: null,
        status: { notIn: ["PICKED_UP", "CANCELLED"] },
      },
      data: { vehicleId: vehicle.id },
    });
  }

  revalidatePath(`/admin/customers/${customerId}`);
  return { ok: true };
}

export async function addServiceRecord(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  await verifySession();
  const vehicleId = str(formData.get("vehicleId"));
  const customerId = str(formData.get("customerId"));
  const description = str(formData.get("description"));
  if (!vehicleId || !description) {
    return { ok: false, error: "Συμπληρώστε την περιγραφή της εργασίας." };
  }
  const performedAt = str(formData.get("performedAt"));

  await prisma.serviceRecord.create({
    data: {
      vehicleId,
      description,
      parts: strOrNull(formData.get("parts")),
      cost: intOrNull(formData.get("cost")),
      mileage: intOrNull(formData.get("mileage")),
      performedAt: performedAt ? new Date(performedAt) : new Date(),
    },
  });

  revalidatePath(`/admin/customers/${customerId}`);
  return { ok: true };
}

export async function deleteVehiclePhoto(formData: FormData) {
  await verifySession();
  const id = str(formData.get("id"));
  const customerId = str(formData.get("customerId"));
  if (!id) return;
  await prisma.vehiclePhoto.delete({ where: { id } }).catch(() => {});
  if (customerId) revalidatePath(`/admin/customers/${customerId}`);
}
