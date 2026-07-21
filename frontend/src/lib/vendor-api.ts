import { Vendor, VendorService } from "./vendors";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000").replace(/\/$/, "");

function csrfToken() {
  return document.cookie.split("; ").find((entry) => entry.startsWith("eventra_csrf="))?.split("=")[1];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const csrf = csrfToken();
  if (csrf && options.method && options.method !== "GET") headers.set("X-CSRF-Token", decodeURIComponent(csrf));
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Vendor request failed");
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getVendorProfile() {
  return request<{ vendor: Vendor | null }>("/api/vendor/profile");
}

export function saveVendorProfile(profile: { businessName: string; categorySlug: string; city: string; description: string; phone?: string | null; avatarUrl?: string | null; priceFromMinor?: number | null }) {
  return request<{ vendor: Vendor }>("/api/vendor/profile", { method: "POST", body: JSON.stringify(profile) });
}

export function getMyServices() {
  return request<{ services: VendorService[] }>("/api/vendor/services");
}

export function createService(service: { name: string; description: string; priceFromMinor: number }) {
  return request<{ service: VendorService }>("/api/vendor/services", { method: "POST", body: JSON.stringify(service) });
}

export function updateService(id: number, service: Partial<Pick<VendorService, "name" | "description" | "priceFromMinor" | "isActive">>) {
  return request<{ service: VendorService }>(`/api/vendor/services/${id}`, { method: "PATCH", body: JSON.stringify(service) });
}

export function deleteService(id: number) {
  return request<void>(`/api/vendor/services/${id}`, { method: "DELETE" });
}

export type AvailabilitySlot = { id: number; startsAt: string; endsAt: string; isAvailable: boolean };
export function getAvailability() { return request<{ availability: AvailabilitySlot[] }>("/api/vendor/availability"); }
export function createAvailability(data: { startsAt: string; endsAt: string; isAvailable?: boolean }) { return request<{ availability: AvailabilitySlot }>("/api/vendor/availability", { method: "POST", body: JSON.stringify(data) }); }
export function deleteAvailability(id: number) { return request<void>(`/api/vendor/availability/${id}`, { method: "DELETE" }); }

async function upload(path: string, image: File, altText?: string) {
  const csrf = csrfToken();
  const body = new FormData();
  body.append("image", image);
  if (altText) body.append("altText", altText);
  const response = await fetch(`${API_BASE}${path}`, { method: "POST", credentials: "include", headers: csrf ? { "X-CSRF-Token": decodeURIComponent(csrf) } : {}, body });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Image upload failed");
  return response.json() as Promise<{ url?: string; image?: { id: number; url: string; altText: string | null } }>;
}

export function uploadProfileImage(image: File) { return upload("/api/vendor/profile/image", image); }
export function uploadServiceImage(serviceId: number, image: File, altText?: string) { return upload(`/api/vendor/services/${serviceId}/images`, image, altText); }
