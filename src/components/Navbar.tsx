"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

const linkClass =
  "block text-[#8B000F] px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#8B000F]";

interface NavbarProps {
  forceVisible?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ forceVisible = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  // Hide Navbar on vendor/admin dashboards for a focused workspace
  if (!forceVisible && (pathname?.startsWith("/vendor") || pathname?.startsWith("/admin"))) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (err) {
      (await import("../lib/logger")).error("Sign out error:", err);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md relative">
      {/* Responsive Logo with gradient */}
      <div className="flex items-center">
        <svg
          viewBox="0 0 120 40"
          className="h-10 w-auto md:h-12 transition-all duration-300"
          style={{ minWidth: 80 }}
        >
          <defs>
            <linearGradient id="eventra-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B000F" />
              <stop offset="70%" stopColor="#FF6F3C" /> {/* Orange */}
              <stop offset="100%" stopColor="#FFD1B3" /> {/* Peach */}
            </linearGradient>
          </defs>
          <text
            x="-3"
            y="28"
            fontFamily="Georgia, serif"
            fontWeight="bold"
            fontSize="28"
            fill="url(#eventra-gradient)"
            style={{ letterSpacing: 2 }}
          >
            Eventra
          </text>
        </svg>
      </div>
      {/* Desktop Links */}
      <div className="hidden md:flex space-x-2">
        <Link href="/" className={linkClass}>
          Home
        </Link>
        <Link href="/services" className={linkClass}>
          Services
        </Link>
        <Link href="/vendor" className={linkClass}>
          Vendors
        </Link>
        <Link href="/profile" className={linkClass}>
          Profile
        </Link>
        {user ? (
          <button type="button" onClick={handleSignOut} className={linkClass}>
            Sign Out
          </button>
        ) : (
          <Link href="/auth" className={linkClass}>
            Login
          </Link>
        )}
        <Link href="/signup" className={linkClass}>
          signup
        </Link>
        <Link href="/checkout" className={linkClass}>
          Checkout
        </Link>
      </div>
      {/* Hamburger Icon */}
      <button
        type="button"
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span
          className={`block w-7 h-1 bg-[#8B000F] rounded transition-all duration-300 ${
            menuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`block w-7 h-1 bg-[#8B000F] rounded my-1 transition-all duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block w-7 h-1 bg-[#8B000F] rounded transition-all duration-300 ${
            menuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 flex flex-col items-center md:hidden animate-fade-in">
          <Link
            href="/"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/services"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/vendor"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Vendors
          </Link>
          <Link
            href="/profile"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          {user ? (
            <button
              className={linkClass}
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
          <Link
            href="/checkout"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Checkout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
