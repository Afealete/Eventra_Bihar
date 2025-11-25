import Link from "next/link";
import HeroSlider from "../../components/HeroSlider";

const categories = [
  {
    name: "Photographers",
    icon: "📸",
    img: "/photography.jpg",
  },
  {
    name: "Venues",
    icon: "🏛️",
    img: "/venue.jpeg",
  },
  {
    name: "Caterers",
    icon: "🍽️",
    img: "/mehendi.jpeg",
  },
  {
    name: "Decorators",
    icon: "🎉",
    img: "/decorator.jpg",
  },
  {
    name: "Makeup Artists",
    icon: "💄",
    img: "/makeup_artiste.jpeg",
  },
  {
    name: "Mehendi",
    icon: "🌿",
    img: "/mehendi.jpeg",
  },
  {
    name: "Bands & DJs",
    icon: "🎵",
    img: "/DJ.JPEG",
  },
  {
    name: "Bridal Wear",
    icon: "👗",
    img: "/weddingpic.jpg",
  },
];

const featuredVendors = [
  {
    id: 1,
    name: "Dream Weddings Photography",
    category: "Photographer",
    location: "Patna",
    rating: 4.8,
    img: "/photography.jpg",
  },
  {
    id: 2,
    name: "Royal Banquet Hall",
    category: "Venue",
    location: "Gaya",
    rating: 4.6,
    img: "/venue.jpeg",
  },
  {
    id: 3,
    name: "Floral Decorators",
    category: "Decorator",
    location: "Muzaffarpur",
    rating: 4.7,
    img: "/decorator.jpg",
  },
  {
    id: 4,
    name: "Tasty Caterers",
    category: "Caterer",
    location: "Bhagalpur",
    rating: 4.5,
    img: "/mehendi.jpeg",
  },
];

const testimonials = [
  {
    name: "Priya & Aman",
    text: "Eventra made our wedding in Patna so easy! We found the best photographer and venue in minutes.",
  },
  {
    name: "Rohit & Neha",
    text: "The vendor reviews and transparent pricing helped us plan our Gaya wedding stress-free.",
  },
  {
    name: "Sakshi & Arjun",
    text: "Loved the variety of decorators and caterers. Highly recommend Eventra for Bihar weddings!",
  },
];

export default function CustomerHome() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="w-full relative bg-gradient-to-br from-[var(--color-crimson)] to-[var(--color-peach)] py-24 px-4 flex flex-col items-center text-center overflow-hidden mb-12 border-b-4 border-[var(--color-crimson)]/10">
        {/* Sliding background images */}
        <HeroSlider />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight text-white drop-shadow-lg">
            Plan Your Dream Wedding in Bihar
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white max-w-2xl font-medium">
            Discover, compare, and book the best wedding vendors across Bihar.
            Trusted by thousands of happy couples.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xl mb-8">
            <input
              type="text"
              placeholder="Search for services (e.g. photographer, venue)"
              className="flex-1 px-4 py-3 border-2 border-[var(--color-crimson)] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-crimson)] text-lg bg-white/80 placeholder:text-[var(--color-crimson)]"
            />
            <Link href="/services">
              <button
                type="button"
                className="bg-[var(--color-crimson)] text-white px-8 py-3 rounded-r-lg font-bold text-lg border-2 border-[var(--color-crimson)] w-full sm:w-auto mt-2 sm:mt-0 shadow"
              >
                Search
              </button>
            </Link>
          </div>
          <div className="text-white font-semibold text-lg">
            Popular: Photographers, Venues, Caterers, Decorators
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#8B000F]/80 to-transparent pointer-events-none" />
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto py-10 px-4">
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: "#8B000F" }}
        >
          Explore Top Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 border-2 border-[#8B000F]/10"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-4 border-[#8B000F]/20">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-lg font-semibold text-[#8B000F]">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="max-w-6xl mx-auto py-10 px-4">
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: "#8B000F" }}
        >
          Featured Vendors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuredVendors.map((vendor) => (
            <div
              key={vendor.name}
              className="bg-white rounded-2xl shadow-lg p-0 flex flex-col border-2 border-[#8B000F]/10"
            >
              <div className="w-full h-40 rounded-t-2xl overflow-hidden relative">
                <img
                  src={vendor.img}
                  alt={vendor.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 left-2 bg-[#8B000F] text-white text-xs px-3 py-1 rounded-full shadow">
                  {vendor.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1 text-[#8B000F]">
                  {vendor.name}
                </h3>
                <div className="mb-1 text-black font-medium">
                  {vendor.location}
                </div>
                <div className="mb-3 text-yellow-600 font-semibold">
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

      {/* Testimonials Section */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: "var(--color-crimson)" }}
        >
          What Couples Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-[var(--color-crimson)]/60"
            >
              <svg
                width="40"
                height="40"
                fill="var(--color-crimson)"
                className="mb-4"
                viewBox="0 0 24 24"
              >
                <path d="M7.17 6.17A7 7 0 0 0 5 12v2a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3v-2a7 7 0 0 0-4.83-6.83ZM19 6.17A7 7 0 0 0 17 12v2a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3v-2a7 7 0 0 0-4.83-6.83Z" />
              </svg>
              <p className="text-lg text-black mb-4">{t.text}</p>
              <div className="font-bold text-[var(--color-crimson)]">
                {t.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
