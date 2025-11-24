import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const SECRET = process.env.ADMIN_COOKIE_SECRET || "dev-secret-change-me";

async function verifyToken(token?: string) {
  if (!token) return false;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  try {
    // decode base64 payload
    const payload = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString();
    const encoder = new TextEncoder();
    const keyData = encoder.encode(SECRET);
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const expected = Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return expected === sig;
  } catch (e) {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // allow the login page
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin")) return NextResponse.next();

  const token = req.cookies.get("eventra_admin")?.value;
  const ok = await verifyToken(token);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?redirect=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
