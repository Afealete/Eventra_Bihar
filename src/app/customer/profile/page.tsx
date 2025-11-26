"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import VendorSidebar from "../../vendor/dashboard/sidebar";

const bookings = [
  {
    id: 1,
    service: "Dream Weddings Photography",
    date: "2025-12-10",
    status: "Confirmed",
  },
  {
    id: 2,
    service: "Royal Banquet Hall",
    date: "2026-01-15",
    status: "Pending",
  },
];

export default function CustomerProfile() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "Bihar, India",
    memberSince: "2024",
  });
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    } else if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.displayName || "User",
        email: user.email || "",
      }));
      setFormData({
        name: user.displayName || "",
        location: "Bihar, India",
      });
    }
  }, [user, loading, router]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (formData.name !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.name,
        });
      }
      setProfile((prev) => ({
        ...prev,
        name: formData.name,
        location: formData.location,
      }));
      setEdit(false);
    } catch (err) {
      (await import("../../../lib/logger")).error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div
          className="bg-cover bg-center h-36 rounded-2xl overflow-hidden"
          style={{ backgroundImage: `url('/wedding-cover.jpg')` }}
        >
          <div className="h-36 bg-black/20"></div>
        </div>

        <div className="-mt-16">
          <div className="bg-white rounded-2xl shadow p-6 md:p-8">
            {!edit ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src="/logo.svg"
                      alt={profile.name}
                      className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                    <div>
                      <div className="text-2xl font-extrabold text-[#8B000F]">
                        {profile.name}
                      </div>
                      <div className="text-sm text-black/90">
                        {profile.email}
                      </div>
                      <div className="text-sm text-black/80">
                        Member since {profile.memberSince} • {profile.location}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEdit(true)}
                    className="px-4 py-2 bg-[#8B000F] text-white rounded-lg font-semibold hover:bg-[#6b000f]"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="ml-auto mt-6 md:mt-0 grid grid-cols-2 gap-3 w-full md:w-auto">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-black/90">Active Bookings</div>
                    <div className="text-lg font-bold text-black">
                      {bookings.length}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-black/90">Saved Vendors</div>
                    <div className="text-lg font-bold text-black">8</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="max-w-2xl">
                <h3 className="text-2xl font-bold text-black mb-6">
                  Edit Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B000F]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-black/60 cursor-not-allowed"
                    />
                    <p className="text-xs text-black/60 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B000F]"
                      placeholder="Enter your location"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-2 bg-[#8B000F] text-white rounded-lg font-semibold hover:bg-[#6b000f] disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEdit(false)}
                      className="px-6 py-2 border border-gray-300 text-black rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!edit && (
              <>
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-black mb-3">
                    Wedding Planning Progress
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-[#8B000F] h-4 rounded-full"
                      style={{ width: "60%" }}
                    />
                  </div>
                  <div className="text-sm text-black">
                    2 of 5 key bookings completed
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-black mb-4">
                    My Bookings
                  </h3>
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div
                        key={b.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-gray-100 rounded-lg p-4"
                      >
                        <div>
                          <div className="text-lg font-semibold text-[#8B000F]">
                            {b.service}
                          </div>
                          <div className="text-sm text-black/90">
                            Date: {b.date}
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-0 flex items-center gap-3">
                          <div
                            className={`px-3 py-1 rounded-full text-white font-semibold ${
                              b.status === "Confirmed"
                                ? "bg-green-600"
                                : "bg-yellow-500"
                            }`}
                          >
                            {b.status}
                          </div>
                          <button
                            type="button"
                            className="px-3 py-1 bg-white border rounded"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
