const API_BASE = process.env.NODE_ENV === "production"
  ? "/backend"
  : (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000").replace(/\/$/, "");

export type VendorCategory = { id?: number; name: string; slug: string };
export type Vendor = {
  id: number;
  businessName: string;
  slug: string;
  city: string;
  state: string;
  description: string;
  phone?: string | null;
  avatarUrl: string | null;
  priceFromMinor: number | null;
  category: VendorCategory | null;
  approvalStatus?: string;
  services?: VendorService[];
  reviews?: { id: number; rating: number; comment: string; customerName: string | null; createdAt: string }[];
};
export type VendorService = {
  id: number;
  name: string;
  description: string;
  priceFromMinor: number;
  isActive?: boolean;
  images?: { id: number; url: string; altText: string | null }[];
  packages?: { id: number; name: string; description: string; priceMinor: number }[];
};
export type VendorAvailability = { id: number; startsAt: string; endsAt: string; isAvailable: boolean };

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "Unable to load vendor data");
  return response.json() as Promise<T>;
}

export function formatINR(minor: number | null) {
  if (minor === null) return "Contact for pricing";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(minor / 100);
}

export function getCategories() {
  return get<{ categories: VendorCategory[] }>("/api/categories");
}

export function getVendors(filters: { search?: string; category?: string; city?: string } = {}) {
  const params = new URLSearchParams({ limit: "24" });
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.city) params.set("city", filters.city);
  return get<{ vendors: Vendor[] }>(`/api/vendors?${params.toString()}`);
}

export function getVendor(slug: string) {
  return get<{ vendor: Vendor }>(`/api/vendors/${encodeURIComponent(slug)}`);
}

export function getVendorAvailability(slug: string) {
  return get<{ availability: VendorAvailability[] }>(`/api/vendors/${encodeURIComponent(slug)}/availability`);
}
