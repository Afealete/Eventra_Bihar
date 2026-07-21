import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 replacement for middleware.ts. Express remains the authorization
// source of truth; this only avoids rendering the protected admin shell when
// no Eventra access cookie is present.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") return NextResponse.next();

  if (!req.cookies.get("eventra_access")?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
