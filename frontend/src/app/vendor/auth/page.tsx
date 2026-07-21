"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../../../components/AuthCard";
import { firebaseGoogleLogin, login, logout, signup } from "../../../lib/auth";

export default function VendorAuth() {
  const [firebaseError, setFirebaseError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  const redirectFromStoredRole = async (data: { user: { role: "customer" | "vendor" | "admin" } }) => {
    if (data.user.role === "admin") {
      await logout();
      throw new Error("Use the dedicated admin sign-in page for administrator access.");
    }
    router.replace(data.user.role === "vendor" ? "/vendor/dashboard" : "/");
  };

  const handleGoogleLogin = async () => {
    setFirebaseError("");
    try {
      const data = await firebaseGoogleLogin("vendor");
      await redirectFromStoredRole(data);
    } catch (err: any) {
      setFirebaseError(err?.message || "Google login failed");
    }
  };

  const handleEmailAuth = async (values: any, actions: any) => {
    setFirebaseError("");
    try {
      if (mode === "login") {
        const data = await login(values.email, values.password);
        await redirectFromStoredRole(data);
      } else {
        await redirectFromStoredRole(await signup(values.email, values.password, values.name || undefined, "vendor"));
      }
    } catch (err: any) {
      setFirebaseError(err?.message || "Authentication failed");
    } finally {
      actions.setSubmitting(false);
    }
  };

  const SignupSchema = Yup.object().shape({
    name: Yup.string().when("mode", (modeValue: any, schema: any) =>
      modeValue === "signup" ? schema.required("Full name is required") : schema
    ),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "At least 8 characters")
      .required("Password is required"),
    confirm: Yup.string().when("mode", (modeValue: any, schema: any) =>
      modeValue === "signup"
        ? schema
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm your password")
        : schema
    ),
  });

  return (
    <AuthCard
      title={mode === "login" ? "Vendor Sign in" : "Create vendor account"}
      subtitle={
        mode === "login"
          ? "Sign in to your vendor dashboard"
          : "Create a vendor account"
      }
    >
      <div className="mb-4">
        <div className="flex gap-2 border rounded-lg p-1 mb-4">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-3 py-1 rounded-lg ${
              mode === "login" ? "bg-[#6b1839] text-white" : "text-black/80"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`px-3 py-1 rounded-lg ${
              mode === "signup" ? "bg-[#6b1839] text-white" : "text-black/80"
            }`}
          >
            Sign up
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-lg py-3 hover:shadow-sm mb-4"
        >
          <span className="text-sm font-medium">Continue with Google</span>
        </button>

        {firebaseError && (
          <div className="text-red-500 text-sm mb-3">{firebaseError}</div>
        )}

        <Formik
          initialValues={{
            mode,
            name: "",
            email: "",
            password: "",
            confirm: "",
          }}
          enableReinitialize
          validationSchema={SignupSchema}
          onSubmit={handleEmailAuth}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {mode === "signup" && (
                <div>
                  <Field
                    name="name"
                    placeholder="Business name / Full name"
                    className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}

              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {mode === "signup" && (
                <div>
                  <Field
                    name="confirm"
                    type="password"
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                  />
                  <ErrorMessage
                    name="confirm"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8B000F] text-white py-3 rounded-lg font-semibold hover:bg-[#6b000f] disabled:opacity-60"
              >
                {isSubmitting
                  ? mode === "login"
                    ? "Signing in..."
                    : "Creating..."
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </AuthCard>
  );
}
