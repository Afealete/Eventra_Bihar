"use client";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg border-2 border-[var(--color-crimson)]/10 bg-white">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-[var(--color-crimson)]">
          Create Your Account
        </h2>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Full Name is required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
            password: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Password is required"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            alert("Signup successful!\n" + JSON.stringify(values, null, 2));
            setSubmitting(false);
            resetForm();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <label
                  className="block mb-1 font-semibold text-[var(--color-crimson)]"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 border-2 border-[var(--color-crimson)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-crimson)] text-lg"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  className="block mb-1 font-semibold text-[var(--color-crimson)]"
                  htmlFor="email"
                >
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 border-2 border-[var(--color-crimson)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-crimson)] text-lg"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  className="block mb-1 font-semibold text-[var(--color-crimson)]"
                  htmlFor="password"
                >
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 border-2 border-[var(--color-crimson)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-crimson)] text-lg"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--color-crimson)] text-white py-3 rounded-lg font-bold text-lg mt-2 shadow disabled:opacity-60"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-6 text-black">
          Already have an account?{" "}
          <Link
            href="/auth"
            className="text-[var(--color-crimson)] font-semibold underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
