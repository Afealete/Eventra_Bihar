"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";

const navItems = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: "📊" },
  { label: "Profile", href: "/vendor/dashboard/profile", icon: "👤" },
  { label: "Bookings", href: "/vendor/dashboard/bookings", icon: "📅" },
  { label: "Payments", href: "/vendor/dashboard/payments", icon: "💳" },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Hamburger button (visible on mobile) */}
      <button
        type="button"
        onClick={() => setMobileOpen((m) => !m)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#8B000F] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 md:z-auto transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${
          collapsed ? "md:w-20" : "md:w-64"
        } w-64 md:h-full bg-[#8B000F] text-white flex flex-col py-4 px-3 md:px-4 shadow-lg relative`}
      >
        <div className="flex items-center justify-between px-2 mb-6">
          <div
            className={`font-extrabold text-lg ${
              collapsed ? "opacity-0 w-0 overflow-hidden" : ""
            }`}
          >
            Vendor Panel
          </div>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((c) => !c)}
            className="hidden md:block bg-white/10 hover:bg-white/20 p-1 rounded focus:outline-none focus:ring-2 focus:ring-white"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                  active
                    ? "bg-white text-[#8B000F]"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`${collapsed ? "md:hidden" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={`mt-auto px-3 py-4 ${collapsed ? "text-center" : ""}`}>
          <button
            type="button"
            onClick={() => router.push("/vendor/dashboard/profile")}
            className="w-full text-sm bg-white/10 hover:bg-white/20 rounded py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {collapsed ? "⚙️" : "Account settings"}
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await signOut(auth);
                router.replace("/");
              } catch (e) {
                (await import("../../../lib/logger")).error(
                  "Sign out failed",
                  e
                );
              }
            }}
            className="w-full text-sm bg-red-600 hover:bg-red-700 rounded py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white"
          >
            {collapsed ? "⎋" : "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}
