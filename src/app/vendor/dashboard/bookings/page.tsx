"use client";
import { useState, useEffect, useMemo } from "react";
import VendorSidebar from "../sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation";

const dummyBookings = [
  {
    id: 1,
    customer: "Priya & Aman",
    service: "Photography",
    date: "2025-12-10",
    status: "Confirmed",
  },
  {
    id: 2,
    customer: "Rohit & Neha",
    service: "Venue",
    date: "2026-01-15",
    status: "Pending",
  },
  {
    id: 3,
    customer: "Sakshi & Arjun",
    service: "Catering",
    date: "2026-02-20",
    status: "Completed",
  },
];

export default function VendorBookings() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [bookings, setBookings] = useState(dummyBookings);
  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "completed"
  >("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "grid" | "calendar">("list");
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (!user) return null;

  const handleChangeStatus = (id: number, status: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkChangeStatus = (status: string) => {
    setBookings((prev) =>
      prev.map((b) => (selected.includes(b.id) ? { ...b, status } : b))
    );
    setSelected([]);
  };

  const filtered = useMemo(
    () =>
      bookings.filter((b) => {
        if (filter === "pending" && b.status !== "Pending") return false;
        if (filter === "confirmed" && b.status !== "Confirmed") return false;
        if (filter === "completed" && b.status !== "Completed") return false;
        if (
          query &&
          !`${b.customer} ${b.service}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
          return false;
        return true;
      }),
    [bookings, filter, query]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <VendorSidebar />
      <main className="flex-1 p-10 pt-20 md:pt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#8B000F]">Bookings</h1>
            <p className="text-sm text-black/90">
              Manage upcoming bookings, confirm availability, and update
              statuses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg border px-2">
              <input
                type="text"
                placeholder="Search bookings"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-3 py-2 w-56 focus:outline-none"
              />
              <select
                className="px-3 py-2 border-l"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`px-3 py-2 rounded ${
                  view === "list"
                    ? "bg-[#8B000F] text-white"
                    : "bg-white border"
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`px-3 py-2 rounded ${
                  view === "grid"
                    ? "bg-[#8B000F] text-white"
                    : "bg-white border"
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setView("calendar")}
                className={`px-3 py-2 rounded ${
                  view === "calendar"
                    ? "bg-[#8B000F] text-white"
                    : "bg-white border"
                }`}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>

        <div>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center text-black">
              No bookings found.
            </div>
          ) : view === "calendar" ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center text-black">
              Calendar view coming soon.
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                  : "flex flex-col gap-3"
              }
            >
              {selected.length > 0 && (
                <div className="flex items-center justify-between bg-white rounded-lg p-3 mb-2">
                  <div className="text-sm text-black/90">
                    {selected.length} selected
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => bulkChangeStatus("Confirmed")}
                      className="px-3 py-1 bg-[#8B000F] text-white rounded"
                    >
                      Mark Confirmed
                    </button>
                    <button
                      type="button"
                      onClick={() => bulkChangeStatus("Completed")}
                      className="px-3 py-1 bg-[#FF6F3C] text-white rounded"
                    >
                      Mark Complete
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelected([])}
                      className="px-3 py-1 bg-white border"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {filtered.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition flex gap-4 items-start"
                >
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={selected.includes(b.id)}
                      onChange={() => toggleSelect(b.id)}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="text-lg font-semibold text-black">
                          {b.customer}
                        </div>
                        <div className="text-sm text-black/90">{b.service}</div>
                      </div>
                      <div className="text-sm text-black/90">{b.date}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-white font-bold ${
                            b.status === "Confirmed"
                              ? "bg-green-600"
                              : b.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-blue-600"
                          }`}
                        >
                          {b.status}
                        </div>
                        <div className="text-sm text-black/90">
                          Booking ID: #{b.id}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {b.status !== "Confirmed" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleChangeStatus(b.id, "Confirmed")
                            }
                            className="px-3 py-1 bg-[#8B000F] text-white rounded"
                          >
                            Confirm
                          </button>
                        )}
                        {b.status !== "Completed" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleChangeStatus(b.id, "Completed")
                            }
                            className="px-3 py-1 bg-[#FF6F3C] text-white rounded"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          type="button"
                          className="px-3 py-1 bg-white border rounded"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
