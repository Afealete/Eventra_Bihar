"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout, me } from "../lib/auth";

const baseLink = "rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B000F] focus-visible:ring-offset-2";

export default function Navbar({ forceVisible = false }: { forceVisible?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string | null; email?: string; role?: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Browse vendors" },
    { href: "/profile#bookings", label: "My bookings" },
    { href: "/profile", label: "Profile" },
  ];

  useEffect(() => {
    let active = true;
    me().then((data) => active && setUser(data?.user ?? null));
    return () => { active = false; };
  }, [pathname]);

  if (!forceVisible && (pathname?.startsWith("/vendor") || pathname?.startsWith("/admin"))) return null;

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname?.startsWith(href.split("#")[0]);
  const itemClass = (href: string) => `${baseLink} ${isActive(href) ? "bg-[#fff0f3] text-[#8B000F]" : "text-slate-700 hover:bg-[#fff7f3] hover:text-[#8B000F]"}`;
  const signOut = async () => {
    await logout();
    setUser(null);
    setMenuOpen(false);
    router.replace("/");
  };

  return <nav className="sticky top-0 z-40 border-b border-[#f2ddd5] bg-white/95 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
      <Link href="/" aria-label="Eventra Bihar home" className="font-serif text-2xl font-bold tracking-wide text-[#8B000F]">Eventra <span className="text-[#d45b35]">Bihar</span></Link>
      <div className="hidden items-center gap-1 md:flex">
        {links.map((link) => <Link key={link.href} href={link.href} className={itemClass(link.href)}>{link.label}</Link>)}
        <Link href="/vendor" className={`${baseLink} ml-1 border border-[#8B000F] text-[#8B000F] hover:bg-[#fff0f3]`}>Vendor portal</Link>
        {user ? <button type="button" onClick={signOut} className={`${baseLink} ml-1 bg-[#8B000F] text-white hover:bg-[#6b000f]`}>Sign out</button> : <Link href="/auth" className={`${baseLink} ml-1 bg-[#8B000F] text-white hover:bg-[#6b000f]`}>Log in</Link>}
      </div>
      <button type="button" aria-label="Toggle navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)} className="rounded-lg p-2 text-[#8B000F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B000F] md:hidden">
        <span className="block text-2xl leading-none" aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
      </button>
    </div>
    {menuOpen && <div className="border-t border-[#f2ddd5] bg-white px-4 py-3 shadow-lg md:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-1">
        {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={itemClass(link.href)}>{link.label}</Link>)}
        <Link href="/vendor" onClick={() => setMenuOpen(false)} className={itemClass("/vendor")}>Vendor portal</Link>
        {user ? <button type="button" onClick={signOut} className={`${baseLink} text-left bg-[#8B000F] text-white`}>Sign out</button> : <Link href="/auth" onClick={() => setMenuOpen(false)} className={`${baseLink} bg-[#8B000F] text-white`}>Log in</Link>}
      </div>
    </div>}
  </nav>;
}
