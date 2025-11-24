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
      router.replace("/customer/auth");
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
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-extrabold mb-8 text-[#8B000F]">
          Vendor Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-sm text-black/80">Total Bookings</div>
            <div className="text-2xl font-bold">42</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-sm text-black/80">This Month</div>
            <div className="text-2xl font-bold">12</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-sm text-black/80">Revenue</div>
            <div className="text-2xl font-bold">₹22,000</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-sm text-black/80">Pending</div>
            <div className="text-2xl font-bold">3</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center col-span-1">
            <h2 className="text-2xl font-bold mb-4 text-[#8B000F]">
              Booking Summary
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4">
              {chartData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1 text-sm">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: COLORS[i] }}
                  ></span>
                  {d.name}
                </span>
              ))}
            </div>
          </div>
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-[#8B000F]">
              Monthly Revenue
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[
                  { month: "Oct", revenue: 18000 },
                  { month: "Nov", revenue: 15000 },
                  { month: "Dec", revenue: 22000 },
                ]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                {/* ...existing code... */}
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8B000F" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Links */}
          <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-[#8B000F]">
              Quick Links
            </h2>
            <div className="flex flex-col gap-4 w-full">
              <Link
                href="/vendor/dashboard/profile"
                className="bg-[#8B000F] text-white px-6 py-3 rounded-lg font-semibold text-center shadow"
              >
                Edit Profile
              </Link>
              <Link
                href="/vendor/dashboard/bookings"
                className="bg-[#FF6F3C] text-white px-6 py-3 rounded-lg font-semibold text-center shadow"
              >
                View Bookings
              </Link>
              <Link
                href="/vendor/dashboard/payments"
                className="bg-[#FFD1B3] text-[#8B000F] px-6 py-3 rounded-lg font-semibold text-center shadow"
              >
                Payment Status
              </Link>
            </div>
          </div>
          {/* Analytics Section */}
          <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-[#8B000F]">
              Analytics
            </h2>
            <ul className="w-full text-black text-lg space-y-2">
              <li>
                New Bookings This Month: <span className="font-bold">12</span>
              </li>
              <li>
                Completed Events: <span className="font-bold">27</span>
              </li>
              <li>
                Pending Payments: <span className="font-bold">2</span>
              </li>
              <li>
                Average Rating: <span className="font-bold">4.8 ★</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-[#8B000F]">
            Recent Bookings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dummyBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{b.service}</div>
                  <div className="text-sm text-black/80">{b.date}</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    b.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : b.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {b.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
