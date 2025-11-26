"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import AuthCard from "./AuthCard";

type AuthProps = {
  defaultMode?: "login" | "signup";
};

export default function CustomerAuth({ defaultMode }: AuthProps) {
  const [firebaseError, setFirebaseError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">(defaultMode ?? "login");
  const [role, setRole] = useState<"customer" | "vendor" | "admin">("customer");
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (role === "vendor") router.replace("/vendor/dashboard");
      else if (role === "admin") {
        if (user.email === "admin@eventra.com")
          router.replace("/admin/dashboard");
        else
          setFirebaseError(
            "Admin access requires the admin@eventra.com account."
          );
      } else router.replace("/");
    }
  }, [user, role, router]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  const handleGoogleLogin = async () => {
    setFirebaseError("");
    if (role === "admin") {
      setFirebaseError(
        "Use the admin sign-in page at /admin/login for admin access."
      );
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      // Silently ignore when user closes the popup — it's not an error
      if (err?.code === "auth/popup-closed-by-user") {
        return;
      }
      (await import("../lib/logger")).error("Google login error:", err);
      setFirebaseError(
        (err?.code ? `${err.code}: ` : "") +
          (err?.message || "Google login failed")
      );
    }
  };

  const handleEmailAuth = async (values: any, actions: any) => {
    setFirebaseError("");
    try {
      // If the submitted email is the admin email, route the login
      // through the server-side admin endpoint so Firebase isn't used.
      // This handles cases where role wasn't switched to "admin" in the UI.
      const ADMIN_EMAIL_FALLBACK = "admin@eventra.com";
      const isAdminEmail =
        (values.email || "").toLowerCase() === ADMIN_EMAIL_FALLBACK;
      if (isAdminEmail) {
        if (mode !== "login") {
          setFirebaseError(
            "Admin account must be created on the server. Use /admin/login"
          );
          return;
        }
        const resp = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
          throw new Error(data?.error || "Admin login failed");
        }
        // server set cookie; redirect to admin dashboard
        router.replace("/admin/dashboard");
        return;
      }

      if (mode === "login") {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        // Redirect is handled by the useEffect hook watching useAuthState
      } else {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        // After signup, Firebase auto-logs in user; useEffect will trigger redirect
        // Don't reset form yet — wait for auth state to update
      }
      // Reset form after successful auth
      actions.resetForm();
    } catch (err: any) {
      actions.setSubmitting(false);
      setFirebaseError(err?.message || "Authentication failed");
    }
  };

  const getValidationSchema = () => {
    return Yup.object().shape({
      name:
        mode === "signup"
          ? Yup.string().required("Full name is required")
          : Yup.string(),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "At least 6 characters")
        .required("Password is required"),
      confirm:
        mode === "signup"
          ? Yup.string()
              .oneOf([Yup.ref("password")], "Passwords must match")
              .required("Confirm your password")
          : Yup.string(),
    });
  };

  return (
    <AuthCard
      title={mode === "login" ? "Welcome Back" : "Create your account"}
      subtitle={
        mode === "login"
          ? "Sign in to continue to Eventra"
          : "Set up your Eventra account"
      }
    >
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <div className="flex gap-2 border rounded-lg p-1">
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
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-black/90 mb-3">
          Role:
        </div>
        <div className="flex gap-2">
          {(["customer", "vendor", "admin"] as const).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-2 rounded-lg text-sm border ${
                role === r
                  ? "bg-[#6b1839] text-white border-[#6b1839]"
                  : "bg-white text-black/90"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-lg py-3 hover:shadow-sm"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-18.5-1.5-36.3-4.3-53.6H272v101.4h147.4c-6.4 34.8-25.8 64.3-55 84.1v69.9h88.8c52-48 82.3-118.5 82.3-201.8z"
            />
            <path
              fill="#34A853"
              d="M272 544.3c73.8 0 135.8-24.4 181-66.3l-88.8-69.9c-24.7 16.6-56.5 26.5-92.2 26.5-70.9 0-131-47.8-152.4-112.1H28.9v70.6C74.2 490.4 166.8 544.3 272 544.3z"
            />
            <path
              fill="#FBBC05"
              d="M119.6 328.5c-10.9-32.5-10.9-67.6 0-100.1V157.8H28.9c-41.1 80.1-41.1 173.5 0 253.6l90.7-82.9z"
            />
            <path
              fill="#EA4335"
              d="M272 109.6c39.8 0 75.6 13.7 103.8 40.6l77.8-77.8C407.6 27.5 345.6 0 272 0 166.8 0 74.2 53.9 28.9 137.6l90.7 70.6C141 157.4 201.1 109.6 272 109.6z"
            />
          </svg>
          <span className="text-sm font-medium">Continue with Google</span>
        </button>
      </div>

      <Formik
        key={mode}
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirm: "",
        }}
        enableReinitialize
        validationSchema={getValidationSchema()}
        onSubmit={handleEmailAuth}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {mode === "signup" && (
              <div>
                <Field
                  name="name"
                  placeholder="Full name"
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

            <div className="flex items-center justify-between">
              <div className="text-sm text-black/80">
                Role: <strong className="text-black">{role}</strong>
              </div>
              <button
                type="button"
                onClick={() => router.push("/auth/forgot")}
                className="text-sm text-[#8B000F]"
              >
                Forgot password?
              </button>
            </div>

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

      <div className="mt-6 text-center text-sm text-black/80">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="text-[#8B000F] font-medium"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-[#8B000F] font-medium"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </AuthCard>
  );
}
