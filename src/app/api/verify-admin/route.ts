import { NextResponse } from "next/server";
import crypto from "crypto";

function verifyToken(token?: string) {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  try {
    const payload = Buffer.from(b64, "base64").toString();
    const secret = process.env.ADMIN_COOKIE_SECRET || "dev-secret-change-me";
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (expected !== sig) return null;
    const obj = JSON.parse(payload);
    return obj;
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    // Prefer cookie-based admin token
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/(?:^|; )eventra_admin=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    const payload = verifyToken(token || undefined);
    if (!payload) return NextResponse.json({ admin: false }, { status: 403 });
    return NextResponse.json({ admin: true, email: payload.email, ts: payload.ts });
  } catch (err: any) {
    console.error("verify-admin error", err?.message || err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Send POST to verify admin cookie" });
}
