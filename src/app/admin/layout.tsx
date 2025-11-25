import React from "react";
import AdminSidebar from "../../components/AdminSidebarStyled";

export const metadata = {
  title: "Admin - Eventra",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
