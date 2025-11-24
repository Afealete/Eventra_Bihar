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

  return (
    <aside
      className={`h-full ${
        collapsed ? "w-20" : "w-64"
      } bg-[#8B000F] text-white flex flex-col py-4 px-3 md:px-4 shadow-lg transition-width duration-200 relative`}
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
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((c) => !c)}
          className="bg-white/10 hover:bg-white/20 p-1 rounded focus:outline-none focus:ring-2 focus:ring-white"
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                active
                  ? "bg-white text-[#8B000F]"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`${collapsed ? "hidden" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className={`mt-auto px-3 py-4 ${collapsed ? "text-center" : ""}`}>
        <button
          onClick={() => router.push("/vendor/dashboard/profile")}
          className="w-full text-sm bg-white/10 hover:bg-white/20 rounded py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-white"
        >
          {collapsed ? "⚙️" : "Account settings"}
        </button>
        <button
          onClick={async () => {
              try {
                await signOut(auth);
                router.replace("/");
              } catch (e) {
                // use logger to avoid noisy client logs in production
                (await import("../../../lib/logger")).error("Sign out failed", e);
              }
            }}
          className="w-full text-sm bg-red-600 hover:bg-red-700 rounded py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white"
        >
          {collapsed ? "⎋" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
