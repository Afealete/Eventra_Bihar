"use client";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
// Customer Vendor Detail page moved from app/vendor/page.tsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSearchParams } from "next/navigation";

const VENDORS = [
  {
    id: 1,
    name: "Dream Weddings Photography",
    category: "Photographer",
    city: "Patna",
    price: "₹20,000+",
    rating: 4.8,
    img: "/photography.jpg",
    description:
      "Dream Weddings Photography specialises in capturing authentic moments across Bihar. We offer customizable packages and reliable service for your big day.",
  },
  {
    id: 2,
    name: "Royal Banquet Hall",
    category: "Venue",
    city: "Gaya",
    price: "₹1,00,000+",
    rating: 4.6,
    img: "/venue.jpeg",
    description:
      "Royal Banquet Hall is a spacious venue perfect for large weddings and receptions.",
  },
  {
    id: 3,
    name: "Floral Decorators",
    category: "Decorator",
    city: "Muzaffarpur",
    price: "₹15,000+",
    rating: 4.7,
    img: "/decorator.jpg",
    description:
      "Floral Decorators create elegant, bespoke decor packages tailored to your theme.",
  },
  {
    id: 4,
    name: "Tasty Caterers",
    category: "Caterer",
    city: "Bhagalpur",
    price: "₹500/plate",
    rating: 4.5,
    img: "/mehendi.jpeg",
    description:
      "Tasty Caterers serve delicious, traditional and fusion menus for weddings of all sizes.",
  },
];

// ...existing code...

function VendorContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams?.get("id");
  const vendorId = idParam ? parseInt(idParam, 10) : 1;
  const vendor = VENDORS.find((v) => v.id === vendorId) || VENDORS[0];
  const router = useRouter();

  return (
    <div className="bg-white">
      {/* Vendor Highlights */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-10 mb-10 items-center">
          <div className="flex-1 bg-gray-100 rounded-2xl h-64 flex items-center justify-center overflow-hidden shadow-md">
            <img
              src={vendor.img}
              alt={vendor.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 flex flex-col items-start">
            <h2
              className="text-4xl font-extrabold mb-2 tracking-tight"
              style={{ color: "#8B000F" }}
            >
              {vendor.name}
            </h2>
            <div className="mb-2 text-black font-medium text-lg">
              {vendor.category} · {vendor.city}
            </div>
            <div className="mb-2 text-black">
              Starting at <span className="font-bold">{vendor.price}</span>
            </div>
            <div className="mb-2 text-yellow-600 font-semibold">
              ★ {vendor.rating} (reviews)
            </div>
            <button
              type="button"
              onClick={() => router.push(`/customer/checkout?v=${vendor.id}`)}
              className="bg-[#8B000F] text-white px-8 py-3 rounded-lg font-bold text-lg mt-4 shadow border-2 border-[#8B000F]"
            >
              Book Now
            </button>
          </div>
        </div>
        {/* About Section */}
        <div className="mb-10">
          <h3
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--color-crimson)" }}
          >
            About
          </h3>
          <p className="text-black text-lg max-w-3xl">{vendor.description}</p>
        </div>
        {/* Gallery Section */}
        <div className="mb-10">
          <h3
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--color-crimson)" }}
          >
            Gallery
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <img
              src="/weddingpic.jpg"
              alt="Gallery 1"
              className="h-32 w-full object-cover rounded-lg shadow-inner"
            />
            <img
              src="/decorator.jpg"
              alt="Gallery 2"
              className="h-32 w-full object-cover rounded-lg shadow-inner"
            />
            <img
              src="/venue.jpeg"
              alt="Gallery 3"
              className="h-32 w-full object-cover rounded-lg shadow-inner"
            />
            <img
              src="/makeup_artiste.jpeg"
              alt="Gallery 4"
              className="h-32 w-full object-cover rounded-lg shadow-inner"
            />
          </div>
        </div>
        {/* Packages Section */}
        <div className="mb-10">
          <h3
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--color-crimson)" }}
          >
            Packages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border-2 border-[#8B000F]/10 rounded-xl p-6 shadow bg-white">
              <div
                className="font-bold text-lg mb-2"
                style={{ color: "#8B000F" }}
              >
                Basic Package
              </div>
              <div className="text-black mb-1">1 Day Coverage</div>
              <div className="text-black mb-1">100 Edited Photos</div>
              <div className="text-black mb-1">Online Gallery</div>
              <div className="font-bold mt-2">₹20,000</div>
            </div>
            <div className="border-2 border-[#8B000F]/10 rounded-xl p-6 shadow bg-white">
              <div
                className="font-bold text-lg mb-2"
                style={{ color: "#8B000F" }}
              >
                Premium Package
              </div>
              <div className="text-black mb-1">2 Days Coverage</div>
              <div className="text-black mb-1">250 Edited Photos</div>
              <div className="text-black mb-1">Photo Album</div>
              <div className="font-bold mt-2">₹35,000</div>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-2" style={{ color: "#8B000F" }}>
            Reviews
          </h3>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded shadow text-black">
              “Amazing service and very professional! Made our wedding
              memorable.”
            </div>
            <div className="bg-gray-50 p-4 rounded shadow text-black">
              “Captured our day perfectly. Highly recommend!”
            </div>
          </div>
        </div>
        {/* Contact/Booking Section */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold mb-4" style={{ color: "#8B000F" }}>
            Contact & Booking
          </h3>
          <Formik
            initialValues={{ name: "", email: "", phone: "", message: "" }}
            validationSchema={Yup.object({
              name: Yup.string().required("Name is required"),
              email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
              phone: Yup.string()
                .matches(/^\d{10,}$/, "Enter a valid phone number")
                .required("Phone is required"),
              message: Yup.string().required("Message is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              alert("Enquiry sent!\n" + JSON.stringify(values, null, 2));
              setSubmitting(false);
              resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 bg-white p-6 rounded-xl shadow max-w-lg">
                <Field
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border-2 border-[#8B000F] rounded focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-lg"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <Field
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border-2 border-[#8B000F] rounded focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-lg"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <Field
                  name="phone"
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full px-4 py-3 border-2 border-[#8B000F] rounded focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-lg"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <Field
                  as="textarea"
                  name="message"
                  placeholder="Your Message"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-[#8B000F] rounded focus:outline-none focus:ring-2 focus:ring-[#8B000F] text-lg"
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#8B000F] text-white py-3 rounded-lg font-bold text-lg shadow border-2 border-[#8B000F] disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send Enquiry"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </div>
  );
}

export default function CustomerVendorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VendorContent />
    </Suspense>
  );
}
