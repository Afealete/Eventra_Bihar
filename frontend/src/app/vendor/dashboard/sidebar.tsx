"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "../../../lib/auth";

const items = [
  ["Dashboard", "/vendor/dashboard"],
  ["Profile", "/vendor/dashboard/profile"],
  ["Services", "/vendor/dashboard/services"],
  ["Availability", "/vendor/dashboard/availability"],
  ["Bookings", "/vendor/dashboard/bookings"],
] as const;

export default function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    `block rounded-xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B000F] focus-visible:ring-offset-2 ${
      pathname === href
        ? "border-[#edc9bd] bg-[#fff0f3] text-[#8B000F] shadow-sm"
        : "border-transparent text-slate-700 hover:border-[#f0ded8] hover:bg-[#fff7f3] hover:text-[#8B000F]"
    }`;

  const signOut = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open vendor navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-[#f0ded8] bg-white p-2 text-[#8B000F] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B000F] md:hidden"
      >
        {open ? "×" : "☰"}
      </button>
      {open && (
        <button
          type="button"
          aria-label="Close vendor navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm md:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#f0ded8] bg-[#fffdfc] px-4 py-6 text-slate-900 shadow-xl transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-sm ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-[#f0ded8] px-3 pb-6">
          <Link href="/vendor/dashboard" className="font-serif text-2xl font-bold text-[#8B000F]" onClick={() => setOpen(false)}>
            Eventra <span className="text-[#d45b35]">Vendor</span>
          </Link>
          <p className="mt-2 text-sm text-slate-600">Manage your event business</p>
          <span className="mt-4 inline-flex rounded-full bg-[#fff0f3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8B000F]">
            Vendor workspace
          </span>
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {items.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={linkClass(href)}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-[#f0ded8] pt-4">
          <Link href="/services" className={linkClass("/services")}>View marketplace</Link>
          <Link href="/vendor/dashboard/payments" className={linkClass("/vendor/dashboard/payments")}>Payment information</Link>
          <button
            type="button"
            onClick={signOut}
            className="w-full rounded-xl border border-[#8B000F] bg-white px-4 py-3 text-left text-sm font-bold text-[#8B000F] transition hover:bg-[#fff0f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B000F] focus-visible:ring-offset-2"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
