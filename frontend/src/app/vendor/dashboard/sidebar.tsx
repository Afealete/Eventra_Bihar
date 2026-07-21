"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "../../../lib/auth";

const items = [["Dashboard", "/vendor/dashboard"], ["Profile", "/vendor/dashboard/profile"], ["Services", "/vendor/dashboard/services"], ["Availability", "/vendor/dashboard/availability"], ["Bookings", "/vendor/dashboard/bookings"]] as const;
export default function VendorSidebar() {
  const pathname = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false);
  const linkClass = (href: string) => `block rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${pathname === href ? "bg-white text-[#8B000F]" : "text-white hover:bg-white/15"}`;
  const signOut = async () => { await logout(); router.replace("/"); };
  return <><button type="button" aria-label="Open vendor navigation" aria-expanded={open} onClick={() => setOpen(!open)} className="fixed left-4 top-4 z-50 rounded-lg bg-[#8B000F] p-2 text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:hidden">{open ? "×" : "☰"}</button>{open && <button aria-label="Close vendor navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/40 md:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#72102b] px-4 py-6 text-white shadow-xl transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><Link href="/vendor/dashboard" className="px-3 font-serif text-2xl font-bold" onClick={() => setOpen(false)}>Eventra <span className="text-[#ffd1b3]">Vendor</span></Link><p className="mt-2 px-3 text-sm text-white/75">Manage your event business</p><nav className="mt-8 flex flex-1 flex-col gap-2">{items.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={linkClass(href)}>{label}</Link>)}</nav><div className="space-y-2 border-t border-white/15 pt-4"><Link href="/services" className={linkClass("/services")}>View marketplace</Link><Link href="/vendor/dashboard/payments" className={linkClass("/vendor/dashboard/payments")}>Payment information</Link><button type="button" onClick={signOut} className="w-full rounded-xl bg-white px-4 py-3 text-left text-sm font-bold text-[#8B000F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Sign out</button></div></aside></>;
}
