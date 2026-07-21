"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CurrentUser, me, UserRole } from "../lib/auth";

export default function AuthGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: UserRole[] }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await me();
      if (!mounted) return;
      setUser(data?.user ?? null);
      setLoading(false);
      if (!data?.user) router.replace('/auth');
      else if (allowedRoles && !allowedRoles.includes(data.user.role)) router.replace('/');
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) return null;
  return <>{children}</>;
}
