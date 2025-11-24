import { NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@eventra.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SECRET = process.env.ADMIN_COOKIE_SECRET || "dev-secret-change-me";

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const payload = JSON.stringify({ email, ts: Date.now() });
    const token = `${Buffer.from(payload).toString("base64")}.${sign(payload)}`;

    const res = NextResponse.json({ ok: true });
    const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
    // Set HttpOnly cookie for /admin paths. Use SameSite=Strict and Secure in production.
    res.headers.set(
      "Set-Cookie",
      `eventra_admin=${token}; HttpOnly; Path=/; Max-Age=86400; ${secure}SameSite=Strict`
    );
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
