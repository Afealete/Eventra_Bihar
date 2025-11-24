"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname() || "";

  const navItems: { href: string; label: string }[] = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/vendors", label: "Vendors" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/reports", label: "Reports" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:block md:col-span-1">
      <div className="sticky top-6 p-4 bg-white rounded-lg shadow h-[calc(100vh-3rem)]">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#8B000F]">Eventra Admin</h3>
          <p className="text-sm text-black/80">Control panel</p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((it) => (
            <Link key={it.href} href={it.href} className={`block px-3 py-2 rounded ${isActive(it.href) ? "bg-[#8B000F] text-white font-semibold" : "hover:bg-gray-50 text-black"}`}>
              {it.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={async () => {
              try {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.href = "/admin/login";
              } catch (e) {
                console.error("Logout failed", e);
              }
            }}
            className="mt-4 px-3 py-2 bg-white border border-gray-200 rounded text-left"
          >
            Sign out
          </button>
        </nav>
      </div>
    </aside>
  );
}
