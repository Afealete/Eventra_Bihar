"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../../../components/AuthCard";
import { login, me } from "../../../lib/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  useEffect(() => { me().then((session) => { if (session?.user?.role === "admin") router.replace("/admin/dashboard"); }); }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user.role !== "admin") throw new Error("This account is not an administrator.");
      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Admin Sign in"
      subtitle="Sign in with an administrator account"
    >
      <p className="mb-5 rounded-xl bg-[#fff7f3] p-3 text-sm text-slate-700">This page is for authorized Eventra administrators only. There is no public admin registration.</p>
      {error && <div role="alert" className="text-red-800 bg-red-50 rounded-lg p-3 text-sm mb-3">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <label htmlFor="admin-email" className="block text-sm font-semibold">Administrator email</label><input id="admin-email" required type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded"
        />
        <label htmlFor="admin-password" className="block text-sm font-semibold">Password</label><div className="relative"><input id="admin-password" required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          className="w-full px-3 py-2 border rounded"
        />
        <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-2 text-sm font-semibold text-[#8B000F]">{showPassword ? "Hide" : "Show"}</button></div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8B000F] text-white py-2 rounded"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthCard>
  );
}
