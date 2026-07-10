import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * Verifies the admin session for the current request. Redirects to the login
 * page if there is no valid session. Memoized per-request with React `cache`.
 */
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session?.adminId) {
    redirect("/admin/login");
  }
  return session;
});

/** Returns the full admin record for the logged-in user (or redirects). */
export const getCurrentAdmin = cache(async () => {
  const session = await verifySession();
  const admin = await prisma.adminUser.findUnique({
    where: { id: session.adminId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
});
