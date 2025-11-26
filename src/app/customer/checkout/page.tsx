"use client";
// Customer Checkout page moved from app/checkout/page.tsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function CustomerCheckout() {
  return (
    <div className="bg-white checkout">
      <section className="max-w-2xl mx-auto py-12 px-4">
        <h2
          className="text-4xl font-extrabold mb-8 tracking-tight"
          style={{ color: "#6b1839" }}
        >
          Checkout
        </h2>
        <div className="bg-gray-50 rounded-xl shadow p-6 mb-8">
          <h3 className="text-2xl font-bold mb-2" style={{ color: "#6b1839" }}>
            Booking Summary
          </h3>
          <div className="text-black mb-2 text-base font-medium">
            Service:{" "}
            <span className="font-semibold">Dream Weddings Photography</span>
          </div>
          <div className="text-black mb-2 text-base font-medium">
            Date: <span className="font-semibold">2025-12-10</span>
          </div>
          <div className="text-black mb-2 text-base font-medium">
            Price: <span className="font-semibold">₹20,000</span>
          </div>
        </div>
        <Formik
          initialValues={{ name: "", phone: "", email: "", payment: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Full Name is required"),
            phone: Yup.string()
              .matches(/^\d{10,}$/, "Enter a valid phone number")
              .required("Phone Number is required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
            payment: Yup.string().required("Select a payment method"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            alert("Checkout successful!\n" + JSON.stringify(values, null, 2));
            setSubmitting(false);
            resetForm();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5 bg-white p-6 rounded-xl shadow">
              <Field
                name="name"
                type="text"
                placeholder="Full Name"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#6b1839] text-lg"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
              <Field
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#6b1839] text-lg"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm"
              />
              <Field
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#6b1839] text-lg"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
              <Field
                as="select"
                name="payment"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#6b1839] text-lg"
              >
                <option value="">Payment Method</option>
                <option value="UPI">UPI</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash on Event Day">Cash on Event Day</option>
              </Field>
              <ErrorMessage
                name="payment"
                component="div"
                className="text-red-500 text-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#6b1839] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#4b1026] transition-colors shadow disabled:opacity-60"
              >
                {isSubmitting ? "Processing..." : "Pay Now (Dummy)"}
              </button>
            </Form>
          )}
        </Formik>
      </section>

      {/* Bihar Wedding Tips */}
      <section className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h3 className="text-2xl font-bold mb-6" style={{ color: "#6b1839" }}>
          Tips for a Smooth Wedding in Bihar
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <li className="bg-white rounded-xl shadow p-6">
            <span className="font-bold text-[#6b1839]">Confirm Dates:</span>{" "}
            Check for local festivals and holidays in Bihar before finalizing
            your wedding date.
          </li>
          <li className="bg-white rounded-xl shadow p-6">
            <span className="font-bold text-[#6b1839]">Book Early:</span> Secure
            your favorite vendors and venues at least 3-6 months in advance.
          </li>
        </ul>
      </section>
    </div>
  );
}
