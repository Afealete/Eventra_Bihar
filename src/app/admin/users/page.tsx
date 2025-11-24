"use client";
import React from "react";

export default function AdminUsers() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-4">Users</h2>
      <p className="text-sm text-black/90 mb-4">Manage registered customers and vendors.</p>
      <div className="bg-white rounded-lg shadow p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-black/90 border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Role</th>
              <th className="py-2">Email</th>
              <th className="py-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">Demo User</td>
              <td className="py-3">Customer</td>
              <td className="py-3">demo@example.com</td>
              <td className="py-3">2025-01-01</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
