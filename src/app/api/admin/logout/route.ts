import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
  // Clear cookie with same flags
  res.headers.set(
    "Set-Cookie",
    `eventra_admin=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; ${secure}SameSite=Strict`
  );
  return res;
}
