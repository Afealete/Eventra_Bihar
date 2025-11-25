"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  role: "Customer" | "Vendor";
  email: string;
  joined: string;
};

const sampleUsers: User[] = [
  {
    id: "u1",
    name: "Demo User",
    role: "Customer",
    email: "demo@example.com",
    joined: "2025-01-01",
  },
  {
    id: "u2",
    name: "Ramesh Kumar",
    role: "Vendor",
    email: "ramesh@example.com",
    joined: "2024-03-12",
  },
  {
    id: "u3",
    name: "Sunita Sharma",
    role: "Customer",
    email: "sunita@example.com",
    joined: "2024-06-02",
  },
];

export default function AdminUsers() {
  const [users] = useState<User[]>(sampleUsers);
  const router = useRouter();

  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-4">Users</h2>
      <p className="text-sm text-black/90 mb-4">
        Manage registered customers and vendors.
      </p>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-black/90 border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Role</th>
                <th className="py-2">Email</th>
                <th className="py-2">Joined</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{u.name}</td>
                  <td className="py-3">{u.role}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3">{u.joined}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => router.push(`/admin/users/${u.id}`)}
                      className="px-3 py-1 bg-[#8B000F] text-white rounded"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
