"use client";
import React, { useState } from "react";

type Booking = {
  id: string;
  customer: string;
  vendor: string;
  date: string;
  amount: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
};

const sampleBookings: Booking[] = [
  {
    id: "b101",
    customer: "Priya & Aman",
    vendor: "Dream Weddings",
    date: "2025-12-10",
    amount: 45000,
    status: "Confirmed",
  },
  {
    id: "b102",
    customer: "Rohit & Neha",
    vendor: "Royal Banquets",
    date: "2026-01-15",
    amount: 120000,
    status: "Pending",
  },
  {
    id: "b103",
    customer: "Sakshi & Arjun",
    vendor: "TasteCater",
    date: "2026-02-20",
    amount: 70000,
    status: "Completed",
  },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);

  const updateStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-black mb-4">Bookings</h2>
      <p className="text-sm text-black/90 mb-4">
        Manage bookings and payments.
      </p>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-black/90 border-b">
                <th className="py-2">ID</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Vendor</th>
                <th className="py-2">Date</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{b.id}</td>
                  <td className="py-3">{b.customer}</td>
                  <td className="py-3">{b.vendor}</td>
                  <td className="py-3">{b.date}</td>
                  <td className="py-3">₹{b.amount.toLocaleString()}</td>
                  <td className="py-3">{b.status}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateStatus(b.id, "Confirmed")}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(b.id, "Cancelled")}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 bg-white border rounded"
                      >
                        Details
                      </button>
                    </div>
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
