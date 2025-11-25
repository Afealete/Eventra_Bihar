"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import VendorSidebar from "./sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { useRouter } from "next/navigation";

const dummyBookings = [
  { id: 1, service: "Photography", date: "2025-12-10", status: "Confirmed" },
  { id: 2, service: "Venue", date: "2026-01-15", status: "Pending" },
];

const chartData = [
  { name: "Confirmed", value: 8 },
  { name: "Pending", value: 3 },
  { name: "Cancelled", value: 1 },
];
const COLORS = ["#8B000F", "#FF6F3C", "#FFD1B3"];

export default function VendorDashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/vendor/auth");
    }
  }, [user, loading, router]);
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (!user) return null;
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#8B000F]">
                Vendor Dashboard
              </h1>
              <p className="text-sm text-black/90 mt-1">Overview of your vendor activity</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                placeholder="Search bookings or customers"
                className="px-4 py-2 rounded-lg border w-72 md:w-96"
              />
              <button type="button" onClick={() => alert('Download report — demo')} className="px-4 py-2 bg-[#8B000F] text-white rounded">
                Export
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-5 flex flex-col">
              <div className="text-sm text-black/90">Total Bookings</div>
              <div className="text-2xl font-bold text-black mt-2">42</div>
            </div>
            <div className="bg-white rounded-lg shadow p-5 flex flex-col">
              <div className="text-sm text-black/90">This Month</div>
              <div className="text-2xl font-bold text-black mt-2">12</div>
            </div>
            <div className="bg-white rounded-lg shadow p-5 flex flex-col">
              <div className="text-sm text-black/90">Revenue</div>
              <div className="text-2xl font-bold text-black mt-2">₹22,000</div>
            </div>
            <div className="bg-white rounded-lg shadow p-5 flex flex-col">
              <div className="text-sm text-black/90">Pending</div>
              <div className="text-2xl font-bold text-black mt-2">3</div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-black mb-4">Monthly Revenue</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      { month: "Oct", revenue: 18000 },
                      { month: "Nov", revenue: 15000 },
                      { month: "Dec", revenue: 22000 },
                    ]}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8B000F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-black mb-3">Booking Summary</h3>
              <div className="w-full h-36">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={60}
                      fill="#8884d8"
                    >
                      {chartData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-black mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-black/90 border-b">
                    <th className="py-2">Service</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyBookings.map((b) => (
                    <tr key={b.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 text-black font-medium">{b.service}</td>
                      <td className="py-3 text-black">{b.date}</td>
                      <td className="py-3">
                        <div className={`px-3 py-1 rounded-full text-sm ${b.status === "Confirmed" ? "bg-green-600 text-white" : b.status === "Pending" ? "bg-yellow-500 text-white" : "bg-red-600 text-white"}`}>
                          {b.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
