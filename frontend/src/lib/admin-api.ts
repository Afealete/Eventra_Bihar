import { Booking } from "./bookings";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000").replace(/\/$/, "");
function csrf() { return document.cookie.split("; ").find((item) => item.startsWith("eventra_csrf="))?.split("=")[1]; }
async function request<T>(path: string, options: RequestInit = {}): Promise<T> { const headers = new Headers(options.headers); if (options.method && options.method !== "GET") { headers.set("Content-Type", "application/json"); const token = csrf(); if (token) headers.set("X-CSRF-Token", decodeURIComponent(token)); } const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" }); if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Admin request failed"); return response.json() as Promise<T>; }
export function getAdminDashboard() { return request<{ users: { role: string; count: number }[]; vendors: { approval_status: string; count: number }[]; bookings: { status: string; count: number }[] }>("/api/admin/dashboard"); }
export function getAdminUsers() { return request<{ users: { id: number; email: string; name: string | null; role: string; emailVerified: boolean; createdAt: string }[] }>("/api/admin/users"); }
export type AdminVendor = { id: number; businessName: string; slug: string; city: string; approvalStatus: string; email: string; ownerName: string | null; categoryName: string | null; createdAt: string };
export function getAdminVendors() { return request<{ vendors: AdminVendor[] }>("/api/admin/vendors"); }
export function setVendorApproval(id: number, action: "approve" | "reject") { return request<{ vendor: AdminVendor }>(`/api/admin/vendors/${id}/${action}`, { method: "POST", body: "{}" }); }
export function getAdminBookings() { return request<{ bookings: Booking[] }>("/api/admin/bookings"); }
export async function downloadBookingReport() { const response = await fetch(`${API_BASE}/api/admin/reports/bookings`, { credentials: "include" }); if (!response.ok) throw new Error("Unable to generate report"); return response.blob(); }
