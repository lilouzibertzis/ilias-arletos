import { NextResponse, type NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";

/**
 * Optimistic auth gate for the admin area (Next 16 renamed `middleware` →
 * `proxy`, Node.js runtime). Real enforcement also happens in the DAL
 * (`verifySession`) next to the data — this just handles redirects fast.
 */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const session = await decrypt(req.cookies.get(SESSION_COOKIE)?.value);

  // Not logged in → bounce everything except the login page to login.
  if (!isLoginPage && !session?.adminId) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  // Already logged in → keep them out of the login page.
  if (isLoginPage && session?.adminId) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
