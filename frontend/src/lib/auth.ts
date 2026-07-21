import { auth, googleProvider, signInWithPopup } from "./firebase";
import { signOut } from "firebase/auth";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000").replace(/\/$/, "");

export type UserRole = "customer" | "vendor" | "admin";
export type PublicAuthRole = Exclude<UserRole, "admin">;

export type CurrentUser = {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  emailVerified: boolean;
  phone: string | null;
  about: string | null;
  photo: string | null;
  price: string | null;
};

function csrfToken() {
  if (typeof document === "undefined") return undefined;
  return document.cookie.split("; ").find((entry) => entry.startsWith("eventra_csrf="))?.split("=")[1];
}

async function request<T>(path: string, options: RequestInit = {}, includeCsrf = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (includeCsrf) {
    const token = csrfToken();
    if (token) headers.set("X-CSRF-Token", decodeURIComponent(token));
  }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Request failed");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  return request<{ user: CurrentUser }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(email: string, password: string, name?: string, role: PublicAuthRole = "customer") {
  return request<{ user: CurrentUser }>("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, role }),
  });
}

export async function me() {
  try {
    return await request<{ user: CurrentUser }>("/me");
  } catch (_error) {
    return null;
  }
}

export async function refresh() {
  return request<{ user: CurrentUser }>("/auth/refresh", { method: "POST" });
}

export async function logout() {
  try {
    await request<void>("/auth/logout", { method: "POST" }, true);
  } finally {
    // Firebase Auth is only a Google identity provider here. Clear its local
    // browser state as well so a later popup does not silently reuse it.
    await signOut(auth).catch(() => undefined);
  }
}

export async function updateProfile(data: { name?: string; phone?: string; about?: string; photo?: string; price?: string }) {
  return request<{ user: CurrentUser }>("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }, true);
}

export async function firebaseGoogleLogin(role: PublicAuthRole = "customer") {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    const idToken = await credential.user.getIdToken();
    return await request<{ user: CurrentUser }>("/auth/firebase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, role }),
    });
  } catch (error: any) {
    const messages: Record<string, string> = {
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
      "auth/popup-blocked": "Your browser blocked the Google sign-in popup. Allow popups and try again.",
      "auth/account-selection-required": "Select a Google account to continue.",
      "auth/network-request-failed": "Unable to reach Google sign-in. Check your connection and try again.",
      "auth/operation-not-allowed": "Google sign-in is not enabled for this application.",
      "auth/invalid-api-key": "Firebase sign-in is not configured correctly.",
      "auth/invalid-api-key-not-valid": "Firebase sign-in is not configured correctly.",
      "auth/internal-error": "Google sign-in is not configured correctly. Confirm the Firebase Google provider settings and try again.",
    };
    if (typeof error?.code === "string" && messages[error.code]) throw new Error(messages[error.code]);
    throw error;
  }
}
