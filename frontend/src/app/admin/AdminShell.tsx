"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AuthGuard from "../../components/AuthGuard";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The login route lives under /admin for URL clarity, but it must remain
  // publicly reachable so an unauthenticated administrator can sign in.
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-10 pt-16 md:pt-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
