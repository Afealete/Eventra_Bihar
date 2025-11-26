"use client";
import { useState } from "react";
import { signInWithPopup, auth, googleProvider } from "../../firebase";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

export default function VendorDetail() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google login successful!");
    } catch (error: any) {
      // Silently ignore when user closes the popup — it's not an error
      if (error?.code === "auth/popup-closed-by-user") {
        setGoogleLoading(false);
        return;
      }
      // log full error for debugging via logger
      (await import("../../lib/logger")).error("Google login error:", error);
      alert(
        (error?.code ? `${error.code}: ` : "") +
          (error?.message || "Google login failed")
      );
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Navbar forceVisible />
      <div className="bg-gray-50 min-h-screen">
        <section className="max-w-6xl mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
            <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3">
                  <div className="bg-gray-100 rounded-lg overflow-hidden h-52">
                    <img
                      src="/photography.jpg"
                      alt="Dream Weddings"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-extrabold text-[#8B000F] mb-2">
                    Dream Weddings Photography
                  </h2>
                  <div className="text-black font-medium mb-2">
                    Photographer · Patna, Bihar
                  </div>
                  <div className="text-black mb-4">
                    Starting at <span className="font-bold">₹20,000</span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-yellow-600 font-semibold">
                      ★ 4.8 (120 reviews)
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push("/customer/checkout?v=1")}
                      className="ml-auto bg-[#8B000F] text-white px-6 py-2 rounded-lg font-semibold"
                    >
                      Book Now
                    </button>
                  </div>
                  <p className="text-black">
                    Dream Weddings Photography specialises in capturing
                    authentic moments across Bihar. We offer customizable
                    packages and reliable service for your big day.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-black mb-3">Packages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <div className="font-bold text-lg text-[#8B000F]">
                      Basic
                    </div>
                    <div className="text-black">
                      1 Day Coverage • 100 Edited Photos
                    </div>
                    <div className="font-bold mt-3">₹20,000</div>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <div className="font-bold text-lg text-[#8B000F]">
                      Premium
                    </div>
                    <div className="text-black">
                      2 Days Coverage • 250 Edited Photos • Album
                    </div>
                    <div className="font-bold mt-3">₹35,000</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-black mb-3">Reviews</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded shadow">
                    Amazing photography and very professional! Made our Patna
                    wedding memorable.
                  </div>
                  <div className="bg-gray-50 p-4 rounded shadow">
                    Captured our day perfectly. Highly recommend for weddings in
                    Bihar!
                  </div>
                </div>
              </div>
            </div>

            <aside className="bg-white rounded-2xl shadow p-4">
              <div className="mb-4">
                <h4 className="text-sm text-black/90">Quick Contact</h4>
                <div className="text-black font-medium">
                  Reach out to check availability
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full bg-white border border-[#8B000F] text-[#8B000F] px-4 py-2 rounded hover:bg-[#8B000F] hover:text-white transition"
                >
                  {googleLoading ? "Signing in..." : "Contact via Google Chat"}
                </button>
                <button
                  type="button"
                  onClick={() => alert("Request Quote — demo only")}
                  className="w-full bg-[#8B000F] text-white px-4 py-2 rounded"
                >
                  Request Quote
                </button>
              </div>
            </aside>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-2xl font-bold text-black mb-3">Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <img
                src="/weddingpic.jpg"
                alt="w1"
                className="h-36 w-full object-cover rounded-lg"
              />
              <img
                src="/decorator.jpg"
                alt="w2"
                className="h-36 w-full object-cover rounded-lg"
              />
              <img
                src="/venue.jpeg"
                alt="w3"
                className="h-36 w-full object-cover rounded-lg"
              />
              <img
                src="/makeup_artiste.jpeg"
                alt="w4"
                className="h-36 w-full object-cover rounded-lg"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
