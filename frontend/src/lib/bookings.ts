const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000").replace(/\/$/, "");

export type Booking = {
  id: number;
  status: "pending" | "confirmed" | "rejected" | "cancelled" | "completed";
  eventDate: string;
  eventLocation: string;
  guestCount: number | null;
  customerMessage: string;
  vendorResponse: string | null;
  quotedPriceMinor: number;
  createdAt: string;
  customer?: { id: number; name: string | null; email: string };
  vendor: { id: number; businessName: string; slug: string; city: string };
  service: { id: number; name: string | null };
};

function csrfToken() {
  return document.cookie.split("; ").find((entry) => entry.startsWith("eventra_csrf="))?.split("=")[1];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.method && options.method !== "GET") {
    headers.set("Content-Type", "application/json");
    const csrf = csrfToken();
    if (csrf) headers.set("X-CSRF-Token", decodeURIComponent(csrf));
  }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Booking request failed");
  return response.json() as Promise<T>;
}

export function createBooking(data: { serviceId: number; eventDate: string; eventLocation: string; guestCount?: number | null; message?: string }) {
  return request<{ booking: Booking }>("/api/bookings", { method: "POST", body: JSON.stringify(data) });
}
export function getCustomerBookings() { return request<{ bookings: Booking[] }>("/api/customer/bookings"); }
export function getVendorBookings() { return request<{ bookings: Booking[] }>("/api/vendor/bookings"); }
export function updateVendorBooking(id: number, action: "accept" | "reject" | "complete", note?: string) {
  return request<{ booking: Booking }>(`/api/vendor/bookings/${id}/${action}`, { method: "POST", body: JSON.stringify({ note }) });
}
export function createReview(bookingId: number, rating: number, comment: string) {
  return request(`/api/bookings/${bookingId}/review`, { method: "POST", body: JSON.stringify({ rating, comment }) });
}
