"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems: { href: string; label: string; icon?: string }[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/vendors", label: "Vendors", icon: "🏷️" },
  { href: "/admin/bookings", label: "Bookings", icon: "📅" },
  { href: "/admin/reports", label: "Reports", icon: "📈" },
];

export default function AdminSidebarStyled() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

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
          Admin Panel
        </div>
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((c) => !c)}
          className="bg-white/10 hover:bg-white/20 p-1 rounded focus:outline-none focus:ring-2 focus:ring-white"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((it) => {
          const active = isActive(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                active
                  ? "bg-white text-[#8B000F]"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <span className="text-xl">{it.icon}</span>
              <span className={`${collapsed ? "hidden" : ""}`}>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={`mt-auto px-3 py-4 ${collapsed ? "text-center" : ""}`}>
        <button
          type="button"
          onClick={() => router.push("/admin/login")}
          className="w-full text-sm bg-white/10 hover:bg-white/20 rounded py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-white"
        >
          {collapsed ? "⚙️" : "Account settings"}
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await fetch("/api/admin/logout", { method: "POST" });
              router.replace("/auth");
            } catch (e) {
              (await import("../lib/logger")).error("Sign out failed", e);
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
