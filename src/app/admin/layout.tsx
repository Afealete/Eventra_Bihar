import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

export const metadata = {
  title: "Admin - Eventra",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 pt-16 md:pt-6">{children}</main>
    </div>
  );
}
