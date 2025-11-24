// Customer Service Listing page moved from app/services/page.tsx
import Link from "next/link";

const vendors = [
  {
    id: 1,
    name: "Dream Weddings Photography",
    category: "Photographer",
    city: "Patna",
    price: "₹20,000+",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Royal Banquet Hall",
    category: "Venue",
    city: "Gaya",
    price: "₹1,00,000+",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Floral Decorators",
    category: "Decorator",
    city: "Muzaffarpur",
    price: "₹15,000+",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Tasty Caterers",
    category: "Caterer",
    city: "Bhagalpur",
    price: "₹500/plate",
    rating: 4.5,
  },
];

const cities = [
  "All Cities",
  "Patna",
  "Gaya",
  "Muzaffarpur",
  "Bhagalpur",
  "Darbhanga",
  "Purnia",
];

export default function CustomerServices() {
  return (
    <div className="bg-white">
      {/* Filters */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-4xl font-extrabold mb-10 tracking-tight text-[#8B000F]">
          Find Wedding Vendors in Bihar
        </h2>
        <div className="flex flex-wrap gap-4 mb-10 items-center justify-center">
          <input
            type="text"
            placeholder="Search vendors..."
            className="px-5 py-3 border-2 border-[#8B000F] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-lg shadow-sm"
          />
          <select className="px-5 py-3 border-2 border-[#FFD1B3] rounded focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-lg shadow-sm">
            <option>All Categories</option>
            <option>Photographer</option>
            <option>Venue</option>
            <option>Caterer</option>
            <option>Decorator</option>
          </select>
          <select className="px-5 py-3 border-2 border-[#FFD1B3] rounded focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-lg shadow-sm">
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
          <select className="px-5 py-3 border-2 border-[#FFD1B3] rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-lg shadow-sm">
            <option>Sort by</option>
            <option>Price</option>
            <option>Rating</option>
          </select>
        </div>
        {/* Vendor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {vendors.map((vendor, idx) => (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl shadow-lg p-0 flex flex-col items-start group cursor-pointer border-2 border-[#8B000F]/10"
            >
              <div className="w-full h-40 rounded-t-2xl overflow-hidden relative">
                <img
                  src={
                    vendor.category === "Photographer"
                      ? "/photography.jpg"
                      : vendor.category === "Venue"
                      ? "/venue.jpeg"
                      : vendor.category === "Decorator"
                      ? "/decorator.jpg"
                      : vendor.category === "Caterer"
                      ? "/mehendi.jpeg"
                      : "/weddingpic.jpg"
                  }
                  alt={vendor.name}
                  className="object-cover w-full h-full"
                />
                <div
                  className="absolute top-2 left-2 bg-[#8B000F] text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide"
                  style={{ letterSpacing: 1 }}
                >
                  {vendor.category}
                </div>
              </div>
              <div className="p-6 w-full flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1 text-[#8B000F]">
                  {vendor.name}
                </h3>
                <div className="mb-1 text-[#FF6F3C] font-medium">
                  {vendor.city}
                </div>
                <div className="mb-1 text-[#8B000F]">{vendor.price}</div>
                <div className="mb-3 text-orange-500 font-semibold">
                  ★ {vendor.rating}
                </div>
                <Link
                  href={`/customer/vendor?id=${vendor.id}`}
                  className="inline-block bg-[#8B000F] text-white px-6 py-2 rounded-lg font-semibold mt-auto shadow"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Tips Section */}
      <section className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h3 className="text-2xl font-bold mb-6" style={{ color: "#6b1839" }}>
          Tips for Booking Wedding Vendors in Bihar
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <li className="bg-white rounded-xl shadow p-6">
            <span className="font-bold text-[#6b1839]">Book Early:</span> Top
            vendors in Patna, Gaya, and other cities get booked fast during
            wedding season.
          </li>
          <li className="bg-white rounded-xl shadow p-6">
            <span className="font-bold text-[#6b1839]">Check Reviews:</span>{" "}
            Read real reviews from couples who planned their wedding in Bihar.
          </li>
          <li className="bg-white rounded-xl shadow p-6">
            <span className="font-bold text-[#6b1839]">Compare Packages:</span>{" "}
            Ask for detailed quotes and compare inclusions before booking.
          </li>
        </ul>
      </section>
      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h3
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "#6b1839" }}
        >
          Frequently Asked Questions
        </h3>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-bold mb-2 text-[#6b1839]">
              How do I contact a vendor?
            </div>
            <div className="text-black">
              Click “View Details” to see vendor info and contact options.
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-bold mb-2 text-[#6b1839]">
              Are prices negotiable?
            </div>
            <div className="text-black">
              Many vendors offer custom packages. Contact them to discuss your
              needs.
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-bold mb-2 text-[#6b1839]">
              Can I see real wedding photos?
            </div>
            <div className="text-black">
              Yes! Check the vendor’s gallery and reviews for real wedding
              inspiration from Bihar.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
