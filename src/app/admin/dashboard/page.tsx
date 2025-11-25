"use client";
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const sampleUsers = [
  {
    id: 1,
    name: "Ramesh Kumar",
    role: "Vendor",
    email: "ramesh@example.com",
    joined: "2024-03-12",
  },
  {
    id: 2,
    name: "Sunita Sharma",
    role: "Customer",
    email: "sunita@example.com",
    joined: "2024-06-02",
  },
  {
    id: 3,
    name: "Amit Singh",
    role: "Vendor",
    email: "amit@example.com",
    joined: "2025-01-08",
  },
  {
    id: 4,
    name: "Priya Verma",
    role: "Customer",
    email: "priya@example.com",
    joined: "2025-04-20",
  },
];

const recentBookings = [
  {
    id: 101,
    customer: "Priya & Aman",
    vendor: "Dream Weddings",
    date: "2025-12-10",
    amount: "₹45,000",
    status: "Confirmed",
  },
  {
    id: 102,
    customer: "Rohit & Neha",
    vendor: "Royal Banquets",
    date: "2026-01-15",
    amount: "₹1,20,000",
    status: "Pending",
  },
  {
    id: 103,
    customer: "Sakshi & Arjun",
    vendor: "TasteCater",
    date: "2026-02-20",
    amount: "₹70,000",
    status: "Completed",
  },
];

// Sample data for charts
const bookingsData = [
  { name: "Oct", bookings: 20, revenue: 120000 },
  { name: "Nov", bookings: 35, revenue: 220000 },
  { name: "Dec", bookings: 48, revenue: 345000 },
  { name: "Jan", bookings: 30, revenue: 180000 },
  { name: "Feb", bookings: 25, revenue: 150000 },
];

const vendorBreakdown = [
  { name: "Photography", value: 40 },
  { name: "Catering", value: 25 },
  { name: "Venue", value: 20 },
  { name: "Decoration", value: 15 },
];

const COLORS = ["#8B000F", "#FF6F3C", "#FFD166", "#4CAF50"];

export default function AdminDashboard() {
  // Admin access is protected by middleware via the signed admin cookie.
  // No client-side Firebase auth check required for admin routes.
  const [users, setUsers] = useState(sampleUsers);
  const [bookings, setBookings] = useState(recentBookings);
  const [search, setSearch] = useState("");

  const bookingsChartData = bookings.map((b, i) => ({
    name: `B${i + 1}`,
    amount: Number(b.amount.replace(/[₹,]/g, "")) / 1000,
  }));

  const vendorPie = [
    { name: "Dream Weddings", value: 40 },
    { name: "Royal Banquets", value: 30 },
    { name: "TasteCater", value: 30 },
  ];

  // middleware enforces admin access; render immediately

  const filteredUsers = users.filter((u) =>
    (u.name + u.email + u.role).toLowerCase().includes(search.toLowerCase())
  );

  const downloadBookingsCSV = () => {
    const rows = [
      ["id", "customer", "vendor", "date", "amount", "status"],
      ...bookings.map((b) => [
        b.id,
        b.customer,
        b.vendor,
        b.date,
        b.amount.replace(/[₹,]/g, ""),
        b.status,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#8B000F]">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-black/90 mt-1">
                  Overview of platform activity and management tools
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users or vendors"
                  className="px-4 py-2 rounded-lg border w-72 md:w-96"
                />
                <button
                  type="button"
                  onClick={() => alert("Create report — demo only")}
                  className="px-4 py-2 bg-[#8B000F] text-white rounded"
                >
                  Create Report
                </button>
                <button
                  type="button"
                  onClick={downloadBookingsCSV}
                  className="px-4 py-2 bg-white border border-gray-200 rounded"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await fetch("/api/admin/logout", { method: "POST" });
                      window.location.href = "/auth";
                    } catch (e) {
                      console.error("Logout failed", e);
                    }
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded ml-2"
                >
                  Sign out
                </button>
              </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-5 flex flex-col">
                <div className="text-sm text-black/90">Total Vendors</div>
                <div className="text-2xl font-bold text-black mt-2">
                  {users.filter((u) => u.role === "Vendor").length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 flex flex-col">
                <div className="text-sm text-black/90">Total Customers</div>
                <div className="text-2xl font-bold text-black mt-2">
                  {users.filter((u) => u.role === "Customer").length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 flex flex-col">
                <div className="text-sm text-black/90">Bookings (30d)</div>
                <div className="text-2xl font-bold text-black mt-2">
                  {bookings.length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 flex flex-col">
                <div className="text-sm text-black/90">Revenue (est.)</div>
                <div className="text-2xl font-bold text-black mt-2">
                  ₹3,45,000
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-black">
                    Recent Bookings
                  </h3>
                  <div className="text-sm text-black/80">
                    Latest activity across the platform
                  </div>
                </div>
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={bookingsChartData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#8B000F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="divide-y">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-semibold text-black">
                          {b.customer}
                        </div>
                        <div className="text-sm text-black/90">
                          {b.vendor} • {b.date}
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-white font-medium ${
                            b.status === "Confirmed"
                              ? "bg-green-600"
                              : b.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-blue-600"
                          }`}
                        >
                          {b.status}
                        </div>
                        <div className="text-sm text-black">{b.amount}</div>
                        <button
                          type="button"
                          className="px-3 py-1 bg-white border border-gray-200 rounded"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-black mb-3">Users</h3>
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
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 text-black font-medium">
                            {u.name}
                          </td>
                          <td className="py-3 text-black">{u.role}</td>
                          <td className="py-3 text-black">{u.email}</td>
                          <td className="py-3 text-black">{u.joined}</td>
                          <td className="py-3">
                            <button
                              type="button"
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
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">
                    Vendors distribution
                  </h4>
                  <div className="w-full h-36">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={vendorPie}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={60}
                          fill="#8884d8"
                        >
                          {vendorPie.map((entry, idx) => (
                            <Cell
                              key={`cell-${idx}`}
                              fill={["#8B000F", "#FF6F3C", "#FFD1B3"][idx % 3]}
                            />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            <footer className="mt-8 text-sm text-black/80">
              Updated: {new Date().toLocaleString()}
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
