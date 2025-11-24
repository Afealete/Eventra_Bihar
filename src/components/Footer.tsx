import React from "react";
import Link from "next/link";

const Footer: React.FC = () => (
  <footer className="w-full bg-[#fff0f3] text-[#6b1839] mt-12">
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Eventra</h3>
        <p className="text-sm">
          Plan and manage weddings with verified vendors across Bihar.
        </p>
        <div className="text-sm mt-3">© {new Date().getFullYear()} Eventra</div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Quick Links</h4>
        <ul className="text-sm space-y-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/vendor">Vendors</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/auth">Login</Link>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Support</h4>
        <ul className="text-sm space-y-1">
          <li>help@eventra.example</li>
          <li>+91 98765 43210</li>
          <li>Terms & Conditions</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Follow Us</h4>
        <div className="flex gap-3">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
          >
            Twitter
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
