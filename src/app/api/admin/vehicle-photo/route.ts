import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const vehicleId = String(form.get("vehicleId") ?? "");
  const file = form.get("file");

  if (!vehicleId || !(file instanceof File)) {
    return NextResponse.json({ error: "Λείπουν στοιχεία." }, { status: 400 });
  }
  const mimeType = file.type || "image/jpeg";
  if (!mimeType.startsWith("image/")) {
    return NextResponse.json({ error: "Επιτρέπονται μόνο εικόνες." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_BYTES) {
    return NextResponse.json({ error: "Η εικόνα είναι πολύ μεγάλη (μέγιστο 8MB)." }, { status: 413 });
  }

  const photo = await prisma.vehiclePhoto.create({
    data: { vehicleId, data: bytes, mimeType },
    select: { id: true },
  });

  return NextResponse.json({ id: photo.id });
}
