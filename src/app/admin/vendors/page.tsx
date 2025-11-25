"use client";
import React, { useState } from "react";
import Link from "next/link";

type Vendor = {
  id: string;
  name: string;
  category: string;
  location: string;
  email: string;
};

const sampleVendors: Vendor[] = [
  {
    id: "v1",
    name: "Dream Weddings",
    category: "Venue",
    location: "Patna",
    email: "contact@dreamweddings.com",
  },
  {
    id: "v2",
    name: "Royal Banquets",
    category: "Catering",
    location: "Gaya",
    email: "hello@royalbanquets.com",
  },
  {
    id: "v3",
    name: "TasteCater",
    category: "Catering",
    location: "Patna",
    email: "info@tastecater.com",
  },
];

export default function AdminVendors() {
  const [vendors] = useState<Vendor[]>(sampleVendors);

  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-4">Vendors</h2>
      <p className="text-sm text-black/90 mb-4">
        Manage vendor listings and profiles.
      </p>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-black/90 border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Location</th>
                <th className="py-2">Email</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{v.name}</td>
                  <td className="py-3">{v.category}</td>
                  <td className="py-3">{v.location}</td>
                  <td className="py-3">{v.email}</td>
                  <td className="py-3">
                    <Link
                      href={`/customer/vendor?id=${v.id}`}
                      className="inline-block"
                    >
                      <button
                        type="button"
                        className="px-3 py-1 bg-[#8B000F] text-white rounded"
                      >
                        View
                      </button>
                    </Link>
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
