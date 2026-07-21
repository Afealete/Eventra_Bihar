import React from "react";
import AdminShell from "./AdminShell";

export const metadata = {
  title: "Admin - Eventra",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
