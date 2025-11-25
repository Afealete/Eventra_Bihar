"use client";
import { useState, useEffect, useRef } from "react";
import VendorSidebar from "../sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../firebase";
import { useRouter } from "next/navigation";

export default function VendorProfile() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "Dream Weddings Photography",
    email: "vendor@example.com",
    phone: "9876543210",
    price: "₹20,000+",
    about: "Top-rated wedding photographer in Bihar.",
    photo: "/photography.jpg",
    bookings: 128,
    rating: 4.9,
  });
  const [edit, setEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar />
      <main className="flex-1">
        <div
          className="bg-cover bg-center h-40 md:h-56"
          style={{ backgroundImage: `url('/wedding-cover.jpg')` }}
        >
          <div className="h-40 md:h-56 bg-black/20"></div>
        </div>

        <div className="-mt-16 md:-mt-20 px-6 md:px-12">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:gap-8">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="relative">
                  <img
                    src={preview ?? profile.photo}
                    alt="Vendor"
                    className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white object-cover shadow-xl"
                  />
                  <button
                    type="button"
                    className="absolute -right-2 -bottom-2 bg-white rounded-full p-1 shadow"
                    onClick={() => {
                      setShowModal(true);
                    }}
                    aria-label="Edit photo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#8B000F]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M4 13V16H7L16 7L13 4L4 13Z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#8B000F]">
                    {profile.name}
                  </div>
                  <div className="text-sm text-black/90 mt-1">
                    Professional Vendor • Bihar
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 ml-auto grid grid-cols-3 gap-3 md:gap-4 w-full md:w-auto">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm text-black/90">Bookings</div>
                  <div className="text-lg font-bold text-black">
                    {profile.bookings}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm text-black/90">Rating</div>
                  <div className="text-lg font-bold text-black">
                    {profile.rating} ★
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm text-black/90">From</div>
                  <div className="text-lg font-bold text-black">
                    {profile.price}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-black">About</h2>
                  <div>
                    <button
                      type="button"
                      className="bg-[#FF6F3C] text-white px-4 py-2 rounded-md mr-2"
                      onClick={() => setShowModal(true)}
                    >
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      className="bg-white border border-gray-200 text-black px-4 py-2 rounded-md"
                      onClick={() => alert("Open public profile — demo")}
                    >
                      View Public
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-black leading-relaxed">
                  {profile.about}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-black/90">
                      Email
                    </div>
                    <div className="text-black font-medium">
                      {profile.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-black/90">
                      Phone
                    </div>
                    <div className="text-black">{profile.phone}</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl md:w-3/5 p-6 z-10">
                  <div className="text-sm text-black/90">Quick Actions</div>
                  <div className="mt-3 flex flex-col gap-3">
                    <button
                      type="button"
                      className="px-3 py-2 bg-[#8B000F] text-white rounded"
                      onClick={() => alert("Create Offer — demo")}
                    >
                      Create Offer
                    </button>
                    <button
                      type="button"
                      className="px-3 py-2 bg-white border border-gray-200 text-black rounded"
                      onClick={() => alert("Message Customer — demo")}
                    >
                      Message Customer
                    </button>
                    <button
                      type="button"
                      className="px-3 py-2 bg-white border border-gray-200 text-black rounded"
                      onClick={() => alert("Manage Availability — demo")}
                    >
                      Manage Availability
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowModal(false)}
            />
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg p-6 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-black">Edit Profile</h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-black/80"
                >
                  Close
                </button>
              </div>
              <form
                className="mt-4 grid grid-cols-1 gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowModal(false);
                }}
              >
                <div>
                  <label className="text-sm font-medium text-black">
                    Business Name
                  </label>
                  <input
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-black"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-black">
                      Email
                    </label>
                    <input
                      className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-black"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black">
                      Phone
                    </label>
                    <input
                      className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-black"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-black">
                    Starting Price
                  </label>
                  <input
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-black"
                    value={profile.price}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, price: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black">
                    About
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-black h-28"
                    value={profile.about}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, about: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black">
                    Profile Photo
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={preview ?? profile.photo}
                      alt="preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const url = URL.createObjectURL(f);
                            setPreview(url);
                            // keep file for future upload
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-white border border-gray-200 rounded"
                        onClick={() => fileRef.current?.click()}
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-black rounded"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#8B000F] text-white rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
