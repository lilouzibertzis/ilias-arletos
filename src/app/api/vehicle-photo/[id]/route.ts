import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Public: serves a stored service-book photo by id (ids are unguessable cuids).
export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const photo = await prisma.vehiclePhoto.findUnique({
    where: { id },
    select: { data: true, mimeType: true },
  });

  if (!photo) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(photo.data), {
    headers: {
      "Content-Type": photo.mimeType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
